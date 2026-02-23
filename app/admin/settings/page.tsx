"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import toast from "react-hot-toast";

interface SiteInfo {
  site_name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  twitter: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export default function AdminSettingsPage() {
  const [siteInfo, setSiteInfo] = useState<SiteInfo>({
    site_name: "Da Hausa Initiative",
    tagline: "Simplifying concepts, Strengthening communities",
    email: "",
    phone: "",
    address: "FCT, Nigeria",
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings?key=site_info")
      .then((r) => r.json())
      .then((d) => { if (d.value) setSiteInfo(d.value); })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "site_info", value: siteInfo }),
      });
      if (res.ok) toast.success("Settings saved.");
      else toast.error("Save failed.");
    } catch {
      toast.error("Error saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="lg:mt-0 mt-14 py-20 text-center text-gray-400">Loading...</div>;

  return (
    <div className="lg:mt-0 mt-14">
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Configure</p>
        <h1 className="font-display text-3xl font-light text-black">Site Settings</h1>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-white border border-[#E8E8E8] p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-5">
            Organisation Info
          </h2>
          <div className="space-y-4">
            {[
              { key: "site_name", label: "Site Name" },
              { key: "tagline", label: "Tagline" },
              { key: "email", label: "Contact Email" },
              { key: "phone", label: "Phone Number" },
              { key: "address", label: "Address" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="label-dhi">{label}</label>
                <input
                  value={siteInfo[key as keyof SiteInfo]}
                  onChange={(e) => setSiteInfo({ ...siteInfo, [key]: e.target.value })}
                  className="input-dhi"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E8E8E8] p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-5">
            Social Media Links
          </h2>
          <div className="space-y-4">
            {[
              { key: "twitter", label: "Twitter / X URL" },
              { key: "facebook", label: "Facebook URL" },
              { key: "instagram", label: "Instagram URL" },
              { key: "linkedin", label: "LinkedIn URL" },
              { key: "youtube", label: "YouTube URL" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="label-dhi">{label}</label>
                <input
                  type="url"
                  value={siteInfo[key as keyof SiteInfo]}
                  onChange={(e) => setSiteInfo({ ...siteInfo, [key]: e.target.value })}
                  className="input-dhi"
                  placeholder="https://..."
                />
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary">
          <Save size={15} />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
