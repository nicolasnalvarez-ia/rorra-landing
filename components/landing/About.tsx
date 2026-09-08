import CroppedImage from "@/components/CroppedImage";
import type { SiteContent } from "@/lib/content";

export default function About({ sobreMi }: { sobreMi: SiteContent["sobreMi"] }) {
  return (
    <section id="sobre-mi" className="about wrap">
      <div className="about-media" data-reveal="scale">
        <CroppedImage photo={sobreMi.image} alt="Rocío" className="about-photo" />
        <span className="about-sticker">hola, soy Ro</span>
      </div>

      <div className="about-body">
        <span className="eyebrow" data-reveal="up">
          Sobre mí
        </span>
        <h2 className="h2" data-reveal="up" style={{ "--d": "80ms" } as React.CSSProperties}>
          Marketing, moda y <i>una cámara</i> siempre a mano.
        </h2>
        <div className="about-text">
          <p data-reveal="up" style={{ "--d": "160ms" } as React.CSSProperties}>
            Soy argentina y hago contenido desde antes de que fuera trabajo: probando productos,
            contando historias y mostrando la vida como es.
          </p>
          <p data-reveal="up" style={{ "--d": "240ms" } as React.CSSProperties}>
            Las marcas me buscan porque mi contenido no parece un aviso. Parece una amiga
            recomendándote algo que le encantó. Grabo, edito y entrego listo para publicar. En
            español, en inglés o en los dos.
          </p>
        </div>
        <div className="tags" data-reveal="up" style={{ "--d": "320ms" } as React.CSSProperties}>
          {sobreMi.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
