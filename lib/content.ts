export type Servicio = {
  num: string;
  titulo: string;
  desc: string;
};

export type GaleriaItem = {
  id: string;
  tag: string;
  /** All photos in this category. photos[0] is the cover shown on the grid. */
  photos: string[];
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
  "camiseta-argentina.jpg",
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
      tag: "night out",
      photos: ["/photos/vestido-noche.jpg", "/photos/noche-espalda.jpg", "/photos/city-night.jpg"],
    },
    {
      id: "g2",
      tag: "travel",
      photos: ["/photos/texas.jpg", "/photos/city-night.jpg", "/photos/pergola.jpg"],
    },
    {
      id: "g3",
      tag: "fits",
      photos: [
        "/photos/mirror.jpg",
        "/photos/camiseta-argentina.jpg",
        "/photos/zebra-selfie.jpg",
        "/photos/vestido-noche.jpg",
      ],
    },
    {
      id: "g4",
      tag: "summer",
      photos: ["/photos/pool.jpg", "/photos/bikini-rosa.jpg", "/photos/pergola.jpg"],
    },
    {
      id: "g5",
      tag: "on camera",
      photos: ["/photos/camiseta-argentina.jpg", "/photos/zebra-selfie.jpg", "/photos/mirror.jpg"],
    },
    {
      id: "g6",
      tag: "haul",
      photos: ["/photos/ross.jpg", "/photos/mirror.jpg", "/photos/camiseta-argentina.jpg"],
    },
    {
      id: "g7",
      tag: "food",
      photos: ["/photos/sushi.jpg", "/photos/city-night.jpg", "/photos/texas.jpg"],
    },
    {
      id: "g8",
      tag: "glam",
      photos: [
        "/photos/noche-espalda.jpg",
        "/photos/vestido-noche.jpg",
        "/photos/zebra-selfie.jpg",
        "/photos/city-night.jpg",
      ],
    },
  ],
};

/** Crop focal point as percentages (0-100) from the top-left, used with CSS object-position. */
export type FocalPoint = { x: number; y: number };

export const DEFAULT_FOCAL: FocalPoint = { x: 50, y: 50 };

export type LibraryItem = {
  id: string;
  url: string;
  label: string;
  /** Where to keep the crop centered when this photo is shown in a cropped (object-fit: cover) spot. */
  focal?: FocalPoint;
};

export function getFocal(library: LibraryItem[], url: string): FocalPoint {
  return library.find((item) => item.url === url)?.focal ?? DEFAULT_FOCAL;
}
