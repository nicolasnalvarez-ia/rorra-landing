// Uses the Web Crypto API (globalThis.crypto) so this works both in the
// Node.js runtime (API routes) and the Edge runtime (middleware).

export const ADMIN_COOKIE = "rorra_admin_session";

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

function getAdminPassword(): string {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) {
    throw new Error("ADMIN_PASSWORD environment variable is not set");
  }
  return pw;
}

/** Derives a session token from the admin password so the cookie never stores the password itself. */
export async function getSessionToken(): Promise<string> {
  return hmacHex(getAdminPassword(), "rorra-admin-session");
}

export function isValidPassword(candidate: string): boolean {
  try {
    return timingSafeEqualStr(candidate, getAdminPassword());
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
