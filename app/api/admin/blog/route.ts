import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { isAdminRequest } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

// GET — admin: list all posts (any status)
export async function GET(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = createServerClient();
  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  return NextResponse.json({ posts: data || [] }, {
    headers: { "Cache-Control": "no-store, must-revalidate" },
  });
}

// POST — admin: create post
export async function POST(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { title, slug, excerpt, content, cover_image_url, images,
            tags, author, status, published_at } = body;

    if (!title || !slug || !content)
      return NextResponse.json({ error: "title, slug, and content are required" }, { status: 400 });

    const db = createServerClient();
    const { data, error } = await db
      .from("blog_posts")
      .insert({
        title, slug, excerpt, content,
        cover_image_url, images: images || [], tags: tags || [],
        author: author || "Da Hausa Initiative",
        status: status || "draft",
        published_at: status === "published" ? (published_at || new Date().toISOString()) : null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505")
        return NextResponse.json({ error: "A slug with that name already exists." }, { status: 409 });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ post: data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT — admin: update post
export async function PUT(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const { id, ...fields } = body;
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    // if switching to published and no published_at yet, set it now
    if (fields.status === "published" && !fields.published_at) {
      fields.published_at = new Date().toISOString();
    }

    const db = createServerClient();
    const { data, error } = await db
      .from("blog_posts")
      .update({ ...fields, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ post: data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE — admin: delete post
export async function DELETE(request: NextRequest) {
  if (!isAdminRequest(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

    const db = createServerClient();
    const { error } = await db.from("blog_posts").delete().eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}