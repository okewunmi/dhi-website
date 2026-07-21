// import { NextRequest, NextResponse } from "next/server";
// import { createServerClient } from "@/lib/supabase-server";
// import { z } from "zod";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// export const fetchCache = "force-no-store";

// const schema = z.object({
//   post_id: z.string().uuid(),
//   visitor_id: z.string().min(10),
//   reaction: z.enum(["like", "dislike"]),
// });

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const post_id = searchParams.get("post_id");
//   const visitor_id = searchParams.get("visitor_id");
//   if (!post_id) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

//   const db = createServerClient();
//   const [{ count: likes }, { count: dislikes }, mine] = await Promise.all([
//     db.from("blog_reactions").select("id", { count: "exact", head: true }).eq("post_id", post_id).eq("reaction", "like"),
//     db.from("blog_reactions").select("id", { count: "exact", head: true }).eq("post_id", post_id).eq("reaction", "dislike"),
//     visitor_id
//       ? db.from("blog_reactions").select("reaction").eq("post_id", post_id).eq("visitor_id", visitor_id).single()
//       : Promise.resolve({ data: null }),
//   ]);

//   return NextResponse.json({
//     likes: likes || 0,
//     dislikes: dislikes || 0,
//     myReaction: (mine as { data: { reaction: string } | null })?.data?.reaction || null,
//   }, { headers: { "Cache-Control": "no-store, must-revalidate" } });
// }

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const parsed = schema.safeParse(body);
//     if (!parsed.success)
//       return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

//     const { post_id, visitor_id, reaction } = parsed.data;
//     const db = createServerClient();

//     const { data: existing } = await db
//       .from("blog_reactions")
//       .select("id, reaction")
//       .eq("post_id", post_id)
//       .eq("visitor_id", visitor_id)
//       .single();

//     if (existing && existing.reaction === reaction) {
//       await db.from("blog_reactions").delete().eq("id", existing.id);
//       return NextResponse.json({ myReaction: null });
//     }

//     const { error } = await db
//       .from("blog_reactions")
//       .upsert({ post_id, visitor_id, reaction }, { onConflict: "post_id,visitor_id" });

//     if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//     return NextResponse.json({ myReaction: reaction });
//   } catch {
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const schema = z.object({
  comment_id: z.string().uuid(),
  visitor_id: z.string().min(10),
  reaction: z.enum(["like", "dislike"]),
});

// GET — totals + this visitor's reaction, for one or many comments at once
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const post_id = searchParams.get("post_id"); // fetch all reactions for a post's comments in one go
  const visitor_id = searchParams.get("visitor_id");
  if (!post_id) return NextResponse.json({ error: "post_id is required" }, { status: 400 });

  const db = createServerClient();

  // get all comment ids for this post first
  const { data: comments } = await db
    .from("blog_comments")
    .select("id")
    .eq("post_id", post_id);

  const ids = (comments || []).map((c) => c.id);
  if (ids.length === 0) return NextResponse.json({ reactions: {} });

  const { data: allReactions } = await db
    .from("blog_comment_reactions")
    .select("comment_id, reaction, visitor_id")
    .in("comment_id", ids);

  const result: Record<string, { likes: number; dislikes: number; myReaction: string | null }> = {};
  for (const id of ids) result[id] = { likes: 0, dislikes: 0, myReaction: null };

  for (const r of allReactions || []) {
    if (r.reaction === "like") result[r.comment_id].likes++;
    if (r.reaction === "dislike") result[r.comment_id].dislikes++;
    if (visitor_id && r.visitor_id === visitor_id) result[r.comment_id].myReaction = r.reaction;
  }

  return NextResponse.json({ reactions: result }, {
    headers: { "Cache-Control": "no-store, must-revalidate" },
  });
}

// POST — toggle/set/switch reaction on a single comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });

    const { comment_id, visitor_id, reaction } = parsed.data;
    const db = createServerClient();

    const { data: existing } = await db
      .from("blog_comment_reactions")
      .select("id, reaction")
      .eq("comment_id", comment_id)
      .eq("visitor_id", visitor_id)
      .single();

    if (existing && existing.reaction === reaction) {
      await db.from("blog_comment_reactions").delete().eq("id", existing.id);
      return NextResponse.json({ myReaction: null });
    }

    const { error } = await db
      .from("blog_comment_reactions")
      .upsert({ comment_id, visitor_id, reaction }, { onConflict: "comment_id,visitor_id" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ myReaction: reaction });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}