import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";
import { loadStoredData, saveStoredData } from "@/lib/content-store";
import {
  MISSING_CONFIG_MESSAGE,
  deleteImage,
  imagePathFromUrl,
  isStorageConfigured,
} from "@/lib/supabase-storage";
import { findUsages, removePhotoFromCategories } from "@/lib/usages";

/**
 * Deletes a photo for real: out of the library, out of every portfolio
 * category, and out of Supabase storage. Hero/"sobre mí" slots always need an
 * image, so a photo still assigned to one is refused until it's replaced.
 */
export async function DELETE(request: Request) {
  const body = (await request.json().catch(() => null)) as { url?: unknown; force?: unknown } | null;
  const url = typeof body?.url === "string" ? body.url : "";
  const force = body?.force === true;

  if (!url) return NextResponse.json({ error: "Falta la URL de la foto." }, { status: 400 });
  if (!isStorageConfigured()) {
    return NextResponse.json({ error: MISSING_CONFIG_MESSAGE }, { status: 503 });
  }

  const data = await loadStoredData();
  const item = data.library.find((l) => l.url === url);
  if (!item) return NextResponse.json({ error: "La foto no está en la biblioteca." }, { status: 404 });

  const usages = findUsages(data.content, url);
  const slotUsages = usages.filter((u) => u.kind === "slot");

  if (slotUsages.length > 0) {
    return NextResponse.json(
      {
        error: `Esta foto está puesta en ${slotUsages
          .map((u) => u.label)
          .join(" y ")}. Cambiá esa imagen primero y después borrala.`,
        usages: usages.map((u) => u.label),
      },
      { status: 409 }
    );
  }

  if (usages.length > 0 && !force) {
    return NextResponse.json(
      { error: "La foto está en uso.", usages: usages.map((u) => u.label), needsConfirmation: true },
      { status: 409 }
    );
  }

  const content = usages.length > 0 ? removePhotoFromCategories(data.content, url) : data.content;
  const library = data.library.filter((l) => l.url !== url);

  try {
    // Bundled /public/photos files ship with the build; they leave the library
    // but there's no storage object to remove.
    const storagePath = item.builtin ? null : imagePathFromUrl(url);
    if (storagePath) await deleteImage(storagePath);

    await saveStoredData({ content, library });
    revalidatePath("/");
  } catch (err) {
    return errorResponse(err, "No se pudo borrar la foto.");
  }

  return NextResponse.json({ ok: true, content, library });
}
