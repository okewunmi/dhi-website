// "use client";

// import { useState, useEffect, useCallback } from "react";
// import {
//   Save, Upload, ChevronDown, ChevronUp, Plus, Trash2,
//   Edit2, X, RefreshCw, Eye, Check
// } from "lucide-react";
// import toast from "react-hot-toast";

// interface CmsEditorClientProps {
//   page: string;
//   sections: Record<string, string>;
// }

// // ─── Field renderer ───────────────────────────────────────────
// function FieldEditor({
//   fieldKey,
//   value,
//   onChange,
// }: {
//   fieldKey: string;
//   value: unknown;
//   onChange: (val: unknown) => void;
// }) {
//   const [uploading, setUploading] = useState(false);

//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUploading(true);
//     try {
//       const fd = new FormData();
//       fd.append("file", file);
//       const res = await fetch("/api/upload", { method: "POST", body: fd });
//       const d = await res.json();
//       if (res.ok) { onChange(d.url); toast.success("Image uploaded."); }
//       else toast.error(d.error || "Upload failed.");
//     } catch { toast.error("Upload error."); }
//     finally { setUploading(false); }
//   };

//   // Array of objects
//   if (Array.isArray(value)) {
//     const arr = value as Record<string, unknown>[];
//     return (
//       <div className="space-y-3">
//         {arr.map((item, i) => (
//           <div key={i} className="border border-[#E8E8E8] bg-[#FAFAFA] p-4">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-xs font-bold text-[#BF4E14] uppercase tracking-wide">Item {i + 1}</span>
//               <button
//                 type="button"
//                 onClick={() => { const a = [...arr]; a.splice(i, 1); onChange(a); }}
//                 className="p-1 text-red-400 hover:text-red-600"
//                 title="Delete item"
//               >
//                 <Trash2 size={14} />
//               </button>
//             </div>
//             <div className="space-y-3">
//               {Object.entries(item).map(([k, v]) => (
//                 <div key={k}>
//                   <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
//                     {k.replace(/_/g, " ")}
//                   </label>
//                   {typeof v === "boolean" ? (
//                     <select
//                       value={String(v)}
//                       onChange={(e) => {
//                         const a = [...arr];
//                         a[i] = { ...a[i], [k]: e.target.value === "true" };
//                         onChange(a);
//                       }}
//                       className="input-dhi text-sm py-2"
//                     >
//                       <option value="true">Yes / Show</option>
//                       <option value="false">No / Hide</option>
//                     </select>
//                   ) : typeof v === "string" && (v.length > 80 || k === "description" || k === "body") ? (
//                     <textarea
//                       value={v}
//                       rows={3}
//                       onChange={(e) => {
//                         const a = [...arr];
//                         a[i] = { ...a[i], [k]: e.target.value };
//                         onChange(a);
//                       }}
//                       className="input-dhi text-sm py-2 resize-none"
//                     />
//                   ) : (
//                     <input
//                       value={String(v ?? "")}
//                       onChange={(e) => {
//                         const a = [...arr];
//                         a[i] = { ...a[i], [k]: e.target.value };
//                         onChange(a);
//                       }}
//                       className="input-dhi text-sm py-2"
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={() => {
//             const template = arr[0] || {};
//             const newItem = Object.fromEntries(
//               Object.keys(template).map((k) => [k, typeof template[k] === "boolean" ? false : ""])
//             );
//             onChange([...arr, newItem]);
//           }}
//           className="flex items-center gap-2 text-sm text-[#BF4E14] font-semibold hover:underline"
//         >
//           <Plus size={14} /> Add Item
//         </button>
//       </div>
//     );
//   }

//   // Image field
//   if (fieldKey.includes("image_url") || fieldKey.includes("_image")) {
//     const imgStr = typeof value === "string" ? value : "";
//     return (
//       <div className="space-y-2">
//         <input
//           type="text"
//           value={imgStr}
//           onChange={(e) => onChange(e.target.value)}
//           className="input-dhi text-sm py-2"
//           placeholder="Paste image URL or upload below"
//         />
//         <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#BF4E14] font-semibold hover:underline">
//           <Upload size={12} />
//           {uploading ? "Uploading..." : "Upload Image"}
//           <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleImageUpload} />
//         </label>
//         {imgStr && (
//           // eslint-disable-next-line @next/next/no-img-element
//           <img src={imgStr} alt="Preview" className="h-24 object-cover border border-[#E8E8E8]"
//             onError={(e) => { e.currentTarget.style.display = "none"; }} />
//         )}
//       </div>
//     );
//   }

//   // Boolean
//   if (typeof value === "boolean") {
//     return (
//       <select value={String(value)} onChange={(e) => onChange(e.target.value === "true")} className="input-dhi text-sm py-2">
//         <option value="true">Yes / Show</option>
//         <option value="false">No / Hide</option>
//       </select>
//     );
//   }

//   // Long text
//   if (typeof value === "string" && (value.length > 80 || ["body", "description", "subheadline"].includes(fieldKey))) {
//     return (
//       <textarea value={value} rows={4} onChange={(e) => onChange(e.target.value)}
//         className="input-dhi text-sm py-2 resize-y" />
//     );
//   }

//   // Short text
//   return (
//     <input type="text" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}
//       className="input-dhi text-sm py-2" />
//   );
// }

// // ─── Value preview (read mode) ────────────────────────────────
// function ValuePreview({ value }: { value: unknown }) {
//   if (value === null || value === undefined || value === "") {
//     return <span className="text-gray-300 italic text-xs">Empty</span>;
//   }
//   if (typeof value === "boolean") {
//     return (
//       <span className={`text-xs font-semibold ${value ? "text-green-600" : "text-red-500"}`}>
//         {value ? "Yes" : "No"}
//       </span>
//     );
//   }
//   if (Array.isArray(value)) {
//     return (
//       <span className="text-xs text-gray-500">
//         {value.length} item{value.length !== 1 ? "s" : ""}
//         <span className="ml-2 text-gray-400">
//           {(value as Record<string, unknown>[]).slice(0, 3).map((item, i) => (
//             <span key={i} className="inline-block bg-[#F5F5F5] border border-[#E8E8E8] text-[10px] px-1.5 py-0.5 mr-1">
//               {String(item.title || item.name || `Item ${i + 1}`).slice(0, 25)}
//             </span>
//           ))}
//           {value.length > 3 && <span className="text-gray-400 text-[10px]">+{value.length - 3} more</span>}
//         </span>
//       </span>
//     );
//   }
//   if (typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://")) && value.match(/\.(jpg|jpeg|png|webp|gif)/i)) {
//     return (
//       // eslint-disable-next-line @next/next/no-img-element
//       <img src={value} alt="" className="h-12 object-cover border border-[#E8E8E8]"
//         onError={(e) => { e.currentTarget.style.display = "none"; }} />
//     );
//   }
//   const str = String(value);
//   return (
//     <span className="text-sm text-black">{str.length > 120 ? str.slice(0, 120) + "…" : str}</span>
//   );
// }

// // ─── Section editor ───────────────────────────────────────────
// function SectionEditor({
//   page,
//   sectionKey,
//   sectionLabel,
// }: {
//   page: string;
//   sectionKey: string;
//   sectionLabel: string;
// }) {
//   const [savedData, setSavedData] = useState<Record<string, unknown> | null>(null);
//   const [draftData, setDraftData] = useState<Record<string, unknown>>({});
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [loadError, setLoadError] = useState(false);

//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     setLoadError(false);
//     try {
//       const res = await fetch(`/api/cms?page=${page}&section=${sectionKey}`);
//       const json = await res.json();
//       if (res.ok && json.content) {
//         setSavedData(json.content);
//         setDraftData(json.content);
//       } else {
//         setSavedData({});
//         setDraftData({});
//       }
//     } catch {
//       setLoadError(true);
//     } finally {
//       setLoading(false);
//     }
//   }, [page, sectionKey]);

//   // Fetch when section is first expanded
//   useEffect(() => {
//     if (open && savedData === null) fetchData();
//   }, [open, savedData, fetchData]);

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const res = await fetch("/api/cms", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ page, section: sectionKey, content: draftData }),
//       });
//       if (res.ok) {
//         setSavedData({ ...draftData });
//         setEditing(false);
//         toast.success(`"${sectionLabel}" saved successfully.`);
//       } else {
//         const d = await res.json();
//         toast.error(d.error || "Save failed.");
//       }
//     } catch {
//       toast.error("Save failed — check your connection.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCancel = () => {
//     setDraftData(savedData || {});
//     setEditing(false);
//   };

//   const fieldCount = savedData ? Object.keys(savedData).length : 0;
//   const hasContent = savedData && Object.keys(savedData).length > 0;

//   return (
//     <div className="bg-white border border-[#E8E8E8] overflow-hidden">
//       {/* Section header */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FAFAFA] transition-colors text-left"
//       >
//         <div className="flex items-center gap-3">
//           <div className={`w-2 h-2 rounded-full flex-shrink-0 ${hasContent ? "bg-[#BF4E14]" : "bg-gray-300"}`} />
//           <div>
//             <span className="font-semibold text-black text-sm">{sectionLabel}</span>
//             <span className="text-xs text-gray-400 ml-2">
//               {savedData === null ? "click to load" : `${fieldCount} field${fieldCount !== 1 ? "s" : ""}`}
//             </span>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           {open && !editing && hasContent && (
//             <span
//               role="button"
//               onClick={(e) => { e.stopPropagation(); setEditing(true); }}
//               className="flex items-center gap-1 text-xs text-[#BF4E14] font-semibold hover:underline px-2 py-1"
//             >
//               <Edit2 size={12} /> Edit
//             </span>
//           )}
//           {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
//         </div>
//       </button>

//       {/* Section body */}
//       {open && (
//         <div className="border-t border-[#E8E8E8]">

//           {/* Loading state */}
//           {loading && (
//             <div className="flex items-center gap-2 px-5 py-8 text-sm text-gray-400">
//               <RefreshCw size={14} className="animate-spin" /> Loading saved content…
//             </div>
//           )}

//           {/* Error state */}
//           {!loading && loadError && (
//             <div className="px-5 py-6">
//               <p className="text-sm text-red-500 mb-3">Failed to load content from database.</p>
//               <button onClick={fetchData} className="btn-outline-orange text-xs px-3 py-1.5">
//                 Retry
//               </button>
//             </div>
//           )}

//           {/* Read mode — show saved values */}
//           {!loading && !loadError && !editing && savedData !== null && (
//             <div className="p-5">
//               {Object.keys(savedData).length === 0 ? (
//                 <div className="py-4 text-center">
//                   <p className="text-sm text-gray-400 mb-4">No content saved yet for this section.</p>
//                   <button onClick={() => setEditing(true)} className="btn-primary text-sm">
//                     <Edit2 size={14} /> Add Content
//                   </button>
//                 </div>
//               ) : (
//                 <>
//                   {/* Saved values table */}
//                   <div className="space-y-0 divide-y divide-[#F5F5F5] mb-5">
//                     {Object.entries(savedData).map(([key, val]) => (
//                       <div key={key} className="py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
//                         <span className="text-xs font-bold text-gray-400 uppercase tracking-wide sm:w-40 flex-shrink-0 pt-0.5">
//                           {key.replace(/_/g, " ")}
//                         </span>
//                         <div className="flex-1 min-w-0">
//                           <ValuePreview value={val} />
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center gap-3 pt-3 border-t border-[#F5F5F5]">
//                     <button
//                       onClick={() => setEditing(true)}
//                       className="btn-primary text-sm"
//                     >
//                       <Edit2 size={14} /> Edit Section
//                     </button>
//                     <button
//                       onClick={fetchData}
//                       className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#BF4E14] transition-colors"
//                       title="Reload from database"
//                     >
//                       <RefreshCw size={12} /> Refresh
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           )}

