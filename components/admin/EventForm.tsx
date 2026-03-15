"use client";

import { useState } from "react";
import { RefreshCw, Check, X, ImagePlus, Upload } from "lucide-react";
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
    if (!initial) set("slug", slugify(val));
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
      if (res.ok) {
        set("image_url", d.url);
        toast.success("Image uploaded successfully.");
      } else {
        toast.error(d.error || "Upload failed — please try again.");
      }
    } catch {
      toast.error("Upload error — check your connection.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
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
          <div className="flex w-full border border-[#E8E8E8] focus-within:border-[#BF4E14] transition-colors bg-white">
            <span className="bg-[#F5F5F5] px-3 flex items-center text-xs text-gray-400 whitespace-nowrap border-r border-[#E8E8E8] flex-shrink-0">
              /events/
            </span>
            <input
              value={form.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              className="flex-1 px-3 py-2.5 text-sm text-black bg-white outline-none placeholder-gray-300 min-w-0"
              placeholder="auto-generated from title"
            />
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

          {form.image_url ? (
            /* Preview */
            <div className="relative mb-3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.image_url}
                alt="Cover preview"
                className="w-full h-52 object-cover border border-[#E8E8E8]"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3">
                <label className={`opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-white text-black text-xs font-semibold px-3 py-2 flex items-center gap-1.5 hover:bg-[#F5F5F5] ${uploading ? "pointer-events-none" : ""}`}>
                  <Upload size={13} />
                  {uploading ? "Uploading…" : "Replace"}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} />
                </label>
                <button type="button" onClick={() => set("image_url", "")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white text-xs font-semibold px-3 py-2 hover:bg-red-600">
                  Remove
                </button>
              </div>
            </div>
          ) : (
            /* Upload zone */
            <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed cursor-pointer transition-colors mb-3 ${uploading ? "border-[#BF4E14] bg-[#FEF0E7] cursor-wait" : "border-[#E8E8E8] bg-[#FAFAFA] hover:border-[#BF4E14] hover:bg-[#FEF0E7]"}`}>
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleUpload} />
              {uploading ? (
                <>
                  <RefreshCw size={24} className="text-[#BF4E14] animate-spin mb-2" />
                  <span className="text-sm font-semibold text-[#BF4E14]">Uploading…</span>
                </>
              ) : (
                <>
                  <ImagePlus size={24} className="text-gray-300 mb-2" />
                  <span className="text-sm font-medium text-gray-400">Click to upload from your device</span>
                  <span className="text-xs text-gray-300 mt-1">JPG, PNG, WebP · Max 5MB · Recommended 1200×630px</span>
                </>
              )}
            </label>
          )}

          {/* URL paste — always visible */}
          <div className="flex items-center gap-2">
            <input
              value={form.image_url}
              onChange={(e) => set("image_url", e.target.value)}
              className="input-dhi text-sm py-2 flex-1"
              placeholder="Or paste an image URL directly"
            />
            {form.image_url && !uploading && (
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#BF4E14] font-semibold hover:underline whitespace-nowrap flex-shrink-0 px-1">
                <Upload size={12} /> Upload new
                <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              </label>
            )}
          </div>
          <p className="text-[10px] text-gray-400 mt-1">Upload from your device or paste an external image URL.</p>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="label-dhi">Description</label>
          <textarea value={form.description} rows={4} onChange={(e) => set("description", e.target.value)}
            className="input-dhi resize-y" placeholder="What will attendees learn or experience?" />
        </div>

        {/* Recap */}
        <div className="sm:col-span-2">
          <label className="label-dhi">
            Event Recap{" "}
            <span className="text-gray-400 font-normal normal-case tracking-normal text-xs">(shown for past events)</span>
          </label>
          <textarea value={form.recap} rows={3} onChange={(e) => set("recap", e.target.value)}
            className="input-dhi resize-y" placeholder="Brief summary of what happened at this event." />
        </div>

      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-8 pt-5 border-t border-[#F5F5F5]">
        <button onClick={handleSubmit} disabled={saving || uploading} className="btn-primary">
          {saving
            ? <><RefreshCw size={13} className="animate-spin" /> Saving…</>
            : <><Check size={13} /> {form.id ? "Save Changes" : "Create Event"}</>}
        </button>
        <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
        {uploading && (
          <span className="text-xs text-[#BF4E14] flex items-center gap-1.5 ml-2">
            <RefreshCw size={11} className="animate-spin" /> Uploading image…
          </span>
        )}
      </div>
    </div>
  );
}