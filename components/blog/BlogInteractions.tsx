"use client";

import { useState, useEffect, useCallback } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, RefreshCw, CornerDownRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface Comment {
  id: string;
  name: string;
  comment: string;
  parent_id: string | null;
  is_admin_reply: boolean;
  created_at: string;
}

interface ReactionState {
  likes: number;
  dislikes: number;
  myReaction: string | null;
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
  const [commentReactions, setCommentReactions] = useState<Record<string, ReactionState>>({});
  const [loadingComments, setLoadingComments] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchPostReactions = useCallback(async () => {
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
    const visitorId = getVisitorId();
    try {
      const [commentsRes, reactionsRes] = await Promise.all([
        fetch(`/api/blog/comments?post_id=${postId}`),
        fetch(`/api/blog/comment-reactions?post_id=${postId}&visitor_id=${visitorId}`),
      ]);
      const commentsJson = await commentsRes.json();
      const reactionsJson = await reactionsRes.json();
      if (commentsRes.ok) setComments(commentsJson.comments || []);
      if (reactionsRes.ok) setCommentReactions(reactionsJson.reactions || {});
    } catch { /* silent */ } finally {
      setLoadingComments(false);
    }
  }, [postId]);

  useEffect(() => { fetchPostReactions(); fetchComments(); }, [fetchPostReactions, fetchComments]);

  const react = async (reaction: "like" | "dislike") => {
    const visitorId = getVisitorId();
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

  const reactToComment = async (commentId: string, reaction: "like" | "dislike") => {
    const visitorId = getVisitorId();
    const current = commentReactions[commentId] || { likes: 0, dislikes: 0, myReaction: null };
    const prev = { ...current };

    let next = { ...current };
    if (current.myReaction === reaction) {
      next.myReaction = null;
      reaction === "like" ? next.likes-- : next.dislikes--;
    } else {
      if (current.myReaction === "like") next.likes--;
      if (current.myReaction === "dislike") next.dislikes--;
      next.myReaction = reaction;
      reaction === "like" ? next.likes++ : next.dislikes++;
    }
    setCommentReactions((prevState) => ({ ...prevState, [commentId]: next }));

    try {
      const res = await fetch("/api/blog/comment-reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment_id: commentId, visitor_id: visitorId, reaction }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setCommentReactions((prevState) => ({ ...prevState, [commentId]: prev }));
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
        setCommentReactions((prev) => ({ ...prev, [json.comment.id]: { likes: 0, dislikes: 0, myReaction: null } }));
        setCommentText("");
        toast.success("Comment posted.");
      } else toast.error(json.error || "Failed to post comment.");
    } catch {
      toast.error("Connection error.");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReply = async (parentId: string) => {
    if (!replyName.trim() || replyText.trim().length < 2) {
      toast.error("Name and a reply are required.");
      return;
    }
    setSubmittingReply(true);
    try {
      const res = await fetch("/api/blog/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, name: replyName, comment: replyText, parent_id: parentId }),
      });
      const json = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, json.comment]);
        setCommentReactions((prev) => ({ ...prev, [json.comment.id]: { likes: 0, dislikes: 0, myReaction: null } }));
        setReplyText("");
        setReplyName("");
        setReplyTo(null);
        toast.success("Reply posted.");
      } else toast.error(json.error || "Failed to post reply.");
    } catch {
      toast.error("Connection error.");
    } finally {
      setSubmittingReply(false);
    }
  };

  const topLevel = comments.filter((c) => !c.parent_id);
  const repliesOf = (id: string) => comments.filter((c) => c.parent_id === id);

  const CommentReactionButtons = ({ commentId }: { commentId: string }) => {
    const r = commentReactions[commentId] || { likes: 0, dislikes: 0, myReaction: null };
    return (
      <div className="flex items-center gap-3 mt-2">
        <button onClick={() => reactToComment(commentId, "like")}
          className={cn("flex items-center gap-1 text-xs font-semibold transition-colors",
            r.myReaction === "like" ? "text-[#BF4E14]" : "text-gray-400 hover:text-[#BF4E14]")}>
          <ThumbsUp size={12} /> {r.likes}
        </button>
        <button onClick={() => reactToComment(commentId, "dislike")}
          className={cn("flex items-center gap-1 text-xs font-semibold transition-colors",
            r.myReaction === "dislike" ? "text-gray-700" : "text-gray-400 hover:text-gray-700")}>
          <ThumbsDown size={12} /> {r.dislikes}
        </button>
        <button onClick={() => setReplyTo(replyTo === commentId ? null : commentId)}
          className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#BF4E14] transition-colors">
          <CornerDownRight size={12} /> Reply
        </button>
      </div>
    );
  };

  return (
    <div>
      {/* Post-level Like / Dislike */}
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

        {/* New top-level comment form */}
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

        {loadingComments ? (
          <div className="flex items-center gap-2 py-6 text-sm text-gray-400">
            <RefreshCw size={14} className="animate-spin" /> Loading comments…
          </div>
        ) : topLevel.length === 0 ? (
          <p className="text-sm text-gray-400 py-4">No comments yet. Be the first to share your thoughts.</p>
        ) : (
          <div className="space-y-6">
            {topLevel.map((c) => (
              <div key={c.id} className="border-l-2 border-[#E8E8E8] pl-4 py-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-black">{c.name}</span>
                  {c.is_admin_reply && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-orange-50 text-[#BF4E14] border border-orange-200">
                      <ShieldCheck size={10} /> Admin
                    </span>
                  )}
                  <span className="text-xs text-gray-400">{formatDate(c.created_at)}</span>
                </div>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{c.comment}</p>
                <CommentReactionButtons commentId={c.id} />

                {/* Reply form */}
                {replyTo === c.id && (
                  <div className="mt-3 bg-[#FAFAFA] border border-[#E8E8E8] p-4">
                    <input value={replyName} onChange={(e) => setReplyName(e.target.value)}
                      className="input-dhi text-sm py-2 mb-2" placeholder="Your name *" />
                    <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={2}
                      className="input-dhi resize-y text-sm mb-2" placeholder={`Reply to ${c.name}…`} />
                    <div className="flex items-center gap-2">
                      <button onClick={() => submitReply(c.id)} disabled={submittingReply} className="btn-primary text-xs px-3 py-2">
                        {submittingReply ? "Posting…" : "Post Reply"}
                      </button>
                      <button onClick={() => { setReplyTo(null); setReplyText(""); }} className="text-xs text-gray-400 hover:text-black">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested replies */}
                {repliesOf(c.id).length > 0 && (
                  <div className="mt-4 ml-2 space-y-4">
                    {repliesOf(c.id).map((r) => (
                      <div key={r.id} className="border-l-2 border-[#F5F5F5] pl-4">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-sm font-semibold text-black">{r.name}</span>
                          {r.is_admin_reply && (
                            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-orange-50 text-[#BF4E14] border border-orange-200">
                              <ShieldCheck size={10} /> Admin
                            </span>
                          )}
                          <span className="text-xs text-gray-400">{formatDate(r.created_at)}</span>
                        </div>
                        <p className="text-sm text-[#4A4A4A] leading-relaxed">{r.comment}</p>
                        <CommentReactionButtons commentId={r.id} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}