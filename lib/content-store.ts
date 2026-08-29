import { getJson, putJson } from "./supabase-storage";
import {
  DEFAULT_FOCAL,
  defaultContent,
  PHOTO_LIBRARY,
  type CroppedPhoto,
  type SiteContent,
  type LibraryItem,
} from "./content";

const CONTENT_PATH = "rorra-site-content.json";

export type StoredData = {
  content: SiteContent;
  library: LibraryItem[];
};

function bundledLibrary(): LibraryItem[] {
  return PHOTO_LIBRARY.map((file) => ({
    id: file,
    url: `/photos/${file}`,
    label: file.replace(/\.[a-z]+$/i, "").replace(/-/g, " "),
  }));
}

function defaultData(): StoredData {
  return { content: defaultContent, library: bundledLibrary() };
}

/**
 * Upgrades a stored photo reference to the current shape. Older saves stored
 * a plain URL string instead of { url, focal } — normalizing on read means a
 * schema change never requires wiping (and losing) whatever admins already
 * uploaded or configured.
 */
function normalizeCroppedPhoto(value: unknown, fallback: CroppedPhoto): CroppedPhoto {
  if (typeof value === "string") return { url: value, focal: DEFAULT_FOCAL };
  if (value && typeof value === "object" && "url" in value) {
    const v = value as Partial<CroppedPhoto>;
    const focal = v.focal;
    return {
      url: v.url || fallback.url,
      focal: focal ? { x: focal.x, y: focal.y, zoom: focal.zoom ?? 1 } : DEFAULT_FOCAL,
    };
  }
  return fallback;
}

function normalizeContent(stored: Partial<SiteContent> | undefined, fallback: SiteContent): SiteContent {
  if (!stored) return fallback;
  return {
    ...fallback,
    ...stored,
    hero: {
      ...fallback.hero,
      ...stored.hero,
      image1: normalizeCroppedPhoto(stored.hero?.image1, fallback.hero.image1),
      image2: normalizeCroppedPhoto(stored.hero?.image2, fallback.hero.image2),
    },
    sobreMi: {
      ...fallback.sobreMi,
      ...stored.sobreMi,
      image: normalizeCroppedPhoto(stored.sobreMi?.image, fallback.sobreMi.image),
    },
    galeria: (stored.galeria?.length ? stored.galeria : fallback.galeria).map((g) => ({
      ...g,
      photos: (g.photos ?? []).map((p) => normalizeCroppedPhoto(p, { url: "", focal: DEFAULT_FOCAL })),
    })),
  };
}

export async function loadStoredData(): Promise<StoredData> {
  const fallback = defaultData();
  const data = await getJson<Partial<StoredData>>(CONTENT_PATH);
  if (!data) return fallback;
  return {
    content: normalizeContent(data.content, fallback.content),
    library: data.library?.length ? data.library : fallback.library,
  };
}

export async function saveStoredData(data: StoredData): Promise<void> {
  await putJson(CONTENT_PATH, data);
}
