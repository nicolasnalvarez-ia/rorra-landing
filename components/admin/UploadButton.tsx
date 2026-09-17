"use client";

import { useRef, useState } from "react";
import type { LibraryItem } from "@/lib/content";
import { ACCEPTED_TYPES, uploadPhoto } from "@/lib/upload-client";

/** Single-file upload used inside the picker ("subir y elegir de una"). */
export default function UploadButton({
  onUploaded,
  onError,
  label = "＋ Subir foto",
  className = "adm-btn adm-btn-outline adm-btn-sm",
}: {
  onUploaded: (item: LibraryItem) => void;
  onError: (message: string) => void;
  label?: string;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { item } = await uploadPhoto(file);
      onUploaded(item);
    } catch (err) {
      onError(err instanceof Error ? err.message : "No se pudo subir la imagen.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <span className={`adm-upload ${className}`}>
      {uploading ? "Subiendo…" : label}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={onChange}
        disabled={uploading}
        aria-label={label}
      />
    </span>
  );
}
