"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Twitter, Youtube, Linkedin, Facebook, Instagram, Send, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About DHI" },
  { href: "/programmes", label: "Programmes" },
  { href: "/apply", label: "Apply / Register" },
  { href: "/more#resources", label: "Resources" },
  { href: "/more#newsletter", label: "Newsletter" },
  { href: "/more#contact", label: "Contact" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Thank you for subscribing!");
        setEmail("");
        setName("");
      } else {
        toast.error(data.error || "Something went wrong.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-black text-white">
      {/* Main footer */}
      <div className="container-dhi py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="relative w-[90px] h-[90px] mb-3">
              <Image
                src="/logo.jpeg"
                alt="Da Hausa Initiative"
                fill
                className="object-contain object-left brightness-1 invert"
              />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Simplifying concepts, Strengthening communities — through financial and data literacy for Northern Nigeria.
            </p>
            <div className="flex gap-3">
              <a href="#" aria-label="Twitter" className="text-gray-500 hover:text-[#BF4E14] transition-colors">
                <Twitter size={18} />
              </a>
              <a target="_blank" href="https://www.youtube.com/@Dahausainitiative" aria-label="YouTube" className="text-gray-500 hover:text-[#BF4E14] transition-colors">
                <Youtube size={18} />
              </a>
              <a target="_blank" href="https://www.linkedin.com/company/da-hausa-initiative/" aria-label="LinkedIn" className="text-gray-500 hover:text-[#BF4E14] transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="text-gray-500 hover:text-[#BF4E14] transition-colors">
                <Facebook size={18} />
              </a>
              <a target="_blank" href="https://www.instagram.com/dahausainitiative/" aria-label="Instagram" className="text-gray-500 hover:text-[#BF4E14] transition-colors">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#BF4E14] mb-5">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 text-[#BF4E14] transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#BF4E14] mb-5">
              Contact
            </h4>
            <div className="space-y-3">
              <p className="text-sm text-gray-400">
                <span className="block text-xs text-gray-600 uppercase tracking-wide mb-1">Email</span>
                <a href="mailto:info@dahausa.org" className="hover:text-white transition-colors">
                  info@dahausa.org
                </a>
              </p>
              <p className="text-sm text-gray-400">
                <span className="block text-xs text-gray-600 uppercase tracking-wide mb-1">Location</span>
                FCT, Nigeria
              </p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#BF4E14] mb-5">
              Newsletter
            </h4>
            <p className="text-sm text-gray-400 mb-5 leading-relaxed">
              Get updates on programmes, research, and resources.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-gray-800 text-white text-sm px-4 py-3 focus:border-[#BF4E14] focus:outline-none transition-colors placeholder-gray-600"
              />
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-[#1A1A1A] border border-gray-800 border-r-0 text-white text-sm px-4 py-3 focus:border-[#BF4E14] focus:outline-none transition-colors placeholder-gray-600"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#BF4E14] hover:bg-[#9E3F0F] text-white px-4 py-3 transition-colors disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-900 py-6">
        <div className="container-dhi py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Da Hausa Initiative. All rights reserved.
          </p>
          <p className="text-xs text-gray-700">
            Built for impact in Northern Nigeria.
          </p>
        </div>
      </div>
    </footer>
  );
}
