"use client";

import { useState } from "react";
import { focalStyle, type GaleriaItem } from "@/lib/content";

export default function CategoryCard({
  category,
  canMoveUp,
  canMoveDown,
  onRename,
  onDelete,
  onRemovePhoto,
  onEditCrop,
  onAddPhoto,
  onMovePhoto,
  onMoveCategory,
}: {
  category: GaleriaItem;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onRename: (tag: string) => void;
  onDelete: () => void;
  onRemovePhoto: (index: number) => void;
  onEditCrop: (index: number) => void;
  onAddPhoto: () => void;
  onMovePhoto: (index: number, direction: -1 | 1) => void;
  onMoveCategory: (direction: -1 | 1) => void;
}) {
  const [tag, setTag] = useState(category.tag);
  // A rename that the server rejects (or a reorder) can change the tag from
  // outside; re-sync during render rather than in an effect, so the input
  // never paints one frame of the stale value.
  const [syncedTag, setSyncedTag] = useState(category.tag);
  if (category.tag !== syncedTag) {
    setSyncedTag(category.tag);
    setTag(category.tag);
  }

  return (
    <div className="adm-cat-card">
      <div className="adm-cat-head">
        <div className="adm-cat-order">
          <button
            type="button"
            className="adm-move-btn"
            onClick={() => onMoveCategory(-1)}
            disabled={!canMoveUp}
            aria-label="Subir categoría"
            title="Subir categoría"
          >
            ↑
          </button>
          <button
            type="button"
            className="adm-move-btn"
            onClick={() => onMoveCategory(1)}
            disabled={!canMoveDown}
            aria-label="Bajar categoría"
            title="Bajar categoría"
          >
            ↓
          </button>
        </div>

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

        <span className="adm-cat-count">
          {category.photos.length} {category.photos.length === 1 ? "foto" : "fotos"}
        </span>

        <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={onDelete}>
          Eliminar categoría
        </button>
      </div>

      <div className="adm-cat-photos">
        {category.photos.map((photo, i) => (
          <div className={`adm-photo-tile adm-lib-tile${i === 0 ? " is-cover" : ""}`} key={`${photo.url}-${i}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url} alt={`${category.tag} ${i + 1}`} style={focalStyle(photo.focal)} />

            {i === 0 && <span className="adm-cover-badge">Portada</span>}

            <div className="adm-tile-actions">
              <button
                type="button"
                className="adm-tile-btn"
                onClick={() => onMovePhoto(i, -1)}
                disabled={i === 0}
                aria-label="Mover a la izquierda"
                title="Mover a la izquierda"
              >
                ←
              </button>
              <button
                type="button"
                className="adm-tile-btn"
                onClick={() => onEditCrop(i)}
                aria-label="Ajustar encuadre"
                title="Ajustar encuadre"
              >
                ⤢
              </button>
              <button
                type="button"
                className="adm-tile-btn"
                onClick={() => onMovePhoto(i, 1)}
                disabled={i === category.photos.length - 1}
                aria-label="Mover a la derecha"
                title="Mover a la derecha"
              >
                →
              </button>
            </div>

            <button
              type="button"
              className="adm-photo-remove"
              onClick={() => onRemovePhoto(i)}
              aria-label="Quitar de la categoría"
              title="Quitar de la categoría"
            >
              ×
            </button>
          </div>
        ))}

        <button type="button" className="adm-photo-add" onClick={onAddPhoto} aria-label="Agregar foto">
          ＋
        </button>
      </div>

      {category.photos.length === 0 && (
        <p className="adm-cat-empty">Sin fotos: esta categoría no se va a mostrar en la landing.</p>
      )}
    </div>
  );
}
