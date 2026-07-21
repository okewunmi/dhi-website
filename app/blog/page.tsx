import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogClient from "@/components/blog/BlogClient";
import { createServerClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
  title: "Blog",
  description: "Insights, updates, and stories from Da Hausa Initiative.",
};

export default async function BlogPage() {
  const db = createServerClient();
  const { data } = await db
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  return (
    <>
      <Navbar />
      <main className="mt-[64px] md:mt-[70px]">
        <section className="bg-black text-white py-16 md:py-24">
          <div className="container-dhi">
            <span className="section-label-white">Blog</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mt-3 max-w-3xl">
              Stories, Insights & Updates
            </h1>
          </div>
        </section>
        <BlogClient initialPosts={data || []} />
      </main>
      <Footer />
    </>
  );
}