"use client";

import { useEffect, useRef, useState } from "react";
import { focalStyle, type CroppedPhoto, type Servicio } from "@/lib/content";

/**
 * Editorial list of services. On pointer devices, hovering a row fills it
 * with ink and floats a photo preview that trails the cursor.
 */
export default function Services({
  servicios,
  previews,
}: {
  servicios: Servicio[];
  previews: CroppedPhoto[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const raf = useRef(0);

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover)").matches) return;

    const onMove = (e: PointerEvent) => {
      pos.current.tx = e.clientX;
      pos.current.ty = e.clientY;
      if (!raf.current) raf.current = window.requestAnimationFrame(loop);
    };

    const loop = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.14;
      p.y += (p.ty - p.y) * 0.14;
      el.style.left = `${p.x}px`;
      el.style.top = `${p.y}px`;
      const settled = Math.abs(p.tx - p.x) < 0.3 && Math.abs(p.ty - p.y) < 0.3;
      raf.current = settled ? 0 : window.requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf.current) window.cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <section id="servicios" className="services wrap">
      <div className="section-head">
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span className="eyebrow" data-reveal="up">
            Servicios
          </span>
          <h2 className="h2" data-reveal="up" style={{ "--d": "80ms" } as React.CSSProperties}>
            Qué puedo hacer <i>por tu marca</i>
          </h2>
        </div>
        <p data-reveal="up" style={{ "--d": "160ms" } as React.CSSProperties}>
          Todo el contenido se entrega editado, en formato vertical y con derechos de uso para tus
          canales.
        </p>
      </div>

      <ul className="svc-list" onPointerLeave={() => setActive(null)}>
        {servicios.map((s, i) => (
          <li
            key={s.num}
            className="svc-row"
            data-reveal="up"
            style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
            onPointerEnter={() => setActive(i)}
          >
            <span className="svc-num">{s.num}</span>
            <h3 className="svc-title">{s.titulo}</h3>
            <p className="svc-desc">{s.desc}</p>
            <span className="svc-arrow" aria-hidden="true">
              →
            </span>
          </li>
        ))}
      </ul>

      <div ref={previewRef} className={`svc-preview${active !== null ? " is-on" : ""}`} aria-hidden="true">
        {previews.map((photo, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${photo.url}-${i}`}
            src={photo.url}
            alt=""
            className={active === i ? "is-active" : undefined}
            style={focalStyle(photo.focal)}
          />
        ))}
      </div>
    </section>
  );
}
