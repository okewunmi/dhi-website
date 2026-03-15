// import { Metadata } from "next";
// import { notFound } from "next/navigation";
// import Link from "next/link";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { createServerClient } from "@/lib/supabase-server";
// import { Calendar, MapPin, Clock, ExternalLink, ArrowLeft, Tag } from "lucide-react";

// export const dynamic = "force-dynamic";

// interface Event {
//   id: string;
//   title: string;
//   slug: string;
//   type: string;
//   status: string;
//   date: string;
//   time?: string;
//   location?: string;
//   location_url?: string;
//   description?: string;
//   image_url?: string;
//   registration_url?: string;
//   registration_open: boolean;
//   recap?: string;
// }

// function formatDate(dateStr: string) {
//   const d = new Date(dateStr + "T00:00:00");
//   return d.toLocaleDateString("en-NG", {
//     weekday: "long", day: "numeric", month: "long", year: "numeric",
//   });
// }

// const TYPE_COLORS: Record<string, string> = {
//   Workshop: "bg-orange-50 text-[#BF4E14] border-orange-200",
//   Webinar: "bg-blue-50 text-blue-700 border-blue-200",
//   "Community Session": "bg-green-50 text-green-700 border-green-200",
//   Training: "bg-purple-50 text-purple-700 border-purple-200",
//   Conference: "bg-yellow-50 text-yellow-700 border-yellow-200",
//   Other: "bg-gray-50 text-gray-600 border-gray-200",
// };

// export async function generateMetadata({
//   params,
// }: {
//   params: { slug: string };
// }): Promise<Metadata> {
//   const db = createServerClient();
//   const { data: event } = await db
//     .from("events")
//     .select("title, description")
//     .eq("slug", params.slug)
//     .single();

//   if (!event) return { title: "Event Not Found" };

//   return {
//     title: event.title,
//     description: event.description || `Join us for ${event.title} — an event by Da Hausa Initiative.`,
//   };
// }

// export default async function EventDetailPage({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   const db = createServerClient();
//   const { data: event } = await db
//     .from("events")
//     .select("*")
//     .eq("slug", params.slug)
//     .neq("status", "cancelled")
//     .single();

//   if (!event) notFound();

//   const isPast = (event as Event).status === "past";
//   const typeColor = TYPE_COLORS[(event as Event).type] || TYPE_COLORS.Other;

//   return (
//     <>
//       <Navbar />
//       <main className="mt-[64px] md:mt-[70px]">

//         {/* Back link */}
//         <div className="container-dhi pt-8">
//           <Link href="/events"
//             className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#BF4E14] transition-colors">
//             <ArrowLeft size={14} /> Back to Events
//           </Link>
//         </div>

//         {/* Cover image */}
//         {(event as Event).image_url && (
//           // eslint-disable-next-line @next/next/no-img-element
//           <div className="container-dhi mt-6">
//             <img
//               src={(event as Event).image_url!}
//               alt={(event as Event).title}
//               className="w-full max-h-[420px] object-cover"
//             />
//           </div>
//         )}

//         {/* Main content */}
//         <section className="section-padding">
//           <div className="container-dhi">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

