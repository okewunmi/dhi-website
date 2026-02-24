import { Metadata } from "next";
import { getPageContent } from "@/lib/supabase-server";
import PublicLayout from "@/components/PublicLayout";
import Image from "next/image";
import Link from "next/link";
import { Search, BookOpen, Megaphone, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "About" };
export const revalidate = 60;

const APPROACH_ICONS = [
  <Search key="s" size={20} strokeWidth={1.5} />,
  <BookOpen key="b" size={20} strokeWidth={1.5} />,
  <Megaphone key="m" size={20} strokeWidth={1.5} />,
];

export default async function AboutPage() {
  const content = await getPageContent("about");

  const hero = (content?.hero || {}) as Record<string, string>;
  const why = (content?.why_dhi || {}) as Record<string, string>;
  const what = (content?.what_we_do || {}) as Record<string, unknown>;
  const how = (content?.how_we_work || {}) as Record<string, unknown>;
  const focus = (content?.focus_area || {}) as Record<string, string>;

  const whatItems = (what?.items as Array<{ title: string; description: string }>) || [];
  const howApproaches = (how?.approaches as Array<{ title: string; description: string }>) || [];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-black text-white py-24 lg:py-32">
        <div className="container-dhi">
          <span className="section-label">Da Hausa Initiative</span>
          <h1 className="font-display text-3xl lg:text-7xl font-light text-white mb-6 max-w-3xl">
            {hero.headline || "About Da Hausa Initiative"}
          </h1>
          <div className="w-16 h-px bg-[#BF4E14] mb-8" />
          <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">
            {hero.subheadline || "We exist because literacy — in all its forms — is the foundation of a thriving community."}
          </p>
        </div>
      </section>

      {/* Why DHI */}
      <section className="section-padding bg-white">
        <div className="container-dhi">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="section-label">Our Story</span>
              <h2 className="font-display text-3xl font-light text-black mb-6">
                {why.headline || "Why DHI Exists"}
              </h2>
              <div className="w-12 h-0.5 bg-[#BF4E14] mb-8" />
              <p className="body-text text-[#4A4A4A] leading-relaxed">
                {why.body ||
                  "Northern Nigeria is home to millions of Hausa-speaking people who are largely excluded from mainstream financial systems and digital literacy programmes. DHI exists to close that gap."}
              </p>
            </div>
            <div className="bg-[#F5F5F5] p-10">
              <p className="font-display text-2xl font-light text-black italic leading-relaxed">
                &quot; When communities understand money and data, they make better decisions, advocate for their rights, and build stronger futures.&quot;
              </p>
              <div className="w-12 h-0.5 bg-[#BF4E14] mt-6" />
            </div>
          </div>
        </div>
      </section>

      {/* What we work on */}
      <section className="section-padding bg-[#F5F5F5]">
        <div className="container-dhi">
          <span className="section-label">Focus Areas</span>
          <h2 className="font-display text-3xl font-light text-black mb-12">
            {(what.headline as string) || "What We Work On"}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {whatItems.map((item, i) => (
              <div key={i} className="bg-white p-10 border-l-4 border-[#BF4E14]">
                <h3 className="font-display text-2xl font-light text-[#BF4E14] mb-4">
                  {item.title}
                </h3>
                <p className="text-[#4A4A4A] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="section-padding bg-white">
        <div className="container-dhi">
          <span className="section-label">Our Approach</span>
          <h2 className="font-display text-3xl font-light text-black mb-4">
            {(how.headline as string) || "How DHI Works"}
          </h2>
          <p className="text-[#4A4A4A] mb-12 max-w-2xl">
            {(how.body as string) || "We operate through three complementary approaches that together create lasting change."}
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {howApproaches.map((approach, i) => (
              <div key={i} className="group">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 border border-[#BF4E14] flex items-center justify-center text-[#BF4E14]">
                    {APPROACH_ICONS[i]}
                  </div>
                  <span className="text-xs text-gray-400 font-mono tracking-widest">0{i + 1}</span>
                </div>
                <h3 className="font-display text-2xl font-light text-black mb-3">
                  {approach.title}
                </h3>
                <p className="text-[#4A4A4A] text-sm leading-relaxed">{approach.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Focus area */}
      <section className="section-padding bg-[#BF4E14] text-white">
        <div className="container-dhi">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-orange-200 text-xs font-bold uppercase tracking-widest mb-4 block">
                Where We Work
              </span>
              <h2 className="font-display text-3xl lg:text-5xl font-light text-white mb-6">
                {focus.headline || "Our Focus: Northern Nigeria"}
              </h2>
              <div className="w-12 h-px bg-white/40 mb-8" />
              <p className="text-orange-100 leading-relaxed mb-8">
                {focus.body ||
                  "DHI's work is rooted in the Hausa-speaking communities of Northern Nigeria. We understand the cultural, linguistic, and economic context of this region."}
              </p>
              <Link href="/programmes" className="inline-flex items-center gap-2 bg-white text-[#BF4E14] px-6 py-3 text-sm font-semibold hover:bg-orange-50 transition-colors">
                Explore Our Programmes
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="relative aspect-video lg:aspect-square bg-[#9E3F0F]">
              {focus.image_url ? (
                <Image src={focus.image_url} alt="Northern Nigeria" fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="font-display text-5xl font-light text-white/20">Northern</p>
                    <p className="font-display text-5xl font-light text-white/30">Nigeria</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
