import PortfolioGallery from "@/components/PortfolioGallery";
import type { GaleriaItem } from "@/lib/content";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/links";

export default function Portfolio({ galeria }: { galeria: GaleriaItem[] }) {
  const count = galeria.filter((g) => g.photos.length > 0).length;
  return (
    <section id="portfolio" className="portfolio">
      <div className="wrap">
        <div className="section-head">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <span className="eyebrow" data-reveal="up">
              Portfolio · {String(count).padStart(2, "0")} series
            </span>
            <h2 className="h2" data-reveal="up" style={{ "--d": "80ms" } as React.CSSProperties}>
              Un poco de <i>lo que hago</i>
            </h2>
          </div>
          <p data-reveal="up" style={{ "--d": "160ms" } as React.CSSProperties}>
            Tocá una serie para verla completa.
          </p>
        </div>

        <PortfolioGallery galeria={galeria} />

        <div className="pf-more" data-reveal="up">
          <span>Hay mucho más en las redes.</span>
          <nav aria-label="Redes sociales">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="link-underline">
              Instagram ↗
            </a>
            <a href={TIKTOK_URL} target="_blank" rel="noopener noreferrer" className="link-underline">
              TikTok ↗
            </a>
          </nav>
        </div>
      </div>
    </section>
  );
}
