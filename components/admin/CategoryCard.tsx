"use client";

import { useState } from "react";
import { focalStyle, type GaleriaItem } from "@/lib/content";

export default function CategoryCard({
  category,
  onRename,
  onDelete,
  onRemovePhoto,
  onEditCrop,
  onAddPhoto,
}: {
  category: GaleriaItem;
  onRename: (tag: string) => void;
  onDelete: () => void;
  onRemovePhoto: (index: number) => void;
  onEditCrop: (index: number) => void;
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
        {category.photos.map((photo, i) => (
          <div className="adm-photo-tile adm-lib-tile" key={`${photo.url}-${i}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={`${category.tag} ${i + 1}`} style={focalStyle(photo.focal)} />
            <button
              type="button"
              className="adm-focal-btn"
              onClick={() => onEditCrop(i)}
              aria-label="Ajustar encuadre"
              title="Ajustar encuadre"
            >
              ⤢
            </button>
            {category.photos.length > 1 && (
              <button
                type="button"
                className="adm-photo-remove"
                onClick={() => onRemovePhoto(i)}
                aria-label="Quitar foto"
                title="Quitar de la categoría"
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
