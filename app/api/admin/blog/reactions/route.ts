import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const schema = z.object({
  post_id: z.string().uuid(),
  visitor_id: z.string().min(10),
  reaction: z.enum(["like", "dislike"]),
});

// GET — public: totals + this visitor's current reaction
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const post_id = searchParams.get("post_id");
  const visitor_id = searchParams.get("visitor_id");
  if (!post_id) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

  const db = createServerClient();
  const [{ count: likes }, { count: dislikes }, mine] = await Promise.all([
    db.from("blog_reactions").select("id", { count: "exact", head: true }).eq("post_id", post_id).eq("reaction", "like"),
    db.from("blog_reactions").select("id", { count: "exact", head: true }).eq("post_id", post_id).eq("reaction", "dislike"),
    visitor_id
      ? db.from("blog_reactions").select("reaction").eq("post_id", post_id).eq("visitor_id", visitor_id).single()
      : Promise.resolve({ data: null }),
  ]);

  return NextResponse.json({
    likes: likes || 0,
    dislikes: dislikes || 0,
    myReaction: (mine as { data: { reaction: string } | null })?.data?.reaction || null,
  }, { headers: { "Cache-Control": "no-store, must-revalidate" } });
}

// POST — public: set/toggle/change/remove reaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const { post_id, visitor_id, reaction } = parsed.data;
    const db = createServerClient();

    // If same reaction already exists, remove it (toggle off)
    const { data: existing } = await db
      .from("blog_reactions")
      .select("id, reaction")
      .eq("post_id", post_id)
      .eq("visitor_id", visitor_id)
      .single();

    if (existing && existing.reaction === reaction) {
      await db.from("blog_reactions").delete().eq("id", existing.id);
      return NextResponse.json({ myReaction: null });
    }

    // Otherwise upsert (insert new, or switch like<->dislike)
    const { error } = await db
      .from("blog_reactions")
      .upsert({ post_id, visitor_id, reaction }, { onConflict: "post_id,visitor_id" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ myReaction: reaction });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}