//           {/* Edit mode */}
//           {!loading && !loadError && editing && (
//             <div className="p-5">
//               {/* Edit header */}
//               <div className="flex items-center justify-between mb-5">
//                 <span className="text-xs font-bold text-[#BF4E14] uppercase tracking-wide flex items-center gap-1.5">
//                   <Edit2 size={12} /> Editing: {sectionLabel}
//                 </span>
//                 <button onClick={handleCancel} className="flex items-center gap-1 text-xs text-gray-400 hover:text-black transition-colors">
//                   <X size={12} /> Cancel
//                 </button>
//               </div>

//               {/* Fields */}
//               <div className="space-y-6">
//                 {Object.entries(draftData).map(([key, val]) => (
//                   <div key={key}>
//                     <label className="label-dhi mb-1.5 block">{key.replace(/_/g, " ")}</label>
//                     <FieldEditor
//                       fieldKey={key}
//                       value={val}
//                       onChange={(newVal) => setDraftData((prev) => ({ ...prev, [key]: newVal }))}
//                     />
//                   </div>
//                 ))}
//               </div>

//               {/* Save / Cancel */}
//               <div className="flex items-center gap-3 mt-8 pt-5 border-t border-[#F5F5F5]">
//                 <button
//                   onClick={handleSave}
//                   disabled={saving}
//                   className="btn-primary"
//                 >
//                   {saving ? (
//                     <><RefreshCw size={14} className="animate-spin" /> Saving…</>
//                   ) : (
//                     <><Check size={14} /> Save Changes</>
//                   )}
//                 </button>
//                 <button onClick={handleCancel} className="btn-secondary text-sm">
//                   Cancel
//                 </button>
//                 <span className="text-xs text-gray-400 ml-auto hidden sm:block">
//                   Changes are published immediately after saving.
//                 </span>
//               </div>
//             </div>
//           )}

