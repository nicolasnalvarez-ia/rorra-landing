import CroppedImage from "@/components/CroppedImage";
import PortfolioGallery from "@/components/PortfolioGallery";
import type { SiteContent } from "@/lib/content";

const MARQUEE_TEXT =
  "UGC · Moda · Lifestyle · Beauty · Unboxings · Reviews · Videos para TikTok e Instagram · Fotos de producto · ";

export default function Landing({ content }: { content: SiteContent }) {
  return (
    <div style={{ minHeight: "100vh", background: "#FAF5EE" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          padding: "clamp(16px, 4vw, 24px) clamp(20px, 5vw, 48px)",
          maxWidth: 1280,
          margin: "0 auto",
          gap: 12,
        }}
      >
        <div style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 24 }}>Rocío Romero</div>
        <nav
          style={{
            display: "flex",
            gap: "clamp(12px, 3.5vw, 32px)",
            fontSize: "clamp(11px, 2.4vw, 13px)",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            flexWrap: "wrap",
          }}
        >
          <a href="#sobre-mi">Sobre mí</a>
          <a href="#servicios">Servicios</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#contacto" style={{ color: "#C4451C" }}>
            Contacto
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section
        className="hero-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(28px, 6vw, 48px) clamp(20px, 5vw, 48px) clamp(48px, 10vw, 88px)",
          display: "grid",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#C4451C",
            }}
          >
            <span style={{ width: 36, height: 2, background: "#C4451C", display: "inline-block" }} />
            {content.hero.badgeText}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontWeight: 400,
              fontSize: "clamp(38px, 8vw, 78px)",
              lineHeight: 1.05,
              margin: 0,
              textWrap: "balance",
            }}
          >
            Contenido que se siente <em style={{ color: "#C4451C" }}>real</em>, hecho para tu marca.
          </h1>
          <p style={{ fontSize: 18, lineHeight: 1.6, color: "#5C5248", margin: 0, maxWidth: "46ch" }}>
            Soy Rocío — creo videos y fotos con estética natural que conectan con la gente y venden sin
            parecer publicidad. Moda, lifestyle y mucha creatividad.
          </p>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <a
              href="#contacto"
              className="btn-dark"
              style={{ padding: "16px 32px", borderRadius: 999, fontSize: 15, fontWeight: 600 }}
            >
              Trabajemos juntas
            </a>
            <a
              href="#portfolio"
              style={{ padding: "16px 8px", fontSize: 15, fontWeight: 600, borderBottom: "2px solid #221B14" }}
            >
              Ver portfolio ↓
            </a>
          </div>
          <div style={{ display: "flex", gap: 40, paddingTop: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 34 }}>78K</div>
              <div style={{ fontSize: 13, color: "#5C5248", letterSpacing: "0.04em" }}>en TikTok</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 34 }}>+80</div>
              <div style={{ fontSize: 13, color: "#5C5248", letterSpacing: "0.04em" }}>videos creados</div>
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 34 }}>ES/EN</div>
              <div style={{ fontSize: 13, color: "#5C5248", letterSpacing: "0.04em" }}>contenido bilingüe</div>
            </div>
          </div>
        </div>
        <div
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            alignItems: "start",
          }}
        >
          <CroppedImage
            photo={content.hero.image1}
            alt="Rocío selfie"
            style={{
              width: "100%",
              borderRadius: 16,
              marginTop: 40,
              boxShadow: "0 20px 40px rgba(34,27,20,0.18)",
            }}
          />
          <CroppedImage
            photo={content.hero.image2}
            alt="Rocío en la ciudad"
            style={{ width: "100%", borderRadius: 16, boxShadow: "0 20px 40px rgba(34,27,20,0.18)" }}
          />
        </div>
      </section>

      {/* marquee */}
      <div style={{ background: "#221B14", color: "#FAF5EE", overflow: "hidden", padding: "18px 0", whiteSpace: "nowrap" }}>
        <div
          style={{
            display: "inline-flex",
            gap: 48,
            animation: "marquee 22s linear infinite",
            fontFamily: "var(--font-instrument-serif), serif",
            fontSize: 22,
            fontStyle: "italic",
          }}
        >
          <span>{MARQUEE_TEXT}</span>
          <span>{MARQUEE_TEXT}</span>
        </div>
      </div>

      {/* SOBRE MI */}
      <section
        id="sobre-mi"
        className="sobre-mi-grid"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(56px, 12vw, 96px) clamp(20px, 5vw, 48px)",
          display: "grid",
          alignItems: "center",
        }}
      >
        <CroppedImage
          photo={content.sobreMi.image}
          alt="Rocío"
          style={{ width: "100%", borderRadius: 16, boxShadow: "0 20px 40px rgba(34,27,20,0.15)" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.14em",
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
              fontSize: "clamp(30px, 6vw, 48px)",
              lineHeight: 1.08,
              margin: 0,
              textWrap: "balance",
            }}
          >
            Marketing, moda y una cámara siempre a mano.
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#5C5248", margin: 0 }}>
            Soy argentina y hago contenido desde antes de que fuera trabajo: probando productos,
            contando historias y mostrando la vida como es. Las marcas me buscan porque mi contenido
            no parece un aviso — parece una amiga recomendándote algo que le encantó.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#5C5248", margin: 0 }}>
            Grabo, edito y entrego listo para publicar. Español, inglés o los dos.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {content.sobreMi.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  border: "1px solid #D9CFC2",
                  borderRadius: 999,
                  padding: "8px 18px",
                  fontSize: 14,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS */}
      <section id="servicios" style={{ background: "#F2E9DC" }}>
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "clamp(56px, 12vw, 96px) clamp(20px, 5vw, 48px)",
            display: "flex",
            flexDirection: "column",
            gap: 48,
          }}
        >
          <div
            style={{
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
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "#C4451C",
                  marginBottom: 14,
                }}
              >
                Servicios
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-instrument-serif), serif",
                  fontWeight: 400,
                  fontSize: "clamp(30px, 6vw, 48px)",
                  lineHeight: 1.08,
                  margin: 0,
                  textWrap: "balance",
                }}
              >
                Qué puedo hacer por tu marca
              </h2>
            </div>
            <p style={{ fontSize: 15, color: "#5C5248", maxWidth: "36ch", margin: 0 }}>
              Todo el contenido se entrega editado, con derechos de uso para tus canales.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {content.servicios.map((s) => (
              <div
                key={s.num}
                style={{
                  background: "#FAF5EE",
                  borderRadius: 16,
                  padding: 32,
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                }}
              >
                <div style={{ fontFamily: "var(--font-instrument-serif), serif", fontSize: 40, color: "#C4451C" }}>
                  {s.num}
                </div>
                <h3 style={{ fontSize: 21, margin: 0, fontWeight: 600 }}>{s.titulo}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.6, color: "#5C5248", margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section
        id="portfolio"
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "clamp(56px, 12vw, 96px) clamp(20px, 5vw, 48px)",
          display: "flex",
          flexDirection: "column",
          gap: 48,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#C4451C",
              marginBottom: 14,
            }}
          >
            Portfolio
          </div>
          <h2
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontWeight: 400,
              fontSize: "clamp(30px, 6vw, 48px)",
              margin: 0,
            }}
          >
            Un poco de lo que hago
          </h2>
        </div>
        <PortfolioGallery galeria={content.galeria} />
        <p style={{ textAlign: "center", fontSize: 15, color: "#5C5248", margin: 0 }}>
          Más en{" "}
          <a
            href="https://www.instagram.com/rorra.romero2/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 600, borderBottom: "1px solid #221B14" }}
          >
            Instagram
          </a>{" "}
          y{" "}
          <a
            href="https://www.tiktok.com/@rorra.romero"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontWeight: 600, borderBottom: "1px solid #221B14" }}
          >
            TikTok
          </a>
        </p>
      </section>

      {/* CONTACTO */}
      <section id="contacto" style={{ background: "#221B14", color: "#FAF5EE" }}>
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "clamp(64px, 14vw, 110px) clamp(20px, 5vw, 48px) clamp(40px, 8vw, 60px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 28,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#E8906B",
            }}
          >
            Contacto
          </div>
          <h2
            style={{
              fontFamily: "var(--font-instrument-serif), serif",
              fontWeight: 400,
              fontSize: "clamp(34px, 9vw, 60px)",
              lineHeight: 1.05,
              margin: 0,
              textWrap: "balance",
            }}
          >
            ¿Hacemos algo juntas? <em style={{ color: "#E8906B" }}>Escribime.</em>
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: "#C9BEB0", margin: 0, maxWidth: "48ch" }}>
            Contame de tu marca y armamos contenido que la gente quiera ver. Respondo rápido.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
            <a
              href="mailto:hola@rocioromero.com"
              className="btn-light"
              style={{ padding: "16px 32px", borderRadius: 999, fontSize: 15, fontWeight: 600 }}
            >
              hola@rocioromero.com
            </a>
            <a
              href="https://www.instagram.com/rorra.romero2/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-light"
              style={{ padding: "16px 32px", borderRadius: 999, fontSize: 15, fontWeight: 600 }}
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@rorra.romero"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-light"
              style={{ padding: "16px 32px", borderRadius: 999, fontSize: 15, fontWeight: 600 }}
            >
              TikTok
            </a>
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid #3A322A",
            padding: "24px clamp(20px, 5vw, 48px)",
            display: "flex",
            justifyContent: "space-between",
            maxWidth: 1280,
            margin: "0 auto",
            fontSize: 13,
            color: "#8A7E70",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <span>© 2026 Rocío Romero</span>
          <span style={{ fontFamily: "var(--font-instrument-serif), serif", fontStyle: "italic", fontSize: 15 }}>
            contenido con onda ✳
          </span>
        </div>
      </section>
    </div>
  );
}
