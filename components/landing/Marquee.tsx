const WORDS = [
  "UGC",
  "Moda",
  "Lifestyle",
  "Beauty",
  "Unboxings",
  "Reviews",
  "TikTok",
  "Reels",
  "Fotos de producto",
];

export default function Marquee() {
  const items = [...WORDS, ...WORDS];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((word, i) => (
          <span key={`${word}-${i}`} className={`marquee-item${i % 2 ? " outline" : ""}`}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}
