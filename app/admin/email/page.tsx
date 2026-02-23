"use client";

import { useState, useEffect } from "react";
import { Send, Users, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminEmailPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    fetch("/api/subscribers/count")
      .then((r) => r.json())
      .then((d) => setSubscriberCount(d.count))
      .catch(() => {});
  }, []);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Subject and body are required.");
      return;
    }
    if (!window.confirm(`Send newsletter to all active subscribers?`)) return;

    setSending(true);
    try {
      const res = await fetch("/api/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Newsletter sent to ${data.sent} subscribers!`);
        setSubject("");
        setBody("");
      } else {
        toast.error(data.error || "Failed to send newsletter.");
      }
    } catch {
      toast.error("Connection error.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="lg:mt-0 mt-14">
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Email</p>
        <h1 className="font-display text-3xl font-light text-black">Send Newsletter</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Compose */}
          <div className="bg-white border border-[#E8E8E8] p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-5">
              Compose
            </h2>
            <div className="space-y-5">
              <div>
                <label className="label-dhi">Subject Line *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-dhi"
                  placeholder="e.g. DHI Programme Update – February 2026"
                />
              </div>
              <div>
                <label className="label-dhi">Email Body *</label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={12}
                  className="input-dhi resize-y"
                  placeholder={`Write your newsletter here. Each paragraph on a new line will be formatted as a separate paragraph in the email.

You can include:
- Programme updates
- New resources
- Research highlights
- Upcoming events

Keep it clear, direct, and useful.`}
                />
                <p className="text-xs text-gray-400 mt-2">
                  Each new line becomes a paragraph. Links will be clickable in the email.
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          {preview && (
            <div className="bg-white border border-[#E8E8E8] p-6">
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-5">
                Preview
              </h2>
              <div className="border border-[#E8E8E8] p-6 bg-[#F5F5F5]">
                <div className="bg-[#BF4E14] p-5 mb-0">
                  <p className="text-white font-bold">Da Hausa Initiative</p>
                  <p className="text-orange-200 text-xs">Simplifying concepts, Strengthening communities</p>
                </div>
                <div className="bg-white p-6">
                  <h2 className="font-bold text-[#BF4E14] text-xl mb-4">{subject || "(No subject)"}</h2>
                  <p className="text-gray-600 text-sm mb-4">Dear Friend,</p>
                  {body.split("\n").map((line, i) =>
                    line.trim() ? (
                      <p key={i} className="text-black text-sm mb-3 leading-relaxed">
                        {line}
                      </p>
                    ) : (
                      <br key={i} />
                    )
                  )}
                </div>
                <div className="bg-[#F5F5F5] p-4 text-xs text-gray-400">
                  You received this because you subscribed to Da Hausa Initiative · Unsubscribe
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setPreview(!preview)}
              className="btn-secondary"
            >
              {preview ? "Hide Preview" : "Preview Email"}
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !subject || !body}
              className="btn-primary"
            >
              <Send size={15} />
              {sending ? "Sending..." : "Send to All Subscribers"}
            </button>
          </div>
        </div>

        {/* Sidebar info */}
        <div className="space-y-5">
          <div className="bg-white border border-[#E8E8E8] p-5">
            <div className="flex items-center gap-3 mb-3">
              <Users size={18} className="text-[#BF4E14]" />
              <h3 className="text-sm font-bold uppercase tracking-wide text-gray-600">
                Recipients
              </h3>
            </div>
            <p className="text-3xl font-bold text-black">
              {subscriberCount ?? "—"}
            </p>
            <p className="text-xs text-gray-500 mt-1">Active subscribers</p>
          </div>

          <div className="bg-[#FEF0E7] border border-[#BF4E14]/20 p-5">
            <div className="flex gap-3">
              <AlertCircle size={16} className="text-[#BF4E14] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#BF4E14] mb-2">Before you send</p>
                <ul className="text-xs text-gray-700 space-y-2">
                  <li>• Check the subject line for typos</li>
                  <li>• Preview the email first</li>
                  <li>• This will send to ALL active subscribers</li>
                  <li>• You cannot undo a send</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E8E8E8] p-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-gray-600 mb-3">
              Tips
            </h3>
            <ul className="text-xs text-gray-500 space-y-2">
              <li>• Keep subject lines under 50 characters</li>
              <li>• Start with the most important update</li>
              <li>• Include a clear call to action</li>
              <li>• Emails are sent via Resend with DHI branding</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
