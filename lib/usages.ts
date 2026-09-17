import type { SiteContent } from "./content";

export type Usage = {
  /** Hero and "sobre mí" are single-image slots: they can be replaced, never emptied. */
  kind: "slot" | "category";
  label: string;
};

/** Everywhere a photo URL is currently shown on the landing. */
export function findUsages(content: SiteContent, url: string): Usage[] {
  const usages: Usage[] = [];
  if (content.hero.image1.url === url) usages.push({ kind: "slot", label: "Hero, foto grande" });
  if (content.hero.image2.url === url) usages.push({ kind: "slot", label: "Hero, foto chica" });
  if (content.sobreMi.image.url === url) usages.push({ kind: "slot", label: "Sobre mí" });
  for (const cat of content.galeria) {
    if (cat.photos.some((p) => p.url === url)) usages.push({ kind: "category", label: `Portfolio · ${cat.tag}` });
  }
  return usages;
}

/** Removes a photo from every portfolio category (slots are never emptied this way). */
export function removePhotoFromCategories(content: SiteContent, url: string): SiteContent {
  return {
    ...content,
    galeria: content.galeria.map((cat) => ({ ...cat, photos: cat.photos.filter((p) => p.url !== url) })),
  };
}
