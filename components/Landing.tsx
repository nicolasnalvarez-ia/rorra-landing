"use client";

import CustomCursor from "@/components/CustomCursor";
import PortfolioStrip from "@/components/PortfolioStrip";
import { useReveal } from "@/components/useReveal";
import type { SiteContent } from "@/lib/content";

const MARQUEE_TEXT =
  " UGC ✳ Moda ✳ Lifestyle ✳ Beauty ✳ Unboxings ✳ Reviews ✳ TikTok e Instagram ✳ Fotos de producto ✳";

export default function Landing({ content }: { content: SiteContent }) {
  useReveal();

  return (
    <div style={{ minHeight: "100vh", background: "#F7F0E6", overflowX: "hidden" }}>
      <CustomCursor />

      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "26px 56px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(247,240,230,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(30,24,18,0.08)",
        }}
      >
        <div style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 24 }}>
          Rocío Romero
          <span style={{ color: "#C4451C" }}>.</span>
        </div>
        <nav
          style={{
            display: "flex",
            gap: 34,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#servicios">Servicios</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#contacto" style={{ color: "#C4451C" }}>
            Contacto ↗
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section
        style={{
          position: "relative",
          maxWidth: 1340,
          margin: "0 auto",
          padding: "90px 56px 130px",
          minHeight: "72vh",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(300px, 1fr)",
          gap: 40,
        }}
      >
        <div style={{ position: "relative", zIndex: 2, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#C4451C",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ width: 44, height: 2, background: "#C4451C", display: "inline-block" }} />
            {content.hero.badgeText}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontWeight: 400,
              margin: "28px 0 0",
              fontSize: "clamp(54px, 7vw, 108px)",
              lineHeight: 0.98,
              letterSpacing: "-0.01em",
              position: "relative",
              zIndex: 2,
            }}
          >
            Contenido
            <br />
            <span style={{ display: "inline-flex", alignItems: "center", gap: 24 }}>
              <em style={{ color: "#C4451C" }}>real</em>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={content.hero.heroImage}
                alt="Rocío"
                style={{
                  height: "0.85em",
                  width: "1.7em",
                  objectFit: "cover",
                  borderRadius: 999,
                  boxShadow: "0 10px 30px rgba(30,24,18,0.25)",
                }}
              />
              <span style={{ WebkitTextStroke: "1.5px #1E1812", color: "transparent" }}>que</span>
            </span>
            <br />
            conecta y vende.
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
              marginTop: 44,
              position: "relative",
              zIndex: 2,
              flexWrap: "wrap",
            }}
          >
            <a
              href="#contacto"
              className="btn-dark"
              style={{
                padding: "18px 36px",
                borderRadius: 999,
                fontSize: 15,
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              Trabajemos juntas <span style={{ fontSize: 18 }}>→</span>
            </a>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.55,
                color: "#6B5F52",
                maxWidth: "34ch",
                margin: 0,
              }}
            >
              Videos y fotos con estética natural que no parecen publicidad — parecen una amiga
              recomendando.
            </p>
          </div>
        </div>

        {/* floating polaroids column */}
        <div style={{ position: "relative", minHeight: 480 }}>
          <div
            data-parallax="30"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: 220,
              background: "#fff",
              padding: "10px 10px 34px",
              boxShadow: "0 24px 50px rgba(30,24,18,0.22)",
              animation: "floaty 7s ease-in-out infinite",
              zIndex: 1,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.hero.polaroid1.src}
              alt="summer"
              style={{ width: "100%", display: "block" }}
            />
            <div
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontSize: 21,
                textAlign: "center",
                marginTop: 8,
                color: "#1E1812",
              }}
            >
              {content.hero.polaroid1.caption}
            </div>
          </div>
          <div
            data-parallax="-20"
            style={{
              position: "absolute",
              right: 170,
              bottom: 30,
              width: 185,
              background: "#fff",
              padding: "9px 9px 30px",
              boxShadow: "0 24px 50px rgba(30,24,18,0.22)",
              animation: "floaty2 8s ease-in-out infinite",
              zIndex: 3,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={content.hero.polaroid2.src}
              alt="selfie"
              style={{ width: "100%", display: "block" }}
            />
            <div
              style={{
                fontFamily: "var(--font-caveat), cursive",
                fontSize: 20,
                textAlign: "center",
                marginTop: 7,
              }}
            >
              {content.hero.polaroid2.caption}
            </div>
          </div>
          {/* rotating badge */}
          <div style={{ position: "absolute", right: 20, bottom: 0, width: 120, height: 120, zIndex: 4 }}>
            <svg
              viewBox="0 0 120 120"
              style={{ width: "100%", height: "100%", animation: "spin 14s linear infinite" }}
            >
              <defs>
                <path id="circ" d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" />
              </defs>
              <text
                style={{
                  fontFamily: "Archivo, sans-serif",
                  fontSize: 12.5,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fill: "#1E1812",
                }}
              >
                <textPath href="#circ">disponible para colabs · ugc · </textPath>
              </text>
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeItems: "center",
                fontSize: 26,
                color: "#C4451C",
              }}
            >
              ✳
            </div>
          </div>
        </div>
      </section>

      {/* marquee */}
      <div
        style={{
          background: "#1E1812",
          color: "#F7F0E6",
          overflow: "hidden",
          padding: "20px 0",
          whiteSpace: "nowrap",
          transform: "rotate(-1.2deg) scale(1.02)",
          boxShadow: "0 10px 30px rgba(30,24,18,0.2)",
        }}
      >
        <div style={{ display: "inline-flex", gap: 0, animation: "marquee 20s linear infinite" }}>
          <span
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontSize: 26,
              fontStyle: "italic",
              paddingRight: 12,
            }}
          >
            {MARQUEE_TEXT}
          </span>
          <span
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontSize: 26,
              fontStyle: "italic",
              paddingRight: 12,
            }}
          >
            {MARQUEE_TEXT}
          </span>
        </div>
      </div>

      {/* SOBRE MI */}
      <section
        id="sobre-mi"
        style={{
          maxWidth: 1340,
          margin: "0 auto",
          padding: "130px 56px",
          display: "grid",
          gridTemplateColumns: "0.85fr 1.15fr",
          gap: 90,
          alignItems: "center",
        }}
      >
        <div data-reveal style={{ position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={content.sobreMi.image}
            alt="Rocío"
            style={{
              width: "100%",
              borderRadius: 4,
              display: "block",
              boxShadow: "0 30px 60px rgba(30,24,18,0.22)",
              transform: "rotate(-2deg)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -18,
              left: "50%",
              transform: "translateX(-50%) rotate(3deg)",
              background: "rgba(242,201,184,0.85)",
              width: 120,
              height: 34,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -20,
              right: -14,
              background: "#C4451C",
              color: "#F7F0E6",
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 24,
              padding: "10px 22px",
              borderRadius: 999,
              transform: "rotate(-4deg)",
            }}
          >
            {content.sobreMi.badge}
          </div>
        </div>
        <div data-reveal style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#C4451C",
            }}
          >
            Sobre mí
          </div>
          <h2
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontWeight: 400,
              fontSize: 56,
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Marketing, moda y una cámara <em style={{ color: "#C4451C" }}>siempre</em> a mano.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "#6B5F52", margin: 0 }}>
            Hago contenido desde antes de que fuera trabajo: probando productos, contando
            historias y mostrando la vida como es. Las marcas me buscan porque mi contenido no
            parece un aviso.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "#6B5F52", margin: 0 }}>
            Grabo, edito y entrego listo para publicar. Español, inglés o los dos.
          </p>
          <div style={{ display: "flex", gap: 44, paddingTop: 8, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 40 }}>
                78K
              </div>
              <div style={{ fontSize: 13, color: "#6B5F52" }}>en TikTok</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 40 }}>
                +80
              </div>
              <div style={{ fontSize: 13, color: "#6B5F52" }}>videos creados</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 40 }}>
                ES/EN
              </div>
              <div style={{ fontSize: 13, color: "#6B5F52" }}>bilingüe</div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ maxWidth: 1340, margin: "0 auto", padding: "40px 56px 130px" }}>
        <div data-reveal style={{ textAlign: "center", marginBottom: 60 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "#C4451C",
              marginBottom: 14,
            }}
          >
            Servicios
          </div>
          <h2 style={{ fontFamily: "var(--font-instrument-serif), serif", fontWeight: 400, fontSize: 56, margin: 0 }}>
            Qué puedo hacer por tu marca
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {content.servicios.map((s) => (
            <div
              key={s.num}
              style={{
                position: "sticky",
                top: s.top,
                background: s.bg,
                color: s.fg,
                borderRadius: 22,
                padding: "52px 60px",
                display: "grid",
                gridTemplateColumns: "80px 1fr auto",
                gap: 40,
                alignItems: "center",
                boxShadow: "0 -12px 40px rgba(30,24,18,0.14)",
                border: "1px solid rgba(30,24,18,0.08)",
                minHeight: 160,
              }}
            >
              <div style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 58, color: "#C4451C" }}>
                {s.num}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <h3 style={{ fontSize: 27, margin: 0, fontWeight: 700 }}>{s.titulo}</h3>
                <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0, maxWidth: "60ch", opacity: 0.75 }}>
                  {s.desc}
                </p>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-caveat), cursive",
                  fontSize: 24,
                  transform: "rotate(-4deg)",
                  color: "#C4451C",
                  whiteSpace: "nowrap",
                }}
              >
                {s.nota}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" style={{ background: "#1E1812", color: "#F7F0E6", padding: "120px 0", overflow: "hidden" }}>
        <div
          data-reveal
          style={{
            maxWidth: 1340,
            margin: "0 auto 56px",
            padding: "0 56px",
            display: "flex",
            alignItems: "end",
            justifyContent: "space-between",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#E8906B",
                marginBottom: 14,
              }}
            >
              Portfolio
            </div>
            <h2 style={{ fontFamily: "var(--font-instrument-serif), serif", fontWeight: 400, fontSize: 56, margin: 0 }}>
              Un poco de lo que hago
            </h2>
          </div>
          <div
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 24,
              color: "#E8906B",
              transform: "rotate(-2deg)",
            }}
          >
            arrastrá para ver más →
          </div>
        </div>

        <PortfolioStrip galeria={content.galeria} />

        <p style={{ textAlign: "center", fontSize: 15, color: "#C9BEB0", margin: "40px 0 0" }}>
          Más en{" "}
          <a
            href="https://www.instagram.com/rorra.romero2/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#E8906B", fontWeight: 700, borderBottom: "1px solid #E8906B" }}
          >
            Instagram
          </a>{" "}
          y{" "}
          <a
            href="https://www.tiktok.com/@rorra.romero"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#E8906B", fontWeight: 700, borderBottom: "1px solid #E8906B" }}
          >
            TikTok
          </a>
        </p>
      </section>

      {/* CONTACTO */}
      <section
        id="contacto"
        style={{ position: "relative", padding: "150px 56px 60px", maxWidth: 1340, margin: "0 auto" }}
      >
        <div
          data-reveal
          style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}
        >
          <div
            style={{
              fontFamily: "var(--font-caveat), cursive",
              fontSize: 30,
              color: "#C4451C",
              transform: "rotate(-2deg)",
            }}
          >
            ¿te gustó lo que viste?
          </div>
          <a
            href="mailto:hola@rocioromero.com"
            className="contact-link"
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontSize: "clamp(54px, 8vw, 116px)",
              lineHeight: 1,
              color: "#1E1812",
              display: "inline-block",
            }}
          >
            Escribime →
          </a>
          <p style={{ fontSize: 17, color: "#6B5F52", maxWidth: "46ch", margin: 0 }}>
            Contame de tu marca y armamos contenido que la gente quiera ver. Respondo rápido.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="mailto:hola@rocioromero.com"
              className="btn-dark"
              style={{ padding: "15px 30px", borderRadius: 999, fontSize: 14, fontWeight: 700 }}
            >
              hola@rocioromero.com
            </a>
            <a
              href="https://www.instagram.com/rorra.romero2/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ padding: "15px 30px", borderRadius: 999, fontSize: 14, fontWeight: 700 }}
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@rorra.romero"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              style={{ padding: "15px 30px", borderRadius: 999, fontSize: 14, fontWeight: 700 }}
            >
              TikTok
            </a>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid rgba(30,24,18,0.12)",
            marginTop: 90,
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            color: "#8A7E70",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <span>© 2026 Rocío Romero</span>
          <span style={{ fontFamily: "var(--font-caveat), cursive", fontSize: 19 }}>hecho con onda ✳</span>
        </div>
      </section>
    </div>
  );
}
