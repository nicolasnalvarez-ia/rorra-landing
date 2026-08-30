"use client";

import { useRef, useState } from "react";
import type { LibraryItem } from "@/lib/content";

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
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo subir la imagen.");
      onUploaded({ id: data.url, url: data.url, label: data.label });
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
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={onChange}
        disabled={uploading}
        aria-label={label}
      />
    </span>
  );
}
