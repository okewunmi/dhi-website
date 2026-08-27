"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Save, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface Programme {
  id?: string;
  pillar: "financial_literacy" | "data_literacy";
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  google_form_link: string;
  status: "open" | "coming_soon" | "closed";
  accepting_applications: boolean;
  sort_order: number;
}

const BLANK: Programme = {
  pillar: "financial_literacy",
  title: "",
  subtitle: "",
  description: "",
  badge: "Course",
  google_form_link: "",
  status: "open",
  accepting_applications: true,
  sort_order: 0,
};

export default function ProgrammesAdminPage() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [draft, setDraft] = useState<Programme>(BLANK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [intro, setIntro] = useState("");
  const [introSaving, setIntroSaving] = useState(false);

  const load = () => {
    Promise.all([
      fetch("/api/admin/programmes").then((r) => r.json()),
      fetch("/api/admin/settings?key=apply_page_intro").then((r) => r.json()),
    ])
      .then(([progData, settingData]) => {
        setProgrammes(progData.programmes || []);
        setIntro(
          (settingData.value as string) ||
            "Apply for our programmes and scholarships below."
        );
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveIntro = async () => {
    setIntroSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "apply_page_intro", value: intro }),
      });
      if (res.ok) toast.success("Intro saved.");
      else toast.error("Save failed.");
    } catch {
      toast.error("Error saving.");
    } finally {
      setIntroSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!draft.title.trim()) return toast.error("Title is required.");
    setSaving(true);
    try {
      const res = await fetch("/api/admin/programmes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error();
      toast.success("Programme added.");
      setDraft(BLANK);
      load();
    } catch {
      toast.error("Failed to add programme.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (p: Programme) => {
    const res = await fetch(`/api/admin/programmes/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    if (res.ok) toast.success("Saved.");
    else toast.error("Save failed.");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this programme? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/programmes/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Deleted.");
      setProgrammes((prev) => prev.filter((p) => p.id !== id));
    } else {
      toast.error("Delete failed.");
    }
  };

  const updateField = (id: string, field: keyof Programme, value: unknown) => {
    setProgrammes((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  if (loading) return <div className="py-20 text-center text-gray-400">Loading...</div>;

  return (
    <div className="lg:mt-0 mt-14">
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Manage</p>
        <h1 className="font-display text-3xl font-light text-black">Programmes</h1>
        <p className="text-sm text-gray-500 mt-2">
          Add, edit, or remove programmes shown on the Programmes and Apply pages.
          Every programme applies via its Google Form link.
        </p>
      </div>

      {/* Intro text */}
      <div className="bg-white border border-[#E8E8E8] p-6 mb-8 max-w-3xl">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-4">
          Apply Page Intro
        </h2>
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          rows={2}
          className="input-dhi resize-none"
        />
        <button
          onClick={handleSaveIntro}
          disabled={introSaving}
          className="btn-primary mt-4 !py-2 !px-4 text-xs"
        >
          <Save size={13} />
          {introSaving ? "Saving..." : "Save Intro"}
        </button>
      </div>

      {/* Add new programme */}
      <div className="bg-white border border-[#E8E8E8] p-6 mb-8 max-w-3xl">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-4">
          Add Programme
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <select
            className="input-dhi"
            value={draft.pillar}
            onChange={(e) =>
              setDraft({ ...draft, pillar: e.target.value as Programme["pillar"] })
            }
          >
            <option value="financial_literacy">Financial Literacy</option>
            <option value="data_literacy">Data Literacy</option>
          </select>
          <input
            className="input-dhi"
            placeholder="Badge (e.g. Course, Scholarship)"
            value={draft.badge}
            onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
          />
          <input
            className="input-dhi sm:col-span-2"
            placeholder="Title"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <input
            className="input-dhi sm:col-span-2"
            placeholder="Subtitle"
            value={draft.subtitle}
            onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
          />
          <textarea
            className="input-dhi sm:col-span-2 resize-none"
            placeholder="Description"
            rows={3}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
          <input
            className="input-dhi sm:col-span-2"
            placeholder="Google Form URL"
            value={draft.google_form_link}
            onChange={(e) => setDraft({ ...draft, google_form_link: e.target.value })}
          />
          <select
            className="input-dhi"
            value={draft.status}
            onChange={(e) =>
              setDraft({ ...draft, status: e.target.value as Programme["status"] })
            }
          >
            <option value="open">Open</option>
            <option value="coming_soon">Coming Soon</option>
            <option value="closed">Closed (hidden)</option>
          </select>
          <input
            type="number"
            className="input-dhi"
            placeholder="Sort order"
            value={draft.sort_order}
            onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
          />
          <label className="flex items-center gap-2 text-sm text-[#4A4A4A] sm:col-span-2">
            <input
              type="checkbox"
              checked={draft.accepting_applications}
              onChange={(e) =>
                setDraft({ ...draft, accepting_applications: e.target.checked })
              }
            />
            Accepting applications
          </label>
        </div>
        <button onClick={handleAdd} disabled={saving} className="btn-primary mt-5">
          <Plus size={15} />
          {saving ? "Adding..." : "Add Programme"}
        </button>
      </div>

      {/* Existing programmes */}
      <div className="space-y-4 max-w-3xl">
        {programmes.map((p) => (
          <div key={p.id} className="bg-white border border-[#E8E8E8] p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                className="input-dhi sm:col-span-2 font-semibold"
                value={p.title}
                onChange={(e) => updateField(p.id!, "title", e.target.value)}
              />
              <input
                className="input-dhi"
                value={p.google_form_link}
                placeholder="Google Form URL"
                onChange={(e) => updateField(p.id!, "google_form_link", e.target.value)}
              />
              <select
                className="input-dhi"
                value={p.status}
                onChange={(e) => updateField(p.id!, "status", e.target.value)}
              >
                <option value="open">Open</option>
                <option value="coming_soon">Coming Soon</option>
                <option value="closed">Closed (hidden)</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-[#4A4A4A]">
                <input
                  type="checkbox"
                  checked={p.accepting_applications}
                  onChange={(e) =>
                    updateField(p.id!, "accepting_applications", e.target.checked)
                  }
                />
                Accepting applications
              </label>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button onClick={() => handleUpdate(p)} className="btn-primary !py-2 !px-4 text-xs">
                <Save size={13} /> Save
              </button>
              <button
                onClick={() => handleDelete(p.id!)}
                className="text-xs text-red-600 flex items-center gap-1 hover:underline"
              >
                <Trash2 size={13} /> Delete
              </button>
              {p.google_form_link && (
                <a
                  href={p.google_form_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 flex items-center gap-1 hover:text-[#BF4E14]"
                >
                  <ExternalLink size={12} /> Preview
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}