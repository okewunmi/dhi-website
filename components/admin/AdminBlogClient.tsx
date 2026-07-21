"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, RefreshCw, Calendar, AlertTriangle, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import BlogPostForm, { BlogPostData } from "./BlogPostForm";

const STATUS_COLORS: Record<string, string> = {
  draft: "text-gray-500 bg-gray-100",
  published: "text-green-600 bg-green-50",
  archived: "text-red-500 bg-red-50",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminBlogClient() {
  const [posts, setPosts] = useState<BlogPostData[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editing, setEditing] = useState<BlogPostData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "published" | "archived">("all");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      const json = await res.json();
      if (res.ok) setPosts(json.posts || []);
      else toast.error("Failed to load posts.");
    } catch {
      toast.error("Connection error.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleSuccess = (post: BlogPostData) => {
    if (view === "create") setPosts((prev) => [post, ...prev]);
    else setPosts((prev) => prev.map((p) => p.id === post.id ? post : p));
    setView("list");
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        toast.success("Post deleted.");
      } else toast.error("Failed to delete post.");
    } catch {
      toast.error("Connection error.");
    } finally {
      setDeleting(null);
      setDeleteConfirm(null);
    }
  };

  const filtered = posts.filter((p) => filterStatus === "all" ? true : p.status === filterStatus);

  if (view === "create" || view === "edit") {
    return (
      <BlogPostForm
        initial={editing || undefined}
        onSuccess={handleSuccess}
        onCancel={() => { setView("list"); setEditing(null); }}
      />
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {(["all", "draft", "published", "archived"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn(
                "text-xs font-semibold px-3 py-1.5 border rounded-full capitalize transition-all",
                filterStatus === s ? "bg-black text-white border-black" : "bg-white text-gray-500 border-[#E8E8E8] hover:border-black"
              )}>
              {s === "all" ? `All (${posts.length})` : `${s} (${posts.filter(p => p.status === s).length})`}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchPosts} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#BF4E14] transition-colors">
            <RefreshCw size={12} /> Refresh
          </button>
          <button onClick={() => { setEditing(null); setView("create"); }} className="btn-primary text-sm">
            <Plus size={14} /> New Post
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-2 py-12 text-sm text-gray-400">
          <RefreshCw size={14} className="animate-spin" /> Loading posts…
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 border border-dashed border-[#E8E8E8]">
          <p className="text-sm font-semibold text-gray-400 mb-1">
            {posts.length === 0 ? "No posts yet" : "No posts match this filter"}
          </p>
          {posts.length === 0 && (
            <button onClick={() => setView("create")} className="btn-primary text-sm mt-4">
              <Plus size={14} /> Write your first post
            </button>
          )}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-3">
          {filtered.map((post) => (
            <div key={post.id} className="bg-white border border-[#E8E8E8] hover:border-gray-300 transition-colors p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full capitalize", STATUS_COLORS[post.status])}>
                      {post.status}
                    </span>
                    {(post.tags || []).slice(0, 3).map((t) => (
                      <span key={t} className="text-[10px] text-gray-400 px-2 py-0.5 border border-gray-200 rounded-full">{t}</span>
                    ))}
                  </div>
                  <h3 className="font-semibold text-black text-sm sm:text-base leading-snug mb-2">{post.title}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar size={11} className="text-[#BF4E14]" /> {formatDate(post.published_at)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye size={11} className="text-[#BF4E14]" /> {post.view_count ?? 0} views
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => { setEditing(post); setView("edit"); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#BF4E14] hover:underline px-3 py-1.5 border border-[#BF4E14] hover:bg-[#FEF0E7] transition-colors">
                    <Edit2 size={12} /> Edit
                  </button>
                  {deleteConfirm === post.id ? (
                    <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-1.5">
                      <AlertTriangle size={12} className="text-red-500" />
                      <span className="text-xs text-red-600 font-semibold">Delete?</span>
                      <button onClick={() => handleDelete(post.id!)} disabled={deleting === post.id}
                        className="text-xs text-red-600 font-bold hover:underline ml-1">
                        {deleting === post.id ? "…" : "Yes"}
                      </button>
                      <button onClick={() => setDeleteConfirm(null)} className="text-xs text-gray-400 hover:text-black">No</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(post.id!)}
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