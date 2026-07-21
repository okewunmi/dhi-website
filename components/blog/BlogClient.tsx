"use client";

import Link from "next/link";
import { Calendar, Tag } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  tags: string[];
  author: string;
  published_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogClient({ initialPosts }: { initialPosts: Post[] }) {
  return (
    <section className="section-padding">
      <div className="container-dhi">
        {initialPosts.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#E8E8E8]">
            <p className="text-gray-400 text-sm">No blog posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="block bg-white border border-[#E8E8E8] hover:border-[#BF4E14] transition-all group">
                {post.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={post.cover_image_url} alt={post.title} className="w-full h-44 object-cover" />
                )}
                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(post.tags || []).slice(0, 2).map((t) => (
                      <span key={t} className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 border rounded-full bg-orange-50 text-[#BF4E14] border-orange-200">
                        <Tag size={9} className="inline mr-1" />{t}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-semibold text-black text-base sm:text-lg leading-snug mb-3 group-hover:text-[#BF4E14] transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && <p className="text-sm text-[#4A4A4A] leading-relaxed line-clamp-3 mb-4">{post.excerpt}</p>}
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={12} className="text-[#BF4E14]" /> {formatDate(post.published_at)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}