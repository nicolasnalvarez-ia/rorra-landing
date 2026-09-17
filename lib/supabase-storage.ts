// Thin wrapper over the Supabase Storage REST API (plain fetch, no SDK
// dependency) — used for both uploaded photos and the site's JSON config,
// so it needs to work in both the Node runtime (API routes) and the Edge
// runtime (middleware, for the admin session/credentials check).

export const IMAGES_BUCKET = "fotos";
const DATA_BUCKET = "site-data";

function supabaseUrl(): string {
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error("SUPABASE_URL environment variable is not set");
  return url;
}

function serviceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("SUPABASE_SERVICE_ROLE_KEY environment variable is not set");
  return key;
}

function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const key = serviceRoleKey();
  return { Authorization: `Bearer ${key}`, apikey: key, ...extra };
}

export function publicUrl(bucket: string, path: string): string {
  return `${supabaseUrl()}/storage/v1/object/public/${bucket}/${path}`;
}

/** Uploads (or overwrites) a file and returns its public URL. */
export async function uploadImage(path: string, body: Blob, contentType: string): Promise<string> {
  const res = await fetch(`${supabaseUrl()}/storage/v1/object/${IMAGES_BUCKET}/${path}`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": contentType, "x-upsert": "true" }),
    body,
  });
  if (!res.ok) throw new Error(`Supabase upload failed (${res.status}): ${await res.text()}`);
  return publicUrl(IMAGES_BUCKET, path);
}

/**
 * The storage path inside IMAGES_BUCKET for a public URL we produced, or null
 * if the URL doesn't point at this project's image bucket (a bundled
 * /photos/... file, or anything else).
 */
export function imagePathFromUrl(url: string): string | null {
  const prefix = `${supabaseUrl()}/storage/v1/object/public/${IMAGES_BUCKET}/`;
  if (!url.startsWith(prefix)) return null;
  const path = url.slice(prefix.length);
  // Never let a crafted URL escape the bucket prefix we just matched.
  if (!path || path.includes("..")) return null;
  return path;
}

/** True if the object already exists (used to report duplicate uploads). */
export async function imageExists(path: string): Promise<boolean> {
  try {
    const res = await fetch(publicUrl(IMAGES_BUCKET, path), { method: "HEAD", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

/** Removes an uploaded image. Missing objects are treated as already deleted. */
export async function deleteImage(path: string): Promise<void> {
  const res = await fetch(`${supabaseUrl()}/storage/v1/object/${IMAGES_BUCKET}/${path}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`Supabase delete failed (${res.status}): ${await res.text()}`);
  }
}

export async function getJson<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(publicUrl(DATA_BUCKET, path), { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function putJson(path: string, data: unknown): Promise<void> {
  const res = await fetch(`${supabaseUrl()}/storage/v1/object/${DATA_BUCKET}/${path}`, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json", "x-upsert": "true" }),
    body: JSON.stringify(data, null, 2),
  });
  if (!res.ok) throw new Error(`Supabase putJson failed (${res.status}): ${await res.text()}`);
}
