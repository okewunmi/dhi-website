// "use client";

// import { useState, useMemo } from "react";
// import { Calendar, MapPin, Clock, ExternalLink, Filter, ChevronDown } from "lucide-react";
// import { cn } from "@/lib/utils";

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

// const EVENT_TYPES = ["All", "Workshop", "Webinar", "Community Session", "Training", "Conference", "Other"];

// const TYPE_COLORS: Record<string, string> = {
//   Workshop: "bg-orange-50 text-[#BF4E14] border-orange-200",
//   Webinar: "bg-blue-50 text-blue-700 border-blue-200",
//   "Community Session": "bg-green-50 text-green-700 border-green-200",
//   Training: "bg-purple-50 text-purple-700 border-purple-200",
//   Conference: "bg-yellow-50 text-yellow-700 border-yellow-200",
//   Other: "bg-gray-50 text-gray-600 border-gray-200",
// };

// function formatDate(dateStr: string) {
//   const d = new Date(dateStr + "T00:00:00");
//   return d.toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
// }

// function EventCard({ event, past }: { event: Event; past?: boolean }) {
//   const [expanded, setExpanded] = useState(false);

//   return (
//     <div className={cn(
//       "bg-white border transition-all",
//       past ? "border-[#E8E8E8] opacity-80" : "border-[#E8E8E8] hover:border-[#BF4E14]"
//     )}>
//       {/* Image */}
//       {event.image_url && (
//         // eslint-disable-next-line @next/next/no-img-element
//         <img src={event.image_url} alt={event.title}
//           className="w-full h-44 object-cover" />
//       )}

//       <div className="p-5 sm:p-6">
//         {/* Type + Status badges */}
//         <div className="flex flex-wrap gap-2 mb-3">
//           <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 border rounded-full", TYPE_COLORS[event.type] || TYPE_COLORS.Other)}>
//             {event.type}
//           </span>
//           {past && (
//             <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 border rounded-full bg-gray-50 text-gray-500 border-gray-200">
//               Past Event
//             </span>
//           )}
//           {event.status === "cancelled" && (
//             <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 border rounded-full bg-red-50 text-red-600 border-red-200">
//               Cancelled
//             </span>
//           )}
//         </div>

//         <h3 className="font-semibold text-black text-base sm:text-lg leading-snug mb-3">
//           {event.title}
//         </h3>

//         {/* Meta */}
//         <div className="space-y-1.5 mb-4">
//           <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
//             <Calendar size={13} className="text-[#BF4E14] flex-shrink-0" />
//             {formatDate(event.date)}
//           </div>
//           {event.time && (
//             <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
//               <Clock size={13} className="text-[#BF4E14] flex-shrink-0" />
//               {event.time}
//             </div>
//           )}
//           {event.location && (
//             <div className="flex items-center gap-2 text-sm text-[#4A4A4A]">
//               <MapPin size={13} className="text-[#BF4E14] flex-shrink-0" />
//               {event.location_url ? (
//                 <a href={event.location_url} target="_blank" rel="noopener noreferrer"
//                   className="hover:text-[#BF4E14] transition-colors underline underline-offset-2">
//                   {event.location}
//                 </a>
//               ) : event.location}
//             </div>
//           )}
//         </div>

//         {/* Description (collapsible if long) */}
//         {event.description && (
//           <div className="mb-4">
//             <p className={cn("text-sm text-[#4A4A4A] leading-relaxed", !expanded && "line-clamp-3")}>
//               {event.description}
//             </p>
//             {event.description.length > 160 && (
//               <button onClick={() => setExpanded(!expanded)}
//                 className="flex items-center gap-1 text-xs text-[#BF4E14] font-semibold mt-1 hover:underline">
//                 {expanded ? "Show less" : "Read more"}
//                 <ChevronDown size={12} className={cn("transition-transform", expanded && "rotate-180")} />
//               </button>
//             )}
//           </div>
//         )}

//         {/* Recap for past events */}
//         {past && event.recap && (
//           <div className="bg-[#F5F5F5] border-l-2 border-[#BF4E14] p-3 mb-4">
//             <p className="text-[10px] font-bold text-[#BF4E14] uppercase tracking-wide mb-1">Event Recap</p>
//             <p className="text-sm text-[#4A4A4A] leading-relaxed">{event.recap}</p>
//           </div>
//         )}

