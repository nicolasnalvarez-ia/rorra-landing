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
      key: "hero.image1",
      section: "Hero",
      label: "Foto 1 del hero (izquierda)",
      get: (c) => c.hero.image1,
      set: (c, url) => ({ ...c, hero: { ...c.hero, image1: url } }),
    },
    {
      key: "hero.image2",
      section: "Hero",
      label: "Foto 2 del hero (derecha)",
      get: (c) => c.hero.image2,
      set: (c, url) => ({ ...c, hero: { ...c.hero, image2: url } }),
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
