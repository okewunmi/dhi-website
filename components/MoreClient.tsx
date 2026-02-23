"use client";

import { useState } from "react";
import { Mic, Youtube, FileText, Film, ExternalLink, Send, CheckCircle, ArrowRight, Mail, MapPin } from "lucide-react";
import toast from "react-hot-toast";

interface Resource {
  title: string;
  type: string;
  description: string;
  link: string;
  icon: string;
  coming_soon?: boolean;
}

const RESOURCE_ICONS: Record<string, React.ReactNode> = {
  Mic: <Mic size={22} strokeWidth={1.5} />,
  Youtube: <Youtube size={22} strokeWidth={1.5} />,
  FileText: <FileText size={22} strokeWidth={1.5} />,
  Film: <Film size={22} strokeWidth={1.5} />,
};

export default function MoreClient({
  resources: resourcesData,
  contact: contactData,
}: {
  resources: Record<string, unknown>;
  contact: Record<string, unknown>;
}) {
  const [email, setEmail] = useState("");
  const [subName, setSubName] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [subDone, setSubDone] = useState(false);

  const [contactForm, setContactForm] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactDone, setContactDone] = useState(false);

  const resourceList = (resourcesData?.resources as Resource[]) || [];
  const showContactForm = (contactData?.show_contact_form as boolean) ?? true;
  const contactEmail = (contactData?.email as string) || "info@dahausa.org";
  const contactAddress = (contactData?.address as string) || "FCT, Nigeria";

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name: subName }),
      });
      const json = await res.json();
      if (res.ok) {
        setSubDone(true);
        toast.success("Subscribed successfully!");
      } else {
        toast.error(json.error || "Something went wrong.");
      }
    } catch {
      toast.error("Connection error.");
    } finally {
      setSubLoading(false);
    }
  };

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (res.ok) {
        setContactDone(true);
        toast.success("Message sent successfully!");
      } else {
        const d = await res.json();
        toast.error(d.error || "Something went wrong.");
      }
    } catch {
      toast.error("Connection error.");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <>
      {/* Resources */}
      <section id="resources" className="section-padding bg-white">
        <div className="container-dhi">
          <span className="section-label">Learn & Explore</span>
          <h2 className="font-display text-4xl font-light text-black mb-3">
            {(resourcesData.headline as string) || "Resources"}
          </h2>
          <p className="text-[#4A4A4A] mb-12 max-w-xl">
            {(resourcesData.description as string) || "Explore our collection of podcasts, videos, research papers, and more."}
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resourceList.map((resource, i) => (
              <div
                key={i}
                className={`border border-[#E8E8E8] p-7 group hover:border-[#BF4E14] transition-all ${resource.coming_soon ? "opacity-70" : ""}`}
              >
                <div className="text-[#BF4E14] mb-5">
                  {RESOURCE_ICONS[resource.icon] || <FileText size={22} strokeWidth={1.5} />}
                </div>
                <span className="badge mb-3 inline-block">{resource.type}</span>
                <h3 className="font-semibold text-black mb-2 text-base group-hover:text-[#BF4E14] transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-[#4A4A4A] mb-5 leading-relaxed">{resource.description}</p>
                {resource.coming_soon ? (
                  <span className="text-xs font-bold uppercase tracking-wide text-gray-400">Coming Soon</span>
                ) : (
                  <a
                    href={resource.link || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#BF4E14] hover:gap-3 transition-all"
                  >
                    Access Resource
                    <ExternalLink size={13} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="section-padding bg-[#F5F5F5]">
        <div className="container-dhi">
          <div className="max-w-2xl mx-auto text-center">
            <span className="section-label block text-center">Stay Informed</span>
            <h2 className="font-display text-4xl font-light text-black mb-4">
              Subscribe to Our Newsletter
            </h2>
            <p className="text-[#4A4A4A] mb-10">
              Get updates on our programmes, research findings, and resources delivered directly to your inbox.
              No spam. Unsubscribe at any time.
            </p>

            {subDone ? (
              <div className="bg-white p-10 border border-[#E8E8E8] flex flex-col items-center">
                <CheckCircle size={40} className="text-[#BF4E14] mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-2xl font-light text-black mb-2">You're subscribed!</h3>
                <p className="text-[#4A4A4A] text-sm">Check your inbox for a welcome email from Da Hausa Initiative.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="bg-white p-8 border border-[#E8E8E8]">
                <div className="space-y-4">
                  <div>
                    <label className="label-dhi text-left block">Your Name</label>
                    <input
                      type="text"
                      placeholder="Optional"
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      className="input-dhi"
                    />
                  </div>
                  <div>
                    <label className="label-dhi text-left block">Email Address *</label>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="input-dhi"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={subLoading}
                    className="btn-primary w-full justify-center"
                  >
                    {subLoading ? "Subscribing..." : <>Subscribe <Send size={14} /></>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section-padding bg-white">
        <div className="container-dhi">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Info */}
            <div>
              <span className="section-label">Get in Touch</span>
              <h2 className="font-display text-4xl font-light text-black mb-4">
                {(contactData.headline as string) || "Get in Touch"}
              </h2>
              <div className="w-12 h-0.5 bg-[#BF4E14] mb-8" />
              <p className="text-[#4A4A4A] mb-10 leading-relaxed">
                {(contactData.description as string) || "Have a question, partnership inquiry, or want to learn more about our work?"}
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#BF4E14] flex items-center justify-center text-[#BF4E14] flex-shrink-0">
                    <Mail size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#BF4E14] mb-1">Email</p>
                    <a href={`mailto:${contactEmail}`} className="text-black hover:text-[#BF4E14] transition-colors">
                      {contactEmail}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#BF4E14] flex items-center justify-center text-[#BF4E14] flex-shrink-0">
                    <MapPin size={18} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#BF4E14] mb-1">Location</p>
                    <p className="text-black">{contactAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              {showContactForm ? (
                contactDone ? (
                  <div className="bg-[#F5F5F5] p-10 flex flex-col items-center text-center">
                    <CheckCircle size={40} className="text-[#BF4E14] mb-4" strokeWidth={1.5} />
                    <h3 className="font-display text-2xl font-light text-black mb-2">Message Sent</h3>
                    <p className="text-[#4A4A4A] text-sm">Thank you for reaching out. We'll get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleContact} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="label-dhi">Name *</label>
                        <input
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          required
                          className="input-dhi"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="label-dhi">Email *</label>
                        <input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          required
                          className="input-dhi"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="label-dhi">Subject</label>
                      <input
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                        className="input-dhi"
                        placeholder="What is this about?"
                      />
                    </div>
                    <div>
                      <label className="label-dhi">Message *</label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                        rows={5}
                        className="input-dhi resize-none"
                        placeholder="Your message..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={contactLoading}
                      className="btn-primary w-full justify-center"
                    >
                      {contactLoading ? "Sending..." : <>Send Message <ArrowRight size={15} /></>}
                    </button>
                  </form>
                )
              ) : (
                <div className="bg-[#F5F5F5] p-10 text-center">
                  <p className="text-[#4A4A4A] mb-4">Please reach out via email:</p>
                  <a href={`mailto:${contactEmail}`} className="btn-primary inline-flex">
                    {contactEmail}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
