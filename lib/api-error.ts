import { NextResponse } from "next/server";
import { StorageError } from "./supabase-storage";

/**
 * Admin endpoints talk to Supabase, and most of what can go wrong there is a
 * setup problem (missing env var, bucket never created, wrong key). Letting
 * those bubble up as an unhandled 500 tells the person nothing; this returns
 * the reason so the panel can show it.
 */
export function errorResponse(err: unknown, fallback: string): NextResponse {
  if (err instanceof StorageError) {
    return NextResponse.json({ error: err.message }, { status: 502 });
  }
  console.error(fallback, err);
  return NextResponse.json({ error: fallback }, { status: 500 });
}
