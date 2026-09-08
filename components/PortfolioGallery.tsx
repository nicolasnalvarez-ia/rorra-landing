"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { focalStyle, type GaleriaItem } from "@/lib/content";
import CroppedImage from "@/components/CroppedImage";

export default function PortfolioGallery({ galeria }: { galeria: GaleriaItem[] }) {
  const [openItem, setOpenItem] = useState<GaleriaItem | null>(null);
  const [index, setIndex] = useState(0);
  const [closing, setClosing] = useState(false);

  const photos = useMemo(() => openItem?.photos ?? [], [openItem]);
  const items = galeria.filter((g) => g.photos.length > 0);

  const open = (item: GaleriaItem) => {
    setIndex(0);
    setClosing(false);
    setOpenItem(item);
  };

  const close = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setOpenItem(null);
      setClosing(false);
    }, 300);
  }, []);

  const next = useCallback(
    () => setIndex((i) => (photos.length ? (i + 1) % photos.length : 0)),
    [photos.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (photos.length ? (i - 1 + photos.length) % photos.length : 0)),
    [photos.length]
  );

  useEffect(() => {
    if (!openItem) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openItem, close, next, prev]);

  return (
    <>
      <div className="pf-grid">
        {items.map((g, i) => (
          <button
            key={g.id}
            type="button"
            className="pf-item"
            onClick={() => open(g)}
            aria-label={`Ver ${g.photos.length} fotos de ${g.tag}`}
            data-reveal="up"
            style={{ "--d": `${(i % 3) * 110}ms` } as React.CSSProperties}
          >
            <span className="pf-index">{String(i + 1).padStart(2, "0")}</span>
            <CroppedImage photo={g.photos[0]} alt={g.tag} className="pf-img" />
            <span className="pf-caption">
              <span className="pf-tag">{g.tag}</span>
              <span className="pf-count">{g.photos.length} fotos</span>
            </span>
          </button>
        ))}
      </div>

      {openItem && (
        <div
          className={`lb${closing ? " is-closing" : ""}`}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`Galería ${openItem.tag}`}
        >
          <div className="lb-panel" onClick={(e) => e.stopPropagation()}>
            <div className="lb-head">
              <div>
                <span className="lb-title">{openItem.tag}</span>
                <span className="lb-counter">
                  {String(index + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                </span>
              </div>
              <button type="button" className="lb-close" onClick={close} aria-label="Cerrar">
                ×
              </button>
            </div>

            <div className="lb-stage">
              {photos.length > 1 && (
                <button type="button" className="lb-arrow prev" onClick={prev} aria-label="Anterior">
                  ←
                </button>
              )}
              <CroppedImage
                key={`${photos[index].url}-${index}`}
                photo={photos[index]}
                alt={openItem.tag}
                className="lb-img"
              />
              {photos.length > 1 && (
                <button type="button" className="lb-arrow next" onClick={next} aria-label="Siguiente">
                  →
                </button>
              )}
            </div>

            <div className="lb-thumbs">
              {photos.map((photo, i) => (
                <button
                  key={`${photo.url}-${i}`}
                  type="button"
                  className={`lb-thumb${i === index ? " is-active" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Foto ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo.url} alt="" style={focalStyle(photo.focal)} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
