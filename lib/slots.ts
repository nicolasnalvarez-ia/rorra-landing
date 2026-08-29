import type { SiteContent } from "./content";

export type SlotDef = {
  key: string;
  section: string;
  label: string;
  get: (content: SiteContent) => string;
  set: (content: SiteContent, url: string) => SiteContent;
};

export function buildSlots(content: SiteContent): SlotDef[] {
  const slots: SlotDef[] = [
    {
      key: "hero.heroImage",
      section: "Hero",
      label: "Foto circular junto a “real”",
      get: (c) => c.hero.heroImage,
      set: (c, url) => ({ ...c, hero: { ...c.hero, heroImage: url } }),
    },
    {
      key: "hero.polaroid1",
      section: "Hero",
      label: "Polaroid 1 (arriba a la derecha)",
      get: (c) => c.hero.polaroid1.src,
      set: (c, url) => ({ ...c, hero: { ...c.hero, polaroid1: { ...c.hero.polaroid1, src: url } } }),
    },
    {
      key: "hero.polaroid2",
      section: "Hero",
      label: "Polaroid 2 (abajo)",
      get: (c) => c.hero.polaroid2.src,
      set: (c, url) => ({ ...c, hero: { ...c.hero, polaroid2: { ...c.hero.polaroid2, src: url } } }),
    },
    {
      key: "sobreMi.image",
      section: "Sobre mí",
      label: "Foto principal de “Sobre mí”",
      get: (c) => c.sobreMi.image,
      set: (c, url) => ({ ...c, sobreMi: { ...c.sobreMi, image: url } }),
    },
  ];

  content.galeria.forEach((item, i) => {
    slots.push({
      key: `galeria.${item.id}`,
      section: "Portfolio",
      label: `Foto ${i + 1} — "${item.tag}"`,
      get: (c) => c.galeria.find((g) => g.id === item.id)?.src ?? "",
      set: (c, url) => ({
        ...c,
        galeria: c.galeria.map((g) => (g.id === item.id ? { ...g, src: url } : g)),
      }),
    });
  });

  return slots;
}
