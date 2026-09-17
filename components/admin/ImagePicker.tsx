"use client";

import { useEffect, useMemo, useState } from "react";
import UploadButton from "@/components/admin/UploadButton";
import type { LibraryItem } from "@/lib/content";

export default function ImagePicker({
  title,
  library,
  alreadyUsedUrls,
  onPick,
  onClose,
  onUploaded,
  onError,
}: {
  title: string;
  library: LibraryItem[];
  /** Photos already in this category: shown but not selectable, so no category gets the same photo twice. */
  alreadyUsedUrls?: string[];
  onPick: (url: string) => void;
  onClose: () => void;
  onUploaded: (item: LibraryItem) => void;
  onError: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  const used = useMemo(() => new Set(alreadyUsedUrls ?? []), [alreadyUsedUrls]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? library.filter((item) => item.label.toLowerCase().includes(q)) : library;
  }, [library, query]);

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="adm-modal-head">
          <div className="adm-modal-title">{title}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <UploadButton
              label="＋ Subir nueva"
              onError={onError}
              onUploaded={(item) => {
                onUploaded(item);
                onPick(item.url);
              }}
            />
            <button type="button" className="adm-modal-close" onClick={onClose} aria-label="Cerrar">
              ×
            </button>
          </div>
        </div>

        <input
          className="adm-input adm-picker-search"
          placeholder="Buscar por nombre…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar foto"
        />

        <div className="adm-picker-grid">
          {visible.map((item) => {
            const isUsed = used.has(item.url);
            return (
              <button
                key={item.id}
                type="button"
                className={`adm-picker-item${isUsed ? " is-used" : ""}`}
                onClick={() => !isUsed && onPick(item.url)}
                disabled={isUsed}
                title={isUsed ? `${item.label} — ya está en esta categoría` : item.label}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.label} />
                {isUsed && <span className="adm-picker-used">Ya está</span>}
              </button>
            );
          })}
        </div>

        {visible.length === 0 && <p className="adm-empty-note">No hay fotos que coincidan con “{query}”.</p>}
      </div>
    </div>
  );
}
