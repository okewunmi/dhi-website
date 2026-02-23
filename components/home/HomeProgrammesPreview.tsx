import Link from "next/link";
import { ArrowRight, Mic, BookOpen, Phone, GraduationCap, FileSearch, Video } from "lucide-react";

interface Programme {
  title: string;
  subtitle: string;
  description: string;
  cta_text: string;
  cta_link: string;
  badge: string;
}

const BADGE_ICONS: Record<string, React.ReactNode> = {
  Podcast: <Mic size={14} />,
  Course: <BookOpen size={14} />,
  Coaching: <Phone size={14} />,
  Scholarship: <GraduationCap size={14} />,
  Research: <FileSearch size={14} />,
  Videos: <Video size={14} />,
};

function ProgrammeCard({ prog }: { prog: Programme }) {
  return (
    <div className="card-dhi group">
      <div className="flex items-center gap-2 mb-5">
        <span className="badge flex items-center gap-1.5">
          {BADGE_ICONS[prog.badge]}
          {prog.badge}
        </span>
      </div>
      <h3 className="font-display text-xl font-light text-black mb-1 group-hover:text-[#BF4E14] transition-colors">
        {prog.title}
      </h3>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-4">{prog.subtitle}</p>
      <p className="text-sm text-[#4A4A4A] leading-relaxed mb-6">{prog.description}</p>
      <Link
        href={prog.cta_link || "/programmes"}
        className="text-[#BF4E14] text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all"
      >
        {prog.cta_text || "Learn More"}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

export default function HomeProgrammesPreview({
  preview,
  financial,
  data: dataLiteracy,
}: {
  preview: Record<string, string>;
  financial: Record<string, unknown>;
  data: Record<string, unknown>;
}) {
  const financialProgs = ((financial?.programmes as Programme[]) || []).slice(0, 2);
  const dataProgs = ((dataLiteracy?.programmes as Programme[]) || []).slice(0, 2);
  const allPreview = [...financialProgs.slice(0, 2), ...dataProgs.slice(0, 2)].slice(0, 4);

  return (
    <section className="section-padding bg-[#F5F5F5]">
      <div className="container-dhi">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="section-label">Programmes</span>
            <h2 className="font-display text-4xl lg:text-5xl font-light text-black">
              {preview.headline || "Our Programmes"}
            </h2>
            <p className="text-[#4A4A4A] mt-3 max-w-xl">
              {preview.subheadline || "From podcasts to scholarships, our programmes meet communities where they are."}
            </p>
          </div>
          <Link
            href={preview.cta_link || "/programmes"}
            className="btn-outline-orange flex-shrink-0 inline-flex items-center gap-2"
          >
            {preview.cta_text || "View All Programmes"}
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allPreview.map((prog, i) => (
            <ProgrammeCard key={i} prog={prog} />
          ))}
        </div>
      </div>
    </section>
  );
}
