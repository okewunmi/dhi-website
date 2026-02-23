import { TrendingUp, BarChart2 } from "lucide-react";

interface Pillar {
  title: string;
  description: string;
  icon: string;
}

interface PillarsData {
  headline?: string;
  pillars?: Pillar[];
}

const ICON_MAP: Record<string, React.ReactNode> = {
  TrendingUp: <TrendingUp size={28} strokeWidth={1.5} />,
  BarChart2: <BarChart2 size={28} strokeWidth={1.5} />,
};

export default function HomePillars({ data }: { data: PillarsData }) {
  const pillars = data.pillars || [
    {
      title: "Financial Literacy",
      description:
        "Equipping individuals and households in Northern Nigeria with the knowledge and tools to manage money, plan for the future, and build financial resilience.",
      icon: "TrendingUp",
    },
    {
      title: "Data Literacy",
      description:
        "Building capacity to understand, interpret, and use data — empowering Hausa-speaking communities to engage with evidence and make informed decisions.",
      icon: "BarChart2",
    },
  ];

  return (
    <section className="section-padding bg-[#F5F5F5]">
      <div className="container-dhi">
        <div className="text-center mb-12">
          <span className="section-label block text-center">Our Focus</span>
          <h2 className="font-display text-4xl lg:text-5xl font-light text-black">
            {data.headline || "Our Two Pillars"}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pillars.map((pillar, i) => (
            <div
              key={i}
              className="bg-white p-10 border-t-4 border-[#BF4E14] shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-[#BF4E14] mb-6">
                {ICON_MAP[pillar.icon] || <TrendingUp size={28} strokeWidth={1.5} />}
              </div>
              <h3 className="font-display text-2xl font-light text-black mb-4">
                {pillar.title}
              </h3>
              <p className="text-[#4A4A4A] leading-relaxed text-[15px]">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
