import type { CroppedPhoto, SiteContent } from "./content";

export type SlotDef = {
  key: string;
  section: string;
  label: string;
  get: (content: SiteContent) => CroppedPhoto;
  set: (content: SiteContent, photo: CroppedPhoto) => SiteContent;
};

/** Single-image slots (hero, sobre mí). Portfolio categories have their own CRUD UI. */
export function buildSlots(): SlotDef[] {
  return [
    {
      key: "hero.image1",
      section: "Hero",
      label: "Foto 1 del hero (izquierda)",
      get: (c) => c.hero.image1,
      set: (c, photo) => ({ ...c, hero: { ...c.hero, image1: photo } }),
    },
    {
      key: "hero.image2",
      section: "Hero",
      label: "Foto 2 del hero (derecha)",
      get: (c) => c.hero.image2,
      set: (c, photo) => ({ ...c, hero: { ...c.hero, image2: photo } }),
    },
    {
      key: "sobreMi.image",
      section: "Sobre mí",
      label: "Foto principal de “Sobre mí”",
      get: (c) => c.sobreMi.image,
      set: (c, photo) => ({ ...c, sobreMi: { ...c.sobreMi, image: photo } }),
    },
  ];
}
