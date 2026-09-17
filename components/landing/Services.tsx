import type { Servicio } from "@/lib/content";

/**
 * Editorial list of services. On pointer devices, hovering a row fills it
 * with ink and slides the title.
 */
export default function Services({ servicios }: { servicios: Servicio[] }) {
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

      <ul className="svc-list">
        {servicios.map((s, i) => (
          <li
            key={s.num}
            className="svc-row"
            data-reveal="up"
            style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
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
    </section>
  );
}
