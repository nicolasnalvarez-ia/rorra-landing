"use client";

import { useRef, useState } from "react";
import { CROP_ASPECT_RATIO, DEFAULT_FOCAL, type FocalPoint } from "@/lib/content";

type Rect = { w: number; h: number; x: number; y: number }; // all fractions 0-1

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function rectForAspect(imageAspect: number, focal: FocalPoint): Rect {
  const w = imageAspect > CROP_ASPECT_RATIO ? CROP_ASPECT_RATIO / imageAspect : 1;
  const h = imageAspect > CROP_ASPECT_RATIO ? 1 : imageAspect / CROP_ASPECT_RATIO;
  const maxX = 1 - w;
  const maxY = 1 - h;
  return {
    w,
    h,
    x: maxX > 0 ? (focal.x / 100) * maxX : 0,
    y: maxY > 0 ? (focal.y / 100) * maxY : 0,
  };
}

function focalForRect(rect: Rect): FocalPoint {
  const maxX = 1 - rect.w;
  const maxY = 1 - rect.h;
  return {
    x: maxX > 0 ? Math.round((rect.x / maxX) * 100) : 50,
    y: maxY > 0 ? Math.round((rect.y / maxY) * 100) : 50,
  };
}

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
  const stageRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; rectX: number; rectY: number } | null>(null);

  function onImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    setRect(rectForAspect(img.naturalWidth / img.naturalHeight, initialFocal));
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!rect) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, rectX: rect.x, rectY: rect.y };
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragRef.current || !rect || !stageRef.current) return;
    const box = stageRef.current.getBoundingClientRect();
    const dx = (e.clientX - dragRef.current.startX) / box.width;
    const dy = (e.clientY - dragRef.current.startY) / box.height;
    setRect({
      ...rect,
      x: clamp(dragRef.current.rectX + dx, 0, 1 - rect.w),
      y: clamp(dragRef.current.rectY + dy, 0, 1 - rect.h),
    });
  }

  function onPointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current) e.currentTarget.releasePointerCapture(e.pointerId);
    dragRef.current = null;
  }

  return (
    <div className="adm-modal-backdrop" onClick={onClose}>
      <div className="adm-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 460 }}>
        <div className="adm-modal-head">
          <div className="adm-modal-title">{title}</div>
          <button type="button" className="adm-modal-close" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>
        <p className="adm-section-desc" style={{ marginBottom: 14 }}>
          Arrastrá el recuadro para elegir qué parte de la foto se ve siempre.
        </p>
        <div
          ref={stageRef}
          className="adm-crop-stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" onLoad={onImgLoad} draggable={false} />
          {rect && (
            <div
              className="adm-crop-rect"
              style={{
                left: `${rect.x * 100}%`,
                top: `${rect.y * 100}%`,
                width: `${rect.w * 100}%`,
                height: `${rect.h * 100}%`,
              }}
            />
          )}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
          <button type="button" className="adm-btn adm-btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="adm-btn adm-btn-primary"
            disabled={!rect}
            onClick={() => rect && onConfirm(focalForRect(rect))}
          >
            Guardar encuadre
          </button>
        </div>
      </div>
    </div>
  );
}
