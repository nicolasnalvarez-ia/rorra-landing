export type Servicio = {
  num: string;
  titulo: string;
  desc: string;
};

export type GaleriaItem = {
  id: string;
  src: string;
  tag: string;
  /** Additional photos of the same style, shown when the card is expanded. */
  related: string[];
};

export type SiteContent = {
  hero: {
    badgeText: string;
    image1: string;
    image2: string;
  };
  sobreMi: {
    image: string;
    tags: string[];
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
    badgeText: "Content creator & UGC",
    image1: "/photos/zebra-selfie.jpg",
    image2: "/photos/bikini-rosa.jpg",
  },
  sobreMi: {
    image: "/photos/pergola.jpg",
    tags: ["Moda", "Lifestyle", "Beauty", "Food & travel"],
  },
  servicios: [
    {
      num: "01",
      titulo: "Videos UGC",
      desc: "Reviews, unboxings, tutoriales y day-in-the-life con tu producto integrado de forma natural. Formato vertical listo para TikTok, Reels y ads.",
    },
    {
      num: "02",
      titulo: "Fotos de producto & lifestyle",
      desc: "Fotos con luz natural y estética cuidada para tu feed, web o campañas. Tu producto en contexto real, no en un estudio.",
    },
    {
      num: "03",
      titulo: "Colaboraciones & campañas",
      desc: "Contenido publicado en mis redes: 78K en TikTok con una comunidad que confía en lo que recomiendo.",
    },
  ],
  galeria: [
    {
      id: "g1",
      src: "/photos/vestido-noche.jpg",
      tag: "night out",
      related: ["/photos/noche-espalda.jpg", "/photos/city-night.jpg"],
    },
    {
      id: "g2",
      src: "/photos/texas.jpg",
      tag: "travel",
      related: ["/photos/city-night.jpg", "/photos/pergola.jpg"],
    },
    {
      id: "g3",
      src: "/photos/mirror.jpg",
      tag: "fits",
      related: ["/photos/selfie-beige.jpg", "/photos/zebra-selfie.jpg", "/photos/vestido-noche.jpg"],
    },
    {
      id: "g4",
      src: "/photos/pool.jpg",
      tag: "summer",
      related: ["/photos/bikini-rosa.jpg", "/photos/pergola.jpg"],
    },
    {
      id: "g5",
      src: "/photos/selfie-beige.jpg",
      tag: "on camera",
      related: ["/photos/zebra-selfie.jpg", "/photos/mirror.jpg"],
    },
    {
      id: "g6",
      src: "/photos/ross.jpg",
      tag: "haul",
      related: ["/photos/mirror.jpg", "/photos/selfie-beige.jpg"],
    },
    {
      id: "g7",
      src: "/photos/sushi.jpg",
      tag: "food",
      related: ["/photos/city-night.jpg", "/photos/texas.jpg"],
    },
    {
      id: "g8",
      src: "/photos/noche-espalda.jpg",
      tag: "glam",
      related: ["/photos/vestido-noche.jpg", "/photos/zebra-selfie.jpg", "/photos/city-night.jpg"],
    },
  ],
};

export type LibraryItem = {
  id: string;
  url: string;
  label: string;
};
