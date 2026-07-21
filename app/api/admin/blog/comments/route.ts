import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const schema = z.object({
  post_id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  comment: z.string().min(2, "Comment is too short").max(2000),
  parent_id: z.string().uuid().optional().nullable(),
});

// GET — public: list approved comments for a post
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const post_id = searchParams.get("post_id");
  if (!post_id) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

  const db = createServerClient();
  const { data, error } = await db
    .from("blog_comments")
    .select("id, post_id, name, comment, parent_id, created_at")
    .eq("post_id", post_id)
    .eq("status", "approved")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  return NextResponse.json({ comments: data || [] }, {
    headers: { "Cache-Control": "no-store, must-revalidate" },
  });
}

// POST — public: submit a comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const { post_id, name, email, comment, parent_id } = parsed.data;
    const db = createServerClient();
    const { data, error } = await db
      .from("blog_comments")
      .insert({
        post_id, name, email: email || null, comment,
        parent_id: parent_id || null, status: "approved",
      })
      .select("id, post_id, name, comment, parent_id, created_at")
      .single();

    if (error) return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
    return NextResponse.json({ comment: data });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}