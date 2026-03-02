// "use client";

// import { useState } from "react";
// import { Save, Upload, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
// import toast from "react-hot-toast";

// interface CmsEditorClientProps {
//   page: string;
//   sections: Record<string, string>;
//   initialContent: Record<string, Record<string, unknown>>;
// }

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
//       const formData = new FormData();
//       formData.append("file", file);
//       const res = await fetch("/api/upload", { method: "POST", body: formData });
//       const data = await res.json();
//       if (res.ok) {
//         onChange(data.url);
//         toast.success("Image uploaded.");
//       } else {
//         toast.error(data.error || "Upload failed.");
//       }
//     } catch {
//       toast.error("Upload error.");
//     } finally {
//       setUploading(false);
//     }
//   };

//   // Array of objects
//   if (Array.isArray(value)) {
//     return (
//       <div className="space-y-4">
//         {(value as Record<string, unknown>[]).map((item, i) => (
//           <div key={i} className="border border-[#E8E8E8] p-4 bg-[#FAFAFA] relative">
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-xs font-bold uppercase text-[#BF4E14] tracking-wide">Item {i + 1}</span>
//               <button
//                 onClick={() => {
//                   const arr = [...(value as Record<string, unknown>[])];
//                   arr.splice(i, 1);
//                   onChange(arr);
//                 }}
//                 className="text-red-400 hover:text-red-600 p-1"
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
//                         const arr = [...(value as Record<string, unknown>[])];
//                         arr[i] = { ...arr[i], [k]: e.target.value === "true" };
//                         onChange(arr);
//                       }}
//                       className="input-dhi text-sm py-2"
//                     >
//                       <option value="true">Yes / Show</option>
//                       <option value="false">No / Hide</option>
//                     </select>
//                   ) : typeof v === "string" && v.length > 100 ? (
//                     <textarea
//                       value={v}
//                       onChange={(e) => {
//                         const arr = [...(value as Record<string, unknown>[])];
//                         arr[i] = { ...arr[i], [k]: e.target.value };
//                         onChange(arr);
//                       }}
//                       rows={3}
//                       className="input-dhi text-sm py-2 resize-none"
//                     />
//                   ) : (
//                     <input
//                       value={String(v ?? "")}
//                       onChange={(e) => {
//                         const arr = [...(value as Record<string, unknown>[])];
//                         arr[i] = { ...arr[i], [k]: e.target.value };
//                         onChange(arr);
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
//           onClick={() => {
//             const template = (value as Record<string, unknown>[])[0] || {};
//             const newItem = Object.fromEntries(
//               Object.keys(template).map((k) => [k, typeof template[k] === "boolean" ? false : ""])
//             );
//             onChange([...(value as Record<string, unknown>[]), newItem]);
//           }}
//           className="flex items-center gap-2 text-sm text-[#BF4E14] font-semibold hover:underline"
//         >
//           <Plus size={15} /> Add Item
//         </button>
//       </div>
//     );
//   }

//   // Image URL field
//   if (fieldKey.includes("image_url") || fieldKey.includes("_image") || fieldKey === "image_url") {
//     const imageStr = typeof value === "string" ? value : "";
//     return (
//       <div>
//         <input
//           type="text"
//           value={imageStr}
//           onChange={(e) => onChange(e.target.value)}
//           className="input-dhi text-sm py-2"
//           placeholder="Image URL or upload below"
//         />
//         <div className="mt-2">
//           <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#BF4E14] font-semibold hover:underline">
//             <Upload size={13} />
//             {uploading ? "Uploading..." : "Upload Image"}
//             <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
//           </label>
//         </div>
//         {imageStr ? (
//           // eslint-disable-next-line @next/next/no-img-element
//           <img
//             src={imageStr}
//             alt="Preview"
//             className="mt-2 h-24 object-cover border border-[#E8E8E8]"
//             onError={(e) => { e.currentTarget.style.display = "none"; }}
//           />
//         ) : null}
//       </div>
//     );
//   }

//   // Boolean
//   if (typeof value === "boolean") {
//     return (
//       <select
//         value={String(value)}
//         onChange={(e) => onChange(e.target.value === "true")}
//         className="input-dhi text-sm py-2"
//       >
//         <option value="true">Yes / Show</option>
//         <option value="false">No / Hide</option>
//       </select>
//     );
//   }

//   // Long text
//   if (typeof value === "string" && (value.length > 80 || fieldKey === "body" || fieldKey === "description" || fieldKey === "subheadline")) {
//     return (
//       <textarea
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         rows={4}
//         className="input-dhi text-sm py-2 resize-y"
//       />
//     );
//   }

//   // Short text / URL / number
//   return (
//     <input
//       type="text"
//       value={String(value ?? "")}
//       onChange={(e) => onChange(e.target.value)}
//       className="input-dhi text-sm py-2"
//     />
//   );
// }

// function SectionEditor({
//   page,
//   sectionKey,
//   sectionLabel,
//   initialData,
// }: {
//   page: string;
//   sectionKey: string;
//   sectionLabel: string;
//   initialData: Record<string, unknown>;
// }) {
//   const [data, setData] = useState<Record<string, unknown>>(initialData);
//   const [open, setOpen] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const updateField = (key: string, value: unknown) => {
//     setData((prev) => ({ ...prev, [key]: value }));
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const res = await fetch("/api/cms", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ page, section: sectionKey, content: data }),
//       });
//       if (res.ok) {
//         toast.success(`${sectionLabel} saved.`);
//       } else {
//         const d = await res.json();
//         toast.error(d.error || "Save failed.");
//       }
//     } catch {
//       toast.error("Save failed.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="bg-white border border-[#E8E8E8] overflow-hidden">
//       <button
//         onClick={() => setOpen(!open)}
//         className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#FAFAFA] transition-colors"
//       >
//         <div className="flex items-center gap-3">
//           <div className="w-2 h-2 rounded-full bg-[#BF4E14]" />
//           <span className="font-semibold text-black text-sm">{sectionLabel}</span>
//           <span className="text-xs text-gray-400 hidden sm:block">{Object.keys(data).length} fields</span>
//         </div>
//         {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
//       </button>

