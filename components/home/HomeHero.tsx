import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface HeroData {
  headline?: string;
  subheadline?: string;
  cta_primary_text?: string;
  cta_primary_link?: string;
  cta_secondary_text?: string;
  cta_secondary_link?: string;
  image_url?: string;
}

export default function HomeHero({ data }: { data: HeroData }) {
  const headline = data.headline || "Simplifying Concepts,\nStrengthening Communities";
  const lines = headline.split("\n");

  return (
    <section className="relative bg-white overflow-hidden min-h-[92vh] flex items-center">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.1) 40px, rgba(0,0,0,0.1) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0,0,0,0.1) 40px, rgba(0,0,0,0.1) 41px)",
        }}
      />

      {/* Orange accent left column */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#BF4E14]" />

      <div className="container-dhi relative z-10 py-20 lg:py-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="animate-fade-up">
            <span className="section-label mb-6">Da Hausa Initiative</span>
            <h1 className="text-5xl lg:text-5xl font-light text-black mb-8 leading-[1.05]">
              {lines.map((line, i) => (
                <span key={i} className={i > 0 ? "block text-[#BF4E14]" : "block"}>
                  {line}
                </span>
              ))}
            </h1>
            <p className="body-text text-[#4A4A4A] mb-10 max-w-lg text-lg">
              {data.subheadline ||
                "Da Hausa Initiative works to improve financial and data literacy across Hausa-speaking communities in Northern Nigeria."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href={data.cta_primary_link || "/apply"}
                className="btn-primary text-base"
              >
                {data.cta_primary_text || "Apply Now"}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={data.cta_secondary_link || "/programmes"}
                className="btn-secondary text-base"
              >
                {data.cta_secondary_text || "Our Programmes"}
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex gap-10 mt-14 pt-10 border-t border-[#E8E8E8]">
              {[
                { label: "Programmes", value: "2 Pillars" },
                { label: "Approaches", value: "3 Methods" },
                { label: "Focus", value: "Northern Nigeria" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl font-semibold text-[#BF4E14]">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wide text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual panel */}
          <div className="animate-fade-up-delay-1 relative">
            <div className="relative aspect-[4/5] bg-[#F5F5F5] overflow-hidden">
              {data.image_url ? (
                <Image
                  src={data.image_url}
                  alt="Da Hausa Initiative"
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
                  {/* Placeholder with brand elements */}
                  <div className="w-24 h-1 bg-[#BF4E14] mb-8" />
                  <div className="text-center">
                    <p className="font-display text-4xl font-light text-black mb-3">Financial</p>
                    <p className="text-sm uppercase tracking-widest text-gray-400 mb-6">&</p>
                    <p className="font-display text-4xl font-light text-[#BF4E14]">Data Literacy</p>
                  </div>
                  <div className="w-24 h-1 bg-[#BF4E14] mt-8" />
                  <p className="text-xs text-gray-400 uppercase tracking-widest mt-8 text-center">
                    Research · Training · Advocacy
                  </p>
                </div>
              )}
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-[#BF4E14] text-white p-8  shadow-xl max-w-[220px]">
              <p className="text-2xl font-display font-light mb-1">Northern</p>
              <p className="text-xs uppercase tracking-widest opacity-70">Nigeria Focus</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
