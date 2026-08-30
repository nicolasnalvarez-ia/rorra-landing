import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/supabase-storage";

const MAX_SIZE = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(request: Request) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "El almacenamiento de imágenes (Supabase) no está configurado." },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Formato no soportado. Usá JPG, PNG, WEBP o GIF." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "La imagen supera el máximo de 8MB." }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const random = Math.random().toString(36).slice(2, 8);
  const url = await uploadImage(`uploads/${Date.now()}-${random}-${safeName}`, file, file.type);

  return NextResponse.json({ url, label: file.name.replace(/\.[a-z]+$/i, "") });
}
