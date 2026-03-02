

"use client";

import { useState } from "react";
import { Save, Upload, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface CmsEditorClientProps {
  page: string;
  sections: Record<string, string>;
  initialContent: Record<string, Record<string, unknown>>;
}

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
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        onChange(data.url);
        toast.success("Image uploaded.");
      } else {
        toast.error(data.error || "Upload failed.");
      }
    } catch {
      toast.error("Upload error.");
    } finally {
      setUploading(false);
    }
  };

  // Array of objects
  if (Array.isArray(value)) {
    return (
      <div className="space-y-4">
        {(value as Record<string, unknown>[]).map((item, i) => (
          <div key={i} className="border border-[#E8E8E8] p-4 bg-[#FAFAFA] relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-[#BF4E14] tracking-wide">Item {i + 1}</span>
              <button
                onClick={() => {
                  const arr = [...(value as Record<string, unknown>[])];
                  arr.splice(i, 1);
                  onChange(arr);
                }}
                className="text-red-400 hover:text-red-600 p-1"
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
                        const arr = [...(value as Record<string, unknown>[])];
                        arr[i] = { ...arr[i], [k]: e.target.value === "true" };
                        onChange(arr);
                      }}
                      className="input-dhi text-sm py-2"
                    >
                      <option value="true">Yes / Show</option>
                      <option value="false">No / Hide</option>
                    </select>
                  ) : typeof v === "string" && v.length > 100 ? (
                    <textarea
                      value={v}
                      onChange={(e) => {
                        const arr = [...(value as Record<string, unknown>[])];
                        arr[i] = { ...arr[i], [k]: e.target.value };
                        onChange(arr);
                      }}
                      rows={3}
                      className="input-dhi text-sm py-2 resize-none"
                    />
                  ) : (
                    <input
                      value={String(v ?? "")}
                      onChange={(e) => {
                        const arr = [...(value as Record<string, unknown>[])];
                        arr[i] = { ...arr[i], [k]: e.target.value };
                        onChange(arr);
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
          onClick={() => {
            const template = (value as Record<string, unknown>[])[0] || {};
            const newItem = Object.fromEntries(
              Object.keys(template).map((k) => [k, typeof template[k] === "boolean" ? false : ""])
            );
            onChange([...(value as Record<string, unknown>[]), newItem]);
          }}
          className="flex items-center gap-2 text-sm text-[#BF4E14] font-semibold hover:underline"
        >
          <Plus size={15} /> Add Item
        </button>
      </div>
    );
  }

  // Image URL field
  if (fieldKey.includes("image_url") || fieldKey.includes("_image") || fieldKey === "image_url") {
    const imageStr = typeof value === "string" ? value : "";
    return (
      <div>
        <input
          type="text"
          value={imageStr}
          onChange={(e) => onChange(e.target.value)}
          className="input-dhi text-sm py-2"
          placeholder="Image URL or upload below"
        />
        <div className="mt-2">
          <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[#BF4E14] font-semibold hover:underline">
            <Upload size={13} />
            {uploading ? "Uploading..." : "Upload Image"}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
        {imageStr ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageStr}
            alt="Preview"
            className="mt-2 h-24 object-cover border border-[#E8E8E8]"
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        ) : null}
      </div>
    );
  }

  // Boolean
  if (typeof value === "boolean") {
    return (
      <select
        value={String(value)}
        onChange={(e) => onChange(e.target.value === "true")}
        className="input-dhi text-sm py-2"
      >
        <option value="true">Yes / Show</option>
        <option value="false">No / Hide</option>
      </select>
    );
  }

  // Long text
  if (typeof value === "string" && (value.length > 80 || fieldKey === "body" || fieldKey === "description" || fieldKey === "subheadline")) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="input-dhi text-sm py-2 resize-y"
      />
    );
  }

  // Short text / URL / number
  return (
    <input
      type="text"
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      className="input-dhi text-sm py-2"
    />
  );
}

function SectionEditor({
  page,
  sectionKey,
  sectionLabel,
  initialData,
}: {
  page: string;
  sectionKey: string;
  sectionLabel: string;
  initialData: Record<string, unknown>;
}) {
  const [data, setData] = useState<Record<string, unknown>>(initialData);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const updateField = (key: string, value: unknown) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, section: sectionKey, content: data }),
      });
      if (res.ok) {
        toast.success(`${sectionLabel} saved.`);
      } else {
        const d = await res.json();
        toast.error(d.error || "Save failed.");
      }
    } catch {
      toast.error("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-[#E8E8E8] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#FAFAFA] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#BF4E14]" />
          <span className="font-semibold text-black text-sm">{sectionLabel}</span>
          <span className="text-xs text-gray-400 hidden sm:block">{Object.keys(data).length} fields</span>
        </div>
        {open ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
      </button>

      {open && (
        <div className="border-t border-[#E8E8E8] p-6">
          <div className="space-y-6">
            {Object.entries(data).map(([key, val]) => (
              <div key={key}>
                <label className="label-dhi mb-2 block">{key.replace(/_/g, " ")}</label>
                <FieldEditor fieldKey={key} value={val} onChange={(newVal) => updateField(key, newVal)} />
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              <Save size={15} />
              {saving ? "Saving..." : `Save ${sectionLabel}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CmsEditorClient({ page, sections, initialContent }: CmsEditorClientProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500 mb-6">
        Click a section below to expand and edit its content. Changes are saved per section.
      </p>
      {Object.entries(sections).map(([sectionKey, sectionLabel]) => (
        <SectionEditor
          key={sectionKey}
          page={page}
          sectionKey={sectionKey}
          sectionLabel={sectionLabel}
          initialData={(initialContent?.[sectionKey] as Record<string, unknown>) || {}}
        />
      ))}
    </div>
  );
}