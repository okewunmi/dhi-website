"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, RefreshCw, Calendar, MapPin, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import EventForm, { EventData } from "./EventForm";

const TYPE_COLORS: Record<string, string> = {
  Workshop: "bg-orange-50 text-[#BF4E14] border-orange-200",
  Webinar: "bg-blue-50 text-blue-700 border-blue-200",
  "Community Session": "bg-green-50 text-green-700 border-green-200",
  Training: "bg-purple-50 text-purple-700 border-purple-200",
  Conference: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Other: "bg-gray-50 text-gray-600 border-gray-200",
};

const STATUS_COLORS: Record<string, string> = {
  upcoming: "text-green-600 bg-green-50",
  past: "text-gray-500 bg-gray-100",
  cancelled: "text-red-500 bg-red-50",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminEventsClient() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editing, setEditing] = useState<EventData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "upcoming" | "past" | "cancelled">("all");

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/events");
      const json = await res.json();
      if (res.ok) setEvents(json.events || []);
      else toast.error("Failed to load events.");
    } catch {
      toast.error("Connection error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleSuccess = (event: EventData) => {
    if (view === "create") {
      setEvents((prev) => [event, ...prev]);
    } else {
      setEvents((prev) => prev.map((e) => e.id === event.id ? event : e));
    }
    setView("list");
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch("/api/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        toast.success("Event deleted.");
      } else {
        toast.error("Failed to delete event.");
      }
    } catch {
      toast.error("Connection error.");
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  };

  const filtered = events.filter((e) =>
    filterStatus === "all" ? true : e.status === filterStatus
  );

  // ── Create / Edit form ──────────────────────────────────────
  if (view === "create" || view === "edit") {
    return (
      <EventForm
        initial={editing || undefined}
        onSuccess={handleSuccess}
        onCancel={() => { setView("list"); setEditing(null); }}
      />
    );
  }

  // ── List view ───────────────────────────────────────────────
  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        {/* Status filter pills */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "upcoming", "past", "cancelled"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 border rounded-full capitalize transition-all",
                filterStatus === s
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-500 border-[#E8E8E8] hover:border-black"
              )}>
              {s === "all" ? `All (${events.length})` : `${s} (${events.filter(e => e.status === s).length})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={fetchEvents}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#BF4E14] transition-colors">
            <RefreshCw size={12} /> Refresh
          </button>
          <button onClick={() => { setEditing(null); setView("create"); }} className="btn-primary text-sm">
            <Plus size={14} /> New Event
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 py-12 text-sm text-gray-400">
          <RefreshCw size={14} className="animate-spin" /> Loading events…
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 border border-dashed border-[#E8E8E8]">
          <Calendar size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-400 mb-1">
            {events.length === 0 ? "No events yet" : "No events match this filter"}
          </p>
          {events.length === 0 && (
            <button onClick={() => setView("create")} className="btn-primary text-sm mt-4">
              <Plus size={14} /> Create your first event
            </button>
          )}
        </div>
      )}

      {/* Events list */}
      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((event) => (
            <div key={event.id}
              className="bg-white border border-[#E8E8E8] hover:border-gray-300 transition-colors p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 border rounded-full",
                      TYPE_COLORS[event.type] || TYPE_COLORS.Other)}>
                      {event.type}
                    </span>
                    <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full capitalize",
                      STATUS_COLORS[event.status] || STATUS_COLORS.past)}>
                      {event.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-black text-sm sm:text-base leading-snug mb-2">
                    {event.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={11} className="text-[#BF4E14]" />
                      {formatDate(event.date)}
                    </span>
                    {event.time && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={11} className="text-[#BF4E14]" /> {event.time}
                      </span>
                    )}
                    {event.location && (
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin size={11} className="text-[#BF4E14]" /> {event.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => { setEditing(event); setView("edit"); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#BF4E14] hover:underline px-3 py-1.5 border border-[#BF4E14] hover:bg-[#FEF0E7] transition-colors">
                    <Edit2 size={12} /> Edit
                  </button>

                  {deleteConfirm === event.id ? (
                    <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-1.5">
                      <AlertTriangle size={12} className="text-red-500" />
                      <span className="text-xs text-red-600 font-semibold">Delete?</span>
                      <button onClick={() => handleDelete(event.id!)}
                        disabled={deleting === event.id}
                        className="text-xs text-red-600 font-bold hover:underline ml-1">
                        {deleting === event.id ? "…" : "Yes"}
                      </button>
                      <button onClick={() => setDeleteConfirm(null)}
                        className="text-xs text-gray-400 hover:text-black">
                        No
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(event.id!)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors px-2 py-1.5">
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}