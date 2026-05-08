import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";
import { invalidateObjectsCache } from "@/lib/data";

export async function POST() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  invalidateObjectsCache();
  return NextResponse.json({ ok: true });
}
