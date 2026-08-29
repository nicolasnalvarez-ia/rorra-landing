"use client";

import { useRef, useState } from "react";
import { CROP_ASPECT_RATIO, DEFAULT_FOCAL, MAX_ZOOM, type FocalPoint } from "@/lib/content";

type Rect = { w: number; h: number; x: number; y: number }; // all fractions 0-1

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/** The crop window's max size (zoom 1) for this image's aspect ratio vs. the 3:4 target. */
function maxRectSize(imageAspect: number) {
  const w = imageAspect > CROP_ASPECT_RATIO ? CROP_ASPECT_RATIO / imageAspect : 1;
  const h = imageAspect > CROP_ASPECT_RATIO ? 1 : imageAspect / CROP_ASPECT_RATIO;
  return { w, h };
}

function rectFor(maxSize: { w: number; h: number }, focal: FocalPoint): Rect {
  const w = maxSize.w / focal.zoom;
  const h = maxSize.h / focal.zoom;
  const centerX = focal.x / 100;
  const centerY = focal.y / 100;
  return {
    w,
    h,
    x: clamp(centerX - w / 2, 0, 1 - w),
    y: clamp(centerY - h / 2, 0, 1 - h),
  };
}

function focalFor(rect: Rect, zoom: number): FocalPoint {
  return {
    x: Math.round(((rect.x + rect.w / 2) / 1) * 100),
    y: Math.round(((rect.y + rect.h / 2) / 1) * 100),
    zoom,
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
  const [maxSize, setMaxSize] = useState<{ w: number; h: number } | null>(null);
  const [zoom, setZoom] = useState(initialFocal.zoom);
  const [rect, setRect] = useState<Rect | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; rectX: number; rectY: number } | null>(null);

  function onImgLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const img = e.currentTarget;
    const size = maxRectSize(img.naturalWidth / img.naturalHeight);
    setMaxSize(size);
    setRect(rectFor(size, initialFocal));
  }

  function applyZoom(nextZoom: number) {
    if (!maxSize || !rect) {
      setZoom(nextZoom);
      return;
    }
    // Keep the same center point while resizing the window around it.
    const center = { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
    const nextRect = rectFor(maxSize, { x: center.x * 100, y: center.y * 100, zoom: nextZoom });
    setZoom(nextZoom);
    setRect(nextRect);
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
          Arrastrá el recuadro para elegir qué parte de la foto se ve siempre, y usá el control de abajo
          para achicarlo (sin perder la proporción).
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
        <div className="adm-zoom-row">
          <span className="adm-zoom-label">－</span>
          <input
            type="range"
            min={1}
            max={MAX_ZOOM}
            step={0.02}
            value={zoom}
            onChange={(e) => applyZoom(Number(e.target.value))}
            disabled={!rect}
            aria-label="Achicar encuadre"
          />
          <span className="adm-zoom-label">＋</span>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
          <button type="button" className="adm-btn adm-btn-outline" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="adm-btn adm-btn-primary"
            disabled={!rect}
            onClick={() => rect && onConfirm(focalFor(rect, zoom))}
          >
            Guardar encuadre
          </button>
        </div>
      </div>
    </div>
  );
}
