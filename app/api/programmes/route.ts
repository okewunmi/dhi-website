import { NextResponse } from "next/server";
import { getProgrammes } from "@/lib/supabase-server";

export async function GET() {
  const programmes = await getProgrammes();
  return NextResponse.json({ programmes });
}