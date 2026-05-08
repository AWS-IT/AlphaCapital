import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";
import { readOverrides, writeOverrides } from "@/lib/data";
import type { AdminOverrides } from "@/lib/types";

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const data = await readOverrides();
  return NextResponse.json({ ok: true, data });
}

export async function PUT(request: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as Partial<AdminOverrides> | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Bad payload" }, { status: 400 });
  }
  const cur = await readOverrides();
  const next: AdminOverrides = {
    hotIds: Array.isArray(body.hotIds) ? body.hotIds.map(Number) : cur.hotIds,
    hotOrder: Array.isArray(body.hotOrder) ? body.hotOrder.map(Number) : cur.hotOrder,
    customTexts: body.customTexts ?? cur.customTexts,
    updatedAt: new Date().toISOString(),
  };
  await writeOverrides(next);
  return NextResponse.json({ ok: true, data: next });
}
