import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// ─── GET — admin: list all messages ──────────────────────────
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerClient();
  const { data, error } = await db
    .from("contact_submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  return NextResponse.json({ messages: data || [] }, {
    headers: { "Cache-Control": "no-store, must-revalidate" },
  });
}

// ─── PATCH — admin: mark read/unread ──────────────────────────
export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, is_read } = await request.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const db = createServerClient();
    const { data, error } = await db
      .from("contact_submissions")
      .update({ is_read })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ message: data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── DELETE — admin: delete message ──────────────────────────
export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const db = createServerClient();
    const { error } = await db.from("contact_submissions").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}