//       {open && (
//         <div className="border-t border-[#E8E8E8] p-6">
//           <div className="space-y-6">
//             {Object.entries(data).map(([key, val]) => (
//               <div key={key}>
//                 <label className="label-dhi mb-2 block">{key.replace(/_/g, " ")}</label>
//                 <FieldEditor fieldKey={key} value={val} onChange={(newVal) => updateField(key, newVal)} />
//               </div>
//             ))}
//           </div>
//           <div className="mt-8 flex justify-end">
//             <button onClick={handleSave} disabled={saving} className="btn-primary">
//               <Save size={15} />
//               {saving ? "Saving..." : `Save ${sectionLabel}`}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default function CmsEditorClient({ page, sections, initialContent }: CmsEditorClientProps) {
//   return (
//     <div className="space-y-4">
//       <p className="text-sm text-gray-500 mb-6">
//         Click a section below to expand and edit its content. Changes are saved per section.
//       </p>
//       {Object.entries(sections).map(([sectionKey, sectionLabel]) => (
//         <SectionEditor
//           key={sectionKey}
//           page={page}
//           sectionKey={sectionKey}
//           sectionLabel={sectionLabel}
//           initialData={(initialContent?.[sectionKey] as Record<string, unknown>) || {}}
//         />
//       ))}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Save, Upload, ChevronDown, ChevronUp, Plus, Trash2,
  Edit2, X, RefreshCw, Eye, Check
} from "lucide-react";
import toast from "react-hot-toast";

interface CmsEditorClientProps {
  page: string;
  sections: Record<string, string>;
}

