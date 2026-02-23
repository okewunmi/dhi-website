import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { isAdminRequest } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db = createServerClient();
  const { count } = await db
    .from("subscribers")
    .select("id", { count: "exact", head: true })
    .eq("status", "active");
  return NextResponse.json({ count: count || 0 });
}
