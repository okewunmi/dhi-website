"use client";

import { Download } from "lucide-react";

interface Subscriber {
  email: string;
  name?: string;
  subscribed_at: string;
}

export default function SubscriberActions({
  subscribers,
}: {
  subscribers: Subscriber[];
}) {
  const exportCsv = () => {
    const header = "email,name,subscribed_at";
    const rows = subscribers.map(
      (s) => `${s.email},${s.name || ""},${s.subscribed_at}`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dhi-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={exportCsv}
      className="flex items-center gap-2 text-xs text-[#BF4E14] font-semibold hover:underline"
    >
      <Download size={13} />
      Export CSV
    </button>
  );
}
