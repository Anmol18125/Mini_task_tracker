import { NextRequest, NextResponse } from "next/server";
import { store } from "@lib/tasksStore";

type Ctx = { params: { id: string } };

export function GET(_req: NextRequest, { params }: Ctx) {
  const t = store.get(params.id);
  if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ data: t });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const body = await req.json().catch(() => ({}));
    const updated = store.update(params.id, body ?? {});
    return NextResponse.json({ data: updated });
  } catch (e: any) {
    const code = e?.code;
    if (code === "NOT_FOUND") return NextResponse.json({ error: e.message }, { status: 404 });
    if (code === "VALIDATION") return NextResponse.json({ error: e.message }, { status: 400 });
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    store.delete(params.id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    if (e?.code === "NOT_FOUND") return NextResponse.json({ error: e.message }, { status: 404 });
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
