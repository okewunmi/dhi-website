"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Trash2, Mail, MailOpen, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  submitted_at: string;
  is_read: boolean;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminMessagesClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      const json = await res.json();
      if (res.ok) setMessages(json.messages || []);
      else toast.error("Failed to load messages.");
    } catch {
      toast.error("Connection error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const toggleRead = async (msg: Message) => {
    const newValue = !msg.is_read;
    setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: newValue } : m));
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: msg.id, is_read: newValue }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("Failed to update.");
      setMessages((prev) => prev.map((m) => m.id === msg.id ? { ...m, is_read: msg.is_read } : m));
    }
  };

  const handleOpen = (msg: Message) => {
    setExpanded(expanded === msg.id ? null : msg.id);
    if (!msg.is_read) toggleRead(msg);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        toast.success("Message deleted.");
      } else {
        toast.error("Failed to delete.");
      }
    } catch {
      toast.error("Connection error.");
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  };

  const filtered = messages.filter((m) =>
    filter === "all" ? true : filter === "unread" ? !m.is_read : m.is_read
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {(["all", "unread", "read"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 border rounded-full capitalize transition-all",
                filter === f ? "bg-black text-white border-black" : "bg-white text-gray-500 border-[#E8E8E8] hover:border-black"
              )}>
              {f === "all" ? `All (${messages.length})` :
               f === "unread" ? `Unread (${messages.filter(m => !m.is_read).length})` :
               `Read (${messages.filter(m => m.is_read).length})`}
            </button>
          ))}
        </div>
        <button onClick={fetchMessages} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#BF4E14] transition-colors">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-12 text-sm text-gray-400">
          <RefreshCw size={14} className="animate-spin" /> Loading messages…
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 border border-dashed border-[#E8E8E8]">
          <Mail size={32} className="text-gray-200 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-400">No messages here.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div key={msg.id} className={cn("bg-white border transition-colors p-4 sm:p-5", !msg.is_read ? "border-[#BF4E14]" : "border-[#E8E8E8]")}>
              <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => handleOpen(msg)}>
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {msg.is_read ? <MailOpen size={16} className="text-gray-300 mt-0.5 flex-shrink-0" /> : <Mail size={16} className="text-[#BF4E14] mt-0.5 flex-shrink-0" />}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={cn("text-sm", !msg.is_read ? "font-bold text-black" : "font-medium text-gray-700")}>{msg.name}</p>
                      <span className="text-xs text-gray-400">{msg.email}</span>
                    </div>
                    {msg.subject && <p className="text-sm text-gray-600 mt-1">{msg.subject}</p>}
                    {expanded === msg.id && (
                      <p className="text-sm text-gray-500 mt-2 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0 whitespace-nowrap">{formatDate(msg.submitted_at)}</span>
              </div>

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#F5F5F5]" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => toggleRead(msg)} className="text-xs font-semibold text-gray-500 hover:text-[#BF4E14]">
                  Mark as {msg.is_read ? "unread" : "read"}
                </button>
                {deleteConfirm === msg.id ? (
                  <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-2 py-1 ml-auto">
                    <AlertTriangle size={11} className="text-red-500" />
                    <button onClick={() => handleDelete(msg.id)} disabled={deleting === msg.id} className="text-xs text-red-600 font-bold hover:underline">
                      {deleting === msg.id ? "…" : "Confirm"}
                    </button>
                    <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-400">No</button>
                  </div>
                ) : (
                  <button onClick={() => setDeleteConfirm(msg.id)} className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 ml-auto">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}