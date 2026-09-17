// Thin wrapper over the Supabase Storage REST API (plain fetch, no SDK
// dependency) — used for both uploaded photos and the site's JSON config,
// so it needs to work in both the Node runtime (API routes) and the Edge
// runtime (middleware, for the admin session/credentials check).

export const IMAGES_BUCKET = "fotos";
const DATA_BUCKET = "site-data";

/**
 * A storage problem the admin can actually act on: a missing env var, a
 * bucket that was never created, a wrong key. These carry a Spanish message
 * that the panel shows verbatim, instead of surfacing as an opaque 500.
 */
export class StorageError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "StorageError";
    this.status = status;
  }
}

export function isStorageConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export const MISSING_CONFIG_MESSAGE =
  "Supabase no está configurado: faltan las variables SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY. " +
  "Mientras tanto la landing muestra las fotos que vienen con el sitio y el panel no puede guardar.";

function supabaseUrl(): string {
  const url = process.env.SUPABASE_URL;
  if (!url) throw new StorageError(MISSING_CONFIG_MESSAGE);
  // A trailing slash would produce "…co//storage/v1/…", which Supabase rejects.
  return url.replace(/\/+$/, "");
}

function serviceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new StorageError(MISSING_CONFIG_MESSAGE);
  return key;
}

/** Turns a failed Supabase response into a message that names the fix. */
function storageFailure(action: string, bucket: string, status: number, body: string): StorageError {
  if (status === 401 || status === 403) {
    return new StorageError(
      `Supabase rechazó ${action} en el bucket "${bucket}" (${status}). ` +
        "Revisá que SUPABASE_SERVICE_ROLE_KEY sea la service role key del proyecto, no la anon key.",
      status
    );
  }
  if (status === 404 || /bucket not found/i.test(body)) {
    return new StorageError(
      `No existe el bucket "${bucket}" en Supabase. Crealo como público desde Storage en el panel de Supabase.`,
      status
    );
  }
  return new StorageError(`Supabase falló al ${action} en el bucket "${bucket}" (${status}).`, status);
}

export type StorageStatus = { ok: true } | { ok: false; message: string };

/**
 * Checks that the panel can actually read and write before it lets someone
 * edit. Without this the panel loads happily on the default content and only
 * fails on save, which looks like a bug in the app rather than a missing
 * bucket or key.
 */
export async function checkStorage(): Promise<StorageStatus> {
  if (!isStorageConfigured()) return { ok: false, message: MISSING_CONFIG_MESSAGE };

  for (const bucket of [IMAGES_BUCKET, DATA_BUCKET]) {
    try {
      const res = await fetch(`${supabaseUrl()}/storage/v1/bucket/${bucket}`, {
        headers: authHeaders(),
        cache: "no-store",
      });
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        return { ok: false, message: storageFailure("leer", bucket, res.status, body).message };
      }
    } catch (err) {
      if (err instanceof StorageError) return { ok: false, message: err.message };
      return {
        ok: false,
        message:
          "No se pudo conectar con Supabase. Revisá que SUPABASE_URL apunte al proyecto correcto " +
          "(tiene que ser la URL del proyecto, por ejemplo https://xxxx.supabase.co).",
      };
    }
  }

  return { ok: true };
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
  if (!res.ok) throw storageFailure("subir la foto", IMAGES_BUCKET, res.status, await res.text().catch(() => ""));
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
    throw storageFailure("borrar la foto", IMAGES_BUCKET, res.status, await res.text().catch(() => ""));
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
  if (!res.ok) throw storageFailure("guardar los cambios", DATA_BUCKET, res.status, await res.text().catch(() => ""));
}
