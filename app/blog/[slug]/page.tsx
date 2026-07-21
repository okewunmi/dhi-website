import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServerClient } from "@/lib/supabase-server";
import { Calendar, ArrowLeft, Tag, User } from "lucide-react";
import BlogInteractions from "@/components/blog/BlogInteractions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const db = createServerClient();
  const { data: post } = await db.from("blog_posts").select("title, excerpt").eq("slug", params.slug).single();
  if (!post) return { title: "Post Not Found" };
  return { title: post.title, description: post.excerpt || undefined };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const db = createServerClient();
  const { data: post } = await db
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (!post) notFound();

  // best-effort view increment, don't block render on it
  db.from("blog_posts").update({ view_count: (post.view_count || 0) + 1 }).eq("id", post.id).then(() => {});

  return (
    <>
      <Navbar />
      <main className="mt-[64px] md:mt-[70px]">
        <div className="container-dhi pt-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#BF4E14] transition-colors">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
        </div>

        {post.cover_image_url && (
          <div className="container-dhi mt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={post.cover_image_url} alt={post.title} className="w-full max-h-[420px] object-cover" />
          </div>
        )}

        <section className="section-padding">
          <div className="container-dhi max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {(post.tags || []).map((t: string) => (
                <span key={t} className="text-[10px] font-bold uppercase tracking-wide px-3 py-1 border rounded-full bg-orange-50 text-[#BF4E14] border-orange-200">
                  <Tag size={9} className="inline mr-1" />{t}
                </span>
              ))}
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-black mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-5 text-sm text-gray-400 mb-8 pb-8 border-b border-[#E8E8E8]">
              <span className="flex items-center gap-1.5"><User size={13} className="text-[#BF4E14]" /> {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#BF4E14]" /> {formatDate(post.published_at)}</span>
            </div>

            <div className="prose prose-sm max-w-none text-[#4A4A4A] leading-relaxed text-base mb-10">
              {post.content.split("\n").map((p: string, i: number) => p.trim() ? <p key={i} className="mb-4">{p}</p> : null)}
            </div>

            {post.images && post.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
                {post.images.map((url: string, i: number) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={url} alt={`${post.title} ${i + 1}`} className="w-full h-40 object-cover" />
                ))}
              </div>
            )}

            <BlogInteractions postId={post.id} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}