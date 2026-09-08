"use client";

import { useEffect, useRef } from "react";

export default function Nav() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const y = window.scrollY;
      el.style.setProperty("--progress", String(max > 0 ? Math.min(1, y / max) : 0));
      el.classList.toggle("is-scrolled", y > 40);
    };

    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header ref={ref} className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="nav-brand" aria-label="Rocío Romero, inicio">
          Rocío Romero <em>®</em>
        </a>
        <nav className="nav-links" aria-label="Secciones">
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#servicios">Servicios</a>
          <a href="#portfolio">Portfolio</a>
        </nav>
        <a href="#contacto" className="nav-cta">
          Escribime
        </a>
      </div>
      <span className="nav-progress" aria-hidden="true" />
    </header>
  );
}
