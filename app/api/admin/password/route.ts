import { NextResponse } from "next/server";
import { ADMIN_COOKIE, getSessionToken, isValidPassword, setPassword } from "@/lib/auth";

export async function PUT(request: Request) {
  const body = await request.json().catch(() => null);
  const currentPassword = typeof body?.currentPassword === "string" ? body.currentPassword : "";
  const newPassword = typeof body?.newPassword === "string" ? body.newPassword : "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Completá los dos campos." }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: "La contraseña nueva tiene que tener al menos 6 caracteres." },
      { status: 400 }
    );
  }
  if (!(await isValidPassword(currentPassword))) {
    return NextResponse.json({ error: "La contraseña actual no es correcta." }, { status: 401 });
  }

  await setPassword(newPassword);

  // Re-issue the session cookie: the old one was derived from the old
  // password's hash and would otherwise stop working immediately.
  const token = await getSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
