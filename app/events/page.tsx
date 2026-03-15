import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventsClient from "@/components/events/EventsClient";
import { createServerClient, getCmsContent } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const hero = await getCmsContent("events", "hero") as Record<string, string> | null;
  return {
    title: "Events",
    description: hero?.subheadline || "Upcoming and past events from Da Hausa Initiative — workshops, webinars, and community sessions on financial and data literacy.",
  };
}

export default async function EventsPage() {
  const db = createServerClient();

  const [heroData, eventsResult] = await Promise.all([
    getCmsContent("events", "hero") as Promise<Record<string, string> | null>,
    db.from("events").select("*").neq("status", "cancelled").order("date", { ascending: true }),
  ]);

  const hero = heroData || {};
  const headline = hero.headline || "Workshops, Webinars & Community Sessions";
  const subheadline = hero.subheadline || "Join us in person or online. All events are free unless stated otherwise — register early as spaces are limited.";

  return (
    <>
      <Navbar />
      <main className="mt-[64px] md:mt-[70px]">

        {/* Hero — driven by CMS */}
        <section className="bg-black text-white py-16 md:py-24">
          <div className="container-dhi">
            <span className="section-label-white">Events</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mt-3 max-w-3xl">
              {headline}
            </h1>
            <p className="text-gray-400 mt-5 max-w-xl text-base md:text-lg leading-relaxed">
              {subheadline}
            </p>
            {hero.cta_text && hero.cta_link && (
              <a
                href={hero.cta_link}
                className="inline-flex items-center gap-2 mt-8 bg-[#BF4E14] hover:bg-[#9E3F0F] text-white text-sm font-semibold px-6 py-3 transition-colors"
              >
                {hero.cta_text}
              </a>
            )}
          </div>
        </section>

        <EventsClient initialEvents={eventsResult.data || []} />
      </main>
      <Footer />
    </>
  );
}