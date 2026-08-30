import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { loadStoredData, saveStoredData, type StoredData } from "@/lib/content-store";

export async function GET() {
  const data = await loadStoredData();
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = (await request.json().catch(() => null)) as StoredData | null;
  if (!body?.content || !body?.library) {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  await saveStoredData(body);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
