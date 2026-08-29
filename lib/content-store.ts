import { list, put } from "@vercel/blob";
import { defaultContent, PHOTO_LIBRARY, type LibraryItem, type SiteContent } from "./content";

const CONTENT_PATHNAME = "rorra-site-content.json";

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

async function findContentBlobUrl(): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const { blobs } = await list({ prefix: CONTENT_PATHNAME, limit: 1 });
  return blobs[0]?.url ?? null;
}

export async function loadStoredData(): Promise<StoredData> {
  const fallback = defaultData();
  try {
    const url = await findContentBlobUrl();
    if (!url) return fallback;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return fallback;
    const data = (await res.json()) as Partial<StoredData>;
    return {
      content: { ...fallback.content, ...data.content },
      library: data.library?.length ? data.library : fallback.library,
    };
  } catch {
    return fallback;
  }
}

export async function saveStoredData(data: StoredData): Promise<void> {
  await put(CONTENT_PATHNAME, JSON.stringify(data, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}
