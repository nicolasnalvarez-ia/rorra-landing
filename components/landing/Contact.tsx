import Magnetic from "./Magnetic";
import LocalTime from "./LocalTime";
import { CONTACT_EMAIL, INSTAGRAM_URL, TIKTOK_URL } from "@/lib/links";

export default function Contact() {
  return (
    <section id="contacto" className="contact">
      <span className="contact-watermark" aria-hidden="true">
        Ro
      </span>
      <div className="wrap contact-inner">
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <span className="eyebrow" data-reveal="up" style={{ color: "rgba(243,238,228,0.55)" }}>
            Contacto
          </span>
          <h2 className="contact-title" data-reveal="clip">
            <span>
              ¿Hacemos algo
              <br />
              <i>juntos?</i>
            </span>
          </h2>
        </div>

        <div className="contact-grid">
          <div className="contact-col" data-reveal="up">
            <p>
              Contame de tu marca y armamos contenido que la gente quiera ver. Respondo rápido, en
              español o en inglés.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email">
              {CONTACT_EMAIL}
            </a>
            <div style={{ marginTop: 36, display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Magnetic>
                <a href={`mailto:${CONTACT_EMAIL}`} className="btn btn-paper">
                  Escribime <span className="arrow">↗</span>
                </a>
              </Magnetic>
              <Magnetic>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  Instagram
                </a>
              </Magnetic>
            </div>
          </div>

          <div className="contact-col" data-reveal="up" style={{ "--d": "120ms" } as React.CSSProperties}>
            <span className="eyebrow">Seguime</span>
            <ul className="social-list">
              <li>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  Instagram <small>@rorra.romero2</small>
                </a>
              </li>
              <li>
                <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer">
                  TikTok <small>@rorra.romero</small>
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`}>
                  Email <small>hola@</small>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <footer className="footer">
          <span>© {new Date().getFullYear()} Rocío Romero</span>
          <span className="serif">contenido con onda ✳</span>
          <LocalTime />
        </footer>
      </div>
    </section>
  );
}
