import CroppedImage from "@/components/CroppedImage";
import type { SiteContent } from "@/lib/content";

export default function Hero({ hero }: { hero: SiteContent["hero"] }) {
  return (
    <section id="top" className="hero wrap">
      <h1 className="hero-title">
        <span className="line">
          <span>Rocío</span>
        </span>
        <span className="line">
          <span>
            Romero<i>.</i>
          </span>
        </span>
      </h1>

      <div className="hero-grid">
        <div className="hero-copy hero-fade">
          <span className="eyebrow">{hero.badgeText}</span>
          <p>
            Videos y fotos con estética natural que conectan con la gente y venden sin parecer
            publicidad. Moda, lifestyle y una cámara siempre a mano.
          </p>
          <div className="hero-actions">
            <a href="#contacto" className="btn btn-ink">
              Trabajemos juntos <span className="arrow">↗</span>
            </a>
            <a href="#portfolio" className="link-underline">
              Ver portfolio
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-photo-main">
            <CroppedImage photo={hero.image1} alt="Rocío, retrato" className="hero-photo" data-parallax="slow" />
          </div>
          <div className="hero-photo-side">
            <CroppedImage photo={hero.image2} alt="Rocío en la ciudad" className="hero-photo" data-parallax="fast" />
          </div>
          <svg className="hero-badge" viewBox="0 0 120 120" aria-hidden="true">
            <defs>
              <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
            </defs>
            <circle cx="60" cy="60" r="58" fill="#f3eee4" />
            <text>
              <textPath href="#badge-circle" startOffset="0">
                UGC · Content Creator · Buenos Aires ·
              </textPath>
            </text>
            <circle cx="60" cy="60" r="5" fill="#e23a1e" />
          </svg>
        </div>
      </div>

      <div className="hero-meta hero-fade">
        <span className="scroll-hint">
          <i /> Scroll
        </span>
        <span>Argentina → el mundo</span>
        <span>ES / EN</span>
      </div>
    </section>
  );
}
