"use client";

import { useEffect, useState } from "react";
import { Save, ToggleLeft, ToggleRight, ExternalLink } from "lucide-react";
import toast from "react-hot-toast";

interface FormSettings {
  show_home_cfo_form: boolean;
  home_cfo_use_google_form: boolean;
  home_cfo_google_link: string;
  show_scholarship_form: boolean;
  scholarship_use_google_form: boolean;
  scholarship_google_link: string;
  apply_page_intro: string;
}

export default function FormsPage() {
  const [settings, setSettings] = useState<FormSettings>({
    show_home_cfo_form: true,
    home_cfo_use_google_form: false,
    home_cfo_google_link: "",
    show_scholarship_form: true,
    scholarship_use_google_form: false,
    scholarship_google_link: "",
    apply_page_intro: "Apply for our programmes and scholarships below.",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings?key=apply_form_settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.value) setSettings(data.value);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "apply_form_settings", value: settings }),
      });
      if (res.ok) {
        toast.success("Form settings saved.");
      } else {
        toast.error("Save failed.");
      }
    } catch {
      toast.error("Error saving.");
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({
    value,
    onChange,
    label,
  }: {
    value: boolean;
    onChange: (v: boolean) => void;
    label: string;
  }) => (
    <button
      onClick={() => onChange(!value)}
      className={`flex items-center gap-3 px-4 py-3 border-2 transition-all w-full text-left ${
        value
          ? "border-[#BF4E14] bg-[#FEF0E7]"
          : "border-[#E8E8E8] bg-white"
      }`}
    >
      {value ? (
        <ToggleRight size={22} className="text-[#BF4E14]" />
      ) : (
        <ToggleLeft size={22} className="text-gray-400" />
      )}
      <span className={`text-sm font-medium ${value ? "text-[#BF4E14]" : "text-gray-600"}`}>
        {label}
      </span>
    </button>
  );

  if (loading) {
    return (
      <div className="lg:mt-0 mt-14 flex items-center justify-center py-20">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="lg:mt-0 mt-14">
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Manage</p>
        <h1 className="font-display text-3xl font-light text-black">Form Settings</h1>
        <p className="text-sm text-gray-500 mt-2">
          Control which application forms are visible on the Apply page.
          You can toggle visibility, switch to Google Forms, or add an external link.
        </p>
      </div>

      <div className="space-y-8 max-w-2xl">
        {/* Page intro */}
        <div className="bg-white border border-[#E8E8E8] p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-4">
            Page Introduction
          </h2>
          <textarea
            value={settings.apply_page_intro}
            onChange={(e) => setSettings({ ...settings, apply_page_intro: e.target.value })}
            rows={3}
            className="input-dhi resize-none"
          />
        </div>

        {/* Home CFO Form */}
        <div className="bg-white border border-[#E8E8E8] p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-5">
            Home CFO Course Form
          </h2>
          <div className="space-y-4">
            <Toggle
              value={settings.show_home_cfo_form}
              onChange={(v) => setSettings({ ...settings, show_home_cfo_form: v })}
              label={settings.show_home_cfo_form ? "Form is visible on Apply page" : "Form is hidden"}
            />

            {settings.show_home_cfo_form && (
              <Toggle
                value={settings.home_cfo_use_google_form}
                onChange={(v) => setSettings({ ...settings, home_cfo_use_google_form: v })}
                label={
                  settings.home_cfo_use_google_form
                    ? "Using Google Form link (external)"
                    : "Using built-in application form"
                }
              />
            )}

            {settings.show_home_cfo_form && settings.home_cfo_use_google_form && (
              <div>
                <label className="label-dhi">Google Form URL</label>
                <input
                  type="url"
                  value={settings.home_cfo_google_link}
                  onChange={(e) =>
                    setSettings({ ...settings, home_cfo_google_link: e.target.value })
                  }
                  className="input-dhi"
                  placeholder="https://forms.google.com/..."
                />
                {settings.home_cfo_google_link && (
                  <a
                    href={settings.home_cfo_google_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-[#BF4E14] mt-2 hover:underline"
                  >
                    <ExternalLink size={12} /> Preview link
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Scholarship Form */}
        <div className="bg-white border border-[#E8E8E8] p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-5">
            Hausa Tech Training Scholarship
          </h2>
          <div className="space-y-4">
            <Toggle
              value={settings.show_scholarship_form}
              onChange={(v) => setSettings({ ...settings, show_scholarship_form: v })}
              label={settings.show_scholarship_form ? "Form is visible on Apply page" : "Form is hidden"}
            />

            {settings.show_scholarship_form && (
              <Toggle
                value={settings.scholarship_use_google_form}
                onChange={(v) => setSettings({ ...settings, scholarship_use_google_form: v })}
                label={
                  settings.scholarship_use_google_form
                    ? "Using Google Form link (external)"
                    : "Using built-in application form"
                }
              />
            )}

            {settings.show_scholarship_form && settings.scholarship_use_google_form && (
              <div>
                <label className="label-dhi">Google Form URL</label>
                <input
                  type="url"
                  value={settings.scholarship_google_link}
                  onChange={(e) =>
                    setSettings({ ...settings, scholarship_google_link: e.target.value })
                  }
                  className="input-dhi"
                  placeholder="https://forms.google.com/..."
                />
                {settings.scholarship_google_link && (
                  <a
                    href={settings.scholarship_google_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs text-[#BF4E14] mt-2 hover:underline"
                  >
                    <ExternalLink size={12} /> Preview link
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Save */}
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          <Save size={15} />
          {saving ? "Saving..." : "Save Form Settings"}
        </button>
      </div>
    </div>
  );
}
