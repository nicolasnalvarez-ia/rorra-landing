import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { defaultContent } from "@/lib/content";
import { loadStoredData, saveStoredData } from "@/lib/content-store";
import { validateStoredData } from "@/lib/validate";

export async function GET() {
  const data = await loadStoredData();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validateStoredData(body, defaultContent);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  await saveStoredData(result.data);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