// ─── Field renderer ───────────────────────────────────────────
function FieldEditor({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: string;
  value: unknown;
  onChange: (val: unknown) => void;
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

  // Array of objects
  if (Array.isArray(value)) {
    const arr = value as Record<string, unknown>[];
    return (
      <div className="space-y-3">
        {arr.map((item, i) => (
          <div key={i} className="border border-[#E8E8E8] bg-[#FAFAFA] p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#BF4E14] uppercase tracking-wide">Item {i + 1}</span>
              <button
                type="button"
                onClick={() => { const a = [...arr]; a.splice(i, 1); onChange(a); }}
                className="p-1 text-red-400 hover:text-red-600"
                title="Delete item"
              >
                <Trash2 size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {Object.entries(item).map(([k, v]) => (
                <div key={k}>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1">
                    {k.replace(/_/g, " ")}
                  </label>
                  {typeof v === "boolean" ? (
                    <select
                      value={String(v)}
                      onChange={(e) => {
                        const a = [...arr];
                        a[i] = { ...a[i], [k]: e.target.value === "true" };
                        onChange(a);
                      }}
                      className="input-dhi text-sm py-2"
                    >
                      <option value="true">Yes / Show</option>
                      <option value="false">No / Hide</option>
                    </select>
                  ) : typeof v === "string" && (v.length > 80 || k === "description" || k === "body") ? (
                    <textarea
                      value={v}
                      rows={3}
                      onChange={(e) => {
                        const a = [...arr];
                        a[i] = { ...a[i], [k]: e.target.value };
                        onChange(a);
                      }}
                      className="input-dhi text-sm py-2 resize-none"
                    />
                  ) : (
                    <input
                      value={String(v ?? "")}
                      onChange={(e) => {
                        const a = [...arr];
                        a[i] = { ...a[i], [k]: e.target.value };
                        onChange(a);
                      }}
                      className="input-dhi text-sm py-2"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const template = arr[0] || {};
            const newItem = Object.fromEntries(
              Object.keys(template).map((k) => [k, typeof template[k] === "boolean" ? false : ""])
            );
            onChange([...arr, newItem]);
          }}
          className="flex items-center gap-2 text-sm text-[#BF4E14] font-semibold hover:underline"
        >
          <Plus size={14} /> Add Item
        </button>
      </div>
    );
  }

  // Image field
  if (fieldKey.includes("image_url") || fieldKey.includes("_image")) {
    const imgStr = typeof value === "string" ? value : "";
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={imgStr}
          onChange={(e) => onChange(e.target.value)}
          className="input-dhi text-sm py-2"
          placeholder="Paste image URL or upload below"
        />
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#BF4E14] font-semibold hover:underline">
          <Upload size={12} />
          {uploading ? "Uploading..." : "Upload Image"}
          <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={handleImageUpload} />
        </label>
        {imgStr && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgStr} alt="Preview" className="h-24 object-cover border border-[#E8E8E8]"
            onError={(e) => { e.currentTarget.style.display = "none"; }} />
        )}
      </div>
    );
  }

  // Boolean
  if (typeof value === "boolean") {
    return (
      <select value={String(value)} onChange={(e) => onChange(e.target.value === "true")} className="input-dhi text-sm py-2">
        <option value="true">Yes / Show</option>
        <option value="false">No / Hide</option>
      </select>
    );
  }

  // Long text
  if (typeof value === "string" && (value.length > 80 || ["body", "description", "subheadline"].includes(fieldKey))) {
    return (
      <textarea value={value} rows={4} onChange={(e) => onChange(e.target.value)}
        className="input-dhi text-sm py-2 resize-y" />
    );
  }

  // Short text
  return (
    <input type="text" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}
      className="input-dhi text-sm py-2" />
  );
}

// ─── Value preview (read mode) ────────────────────────────────
function ValuePreview({ value }: { value: unknown }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-gray-300 italic text-xs">Empty</span>;
  }
  if (typeof value === "boolean") {
    return (
      <span className={`text-xs font-semibold ${value ? "text-green-600" : "text-red-500"}`}>
        {value ? "Yes" : "No"}
      </span>
    );
  }
  if (Array.isArray(value)) {
    return (
      <span className="text-xs text-gray-500">
        {value.length} item{value.length !== 1 ? "s" : ""}
        <span className="ml-2 text-gray-400">
          {(value as Record<string, unknown>[]).slice(0, 3).map((item, i) => (
            <span key={i} className="inline-block bg-[#F5F5F5] border border-[#E8E8E8] text-[10px] px-1.5 py-0.5 mr-1">
              {String(item.title || item.name || `Item ${i + 1}`).slice(0, 25)}
            </span>
          ))}
          {value.length > 3 && <span className="text-gray-400 text-[10px]">+{value.length - 3} more</span>}
        </span>
      </span>
    );
  }
  if (typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://")) && value.match(/\.(jpg|jpeg|png|webp|gif)/i)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={value} alt="" className="h-12 object-cover border border-[#E8E8E8]"
        onError={(e) => { e.currentTarget.style.display = "none"; }} />
    );
  }
  const str = String(value);
  return (
    <span className="text-sm text-black">{str.length > 120 ? str.slice(0, 120) + "…" : str}</span>
  );
}

// ─── Section editor ───────────────────────────────────────────
function SectionEditor({
  page,
  sectionKey,
  sectionLabel,
}: {
  page: string;
  sectionKey: string;
  sectionLabel: string;
}) {
  const [savedData, setSavedData] = useState<Record<string, unknown> | null>(null);
  const [draftData, setDraftData] = useState<Record<string, unknown>>({});
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await fetch(`/api/cms?page=${page}&section=${sectionKey}`);
      const json = await res.json();
      if (res.ok && json.content) {
        setSavedData(json.content);
        setDraftData(json.content);
      } else {
        setSavedData({});
        setDraftData({});
      }
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, [page, sectionKey]);

  // Fetch when section is first expanded
  useEffect(() => {
    if (open && savedData === null) fetchData();
  }, [open, savedData, fetchData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, section: sectionKey, content: draftData }),
      });
      if (res.ok) {
        setSavedData({ ...draftData });
        setEditing(false);
        toast.success(`"${sectionLabel}" saved successfully.`);
      } else {
        const d = await res.json();
        toast.error(d.error || "Save failed.");
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

  const fieldCount = savedData ? Object.keys(savedData).length : 0;
  const hasContent = savedData && Object.keys(savedData).length > 0;

  return (
    <div className="bg-white border border-[#E8E8E8] overflow-hidden">
      {/* Section header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#FAFAFA] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${hasContent ? "bg-[#BF4E14]" : "bg-gray-300"}`} />
          <div>
            <span className="font-semibold text-black text-sm">{sectionLabel}</span>
            <span className="text-xs text-gray-400 ml-2">
              {savedData === null ? "click to load" : `${fieldCount} field${fieldCount !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {open && !editing && hasContent && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); setEditing(true); }}
              className="flex items-center gap-1 text-xs text-[#BF4E14] font-semibold hover:underline px-2 py-1"
            >
              <Edit2 size={12} /> Edit
            </span>
          )}
          {open ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
        </div>
      </button>

      {/* Section body */}
      {open && (
        <div className="border-t border-[#E8E8E8]">

          {/* Loading state */}
          {loading && (
            <div className="flex items-center gap-2 px-5 py-8 text-sm text-gray-400">
              <RefreshCw size={14} className="animate-spin" /> Loading saved content…
            </div>
          )}

          {/* Error state */}
          {!loading && loadError && (
            <div className="px-5 py-6">
              <p className="text-sm text-red-500 mb-3">Failed to load content from database.</p>
              <button onClick={fetchData} className="btn-outline-orange text-xs px-3 py-1.5">
                Retry
              </button>
            </div>
          )}

          {/* Read mode — show saved values */}
          {!loading && !loadError && !editing && savedData !== null && (
            <div className="p-5">
              {Object.keys(savedData).length === 0 ? (
                <div className="py-4 text-center">
                  <p className="text-sm text-gray-400 mb-4">No content saved yet for this section.</p>
                  <button onClick={() => setEditing(true)} className="btn-primary text-sm">
                    <Edit2 size={14} /> Add Content
                  </button>
                </div>
              ) : (
                <>
                  {/* Saved values table */}
                  <div className="space-y-0 divide-y divide-[#F5F5F5] mb-5">
                    {Object.entries(savedData).map(([key, val]) => (
                      <div key={key} className="py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wide sm:w-40 flex-shrink-0 pt-0.5">
                          {key.replace(/_/g, " ")}
                        </span>
                        <div className="flex-1 min-w-0">
                          <ValuePreview value={val} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-3 border-t border-[#F5F5F5]">
                    <button
                      onClick={() => setEditing(true)}
                      className="btn-primary text-sm"
                    >
                      <Edit2 size={14} /> Edit Section
                    </button>
                    <button
                      onClick={fetchData}
                      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#BF4E14] transition-colors"
                      title="Reload from database"
                    >
                      <RefreshCw size={12} /> Refresh
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Edit mode */}
          {!loading && !loadError && editing && (
            <div className="p-5">
              {/* Edit header */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-bold text-[#BF4E14] uppercase tracking-wide flex items-center gap-1.5">
                  <Edit2 size={12} /> Editing: {sectionLabel}
                </span>
                <button onClick={handleCancel} className="flex items-center gap-1 text-xs text-gray-400 hover:text-black transition-colors">
                  <X size={12} /> Cancel
                </button>
              </div>

              {/* Fields */}
              <div className="space-y-6">
                {Object.entries(draftData).map(([key, val]) => (
                  <div key={key}>
                    <label className="label-dhi mb-1.5 block">{key.replace(/_/g, " ")}</label>
                    <FieldEditor
                      fieldKey={key}
                      value={val}
                      onChange={(newVal) => setDraftData((prev) => ({ ...prev, [key]: newVal }))}
                    />
                  </div>
                ))}
              </div>

              {/* Save / Cancel */}
              <div className="flex items-center gap-3 mt-8 pt-5 border-t border-[#F5F5F5]">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? (
                    <><RefreshCw size={14} className="animate-spin" /> Saving…</>
                  ) : (
                    <><Check size={14} /> Save Changes</>
                  )}
                </button>
                <button onClick={handleCancel} className="btn-secondary text-sm">
                  Cancel
                </button>
                <span className="text-xs text-gray-400 ml-auto hidden sm:block">
                  Changes are published immediately after saving.
                </span>
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
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-500">
          Expand a section to view and edit its saved content.
        </p>
        <button
          onClick={() => setRefreshKey((k) => k + 1)}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#BF4E14] transition-colors"
          title="Collapse all and reset"
        >
          <RefreshCw size={12} /> Reset view
        </button>
      </div>

      {/* Section list */}
      {Object.entries(sections).map(([sectionKey, sectionLabel]) => (
        <SectionEditor
          key={`${sectionKey}-${refreshKey}`}
          page={page}
          sectionKey={sectionKey}
          sectionLabel={sectionLabel}
        />
      ))}
    </div>
  );
}