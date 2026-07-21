"use client";

import { useState, useEffect, useCallback } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Comment {
  id: string;
  name: string;
  comment: string;
  created_at: string;
}

function getVisitorId(): string {
  const KEY = "dhi_visitor_id";
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function BlogInteractions({ postId }: { postId: string }) {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchReactions = useCallback(async () => {
    const visitorId = getVisitorId();
    try {
      const res = await fetch(`/api/blog/reactions?post_id=${postId}&visitor_id=${visitorId}`);
      const json = await res.json();
      if (res.ok) {
        setLikes(json.likes);
        setDislikes(json.dislikes);
        setMyReaction(json.myReaction);
      }
    } catch { /* silent */ }
  }, [postId]);

  const fetchComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/blog/comments?post_id=${postId}`);
      const json = await res.json();
      if (res.ok) setComments(json.comments || []);
    } catch { /* silent */ } finally {
      setLoadingComments(false);
    }
  }, [postId]);

  useEffect(() => { fetchReactions(); fetchComments(); }, [fetchReactions, fetchComments]);

  const react = async (reaction: "like" | "dislike") => {
    const visitorId = getVisitorId();
    // optimistic update
    const prevLikes = likes, prevDislikes = dislikes, prevMine = myReaction;
    if (myReaction === reaction) {
      setMyReaction(null);
      reaction === "like" ? setLikes((l) => l - 1) : setDislikes((d) => d - 1);
    } else {
      if (myReaction === "like") setLikes((l) => l - 1);
      if (myReaction === "dislike") setDislikes((d) => d - 1);
      setMyReaction(reaction);
      reaction === "like" ? setLikes((l) => l + 1) : setDislikes((d) => d + 1);
    }
    try {
      const res = await fetch("/api/blog/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, visitor_id: visitorId, reaction }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setLikes(prevLikes); setDislikes(prevDislikes); setMyReaction(prevMine);
      toast.error("Failed to update reaction.");
    }
  };

  const submitComment = async () => {
    if (!name.trim() || commentText.trim().length < 2) {
      toast.error("Name and a comment are required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, name, email, comment: commentText }),
      });
      const json = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, json.comment]);
        setCommentText("");
        toast.success("Comment posted.");
      } else toast.error(json.error || "Failed to post comment.");
    } catch {
      toast.error("Connection error.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Like / Dislike */}
      <div className="flex items-center gap-3 py-6 border-t border-b border-[#E8E8E8] mb-10">
        <button onClick={() => react("like")}
          className={cn("flex items-center gap-2 px-4 py-2 border text-sm font-semibold transition-colors",
            myReaction === "like" ? "bg-[#BF4E14] text-white border-[#BF4E14]" : "border-[#E8E8E8] text-gray-600 hover:border-[#BF4E14] hover:text-[#BF4E14]")}>
          <ThumbsUp size={15} /> {likes}
        </button>
        <button onClick={() => react("dislike")}
          className={cn("flex items-center gap-2 px-4 py-2 border text-sm font-semibold transition-colors",
            myReaction === "dislike" ? "bg-gray-700 text-white border-gray-700" : "border-[#E8E8E8] text-gray-600 hover:border-gray-500")}>
          <ThumbsDown size={15} /> {dislikes}
        </button>
      </div>

      {/* Comments */}
      <div>
        <h2 className="font-display text-2xl font-light text-black mb-6 flex items-center gap-2">
          <MessageCircle size={20} className="text-[#BF4E14]" /> Comments ({comments.length})
        </h2>

        {/* Comment form */}
        <div className="bg-[#FAFAFA] border border-[#E8E8E8] p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input value={name} onChange={(e) => setName(e.target.value)} className="input-dhi" placeholder="Your name *" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="input-dhi" placeholder="Email (optional, not shown publicly)" />
          </div>
          <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={3}
            className="input-dhi resize-y mb-3" placeholder="Add a comment…" />
          <button onClick={submitComment} disabled={submitting} className="btn-primary text-sm">
            {submitting ? <><RefreshCw size={13} className="animate-spin" /> Posting…</> : "Post Comment"}
          </button>
        </div>

        {/* Comment list */}
        {loadingComments ? (
          <div className="flex items-center gap-2 py-6 text-sm text-gray-400">
            <RefreshCw size={14} className="animate-spin" /> Loading comments…
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">No comments yet. Be the first to share your thoughts.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="border-l-2 border-[#E8E8E8] pl-4 py-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-black">{c.name}</span>
                  <span className="text-xs text-gray-400">{formatDate(c.created_at)}</span>
                </div>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{c.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}