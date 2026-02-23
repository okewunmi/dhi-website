import { Metadata } from "next";
import { getPageContent } from "@/lib/supabase-server";
import PublicLayout from "@/components/PublicLayout";
import Link from "next/link";
import { ArrowRight, Mic, BookOpen, Phone, GraduationCap, FileSearch, Video } from "lucide-react";

export const metadata: Metadata = { title: "Programmes" };
export const revalidate = 60;

interface Programme {
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  badge: string;
  status: string;
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  Podcast: <Mic size={16} strokeWidth={1.5} />,
  Course: <BookOpen size={16} strokeWidth={1.5} />,
  Coaching: <Phone size={16} strokeWidth={1.5} />,
  Scholarship: <GraduationCap size={16} strokeWidth={1.5} />,
  Research: <FileSearch size={16} strokeWidth={1.5} />,
  Videos: <Video size={16} strokeWidth={1.5} />,
};

function ProgrammeCard({ prog, index }: { prog: Programme; index: number }) {
  return (
    <div className="bg-white border border-[#E8E8E8] p-8 group hover:border-[#BF4E14] transition-all duration-300 hover:shadow-lg relative">
      {prog.status === "coming_soon" && (
        <div className="absolute top-4 right-4 bg-[#F5F5F5] text-xs text-gray-500 font-semibold uppercase tracking-wide px-3 py-1">
          Coming Soon
        </div>
      )}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 border border-[#BF4E14] text-[#BF4E14] flex items-center justify-center">
          {BADGE_ICONS[prog.badge] || <BookOpen size={16} />}
        </div>
        <div>
          <span className="badge text-xs">{prog.badge}</span>
        </div>
      </div>
      <h3 className="font-display text-2xl font-light text-black mb-1 group-hover:text-[#BF4E14] transition-colors">
        {prog.title}
      </h3>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">{prog.subtitle}</p>
      <p className="text-sm text-[#4A4A4A] leading-relaxed mb-8">{prog.description}</p>
      <Link
        href={prog.cta_link || "/apply"}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#BF4E14] hover:gap-3 transition-all"
      >
        {prog.cta_text || "Learn More"}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export default async function ProgrammesPage() {
  const content = await getPageContent("programmes");

  const hero = (content?.hero || {}) as Record<string, string>;
  const financial = (content?.financial_literacy || {}) as Record<string, unknown>;
  const dataLit = (content?.data_literacy || {}) as Record<string, unknown>;

  const financialProgs = (financial?.programmes as Programme[]) || [];
  const dataProgs = (dataLit?.programmes as Programme[]) || [];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-[#F5F5F5] py-20 lg:py-28">
        <div className="container-dhi">
          <span className="section-label">What We Offer</span>
          <h1 className="font-display text-5xl lg:text-7xl font-light text-black mb-6 max-w-3xl">
            {hero.headline || "Our Programmes"}
          </h1>
          <p className="text-[#4A4A4A] text-lg max-w-2xl">
            {hero.subheadline || "Two pillars. One mission. Practical learning for real impact in Northern Nigeria."}
          </p>
        </div>
      </section>

      {/* Pillar nav */}
      <div className="bg-white border-b border-[#E8E8E8] sticky top-[70px] z-30">
        <div className="container-dhi">
          <div className="flex gap-0">
            <a
              href="#financial-literacy"
              className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#BF4E14] border-b-2 border-[#BF4E14]"
            >
              Financial Literacy
            </a>
            <a
              href="#data-literacy"
              className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-[#BF4E14] border-b-2 border-transparent hover:border-[#BF4E14] transition-all"
            >
              Data Literacy
            </a>
          </div>
        </div>
      </div>

      {/* Financial Literacy */}
      <section id="financial-literacy" className="section-padding bg-white">
        <div className="container-dhi">
          <div className="border-l-4 border-[#BF4E14] pl-8 mb-12">
            <span className="section-label">Pillar 01</span>
            <h2 className="font-display text-4xl font-light text-black mb-3">
              {(financial.headline as string) || "Financial Literacy"}
            </h2>
            <p className="text-[#4A4A4A] max-w-2xl">
              {(financial.description as string) || "Helping individuals and households understand money, build skills, and make confident financial decisions."}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financialProgs.map((prog, i) => (
              <ProgrammeCard key={i} prog={prog} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="bg-[#BF4E14] py-3" />

      {/* Data Literacy */}
      <section id="data-literacy" className="section-padding bg-[#F5F5F5]">
        <div className="container-dhi">
          <div className="border-l-4 border-[#BF4E14] pl-8 mb-12">
            <span className="section-label">Pillar 02</span>
            <h2 className="font-display text-4xl font-light text-black mb-3">
              {(dataLit.headline as string) || "Data Literacy"}
            </h2>
            <p className="text-[#4A4A4A] max-w-2xl">
              {(dataLit.description as string) || "Building the capacity to understand, use, and advocate with data across Hausa-speaking communities."}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataProgs.map((prog, i) => (
              <ProgrammeCard key={i} prog={prog} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-black text-white">
        <div className="container-dhi text-center">
          <h2 className="font-display text-4xl font-light text-white mb-4">
            Ready to Apply?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Apply for the Home CFO Course or the Hausa Tech Training Scholarship today.
          </p>
          <Link href="/apply" className="btn-primary">
            Apply / Register Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