//               {/* Left: main info */}
//               <div className="lg:col-span-2">
//                 {/* Badges */}
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   <span className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1 border rounded-full ${typeColor}`}>
//                     <Tag size={9} className="inline mr-1" />
//                     {(event as Event).type}
//                   </span>
//                   {isPast && (
//                     <span className="text-[10px] font-bold uppercase tracking-wide px-3 py-1 border rounded-full bg-gray-50 text-gray-500 border-gray-200">
//                       Past Event
//                     </span>
//                   )}
//                 </div>

//                 <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-black mb-6 leading-tight">
//                   {(event as Event).title}
//                 </h1>

//                 {/* Description */}
//                 {(event as Event).description && (
//                   <div className="prose prose-sm max-w-none text-[#4A4A4A] leading-relaxed text-base mb-8">
//                     {(event as Event).description!.split("\n").map((p, i) =>
//                       p.trim() ? <p key={i} className="mb-3">{p}</p> : null
//                     )}
//                   </div>
//                 )}

//                 {/* Recap for past events */}
//                 {isPast && (event as Event).recap && (
//                   <div className="border-l-4 border-[#BF4E14] pl-5 py-2 bg-[#FAFAFA] mt-6">
//                     <p className="text-xs font-bold text-[#BF4E14] uppercase tracking-wide mb-2">Event Recap</p>
//                     <p className="text-sm text-[#4A4A4A] leading-relaxed">{(event as Event).recap}</p>
//                   </div>
//                 )}
//               </div>

//               {/* Right: details sidebar */}
//               <div className="lg:col-span-1">
//                 <div className="bg-[#FAFAFA] border border-[#E8E8E8] p-6 sticky top-24">
//                   <h2 className="font-semibold text-black text-sm uppercase tracking-wide mb-5">
//                     Event Details
//                   </h2>
//                   <div className="space-y-4">
//                     <div className="flex items-start gap-3">
//                       <Calendar size={15} className="text-[#BF4E14] mt-0.5 flex-shrink-0" />
//                       <div>
//                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Date</p>
//                         <p className="text-sm text-black">{formatDate((event as Event).date)}</p>
//                       </div>
//                     </div>
//                     {(event as Event).time && (
//                       <div className="flex items-start gap-3">
//                         <Clock size={15} className="text-[#BF4E14] mt-0.5 flex-shrink-0" />
//                         <div>
//                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Time</p>
//                           <p className="text-sm text-black">{(event as Event).time}</p>
//                         </div>
//                       </div>
//                     )}
//                     {(event as Event).location && (
//                       <div className="flex items-start gap-3">
//                         <MapPin size={15} className="text-[#BF4E14] mt-0.5 flex-shrink-0" />
//                         <div>
//                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Location</p>
//                           {(event as Event).location_url ? (
//                             <a href={(event as Event).location_url!} target="_blank" rel="noopener noreferrer"
//                               className="text-sm text-[#BF4E14] hover:underline">
//                               {(event as Event).location}
//                             </a>
//                           ) : (
//                             <p className="text-sm text-black">{(event as Event).location}</p>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* CTA */}
//                   <div className="mt-6 pt-5 border-t border-[#E8E8E8]">
//                     {!isPast && (event as Event).registration_url && (event as Event).registration_open ? (
//                       <a href={(event as Event).registration_url!} target="_blank" rel="noopener noreferrer"
//                         className="btn-primary w-full justify-center text-sm">
//                         Register Now <ExternalLink size={13} />
//                       </a>
//                     ) : !isPast && !(event as Event).registration_open ? (
//                       <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide text-center">
//                         Registration Closed
//                       </p>
//                     ) : null}
//                   </div>

//                   {/* Back link */}
//                   <Link href="/events"
//                     className="flex items-center justify-center gap-2 text-xs text-gray-400 hover:text-[#BF4E14] transition-colors mt-4">
//                     <ArrowLeft size={12} /> All Events
//                   </Link>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </section>

//       </main>
//       <Footer />
//     </>
//   );
// }

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, ExternalLink, Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

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

const EVENT_TYPES = ["All", "Workshop", "Webinar", "Community Session", "Training", "Conference", "Other"];

const TYPE_COLORS: Record<string, string> = {
  Workshop: "bg-orange-50 text-[#BF4E14] border-orange-200",
  Webinar: "bg-blue-50 text-blue-700 border-blue-200",
  "Community Session": "bg-green-50 text-green-700 border-green-200",
  Training: "bg-purple-50 text-purple-700 border-purple-200",
  Conference: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Other: "bg-gray-50 text-gray-600 border-gray-200",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

function EventCard({ event, past }: { event: Event; past?: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Link href={`/events/${event.slug}`} className={cn(
      "block bg-white border transition-all group",
      past ? "border-[#E8E8E8] opacity-80 hover:opacity-100 hover:border-[#BF4E14]" : "border-[#E8E8E8] hover:border-[#BF4E14]"
    )}>
      {/* Image */}
      {event.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={event.image_url} alt={event.title}
          className="w-full h-44 object-cover" />
      )}

      <div className="p-5 sm:p-6">
        {/* Type + Status badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 border rounded-full", TYPE_COLORS[event.type] || TYPE_COLORS.Other)}>
            {event.type}
          </span>
          {past && (
            <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 border rounded-full bg-gray-50 text-gray-500 border-gray-200">
              Past Event
            </span>
          )}
          {event.status === "cancelled" && (
            <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 border rounded-full bg-red-50 text-red-600 border-red-200">
              Cancelled
            </span>
          )}
        </div>

        <h3 className="font-semibold text-black text-base sm:text-lg leading-snug mb-3 group-hover:text-[#BF4E14] transition-colors">
          {event.title}
        </h3>

        {/* Meta */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
            <Calendar size={13} className="text-[#BF4E14] flex-shrink-0" />
            {formatDate(event.date)}
          </div>
          {event.time && (
            <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
              <Clock size={13} className="text-[#BF4E14] flex-shrink-0" />
              {event.time}
            </div>
          )}
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
              <MapPin size={13} className="text-[#BF4E14] flex-shrink-0" />
              {event.location_url ? (
                <a href={event.location_url} target="_blank" rel="noopener noreferrer"
                  className="hover:text-[#BF4E14] transition-colors underline underline-offset-2">
                  {event.location}
                </a>
              ) : event.location}
            </div>
          )}
        </div>

        {/* Description (collapsible if long) */}
        {event.description && (
          <div className="mb-4">
            <p className={cn("text-sm text-[#4A4A4A] leading-relaxed", !expanded && "line-clamp-3")}>
              {event.description}
            </p>
            {event.description.length > 160 && (
              <button onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-[#BF4E14] font-semibold mt-1 hover:underline">
                {expanded ? "Show less" : "Read more"}
                <ChevronDown size={12} className={cn("transition-transform", expanded && "rotate-180")} />
              </button>
            )}
          </div>
        )}

        {/* Recap for past events */}
        {past && event.recap && (
          <div className="bg-[#F5F5F5] border-l-2 border-[#BF4E14] p-3 mb-4">
            <p className="text-[10px] font-bold text-[#BF4E14] uppercase tracking-wide mb-1">Event Recap</p>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">{event.recap}</p>
          </div>
        )}

        {/* CTA */}
        {!past && event.registration_url && event.registration_open && (
          <a href={event.registration_url} target="_blank" rel="noopener noreferrer"
            className="btn-primary text-sm w-full justify-center mt-1">
            Register Now <ExternalLink size={13} />
          </a>
        )}
        {!past && !event.registration_open && (
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
            Registration Closed
          </p>
        )}
      </div>
    </Link>
  );
}

export default function EventsClient({ initialEvents }: { initialEvents: Event[] }) {
  const [activeType, setActiveType] = useState("All");

  const filtered = useMemo(() => {
    if (activeType === "All") return initialEvents;
    return initialEvents.filter((e) => e.type === activeType);
  }, [initialEvents, activeType]);

  const upcoming = filtered.filter((e) => e.status === "upcoming");
  const past = filtered.filter((e) => e.status === "past");

  return (
    <section className="section-padding">
      <div className="container-dhi">

        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap mb-10">
          <Filter size={14} className="text-[#BF4E14] mr-1" />
          {EVENT_TYPES.map((t) => (
            <button key={t} onClick={() => setActiveType(t)}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 border rounded-full transition-all",
                activeType === t
                  ? "bg-[#BF4E14] text-white border-[#BF4E14]"
                  : "bg-white text-black border-[#E8E8E8] hover:border-[#BF4E14] hover:text-[#BF4E14]"
              )}>
              {t}
            </button>
          ))}
        </div>

        {/* Upcoming */}
        <div className="mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-light text-black mb-2">
            Upcoming Events
          </h2>
          <div className="w-12 h-0.5 bg-[#BF4E14] mb-8" />
          {upcoming.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-[#E8E8E8]">
              <Calendar size={32} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No upcoming events at the moment.</p>
              <p className="text-gray-300 text-xs mt-1">Check back soon — new events are added regularly.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
            </div>
          )}
        </div>

        {/* Past */}
        {past.length > 0 && (
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-light text-black mb-2">
              Past Events
            </h2>
            <div className="w-12 h-0.5 bg-[#E8E8E8] mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {past.map((e) => <EventCard key={e.id} event={e} past />)}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}