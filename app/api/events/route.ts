import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { isAdminRequest } from "@/lib/auth";

// ─── GET — public: list all events ───────────────────────────
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");

  const db = createServerClient();
  let query = db
    .from("events")
    .select("*")
    .neq("status", "cancelled")
    .order("date", { ascending: true });

  if (type && type !== "all") query = query.eq("type", type);
  if (status && status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  return NextResponse.json({ events: data || [] });
}

// ─── POST — admin: create event ──────────────────────────────
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, slug, type, status, date, time, location, location_url,
            description, image_url, registration_url, registration_open, recap } = body;

    if (!title || !slug || !type || !date)
      return NextResponse.json({ error: "title, slug, type, and date are required" }, { status: 400 });

    const db = createServerClient();
    const { data, error } = await db
      .from("events")
      .insert({ title, slug, type, status: status || "upcoming", date, time, location,
                location_url, description, image_url, registration_url,
                registration_open: registration_open ?? true, recap })
      .select()
      .single();

    if (error) {
      if (error.code === "23505")
        return NextResponse.json({ error: "A slug with that name already exists. Please use a unique slug." }, { status: 409 });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ event: data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── PUT — admin: update event ───────────────────────────────
export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const db = createServerClient();
    const { data, error } = await db
      .from("events")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ event: data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ─── DELETE — admin: delete event ────────────────────────────
export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const db = createServerClient();
    const { error } = await db.from("events").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}