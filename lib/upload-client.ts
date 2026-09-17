"use client";

import { compressImage } from "./image-compress";
import type { LibraryItem } from "./content";

export type UploadedPhoto = {
  item: LibraryItem;
  /** The exact same bytes were already in storage, so nothing new was stored. */
  duplicate: boolean;
  originalSize: number;
  size: number;
};

export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

/** Compresses in the browser, then uploads. The server dedupes by content hash. */
export async function uploadPhoto(file: File): Promise<UploadedPhoto> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error(`"${file.name}" no es un formato soportado (JPG, PNG, WEBP o GIF).`);
  }

  const { file: compressed, originalSize, size } = await compressImage(file);

  const formData = new FormData();
  formData.append("file", compressed);
  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || `No se pudo subir "${file.name}".`);

  return {
    item: { id: data.url, url: data.url, label: data.label },
    duplicate: Boolean(data.duplicate),
    originalSize,
    size,
  };
}
