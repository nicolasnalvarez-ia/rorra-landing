export type Servicio = {
  num: string;
  titulo: string;
  desc: string;
};

/** Crop focal point as percentages (0-100) from the top-left, used with CSS object-position. */
export type FocalPoint = { x: number; y: number };

export const DEFAULT_FOCAL: FocalPoint = { x: 50, y: 50 };

export function focalCss(focal: FocalPoint): string {
  return `${focal.x}% ${focal.y}%`;
}

/**
 * A photo placed somewhere it gets cropped (object-fit: cover). Every cropped
 * spot on the site uses the same 3:4 aspect ratio, and the focal point is
 * chosen per placement (not per photo) since the same photo can be used in
 * different spots.
 */
export type CroppedPhoto = { url: string; focal: FocalPoint };

export const CROP_ASPECT = "3 / 4";

export function croppedPhoto(url: string, focal: FocalPoint = DEFAULT_FOCAL): CroppedPhoto {
  return { url, focal };
}

export type GaleriaItem = {
  id: string;
  tag: string;
  /** All photos in this category. photos[0] is the cover shown on the grid. */
  photos: CroppedPhoto[];
};

export type SiteContent = {
  hero: {
    badgeText: string;
    image1: CroppedPhoto;
    image2: CroppedPhoto;
  };
  sobreMi: {
    image: CroppedPhoto;
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
    image1: croppedPhoto("/photos/zebra-selfie.jpg"),
    image2: croppedPhoto("/photos/bikini-rosa.jpg"),
  },
  sobreMi: {
    image: croppedPhoto("/photos/pergola.jpg"),
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
      photos: [
        croppedPhoto("/photos/vestido-noche.jpg"),
        croppedPhoto("/photos/noche-espalda.jpg"),
        croppedPhoto("/photos/city-night.jpg"),
      ],
    },
    {
      id: "g2",
      tag: "travel",
      photos: [
        croppedPhoto("/photos/texas.jpg"),
        croppedPhoto("/photos/city-night.jpg"),
        croppedPhoto("/photos/pergola.jpg"),
      ],
    },
    {
      id: "g3",
      tag: "fits",
      photos: [
        croppedPhoto("/photos/mirror.jpg"),
        croppedPhoto("/photos/camiseta-argentina.jpg"),
        croppedPhoto("/photos/zebra-selfie.jpg"),
        croppedPhoto("/photos/vestido-noche.jpg"),
      ],
    },
    {
      id: "g4",
      tag: "summer",
      photos: [
        croppedPhoto("/photos/pool.jpg"),
        croppedPhoto("/photos/bikini-rosa.jpg"),
        croppedPhoto("/photos/pergola.jpg"),
      ],
    },
    {
      id: "g5",
      tag: "on camera",
      photos: [
        croppedPhoto("/photos/camiseta-argentina.jpg"),
        croppedPhoto("/photos/zebra-selfie.jpg"),
        croppedPhoto("/photos/mirror.jpg"),
      ],
    },
    {
      id: "g6",
      tag: "haul",
      photos: [
        croppedPhoto("/photos/ross.jpg"),
        croppedPhoto("/photos/mirror.jpg"),
        croppedPhoto("/photos/camiseta-argentina.jpg"),
      ],
    },
    {
      id: "g7",
      tag: "food",
      photos: [
        croppedPhoto("/photos/sushi.jpg"),
        croppedPhoto("/photos/city-night.jpg"),
        croppedPhoto("/photos/texas.jpg"),
      ],
    },
    {
      id: "g8",
      tag: "glam",
      photos: [
        croppedPhoto("/photos/noche-espalda.jpg"),
        croppedPhoto("/photos/vestido-noche.jpg"),
        croppedPhoto("/photos/zebra-selfie.jpg"),
        croppedPhoto("/photos/city-night.jpg"),
      ],
    },
  ],
};

export type LibraryItem = {
  id: string;
  url: string;
  label: string;
};
