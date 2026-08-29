"use client";

import { useState } from "react";
import type { GaleriaItem } from "@/lib/content";

export default function CategoryCard({
  category,
  onRename,
  onDelete,
  onRemovePhoto,
  onAddPhoto,
}: {
  category: GaleriaItem;
  onRename: (tag: string) => void;
  onDelete: () => void;
  onRemovePhoto: (index: number) => void;
  onAddPhoto: () => void;
}) {
  const [tag, setTag] = useState(category.tag);

  return (
    <div className="adm-cat-card">
      <div className="adm-cat-head">
        <input
          className="adm-tag-input"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onBlur={() => {
            const trimmed = tag.trim();
            if (trimmed && trimmed !== category.tag) onRename(trimmed);
            else setTag(category.tag);
          }}
          aria-label="Nombre de la categoría"
        />
        <button
          type="button"
          className="adm-btn adm-btn-danger adm-btn-sm"
          onClick={() => {
            if (window.confirm(`¿Eliminar la categoría "${category.tag}"?`)) onDelete();
          }}
        >
          Eliminar categoría
        </button>
      </div>
      <div className="adm-cat-photos">
        {category.photos.map((src, i) => (
          <div className="adm-photo-tile" key={`${src}-${i}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={`${category.tag} ${i + 1}`} />
            {category.photos.length > 1 && (
              <button
                type="button"
                className="adm-photo-remove"
                onClick={() => onRemovePhoto(i)}
                aria-label="Quitar foto"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button type="button" className="adm-photo-add" onClick={onAddPhoto} aria-label="Agregar foto">
          ＋
        </button>
      </div>
    </div>
  );
}
