"use client";

import { useState } from "react";
import { CROP_ASPECT, DEFAULT_FOCAL, type FocalPoint } from "@/lib/content";

export default function CropStep({
  url,
  initialFocal = DEFAULT_FOCAL,
  title = "Ajustar encuadre",
  onConfirm,
  onClose,
}: {
  url: string;
  initialFocal?: FocalPoint;
  title?: string;
  onConfirm: (focal: FocalPoint) => void;
  onClose: () => void;
}) {
  const [focal, setFocal] = useState<FocalPoint>(initialFocal);

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
          <div className="adm-modal-title">{title}</div>
          <button type="button" className="adm-modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        <p className="adm-section-desc" style={{ marginBottom: 14 }}>
          Así se va a ver recortada acá. Hacé click en el punto que siempre tiene que quedar visible.
        </p>
        <div className="adm-focal-frame" style={{ aspectRatio: CROP_ASPECT }} onClick={pickFromEvent}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" style={{ objectPosition: `${focal.x}% ${focal.y}%` }} />
          <div className="adm-focal-marker" style={{ left: `${focal.x}%`, top: `${focal.y}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
          <button type="button" className="adm-btn adm-btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="adm-btn adm-btn-primary" onClick={() => onConfirm(focal)}>
            Guardar encuadre
          </button>
        </div>
      </div>
    </div>
  );
}
