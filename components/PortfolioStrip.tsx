"use client";

import { useEffect, useRef } from "react";
import type { GaleriaItem } from "@/lib/content";

export default function PortfolioStrip({ galeria }: { galeria: GaleriaItem[] }) {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    let down = false,
      startX = 0,
      startScroll = 0;
    const onDown = (e: PointerEvent) => {
      down = true;
      startX = e.clientX;
      startScroll = strip.scrollLeft;
      strip.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (down) strip.scrollLeft = startScroll - (e.clientX - startX);
    };
    const onUp = () => {
      down = false;
    };
    strip.addEventListener("pointerdown", onDown);
    strip.addEventListener("pointermove", onMove);
    strip.addEventListener("pointerup", onUp);
    return () => {
      strip.removeEventListener("pointerdown", onDown);
      strip.removeEventListener("pointermove", onMove);
      strip.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div
      id="strip"
      ref={stripRef}
      style={{
        display: "flex",
        gap: 26,
        padding: "10px 56px 30px",
        overflowX: "auto",
        userSelect: "none",
      }}
    >
      {galeria.map((g) => (
        <figure
          key={g.id}
          className="gallery-figure"
          style={{
            margin: 0,
            flex: "0 0 auto",
            width: 270,
            background: "#F7F0E6",
            padding: "10px 10px 40px",
            transform: `rotate(${g.rot})`,
            boxShadow: "0 20px 44px rgba(0,0,0,0.4)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={g.src}
            alt={g.tag}
            draggable={false}
            style={{
              width: "100%",
              aspectRatio: "3/4",
              objectFit: "cover",
              display: "block",
              pointerEvents: "none",
            }}
          />
          <figcaption
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 23,
              color: "#1E1812",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            {g.tag}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
