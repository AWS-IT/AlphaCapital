import { NextResponse } from "next/server";
import { ADMIN_COOKIE, ADMIN_TTL_SECONDS, checkCredentials, makeToken } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const login = String(body.login ?? "");
  const password = String(body.password ?? "");

  if (!checkCredentials(login, password)) {
    return NextResponse.json(
      { ok: false, error: "Неверный логин или пароль" },
      { status: 401 },
    );
  }

  const token = makeToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_TTL_SECONDS,
  });
  return res;
}
