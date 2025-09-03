import { NextRequest, NextResponse } from "next/server";
import { store } from "@lib/tasksStore";

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const statusParam = (searchParams.get("status") ?? "all").toLowerCase();
  const q = searchParams.get("q") ?? undefined;

  const status = ["all", "active", "completed"].includes(statusParam)
    ? (statusParam as "all" | "active" | "completed")
    : "all";

  const data = store.list({ status, q });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const task = store.create({ title: body?.title ?? "", description: body?.description });
    return NextResponse.json({ data: task }, { status: 201 });
  } catch (e: any) {
    const code = e?.code;
    if (code === "VALIDATION") {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
