"use client";

import { useEffect } from "react";
import type { LibraryItem } from "@/lib/content";

/**
 * Full-size look at a library photo. The grid only shows square thumbnails, so
 * this is the only place in the panel where the whole, uncropped photo is
 * visible — useful before deciding what to do with it.
 */
export default function PhotoViewer({
  items,
  index,
  uses,
  onIndex,
  onClose,
}: {
  items: LibraryItem[];
  index: number;
  uses: number;
  onIndex: (next: number) => void;
  onClose: () => void;
}) {
  const item = items[index];
  const many = items.length > 1;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (!many) return;
      // Wrap around so holding an arrow key keeps cycling the library.
      if (e.key === "ArrowLeft") onIndex((index - 1 + items.length) % items.length);
      if (e.key === "ArrowRight") onIndex((index + 1) % items.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, items.length, many, onIndex, onClose]);

  if (!item) return null;

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div
        className="adm-viewer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={item.label}
      >
        <div className="adm-modal-head">
          <div className="adm-viewer-meta">
            <div className="adm-modal-title">{item.label}</div>
            <span className={`adm-lib-uses${uses === 0 ? " is-unused" : ""}`}>
              {uses === 0 ? "sin usar" : `en uso · ${uses}`}
            </span>
          </div>
          <button type="button" className="adm-modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="adm-viewer-stage">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.url} alt={item.label} />
        </div>

        {many && (
          <div className="adm-viewer-nav">
            <button
              type="button"
              className="adm-btn adm-btn-outline"
              onClick={() => onIndex((index - 1 + items.length) % items.length)}
            >
              ← Anterior
            </button>
            <span className="adm-viewer-count">
              {index + 1} de {items.length}
            </span>
            <button
              type="button"
              className="adm-btn adm-btn-outline"
              onClick={() => onIndex((index + 1) % items.length)}
            >
              Siguiente →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
