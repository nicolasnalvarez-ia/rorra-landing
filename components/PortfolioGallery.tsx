"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getFocal, type FocalPoint, type GaleriaItem, type LibraryItem } from "@/lib/content";

function focalCss(focal: FocalPoint) {
  return `${focal.x}% ${focal.y}%`;
}

export default function PortfolioGallery({
  galeria,
  library,
}: {
  galeria: GaleriaItem[];
  library: LibraryItem[];
}) {
  const [openItem, setOpenItem] = useState<GaleriaItem | null>(null);
  const [index, setIndex] = useState(0);
  const [closing, setClosing] = useState(false);

  const photos = useMemo(() => openItem?.photos ?? [], [openItem]);

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
    }, 280);
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {galeria.filter((g) => g.photos.length > 0).map((g) => (
          <button
            key={g.id}
            type="button"
            className="pf-card"
            onClick={() => open(g)}
            aria-label={`Ver más fotos de ${g.tag}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.photos[0]}
              alt={g.tag}
              style={{
                width: "100%",
                aspectRatio: "3/4",
                objectFit: "cover",
                objectPosition: focalCss(getFocal(library, g.photos[0])),
                display: "block",
              }}
            />
            <span className="pf-card-hint">＋ ver más</span>
            <span
              style={{
                position: "absolute",
                left: 10,
                bottom: 10,
                background: "rgba(250,245,238,0.92)",
                borderRadius: 999,
                padding: "5px 14px",
                fontSize: 12,
                fontWeight: 600,
                color: "#221B14",
              }}
            >
              {g.tag}
            </span>
          </button>
        ))}
      </div>

      {openItem && (
        <div
          className={`lb-backdrop${closing ? " lb-closing" : ""}`}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`Galería ${openItem.tag}`}
        >
          <div className="lb-panel" onClick={(e) => e.stopPropagation()}>
            <div className="lb-header">
              <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                <span
                  style={{
                    fontFamily: "var(--font-instrument-serif), serif",
                    fontStyle: "italic",
                    fontSize: 32,
                    lineHeight: 1,
                  }}
                >
                  {openItem.tag}
                </span>
                <span style={{ fontSize: 13, letterSpacing: "0.08em", color: "#C9BEB0" }}>
                  {index + 1} / {photos.length}
                </span>
              </div>
              <button type="button" className="lb-close" onClick={close} aria-label="Cerrar">
                ×
              </button>
            </div>

            <div className="lb-stage">
              {photos.length > 1 && (
                <button type="button" className="lb-arrow" onClick={prev} aria-label="Anterior">
                  ←
                </button>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img key={`${photos[index]}-${index}`} src={photos[index]} alt={openItem.tag} className="lb-img" />
              {photos.length > 1 && (
                <button type="button" className="lb-arrow" onClick={next} aria-label="Siguiente">
                  →
                </button>
              )}
            </div>

            <div className="lb-thumbs">
              {photos.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  type="button"
                  className={`lb-thumb${i === index ? " lb-thumb-active" : ""}`}
                  onClick={() => setIndex(i)}
                  aria-label={`Foto ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" style={{ objectPosition: focalCss(getFocal(library, src)) }} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
