// Uses the Web Crypto API (globalThis.crypto) so this works both in the
// Node.js runtime (API routes) and the Edge runtime (middleware).
import { list, put } from "@vercel/blob";

export const ADMIN_COOKIE = "rorra_admin_session";
const CREDENTIALS_PATHNAME = "rorra-admin-credentials.json";

const encoder = new TextEncoder();

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function sha256Hex(message: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(message));
  return bufToHex(digest);
}

async function hmacHex(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  return bufToHex(signature);
}

async function envPasswordHash(): Promise<string> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error("ADMIN_PASSWORD environment variable is not set");
  }
  return sha256Hex(pw);
}

async function findCredentialsBlobUrl(): Promise<string | null> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const { blobs } = await list({ prefix: CREDENTIALS_PATHNAME, limit: 1 });
  return blobs[0]?.url ?? null;
}

/**
 * The password hash currently in effect: whatever was set via the admin
 * "cambiar contraseña" flow, or (until changed at least once) a hash of the
 * ADMIN_PASSWORD env var. Storing this in Blob instead of only the env var
 * is what lets the password change without a redeploy.
 */
async function getCurrentPasswordHash(): Promise<string> {
  try {
    const url = await findCredentialsBlobUrl();
    if (url) {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { passwordHash?: string };
        if (data.passwordHash) return data.passwordHash;
      }
    }
  } catch {
    // fall through to the env var
  }
  return envPasswordHash();
}

export async function setPassword(newPassword: string): Promise<void> {
  const passwordHash = await sha256Hex(newPassword);
  await put(CREDENTIALS_PATHNAME, JSON.stringify({ passwordHash }), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

/** Derives a session token from the current password hash so the cookie never stores the password itself, and changing the password invalidates old sessions. */
export async function getSessionToken(): Promise<string> {
  return hmacHex(await getCurrentPasswordHash(), "rorra-admin-session");
}

export async function isValidPassword(candidate: string): Promise<boolean> {
  try {
    const [expectedHash, candidateHash] = await Promise.all([getCurrentPasswordHash(), sha256Hex(candidate)]);
    return timingSafeEqualStr(candidateHash, expectedHash);
  } catch {
    return false;
  }
}

export async function isValidSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    const expected = await getSessionToken();
    return timingSafeEqualStr(token, expected);
  } catch {
    return false;
  }
}
