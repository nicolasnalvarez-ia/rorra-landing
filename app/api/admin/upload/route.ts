import { NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-error";
import {
  IMAGES_BUCKET,
  MISSING_CONFIG_MESSAGE,
  imageExists,
  isStorageConfigured,
  publicUrl,
  uploadImage,
} from "@/lib/supabase-storage";

const MAX_SIZE = 12 * 1024 * 1024; // 12MB — the client compresses before sending, this is the safety net.
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

async function sha256Hex(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: Request) {
  if (!isStorageConfigured()) {
    return NextResponse.json({ error: MISSING_CONFIG_MESSAGE }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
  }
  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return NextResponse.json({ error: "Formato no soportado. Usá JPG, PNG, WEBP o GIF." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "La imagen supera el máximo de 12MB." }, { status: 400 });
  }

  // Content-addressed storage: the same bytes always land on the same path, so
  // re-uploading a photo (under any filename) reuses the existing object
  // instead of filling the bucket with duplicates.
  const buffer = await file.arrayBuffer();
  const hash = await sha256Hex(buffer);
  const path = `uploads/${hash}.${extension}`;

  try {
    const duplicate = await imageExists(path);
    const url = duplicate
      ? publicUrl(IMAGES_BUCKET, path)
      : await uploadImage(path, new Blob([buffer], { type: file.type }), file.type);

    return NextResponse.json({
      url,
      label: file.name.replace(/\.[a-z0-9]+$/i, "").slice(0, 200) || "foto",
      duplicate,
    });
  } catch (err) {
    return errorResponse(err, `No se pudo subir "${file.name}".`);
  }
}
