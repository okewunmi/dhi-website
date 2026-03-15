import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createServerClient } from "@/lib/supabase-server";
import { Calendar, MapPin, Clock, ExternalLink, ArrowLeft, Tag } from "lucide-react";

export const dynamic = "force-dynamic";

interface Event {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  date: string;
  time?: string;
  location?: string;
  location_url?: string;
  description?: string;
  image_url?: string;
  registration_url?: string;
  registration_open: boolean;
  recap?: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-NG", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

const TYPE_COLORS: Record<string, string> = {
  Workshop: "bg-orange-50 text-[#BF4E14] border-orange-200",
  Webinar: "bg-blue-50 text-blue-700 border-blue-200",
  "Community Session": "bg-green-50 text-green-700 border-green-200",
  Training: "bg-purple-50 text-purple-700 border-purple-200",
  Conference: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Other: "bg-gray-50 text-gray-600 border-gray-200",
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const db = createServerClient();
  const { data: event } = await db
    .from("events")
    .select("title, description")
    .eq("slug", params.slug)
    .single();

  if (!event) return { title: "Event Not Found" };

  return {
    title: event.title,
    description: event.description || `Join us for ${event.title} — an event by Da Hausa Initiative.`,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const db = createServerClient();
  const { data: event } = await db
    .from("events")
    .select("*")
    .eq("slug", params.slug)
    .neq("status", "cancelled")
    .single();

  if (!event) notFound();

  const isPast = (event as Event).status === "past";
  const typeColor = TYPE_COLORS[(event as Event).type] || TYPE_COLORS.Other;

  return (
    <>
      <Navbar />
      <main className="mt-[64px] md:mt-[70px]">

        {/* Back link */}
        <div className="container-dhi pt-8">
          <Link href="/events"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#BF4E14] transition-colors">
            <ArrowLeft size={14} /> Back to Events
          </Link>
        </div>

        {/* Cover image */}
        {(event as Event).image_url && (
          <div className="container-dhi mt-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={(event as Event).image_url!}
              alt={(event as Event).title}
              className="w-full max-h-[420px] object-cover"
            />
          </div>
        )}

        {/* Main content */}
        <section className="section-padding">
          <div className="container-dhi">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

              {/* Left: main info */}
              <div className="lg:col-span-2">
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1 border rounded-full ${typeColor}`}>
                    <Tag size={9} className="inline mr-1" />
                    {(event as Event).type}
                  </span>
                  {isPast && (
                    <span className="text-[10px] font-bold uppercase tracking-wide px-3 py-1 border rounded-full bg-gray-50 text-gray-500 border-gray-200">
                      Past Event
                    </span>
                  )}
                </div>

                <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-black mb-6 leading-tight">
                  {(event as Event).title}
                </h1>

                {/* Description */}
                {(event as Event).description && (
                  <div className="prose prose-sm max-w-none text-[#4A4A4A] leading-relaxed text-base mb-8">
                    {(event as Event).description!.split("\n").map((p, i) =>
                      p.trim() ? <p key={i} className="mb-3">{p}</p> : null
                    )}
                  </div>
                )}

                {/* Recap for past events */}
                {isPast && (event as Event).recap && (
                  <div className="border-l-4 border-[#BF4E14] pl-5 py-2 bg-[#FAFAFA] mt-6">
                    <p className="text-xs font-bold text-[#BF4E14] uppercase tracking-wide mb-2">Event Recap</p>
                    <p className="text-sm text-[#4A4A4A] leading-relaxed">{(event as Event).recap}</p>
                  </div>
                )}
              </div>

              {/* Right: details sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-[#FAFAFA] border border-[#E8E8E8] p-6 sticky top-24">
                  <h2 className="font-semibold text-black text-sm uppercase tracking-wide mb-5">
                    Event Details
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar size={15} className="text-[#BF4E14] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
                        <p className="text-sm text-black">{formatDate((event as Event).date)}</p>
                      </div>
                    </div>
                    {(event as Event).time && (
                      <div className="flex items-start gap-3">
                        <Clock size={15} className="text-[#BF4E14] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Time</p>
                          <p className="text-sm text-black">{(event as Event).time}</p>
                        </div>
                      </div>
                    )}
                    {(event as Event).location && (
                      <div className="flex items-start gap-3">
                        <MapPin size={15} className="text-[#BF4E14] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Location</p>
                          {(event as Event).location_url ? (
                            <a href={(event as Event).location_url!} target="_blank" rel="noopener noreferrer"
                              className="text-sm text-[#BF4E14] hover:underline">
                              {(event as Event).location}
                            </a>
                          ) : (
                            <p className="text-sm text-black">{(event as Event).location}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="mt-6 pt-5 border-t border-[#E8E8E8]">
                    {!isPast && (event as Event).registration_url && (event as Event).registration_open ? (
                      <a href={(event as Event).registration_url!} target="_blank" rel="noopener noreferrer"
                        className="btn-primary w-full justify-center text-sm">
                        Register Now <ExternalLink size={13} />
                      </a>
                    ) : !isPast && !(event as Event).registration_open ? (
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide text-center">
                        Registration Closed
                      </p>
                    ) : null}
                  </div>

                  {/* Back link */}
                  <Link href="/events"
                    className="flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-[#BF4E14] transition-colors mt-4">
                    <ArrowLeft size={12} /> All Events
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}