//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Main export ──────────────────────────────────────────────
// export default function CmsEditorClient({ page, sections }: CmsEditorClientProps) {
//   const [refreshKey, setRefreshKey] = useState(0);

//   return (
//     <div className="space-y-3">
//       {/* Toolbar */}
//       <div className="flex items-center justify-between mb-2">
//         <p className="text-sm text-gray-500">
//           Expand a section to view and edit its saved content.
//         </p>
//         <button
//           onClick={() => setRefreshKey((k) => k + 1)}
//           className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#BF4E14] transition-colors"
//           title="Collapse all and reset"
//         >
//           <RefreshCw size={12} /> Reset view
//         </button>
//       </div>

//       {/* Section list */}
//       {Object.entries(sections).map(([sectionKey, sectionLabel]) => (
//         <SectionEditor
//           key={`${sectionKey}-${refreshKey}`}
//           page={page}
//           sectionKey={sectionKey}
//           sectionLabel={sectionLabel}
//         />
//       ))}
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Save, Upload, ChevronDown, ChevronUp,
  Plus, Trash2, Edit2, X, RefreshCw, Check, Database
} from "lucide-react";
import toast from "react-hot-toast";

// ─── Default templates per section (used when DB row is empty) ─
const SECTION_DEFAULTS: Record<string, Record<string, unknown>> = {
  hero: {
    headline: "Simplifying Concepts,\nStrengthening Communities",
    subheadline: "Da Hausa Initiative (DHI) works to improve financial and data literacy across Hausa-speaking communities in Northern Nigeria.",
    cta_primary_text: "Apply Now",
    cta_primary_link: "/apply",
    cta_secondary_text: "Our Programmes",
    cta_secondary_link: "/programmes",
    image_url: "",
  },
  pillars: {
    headline: "Our Two Pillars",
    pillars: [
      { title: "Financial Literacy", description: "Equipping individuals and households with the knowledge to manage money and build financial resilience.", icon: "TrendingUp" },
      { title: "Data Literacy", description: "Building capacity to understand, interpret, and use data across Hausa-speaking communities.", icon: "BarChart2" },
    ],
  },
  approaches: {
    headline: "How We Work",
    approaches: [
      { title: "Research", description: "Generating evidence on the financial and data needs of Northern Nigerian communities." },
      { title: "Training", description: "Delivering practical, community-rooted programmes that build real skills." },
      { title: "Advocacy", description: "Influencing policy and practice to create systemic change." },
    ],
  },
  about_preview: {
    headline: "About Da Hausa Initiative",
    body: "Da Hausa Initiative (DHI) exists to address the literacy gaps that hold communities back. We focus on Northern Nigeria — a region rich in potential but historically underserved by mainstream financial and digital systems.",
    cta_text: "Learn More About Us",
    cta_link: "/about",
    image_url: "",
  },
  home_videos: {
    headline: "From Our Channel",
    subheadline: "Watch our latest videos on financial and data literacy — in Hausa and English.",
    videos: [
      { title: "Video Title Here", description: "Short description of this video.", youtube_url: "", duration: "", date: "" },
      { title: "Video Title Here", description: "Short description of this video.", youtube_url: "", duration: "", date: "" },
      { title: "Video Title Here", description: "Short description of this video.", youtube_url: "", duration: "", date: "" },
    ],
  },
  newsletter_cta: {
    headline: "Stay Connected",
    body: "Join our newsletter for updates on programmes, research, and resources tailored for Northern Nigeria.",
    cta_text: "Subscribe to Newsletter",
    cta_link: "/more#newsletter",
  },
  why_dhi: {
    headline: "Why DHI Exists",
    body: "Northern Nigeria is home to millions of Hausa-speaking people who are largely excluded from mainstream financial systems and digital literacy programmes.",
  },
  what_we_do: {
    headline: "What We Work On",
    items: [
      { title: "Financial Literacy", description: "Teaching practical money management in a culturally relevant way." },
      { title: "Data Literacy", description: "Equipping individuals with the ability to read, interpret, and use data effectively." },
    ],
  },
  how_we_work: {
    headline: "How DHI Works",
    body: "We operate through three complementary approaches — Research, Training, and Advocacy — that together create lasting change.",
    approaches: [
      { title: "Research", description: "We generate evidence on community needs, programme effectiveness, and policy gaps." },
      { title: "Training", description: "We design and deliver practical, affordable, and accessible training programmes." },
      { title: "Advocacy", description: "We use our research to advocate for policies that expand access to literacy." },
    ],
  },
  focus_area: {
    headline: "Our Focus: Northern Nigeria",
    body: "DHI's work is rooted in the Hausa-speaking communities of Northern Nigeria. We understand the cultural, linguistic, and economic context of this region.",
    image_url: "",
  },
  financial_literacy: {
    headline: "Financial Literacy Programmes",
    description: "Helping individuals and households understand money, build skills, and make confident financial decisions.",
    programmes: [
      { title: "Future Focus with Lailah", subtitle: "Podcast", description: "A podcast series exploring personal finance for Hausa-speaking audiences.", cta_text: "Listen Now", cta_link: "#", badge: "Podcast", status: "active" },
      { title: "Home CFO Course", subtitle: "Online Course", description: "A structured course teaching households to manage money like a CFO.", cta_text: "Apply Now", cta_link: "/apply", badge: "Course", status: "active" },
      { title: "15-Minute Clarity Calls", subtitle: "1-on-1 Coaching", description: "Short coaching calls giving individuals clear financial next steps.", cta_text: "Register Interest", cta_link: "/apply", badge: "Coaching", status: "active" },
    ],
  },
  data_literacy: {
    headline: "Data Literacy Programmes",
    description: "Building the capacity to understand, use, and advocate with data.",
    programmes: [
      { title: "Hausa Tech Training Scholarship", subtitle: "Scholarship", description: "A scholarship for data analysis training for qualified applicants.", cta_text: "Apply for Scholarship", cta_link: "/apply", badge: "Scholarship", status: "active" },
      { title: "Research on Data in Northern Nigeria", subtitle: "Research", description: "Ongoing research on how data is produced and used in Northern Nigeria.", cta_text: "View Research", cta_link: "/more#resources", badge: "Research", status: "active" },
      { title: "Hausa Excel & Power BI Videos", subtitle: "Video Learning", description: "Tutorial videos in Hausa making data skills accessible.", cta_text: "Watch on YouTube", cta_link: "#", badge: "Videos", status: "active" },
    ],
  },
  resources: {
    headline: "Resources",
    description: "Explore our collection of podcasts, videos, research papers, and more.",
    resources: [
      { title: "Future Focus with Lailah", type: "Podcast", description: "Listen to our financial literacy podcast series.", link: "#", icon: "Mic" },
      { title: "Hausa Excel & Power BI Videos", type: "Videos", description: "Data literacy video tutorials in Hausa on YouTube.", link: "#", icon: "Youtube" },
      { title: "Policy Papers", type: "Research", description: "Research and policy papers on financial and data literacy.", link: "#", icon: "FileText" },
      { title: "DHI Documentary", type: "Documentary", description: "A documentary on our work and community impact. Coming soon.", link: "#", icon: "Film", coming_soon: true },
    ],
  },
  contact: {
    headline: "Get in Touch",
    description: "Have a question, partnership inquiry, or want to learn more about our work?",
    email: "info@dahausa.org",
    address: "FCT, Nigeria",
    show_contact_form: true,
  },
};

