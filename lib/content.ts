export type Servicio = {
  num: string;
  top: string;
  bg: string;
  fg: string;
  titulo: string;
  desc: string;
  nota: string;
};

export type GaleriaItem = {
  id: string;
  src: string;
  tag: string;
  rot: string;
};

export type SiteContent = {
  hero: {
    badgeText: string;
    heroImage: string;
    polaroid1: { src: string; caption: string };
    polaroid2: { src: string; caption: string };
  };
  sobreMi: {
    image: string;
    badge: string;
  };
  servicios: Servicio[];
  galeria: GaleriaItem[];
};

/** All photos available in /public/photos, used by the admin picker. */
export const PHOTO_LIBRARY = [
  "bikini-rosa.jpg",
  "city-night.jpg",
  "mirror.jpg",
  "noche-espalda.jpg",
  "pergola.jpg",
  "pool.jpg",
  "ross.jpg",
  "selfie-beige.jpg",
  "sushi.jpg",
  "texas.jpg",
  "vestido-noche.jpg",
  "zebra-selfie.jpg",
] as const;

export const defaultContent: SiteContent = {
  hero: {
    badgeText: "Content creator & UGC — Texas, USA",
    heroImage: "/photos/selfie-beige.jpg",
    polaroid1: { src: "/photos/bikini-rosa.jpg", caption: "summer szn ☀" },
    polaroid2: { src: "/photos/zebra-selfie.jpg", caption: "on set 🎬" },
  },
  sobreMi: {
    image: "/photos/pergola.jpg",
    badge: "arg 🇦🇷 → texas",
  },
  servicios: [
    {
      num: "01",
      top: "110px",
      bg: "#FFFFFF",
      fg: "#1E1812",
      titulo: "Videos UGC",
      desc: "Reviews, unboxings, tutoriales y day-in-the-life con tu producto integrado de forma natural. Formato vertical listo para TikTok, Reels y ads.",
      nota: "el más pedido ✦",
    },
    {
      num: "02",
      top: "140px",
      bg: "#F2E9DC",
      fg: "#1E1812",
      titulo: "Fotos de producto & lifestyle",
      desc: "Fotos con luz natural y estética cuidada para tu feed, web o campañas. Tu producto en contexto real, no en un estudio.",
      nota: "luz natural siempre",
    },
    {
      num: "03",
      top: "170px",
      bg: "#1E1812",
      fg: "#F7F0E6",
      titulo: "Colaboraciones & campañas",
      desc: "Contenido publicado en mis redes: 78K en TikTok con una comunidad que confía en lo que recomiendo.",
      nota: "78K y subiendo ↗",
    },
  ],
  galeria: [
    { id: "g1", src: "/photos/vestido-noche.jpg", tag: "night out ✨", rot: "-2.5deg" },
    { id: "g2", src: "/photos/texas.jpg", tag: "un día en Texas", rot: "1.8deg" },
    { id: "g3", src: "/photos/mirror.jpg", tag: "fits del día", rot: "-1.4deg" },
    { id: "g4", src: "/photos/pool.jpg", tag: "summer szn", rot: "2.4deg" },
    { id: "g5", src: "/photos/selfie-beige.jpg", tag: "on camera", rot: "-2deg" },
    { id: "g6", src: "/photos/ross.jpg", tag: "haul time", rot: "1.5deg" },
    { id: "g7", src: "/photos/sushi.jpg", tag: "food content", rot: "-1.8deg" },
    { id: "g8", src: "/photos/noche-espalda.jpg", tag: "city nights", rot: "2.2deg" },
  ],
};

export async function getContent(): Promise<SiteContent> {
  return defaultContent;
}