//         {/* CTA */}
//         {!past && event.registration_url && event.registration_open && (
//           <a href={event.registration_url} target="_blank" rel="noopener noreferrer"
//             className="btn-primary text-sm w-full justify-center mt-1">
//             Register Now <ExternalLink size={13} />
//           </a>
//         )}
//         {!past && !event.registration_open && (
//           <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">
//             Registration Closed
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default function EventsClient({ initialEvents }: { initialEvents: Event[] }) {
//   const [activeType, setActiveType] = useState("All");

//   const filtered = useMemo(() => {
//     if (activeType === "All") return initialEvents;
//     return initialEvents.filter((e) => e.type === activeType);
//   }, [initialEvents, activeType]);

//   const upcoming = filtered.filter((e) => e.status === "upcoming");
//   const past = filtered.filter((e) => e.status === "past");

//   return (
//     <section className="section-padding">
//       <div className="container-dhi">

//         {/* Filter bar */}
//         <div className="flex items-center gap-2 flex-wrap mb-10">
//           <Filter size={14} className="text-[#BF4E14] mr-1" />
//           {EVENT_TYPES.map((t) => (
//             <button key={t} onClick={() => setActiveType(t)}
//               className={cn(
//                 "text-xs font-semibold px-3 py-1.5 border rounded-full transition-all",
//                 activeType === t
//                   ? "bg-[#BF4E14] text-white border-[#BF4E14]"
//                   : "bg-white text-black border-[#E8E8E8] hover:border-[#BF4E14] hover:text-[#BF4E14]"
//               )}>
//               {t}
//             </button>
//           ))}
//         </div>

//         {/* Upcoming */}
//         <div className="mb-16">
//           <h2 className="font-display text-2xl sm:text-3xl font-light text-black mb-2">
//             Upcoming Events
//           </h2>
//           <div className="w-12 h-0.5 bg-[#BF4E14] mb-8" />
//           {upcoming.length === 0 ? (
//             <div className="py-16 text-center border border-dashed border-[#E8E8E8]">
//               <Calendar size={32} className="text-gray-200 mx-auto mb-3" />
//               <p className="text-gray-400 text-sm">No upcoming events at the moment.</p>
//               <p className="text-gray-300 text-xs mt-1">Check back soon — new events are added regularly.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
//             </div>
//           )}
//         </div>

//         {/* Past */}
//         {past.length > 0 && (
//           <div>
//             <h2 className="font-display text-2xl sm:text-3xl font-light text-black mb-2">
//               Past Events
//             </h2>
//             <div className="w-12 h-0.5 bg-[#E8E8E8] mb-8" />
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {past.map((e) => <EventCard key={e.id} event={e} past />)}
//             </div>
//           </div>
//         )}

//       </div>
//     </section>
//   );
// }

"use client";

import { useState } from "react";
import { RefreshCw, Check, X, Upload, ImagePlus } from "lucide-react";
import toast from "react-hot-toast";

export interface EventData {
  id?: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  date: string;
  time: string;
  location: string;
  location_url: string;
  description: string;
  image_url: string;
  registration_url: string;
  registration_open: boolean;
  recap: string;
}

const EMPTY: EventData = {
  title: "", slug: "", type: "Workshop", status: "upcoming",
  date: "", time: "", location: "", location_url: "",
  description: "", image_url: "", registration_url: "",
  registration_open: true, recap: "",
};

const EVENT_TYPES = ["Workshop", "Webinar", "Community Session", "Training", "Conference", "Other"];
const EVENT_STATUSES = ["upcoming", "past", "cancelled"];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface EventFormProps {
  initial?: EventData;
  onSuccess: (event: EventData) => void;
  onCancel: () => void;
}

export default function EventForm({ initial, onSuccess, onCancel }: EventFormProps) {
  const [form, setForm] = useState<EventData>(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (k: keyof EventData, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (val: string) => {
    set("title", val);
    if (!initial) set("slug", slugify(val)); // auto-slug on create
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (res.ok) { set("image_url", d.url); toast.success("Image uploaded."); }
      else toast.error(d.error || "Upload failed.");
    } catch { toast.error("Upload error."); }
    finally { setUploading(false); }
  };

  const handleSubmit = async () => {
    if (!form.title || !form.date || !form.type) {
      toast.error("Title, type, and date are required.");
      return;
    }
    setSaving(true);
    try {
      const method = form.id ? "PUT" : "POST";
      const res = await fetch("/api/events", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success(form.id ? "Event updated." : "Event created.");
        onSuccess(json.event);
      } else {
        toast.error(json.error || "Save failed.");
      }
    } catch {
      toast.error("Connection error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-[#E8E8E8] p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F5F5F5]">
        <h2 className="font-semibold text-black">{form.id ? "Edit Event" : "Create New Event"}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-black transition-colors">
          <X size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* Title */}
        <div className="sm:col-span-2">
          <label className="label-dhi">Event Title *</label>
          <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
            className="input-dhi" placeholder="e.g. Introduction to Home Budgeting" />
        </div>

        {/* Slug */}
        <div className="sm:col-span-2">
          <label className="label-dhi">Slug (URL) *</label>
          <div className="flex items-center gap-0">
            <span className="bg-[#F5F5F5] border border-r-0 border-[#E8E8E8] px-3 py-2.5 text-xs text-gray-400 whitespace-nowrap">
              /events/
            </span>
            <input value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))}
              className="input-dhi flex-1 rounded-none" placeholder="auto-generated from title" />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Lowercase letters, numbers, and hyphens only. Must be unique.</p>
        </div>

        {/* Type */}
        <div>
          <label className="label-dhi">Event Type *</label>
          <select value={form.type} onChange={(e) => set("type", e.target.value)} className="input-dhi">
            {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="label-dhi">Status *</label>
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className="input-dhi">
            {EVENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Date */}
        <div>
          <label className="label-dhi">Date *</label>
          <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="input-dhi" />
        </div>

        {/* Time */}
        <div>
          <label className="label-dhi">Time</label>
          <input value={form.time} onChange={(e) => set("time", e.target.value)}
            className="input-dhi" placeholder="e.g. 10:00 AM – 12:00 PM WAT" />
        </div>

        {/* Location */}
        <div>
          <label className="label-dhi">Location</label>
          <input value={form.location} onChange={(e) => set("location", e.target.value)}
            className="input-dhi" placeholder="e.g. Online (Zoom) or FCT, Nigeria" />
        </div>

        {/* Location URL */}
        <div>
          <label className="label-dhi">Location Link</label>
          <input value={form.location_url} onChange={(e) => set("location_url", e.target.value)}
            className="input-dhi" placeholder="https://maps.google.com/... or Zoom link" />
        </div>

        {/* Registration URL */}
        <div>
          <label className="label-dhi">Registration Link</label>
          <input value={form.registration_url} onChange={(e) => set("registration_url", e.target.value)}
            className="input-dhi" placeholder="https://forms.gle/... or Eventbrite link" />
        </div>

        {/* Registration open */}
        <div>
          <label className="label-dhi">Registration Open?</label>
          <select value={String(form.registration_open)}
            onChange={(e) => set("registration_open", e.target.value === "true")} className="input-dhi">
            <option value="true">Yes — open</option>
            <option value="false">No — closed</option>
          </select>
        </div>

        {/* Cover Image */}
        <div className="sm:col-span-2">
          <label className="label-dhi">Cover Image</label>

          {/* Preview */}
          {form.image_url ? (
            <div className="relative mb-3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.image_url}
                alt="Cover preview"
                className="w-full h-48 object-cover border border-[#E8E8E8]"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => set("image_url", "")}
                  className="opacity-0 group-hover:opacity-100 bg-red-500 text-white text-xs font-semibold px-3 py-1.5 transition-opacity"
                >
                  Remove Image
                </button>
              </div>
            </div>
          ) : (
            /* Upload zone — shown when no image */
            <label className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed cursor-pointer transition-colors mb-3 ${uploading ? "border-[#BF4E14] bg-[#FEF0E7]" : "border-[#E8E8E8] bg-[#FAFAFA] hover:border-[#BF4E14] hover:bg-[#FEF0E7]"}`}>
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} />
              {uploading ? (
                <><RefreshCw size={22} className="text-[#BF4E14] animate-spin mb-2" /><span className="text-sm text-[#BF4E14] font-semibold">Uploading…</span></>
              ) : (
                <><ImagePlus size={22} className="text-gray-300 mb-2" /><span className="text-sm text-gray-400 font-medium">Click to upload cover image</span><span className="text-xs text-gray-300 mt-1">JPG, PNG, WebP — recommended 1200×630px</span></>
              )}
            </label>
          )}

          {/* URL input — always visible for pasting links */}
          <div className="flex items-center gap-2">
            <input
              value={form.image_url}
              onChange={(e) => set("image_url", e.target.value)}
              className="input-dhi text-sm py-2 flex-1"
              placeholder="Or paste an image URL directly"
            />
            {form.image_url && (
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#BF4E14] font-semibold hover:underline whitespace-nowrap flex-shrink-0">
                <Upload size={12} />
                {uploading ? "Uploading…" : "Replace"}
                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} />
              </label>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="label-dhi">Description</label>
          <textarea value={form.description} rows={4} onChange={(e) => set("description", e.target.value)}
            className="input-dhi resize-y" placeholder="What will attendees learn or experience?" />
        </div>

        {/* Recap (past events) */}
        <div className="sm:col-span-2">
          <label className="label-dhi">
            Event Recap <span className="text-gray-400 font-normal normal-case tracking-normal text-xs">(shown for past events)</span>
          </label>
          <textarea value={form.recap} rows={3} onChange={(e) => set("recap", e.target.value)}
            className="input-dhi resize-y" placeholder="Brief summary of what happened at this event." />
        </div>

      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-8 pt-5 border-t border-[#F5F5F5]">
        <button onClick={handleSubmit} disabled={saving} className="btn-primary">
          {saving
            ? <><RefreshCw size={13} className="animate-spin" /> Saving…</>
            : <><Check size={13} /> {form.id ? "Save Changes" : "Create Event"}</>}
        </button>
        <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
      </div>
    </div>
  );
}