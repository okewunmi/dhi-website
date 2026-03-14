import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// import EventsClient from "@/components/events/EventsClient";
import EventsClient from "@/components/events/EventsClient";
import { createServerClient } from "@/lib/supabase-server";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming and past events from Da Hausa Initiative — workshops, webinars, and community sessions on financial and data literacy.",
};

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const db = createServerClient();
  const { data: events } = await db
    .from("events")
    .select("*")
    .neq("status", "cancelled")
    .order("date", { ascending: true });

  return (
    <>
      <Navbar />
      <main className="mt-[64px] md:mt-[70px]">
        {/* Hero */}
        <section className="bg-black text-white py-16 md:py-24">
          <div className="container-dhi">
            <span className="section-label-white">Events</span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mt-3 max-w-2xl">
              Workshops, Webinars &amp; Community Sessions
            </h1>
            <p className="text-gray-400 mt-5 max-w-xl text-base md:text-lg leading-relaxed">
              Join us in person or online. All events are free unless stated otherwise — register early as spaces are limited.
            </p>
          </div>
        </section>

        <EventsClient initialEvents={events || []} />
      </main>
      <Footer />
    </>
  );
}