interface CmsEditorClientProps {
  page: string;
  sections: Record<string, string>;
}

// ─── Value preview (read mode) ────────────────────────────────
function ValuePreview({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-gray-300 italic text-xs">Empty</span>;
  }
  if (typeof value === "boolean") {
    return <span className={`text-xs font-semibold ${value ? "text-green-600" : "text-red-500"}`}>{value ? "Yes" : "No"}</span>;
  }
  if (Array.isArray(value)) {
    const arr = value as Record<string, unknown>[];
    return (
      <span className="text-xs text-gray-500 flex flex-wrap gap-1 items-center">
        <span className="font-semibold text-black">{arr.length} item{arr.length !== 1 ? "s" : ""}</span>
        {arr.slice(0, 3).map((item, i) => (
          <span key={i} className="inline-block bg-[#F5F5F5] border border-[#E8E8E8] text-[10px] px-2 py-0.5 rounded">
            {String(item.title || item.name || `Item ${i + 1}`).slice(0, 28)}
          </span>
        ))}
        {arr.length > 3 && <span className="text-[10px] text-gray-400">+{arr.length - 3} more</span>}
      </span>
    );
  }
  if (typeof value === "string" && value.match(/\.(jpg|jpeg|png|webp|gif)/i)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={value} alt="" className="h-10 object-cover border border-[#E8E8E8]"
        onError={(e) => { e.currentTarget.style.display = "none"; }} />
    );
  }
  const str = String(value);
  return <span className="text-sm text-black">{str.length > 120 ? str.slice(0, 120) + "…" : str}</span>;
}

