import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";
import { defaultContent } from "@/lib/content";
import { loadStoredData, saveStoredData } from "@/lib/content-store";
import { MISSING_CONFIG_MESSAGE, isStorageConfigured } from "@/lib/supabase-storage";
import { validateStoredData } from "@/lib/validate";

export async function GET() {
  const data = await loadStoredData();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!isStorageConfigured()) {
    return NextResponse.json({ error: MISSING_CONFIG_MESSAGE }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const result = validateStoredData(body, defaultContent);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  try {
    await saveStoredData(result.data);
    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return errorResponse(err, "No se pudieron guardar los cambios.");
  }
}
