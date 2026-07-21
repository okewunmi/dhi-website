"use client";

import { useState } from "react";
import { RefreshCw, Check, X, ImagePlus, Upload, Plus as PlusIcon } from "lucide-react";
import toast from "react-hot-toast";

export interface BlogPostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  images: string[];
  tags: string[];
  author: string;
  status: string;
  published_at: string | null;
  view_count?: number;
}

const EMPTY: BlogPostData = {
  title: "", slug: "", excerpt: "", content: "",
  cover_image_url: "", images: [], tags: [],
  author: "Da Hausa Initiative", status: "draft", published_at: null,
};

const STATUSES = ["draft", "published", "archived"];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

interface Props {
  initial?: BlogPostData;
  onSuccess: (post: BlogPostData) => void;
  onCancel: () => void;
}

export default function BlogPostForm({ initial, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<BlogPostData>(initial || EMPTY);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const set = (k: keyof BlogPostData, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  const handleTitleChange = (val: string) => {
    set("title", val);
    if (!initial) set("slug", slugify(val));
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const d = await res.json();
    if (res.ok) return d.url;
    toast.error(d.error || "Upload failed.");
    return null;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadFile(file);
    if (url) { set("cover_image_url", url); toast.success("Cover image uploaded."); }
    setUploading(false);
    e.target.value = "";
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploadingGallery(true);
    const urls: string[] = [];
    for (const file of files) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    if (urls.length) {
      set("images", [...form.images, ...urls]);
      toast.success(`${urls.length} image(s) added.`);
    }
    setUploadingGallery(false);
    e.target.value = "";
  };

  const removeGalleryImage = (idx: number) => {
    set("images", form.images.filter((_, i) => i !== idx));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  };

  const removeTag = (t: string) => set("tags", form.tags.filter((x) => x !== t));

  const handleSubmit = async () => {
    if (!form.title || !form.content) {
      toast.error("Title and content are required.");
      return;
    }
    setSaving(true);
    try {
      const method = form.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success(form.id ? "Post updated." : "Post created.");
        onSuccess(json.post);
      } else toast.error(json.error || "Save failed.");
    } catch {
      toast.error("Connection error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-[#E8E8E8] p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F5F5F5]">
        <h2 className="font-semibold text-black">{form.id ? "Edit Post" : "New Blog Post"}</h2>
        <button onClick={onCancel} className="text-gray-400 hover:text-black transition-colors"><X size={18} /></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <label className="label-dhi">Title *</label>
          <input value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
            className="input-dhi" placeholder="e.g. 5 Tips for Better Budgeting" />
        </div>

        <div className="sm:col-span-2">
          <label className="label-dhi">Slug (URL) *</label>
          <div className="flex w-full border border-[#E8E8E8] focus-within:border-[#BF4E14] transition-colors bg-white">
            <span className="bg-[#F5F5F5] px-3 flex items-center text-xs text-gray-400 whitespace-nowrap border-r border-[#E8E8E8] flex-shrink-0">/blog/</span>
            <input value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))}
              className="flex-1 px-3 py-2.5 text-sm text-black bg-white outline-none placeholder-gray-300 min-w-0" placeholder="auto-generated from title" />
          </div>
        </div>

        <div>
          <label className="label-dhi">Status *</label>
          <select value={form.status} onChange={(e) => set("status", e.target.value)} className="input-dhi">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="label-dhi">Author</label>
          <input value={form.author} onChange={(e) => set("author", e.target.value)} className="input-dhi" />
        </div>

        <div className="sm:col-span-2">
          <label className="label-dhi">Excerpt</label>
          <textarea value={form.excerpt} rows={2} onChange={(e) => set("excerpt", e.target.value)}
            className="input-dhi resize-y" placeholder="Short summary shown on the blog list page" />
        </div>

        {/* Cover image */}
        <div className="sm:col-span-2">
          <label className="label-dhi">Cover Image</label>
          {form.cover_image_url ? (
            <div className="relative mb-3 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.cover_image_url} alt="Cover preview" className="w-full h-52 object-cover border border-[#E8E8E8]" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3">
                <label className={`opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-white text-black text-xs font-semibold px-3 py-2 flex items-center gap-1.5 hover:bg-[#F5F5F5] ${uploading ? "pointer-events-none" : ""}`}>
                  <Upload size={13} /> {uploading ? "Uploading…" : "Replace"}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleCoverUpload} />
                </label>
                <button type="button" onClick={() => set("cover_image_url", "")}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white text-xs font-semibold px-3 py-2 hover:bg-red-600">
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed cursor-pointer transition-colors mb-3 ${uploading ? "border-[#BF4E14] bg-[#FEF0E7] cursor-wait" : "border-[#E8E8E8] bg-[#FAFAFA] hover:border-[#BF4E14] hover:bg-[#FEF0E7]"}`}>
              <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleCoverUpload} />
              {uploading ? (
                <><RefreshCw size={24} className="text-[#BF4E14] animate-spin mb-2" /><span className="text-sm font-semibold text-[#BF4E14]">Uploading…</span></>
              ) : (
                <><ImagePlus size={24} className="text-gray-300 mb-2" /><span className="text-sm font-medium text-gray-400">Click to upload cover image</span></>
              )}
            </label>
          )}
        </div>

        {/* Gallery images */}
        <div className="sm:col-span-2">
          <label className="label-dhi">Additional Images</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {form.images.map((url, i) => (
              <div key={i} className="relative w-24 h-24 group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover border border-[#E8E8E8]" />
                <button type="button" onClick={() => removeGalleryImage(i)}
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  <X size={11} />
                </button>
              </div>
            ))}
            <label className={`w-24 h-24 border-2 border-dashed flex items-center justify-center cursor-pointer transition-colors ${uploadingGallery ? "border-[#BF4E14] cursor-wait" : "border-[#E8E8E8] hover:border-[#BF4E14]"}`}>
              <input type="file" accept="image/*" multiple className="hidden" disabled={uploadingGallery} onChange={handleGalleryUpload} />
              {uploadingGallery ? <RefreshCw size={16} className="text-[#BF4E14] animate-spin" /> : <PlusIcon size={16} className="text-gray-300" />}
            </label>
          </div>
        </div>

        {/* Tags */}
        <div className="sm:col-span-2">
          <label className="label-dhi">Tags</label>
          <div className="flex gap-2 mb-2">
            <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
              className="input-dhi flex-1" placeholder="Type a tag and press Enter" />
            <button type="button" onClick={addTag} className="btn-secondary text-sm px-4">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.tags.map((t) => (
              <span key={t} className="flex items-center gap-1 text-xs bg-[#F5F5F5] text-gray-700 px-2.5 py-1 rounded-full">
                {t}
                <button type="button" onClick={() => removeTag(t)} className="text-gray-400 hover:text-red-500"><X size={11} /></button>
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="sm:col-span-2">
          <label className="label-dhi">Content *</label>
          <textarea value={form.content} rows={12} onChange={(e) => set("content", e.target.value)}
            className="input-dhi resize-y font-mono text-sm" placeholder="Write the post body here. Use blank lines to separate paragraphs." />
          <p className="text-[10px] text-gray-400 mt-1">Plain text/paragraphs supported now — Markdown rendering can be added later if needed.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-8 pt-5 border-t border-[#F5F5F5]">
        <button onClick={handleSubmit} disabled={saving || uploading || uploadingGallery} className="btn-primary">
          {saving ? <><RefreshCw size={13} className="animate-spin" /> Saving…</> : <><Check size={13} /> {form.id ? "Save Changes" : "Create Post"}</>}
        </button>
        <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
      </div>
    </div>
  );
}