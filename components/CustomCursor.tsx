"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    let tx = 0,
      ty = 0,
      rx = 0,
      ry = 0;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (dot) {
        dot.style.left = tx + "px";
        dot.style.top = ty + "px";
      }
      const target = e.target as HTMLElement;
      const overLink = target.closest && target.closest("a, button");
      if (ring) {
        ring.style.width = ring.style.height = overLink ? "58px" : "36px";
        ring.style.opacity = overLink ? "0.5" : "1";
      }
      document.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
        const f = parseFloat(el.getAttribute("data-parallax") || "0");
        const dx = (tx / window.innerWidth - 0.5) * f;
        const dy = (ty / window.innerHeight - 0.5) * f;
        el.style.marginLeft = dx + "px";
        el.style.marginTop = dy + "px";
      });
    };

    window.addEventListener("mousemove", onMove);

    let raf: number;
    const follow = () => {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      if (ring) {
        ring.style.left = rx + "px";
        ring.style.top = ry + "px";
      }
      raf = requestAnimationFrame(follow);
    };
    follow();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        id="cursor-dot"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 10,
          height: 10,
          background: "#C4451C",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transform: "translate(-50%,-50%)",
        }}
      />
      <div
        ref={ringRef}
        id="cursor-ring"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          border: "1.5px solid #C4451C",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          transform: "translate(-50%,-50%)",
          transition: "width 0.2s, height 0.2s, opacity 0.2s",
        }}
      />
    </>
  );
}