// ─── Field editor (edit mode) ─────────────────────────────────
function FieldEditor({ fieldKey, value, onChange }: {
  fieldKey: string; value: unknown; onChange: (val: unknown) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const d = await res.json();
      if (res.ok) { onChange(d.url); toast.success("Image uploaded."); }
      else toast.error(d.error || "Upload failed.");
    } catch { toast.error("Upload error."); }
    finally { setUploading(false); }
  };

  if (Array.isArray(value)) {
    const arr = value as Record<string, unknown>[];
    return (
      <div className="space-y-3">
        {arr.map((item, i) => (
          <div key={i} className="border border-[#E8E8E8] bg-[#FAFAFA] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#BF4E14] uppercase tracking-wide">Item {i + 1}</span>
              <button type="button"
                onClick={() => { const a = [...arr]; a.splice(i, 1); onChange(a); }}
                className="p-1 text-red-400 hover:text-red-600" title="Remove item">
                <Trash2 size={13} />
              </button>
            </div>
            <div className="space-y-3">
              {Object.entries(item).map(([k, v]) => (
                <div key={k}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block mb-1">
                    {k.replace(/_/g, " ")}
                  </label>
                  {typeof v === "boolean" ? (
                    <select value={String(v)} className="input-dhi text-sm py-1.5"
                      onChange={(e) => { const a = [...arr]; a[i] = { ...a[i], [k]: e.target.value === "true" }; onChange(a); }}>
                      <option value="true">Yes / Show</option>
                      <option value="false">No / Hide</option>
                    </select>
                  ) : typeof v === "string" && (v.length > 80 || ["description", "body"].includes(k)) ? (
                    <textarea value={v} rows={2} className="input-dhi text-sm py-1.5 resize-none"
                      onChange={(e) => { const a = [...arr]; a[i] = { ...a[i], [k]: e.target.value }; onChange(a); }} />
                  ) : (
                    <input value={String(v ?? "")} className="input-dhi text-sm py-1.5"
                      onChange={(e) => { const a = [...arr]; a[i] = { ...a[i], [k]: e.target.value }; onChange(a); }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="button"
          onClick={() => {
            const template = arr[0] ? Object.fromEntries(Object.keys(arr[0]).map(k => [k, typeof arr[0][k] === "boolean" ? false : ""])) : {};
            onChange([...arr, template]);
          }}
          className="flex items-center gap-2 text-sm text-[#BF4E14] font-semibold hover:underline">
          <Plus size={14} /> Add Item
        </button>
      </div>
    );
  }

  if (fieldKey.includes("image_url") || fieldKey.endsWith("_image")) {
    const imgStr = typeof value === "string" ? value : "";
    return (
      <div className="space-y-2">
        <input type="text" value={imgStr} className="input-dhi text-sm py-2"
          placeholder="Paste image URL or upload" onChange={(e) => onChange(e.target.value)} />
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#BF4E14] font-semibold hover:underline">
          <Upload size={12} />{uploading ? "Uploading…" : "Upload Image"}
          <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleImageUpload} />
        </label>
        {imgStr && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgStr} alt="Preview" className="h-20 object-cover border border-[#E8E8E8]"
            onError={(e) => { e.currentTarget.style.display = "none"; }} />
        )}
      </div>
    );
  }

  if (typeof value === "boolean") {
    return (
      <select value={String(value)} onChange={(e) => onChange(e.target.value === "true")} className="input-dhi text-sm py-2">
        <option value="true">Yes / Show</option>
        <option value="false">No / Hide</option>
      </select>
    );
  }

  if (typeof value === "string" && (value.length > 80 || ["body", "description", "subheadline"].includes(fieldKey))) {
    return <textarea value={value} rows={4} onChange={(e) => onChange(e.target.value)} className="input-dhi text-sm py-2 resize-y" />;
  }

  return <input type="text" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className="input-dhi text-sm py-2" />;
}

// ─── Section editor ───────────────────────────────────────────
function SectionEditor({ page, sectionKey, sectionLabel }: {
  page: string; sectionKey: string; sectionLabel: string;
}) {
  const [savedData, setSavedData] = useState<Record<string, unknown> | null>(null);
  const [draftData, setDraftData] = useState<Record<string, unknown>>({});
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/cms?page=${encodeURIComponent(page)}&section=${encodeURIComponent(sectionKey)}`);
      const json = await res.json();
      if (!res.ok) {
        setFetchError(json.error || `HTTP ${res.status}`);
        setSavedData({});
        setDraftData({});
        return;
      }
      const content = json.content as Record<string, unknown>;
      setSavedData(content);
      setDraftData({ ...content });
    } catch (err) {
      setFetchError("Network error — check your connection.");
      setSavedData({});
      setDraftData({});
    } finally {
      setLoading(false);
    }
  }, [page, sectionKey]);

  useEffect(() => {
    if (open && savedData === null) fetchData();
  }, [open, savedData, fetchData]);

  const handleInitialize = () => {
    const defaults = SECTION_DEFAULTS[sectionKey] || {};
    setDraftData({ ...defaults });
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, section: sectionKey, content: draftData }),
      });
      const json = await res.json();
      if (res.ok) {
        setSavedData({ ...draftData });
        setEditing(false);
        toast.success(`"${sectionLabel}" saved successfully.`);
      } else {
        toast.error(json.error || "Save failed — please try again.");
      }
    } catch {
      toast.error("Save failed — check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setDraftData(savedData || {});
    setEditing(false);
  };

  const isEmpty = savedData !== null && Object.keys(savedData).length === 0;
  const hasData = savedData !== null && Object.keys(savedData).length > 0;

  return (
    <div className="bg-white border border-[#E8E8E8] overflow-hidden">
      {/* Header */}
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FAFAFA] transition-colors text-left">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${hasData ? "bg-[#BF4E14]" : "bg-gray-300"}`} />
          <span className="font-semibold text-black text-sm">{sectionLabel}</span>
          <span className="text-xs text-gray-400">
            {savedData === null ? "click to load" : hasData ? `${Object.keys(savedData).length} fields` : "no data"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {open && hasData && !editing && (
            <span role="button" onClick={(e) => { e.stopPropagation(); setEditing(true); setDraftData({ ...savedData }); }}
              className="flex items-center gap-1 text-xs text-[#BF4E14] font-semibold hover:underline px-2 py-1">
              <Edit2 size={11} /> Edit
            </span>
          )}
          {open ? <ChevronUp size={15} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={15} className="text-gray-400 flex-shrink-0" />}
        </div>
      </button>

      {open && (
        <div className="border-t border-[#E8E8E8]">

          {/* Loading */}
          {loading && (
            <div className="flex items-center gap-2 px-5 py-8 text-sm text-gray-400">
              <RefreshCw size={13} className="animate-spin" /> Loading from database…
            </div>
          )}

          {/* Error */}
          {!loading && fetchError && (
            <div className="px-5 py-6">
              <p className="text-sm text-red-500 mb-1 font-semibold">Failed to load</p>
              <p className="text-xs text-gray-400 mb-3">{fetchError}</p>
              <button onClick={fetchData} className="text-xs text-[#BF4E14] font-semibold hover:underline flex items-center gap-1">
                <RefreshCw size={11} /> Retry
              </button>
            </div>
          )}

          {/* Empty — no row in DB yet */}
          {!loading && !fetchError && isEmpty && (
            <div className="px-5 py-8 text-center">
              <Database size={28} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-black mb-1">No content saved yet</p>
              <p className="text-xs text-gray-400 mb-5">
                This section has no data in the database. Initialize it with default content to get started.
              </p>
              <button onClick={handleInitialize}
                className="btn-primary text-sm">
                <Plus size={14} /> Initialize with Defaults
              </button>
            </div>
          )}

          {/* Read mode — show saved values */}
          {!loading && !fetchError && hasData && !editing && (
            <div className="p-5">
              <div className="divide-y divide-[#F5F5F5] mb-5">
                {Object.entries(savedData!).map(([key, val]) => (
                  <div key={key} className="py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide sm:w-36 flex-shrink-0 pt-0.5">
                      {key.replace(/_/g, " ")}
                    </span>
                    <div className="flex-1 min-w-0"><ValuePreview value={val} /></div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-[#F5F5F5]">
                <button onClick={() => { setEditing(true); setDraftData({ ...savedData! }); }} className="btn-primary text-sm">
                  <Edit2 size={13} /> Edit Section
                </button>
                <button onClick={fetchData} title="Reload from database"
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#BF4E14] transition-colors">
                  <RefreshCw size={11} /> Refresh
                </button>
              </div>
            </div>
          )}

          {/* Edit mode */}
          {!loading && !fetchError && editing && (
            <div className="p-5">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#F5F5F5]">
                <span className="text-xs font-bold text-[#BF4E14] uppercase tracking-wide flex items-center gap-1.5">
                  <Edit2 size={11} /> Editing: {sectionLabel}
                </span>
                <button onClick={handleCancel} className="flex items-center gap-1 text-xs text-gray-400 hover:text-black">
                  <X size={11} /> Cancel
                </button>
              </div>

              <div className="space-y-6">
                {Object.entries(draftData).map(([key, val]) => (
                  <div key={key}>
                    <label className="label-dhi mb-1.5 block">{key.replace(/_/g, " ")}</label>
                    <FieldEditor fieldKey={key} value={val}
                      onChange={(newVal) => setDraftData((prev) => ({ ...prev, [key]: newVal }))} />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3 mt-8 pt-5 border-t border-[#F5F5F5]">
                <button onClick={handleSave} disabled={saving} className="btn-primary">
                  {saving
                    ? <><RefreshCw size={13} className="animate-spin" /> Saving…</>
                    : <><Check size={13} /> Save Changes</>}
                </button>
                <button onClick={handleCancel} className="btn-secondary text-sm">Discard</button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────
export default function CmsEditorClient({ page, sections }: CmsEditorClientProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400 mb-4">
        Expand any section to view its current content. Sections marked with a grey dot have no saved data — click to initialize them.
      </p>
      {Object.entries(sections).map(([sectionKey, sectionLabel]) => (
        <SectionEditor key={sectionKey} page={page} sectionKey={sectionKey} sectionLabel={sectionLabel} />
      ))}
    </div>
  );
}