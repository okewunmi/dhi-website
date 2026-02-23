"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function UnsubscribeClient() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(emailParam);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setDone(true);
    } catch {
      // fail silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="relative w-[120px] h-[44px] mx-auto mb-6">
          <Image src="/logo.jpeg" alt="Da Hausa Initiative" fill className="object-contain" />
        </div>
      </div>
      <div className="bg-white border border-[#E8E8E8] p-8">
        {done ? (
          <div className="text-center">
            <CheckCircle size={40} className="text-[#BF4E14] mx-auto mb-4" strokeWidth={1.5} />
            <h2 className="font-display text-2xl font-light text-black mb-2">
              Unsubscribed
            </h2>
            <p className="text-[#4A4A4A] text-sm mb-6">
              You've been removed from the Da Hausa Initiative mailing list.
            </p>
            <Link href="/" className="btn-outline-orange text-sm">
              Return to Website
            </Link>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl font-light text-black mb-2">
              Unsubscribe
            </h2>
            <p className="text-sm text-[#4A4A4A] mb-6">
              Enter your email address to unsubscribe from the Da Hausa Initiative newsletter.
            </p>
            <form onSubmit={handleUnsubscribe} className="space-y-4">
              <div>
                <label className="label-dhi">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-dhi"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
                {loading ? "Processing..." : "Unsubscribe"}
              </button>
            </form>
            <p className="text-center mt-4">
              <Link href="/" className="text-xs text-gray-400 hover:text-[#BF4E14] transition-colors">
                Changed your mind? Return to site
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
