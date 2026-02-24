import { Search, BookOpen, Megaphone } from "lucide-react";

interface Approach {
  title: string;
  description: string;
}

interface ApproachesData {
  headline?: string;
  approaches?: Approach[];
}

const APPROACH_ICONS = [
  <Search key="search" size={22} strokeWidth={1.5} />,
  <BookOpen key="book" size={22} strokeWidth={1.5} />,
  <Megaphone key="mega" size={22} strokeWidth={1.5} />,
];

export default function HomeApproaches({ data }: { data: ApproachesData }) {
  const approaches = data.approaches || [
    {
      title: "Research",
      description:
        "Generating evidence on the financial and data needs of Northern Nigerian communities to inform effective interventions.",
    },
    {
      title: "Training",
      description:
        "Delivering practical, community-rooted programmes that build real skills in financial and data literacy.",
    },
    {
      title: "Advocacy",
      description:
        "Influencing policy and practice to create systemic change that benefits underserved Hausa-speaking populations.",
    },
  ];

  return (
    <section className="section-padding bg-black text-white">
      <div className="container-dhi">
        <div className="grid lg:grid-cols-4 gap-10 items-start">
          {/* Label */}
          <div className="lg:col-span-1">
            <span className="section-label">&nbsp;</span>
            <h2 className="font-display text-3xl lg:text-5xl font-light text-white leading-tight">
              {data.headline || "How We Work"}
            </h2>
            <div className="w-12 h-0.5 bg-[#BF4E14] mt-6" />
          </div>

          {/* Approaches */}
          <div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
            {approaches.map((approach, i) => (
              <div key={i} className="group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-[#BF4E14]">{APPROACH_ICONS[i]}</div>
                  <span className="text-xs text-gray-600 font-mono">0{i + 1}</span>
                </div>
                <h3 className="font-display text-2xl font-light text-white mb-3">
                  {approach.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {approach.description}
                </p>
                <div className="w-8 h-px bg-[#BF4E14] mt-5 group-hover:w-16 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
