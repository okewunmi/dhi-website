import { NextRequest, NextResponse } from "next/server";
import { createServerClient, getAllProgrammes } from "@/lib/supabase-server";

export async function GET() {
  const programmes = await getAllProgrammes();
  return NextResponse.json({ programmes });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = createServerClient();
  const { data, error } = await db.from("programmes").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ programme: data });
}