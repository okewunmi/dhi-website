import { Metadata } from "next";
import { getPageContent } from "@/lib/supabase-server";
import PublicLayout from "@/components/PublicLayout";
import MoreClient from "@/components/MoreClient";

export const metadata: Metadata = { title: "Resources & Contact" };
export const revalidate = 60;

export default async function MorePage() {
  const content = await getPageContent("more");

  const hero = (content?.hero || {}) as Record<string, string>;
  const resources = (content?.resources || {}) as Record<string, unknown>;
  const contact = (content?.contact || {}) as Record<string, unknown>;

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-black text-white py-20 lg:py-28">
        <div className="container-dhi">
          <span className="section-label">Explore</span>
          <h1 className="font-display text-4xl lg:text-6xl font-light text-white mb-6 max-w-3xl">
            {hero.headline || "Resources, Newsletter & Contact"}
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl">
            {hero.subheadline || "Explore our resources, stay connected, and reach out to us."}
          </p>
          {/* Jump links */}
          <div className="flex gap-6 mt-8">
            {["Resources", "Newsletter", "Contact"].map((section) => (
              <a
                key={section}
                href={`#${section.toLowerCase()}`}
                className="text-sm text-gray-400 hover:text-white transition-colors uppercase tracking-wide"
              >
                {section}
              </a>
            ))}
          </div>
        </div>
      </section>

      <MoreClient resources={resources} contact={contact} />
    </PublicLayout>
  );
}
