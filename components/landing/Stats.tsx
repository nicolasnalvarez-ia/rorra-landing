import CountUp from "./CountUp";

export default function Stats() {
  return (
    <div className="wrap">
      <div className="stats">
        <div className="stat" data-reveal="up">
          <span className="stat-num">
            <CountUp to={78} />K
          </span>
          <span className="stat-label">Comunidad en TikTok</span>
        </div>
        <div className="stat" data-reveal="up" style={{ "--d": "100ms" } as React.CSSProperties}>
          <span className="stat-num">
            <CountUp to={80} />
            <sup>+</sup>
          </span>
          <span className="stat-label">Videos entregados</span>
        </div>
        <div className="stat" data-reveal="up" style={{ "--d": "200ms" } as React.CSSProperties}>
          <span className="stat-num">
            ES<i>/</i>EN
          </span>
          <span className="stat-label">Contenido bilingüe</span>
        </div>
      </div>
    </div>
  );
}
