"use client";

import { useState } from "react";
import type { FocalPoint, LibraryItem } from "@/lib/content";
import { DEFAULT_FOCAL } from "@/lib/content";

export default function FocalPointEditor({
  item,
  onSave,
  onClose,
}: {
  item: LibraryItem;
  onSave: (focal: FocalPoint) => void;
  onClose: () => void;
}) {
  const [focal, setFocal] = useState<FocalPoint>(item.focal ?? DEFAULT_FOCAL);

  function pickFromEvent(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    setFocal({ x: Math.min(100, Math.max(0, x)), y: Math.min(100, Math.max(0, y)) });
  }

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="adm-modal-head">
          <div className="adm-modal-title">Ajustar encuadre</div>
          <button type="button" className="adm-modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        <p className="adm-section-desc" style={{ marginBottom: 14 }}>
          Hacé click en el punto de la foto que siempre tiene que quedar visible cuando se recorta (como en
          las tarjetas del portfolio).
        </p>
        <div className="adm-focal-frame" onClick={pickFromEvent}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.url} alt={item.label} style={{ objectPosition: `${focal.x}% ${focal.y}%` }} />
          <div className="adm-focal-marker" style={{ left: `${focal.x}%`, top: `${focal.y}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
          <button type="button" className="adm-btn adm-btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="adm-btn adm-btn-primary" onClick={() => onSave(focal)}>
            Guardar encuadre
          </button>
        </div>
      </div>
    </div>
  );
}
