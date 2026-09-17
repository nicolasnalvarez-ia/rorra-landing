import { MAX_ZOOM, PHOTO_LIBRARY, type CroppedPhoto, type SiteContent, type LibraryItem } from "./content";
import type { StoredData } from "./content-store";
import { imagePathFromUrl } from "./supabase-storage";

/**
 * Server-side validation for anything the admin panel writes back. The panel
 * is the only writer today, but this is the last line before the JSON that
 * drives the public landing, so a malformed (or hostile) payload must never
 * reach storage: a bad URL here would end up rendered in an <img> for every
 * visitor.
 */

export type ValidationResult = { ok: true; data: StoredData } | { ok: false; error: string };

const BUNDLED_URLS = new Set(PHOTO_LIBRARY.map((file) => `/photos/${file}`));

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Only our own bundled files and our own Supabase image bucket are renderable. */
function isAllowedUrl(url: unknown): url is string {
  if (typeof url !== "string" || url.length === 0) return false;
  if (BUNDLED_URLS.has(url)) return true;
  try {
    return imagePathFromUrl(url) !== null;
  } catch {
    // Supabase isn't configured; only bundled photos can be valid.
    return false;
  }
}

function parseFocal(value: unknown): CroppedPhoto["focal"] | null {
  if (!isRecord(value)) return null;
  const { x, y, zoom } = value;
  if (typeof x !== "number" || !Number.isFinite(x) || x < 0 || x > 100) return null;
  if (typeof y !== "number" || !Number.isFinite(y) || y < 0 || y > 100) return null;
  if (typeof zoom !== "number" || !Number.isFinite(zoom) || zoom < 1 || zoom > MAX_ZOOM) return null;
  return { x, y, zoom };
}

function parsePhoto(value: unknown, allowedUrls: Set<string>, where: string): CroppedPhoto | string {
  if (!isRecord(value)) return `${where}: la foto no tiene el formato esperado.`;
  if (!isAllowedUrl(value.url)) return `${where}: la URL de la foto no es válida.`;
  if (!allowedUrls.has(value.url)) return `${where}: la foto no está en la biblioteca.`;
  const focal = parseFocal(value.focal);
  if (!focal) return `${where}: el encuadre de la foto no es válido.`;
  return { url: value.url, focal };
}

function parseLibrary(value: unknown): LibraryItem[] | string {
  if (!Array.isArray(value)) return "La biblioteca no es una lista.";
  if (value.length === 0) return "La biblioteca no puede quedar vacía.";
  if (value.length > 500) return "La biblioteca supera el máximo de 500 fotos.";

  const items: LibraryItem[] = [];
  const seenUrls = new Set<string>();
  const seenIds = new Set<string>();

  for (const raw of value) {
    if (!isRecord(raw)) return "Biblioteca: hay una entrada con formato inválido.";
    if (!isAllowedUrl(raw.url)) return "Biblioteca: hay una foto con una URL no permitida.";
    if (typeof raw.id !== "string" || raw.id.length === 0) return "Biblioteca: hay una foto sin identificador.";
    if (typeof raw.label !== "string") return "Biblioteca: hay una foto sin nombre.";
    if (seenUrls.has(raw.url)) return "Biblioteca: hay fotos duplicadas.";
    if (seenIds.has(raw.id)) return "Biblioteca: hay identificadores repetidos.";
    seenUrls.add(raw.url);
    seenIds.add(raw.id);
    items.push({
      id: raw.id,
      url: raw.url,
      label: raw.label.slice(0, 200),
      builtin: BUNDLED_URLS.has(raw.url) || undefined,
    });
  }

  return items;
}

function parseContent(value: unknown, allowedUrls: Set<string>, fallback: SiteContent): SiteContent | string {
  if (!isRecord(value)) return "El contenido no tiene el formato esperado.";

  const hero = isRecord(value.hero) ? value.hero : null;
  const sobreMi = isRecord(value.sobreMi) ? value.sobreMi : null;
  if (!hero) return "Falta la sección Hero.";
  if (!sobreMi) return "Falta la sección Sobre mí.";

  const image1 = parsePhoto(hero.image1, allowedUrls, "Hero, foto 1");
  if (typeof image1 === "string") return image1;
  const image2 = parsePhoto(hero.image2, allowedUrls, "Hero, foto 2");
  if (typeof image2 === "string") return image2;
  const sobreMiImage = parsePhoto(sobreMi.image, allowedUrls, "Sobre mí");
  if (typeof sobreMiImage === "string") return sobreMiImage;

  if (!Array.isArray(value.galeria)) return "El portfolio no es una lista.";
  if (value.galeria.length > 60) return "El portfolio supera el máximo de 60 categorías.";

  const galeria: SiteContent["galeria"] = [];
  const seenIds = new Set<string>();

  for (const raw of value.galeria) {
    if (!isRecord(raw)) return "Portfolio: hay una categoría con formato inválido.";
    if (typeof raw.id !== "string" || raw.id.length === 0) return "Portfolio: hay una categoría sin identificador.";
    if (seenIds.has(raw.id)) return "Portfolio: hay identificadores de categoría repetidos.";
    seenIds.add(raw.id);

    const tag = typeof raw.tag === "string" ? raw.tag.trim() : "";
    if (!tag) return "Portfolio: hay una categoría sin nombre.";
    if (tag.length > 60) return `Portfolio: el nombre "${tag.slice(0, 20)}…" es demasiado largo.`;

    if (!Array.isArray(raw.photos)) return `Portfolio · ${tag}: las fotos no son una lista.`;
    if (raw.photos.length > 60) return `Portfolio · ${tag}: supera el máximo de 60 fotos.`;

    const photos: CroppedPhoto[] = [];
    const seenPhotoUrls = new Set<string>();
    for (const rawPhoto of raw.photos) {
      const photo = parsePhoto(rawPhoto, allowedUrls, `Portfolio · ${tag}`);
      if (typeof photo === "string") return photo;
      if (seenPhotoUrls.has(photo.url)) return `Portfolio · ${tag}: la misma foto está repetida en la categoría.`;
      seenPhotoUrls.add(photo.url);
      photos.push(photo);
    }

    galeria.push({ id: raw.id, tag, photos });
  }

  // Text lives in code for now; keep whatever the current build ships with
  // rather than letting the payload set it.
  return {
    hero: { badgeText: fallback.hero.badgeText, image1, image2 },
    sobreMi: { tags: fallback.sobreMi.tags, image: sobreMiImage },
    servicios: fallback.servicios,
    galeria,
  };
}

export function validateStoredData(payload: unknown, fallback: SiteContent): ValidationResult {
  if (!isRecord(payload)) return { ok: false, error: "Payload inválido." };

  const library = parseLibrary(payload.library);
  if (typeof library === "string") return { ok: false, error: library };

  const allowedUrls = new Set(library.map((item) => item.url));
  const content = parseContent(payload.content, allowedUrls, fallback);
  if (typeof content === "string") return { ok: false, error: content };

  return { ok: true, data: { content, library } };
}
