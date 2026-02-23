"use client";

import { useState } from "react";
import { ExternalLink, CheckCircle, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

interface FormConfig {
  show_home_cfo_form: boolean;
  home_cfo_use_google_form: boolean;
  home_cfo_google_link: string;
  show_scholarship_form: boolean;
  scholarship_use_google_form: boolean;
  scholarship_google_link: string;
  apply_page_intro: string;
}

function ApplicationForm({
  title,
  description,
  formType,
}: {
  title: string;
  description: string;
  formType: "home_cfo" | "scholarship";
}) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    state: "",
    motivation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, form_type: formType }),
      });
      if (res.ok) {
        setSubmitted(true);
        toast.success("Application submitted successfully!");
      } else {
        const d = await res.json();
        toast.error(d.error || "Something went wrong.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#F5F5F5] p-10 flex flex-col items-center text-center">
        <CheckCircle size={48} className="text-[#BF4E14] mb-5" strokeWidth={1.5} />
        <h3 className="font-display text-2xl font-light text-black mb-3">Application Received</h3>
        <p className="text-[#4A4A4A] text-sm max-w-sm">
          Thank you for applying. We&apos;ve received your application and will be in touch within 5–7 working days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label-dhi">Full Name *</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="input-dhi"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="label-dhi">Email Address *</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="input-dhi"
            placeholder="your@email.com"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label-dhi">Phone Number</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="input-dhi"
            placeholder="+234 xxx xxx xxxx"
          />
        </div>
        <div>
          <label className="label-dhi">State of Residence *</label>
          <select
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            className="input-dhi"
          >
            <option value="">Select state</option>
            {[
              "Kano", "Kaduna", "Katsina", "Sokoto", "Zamfara", "Kebbi",
              "Niger", "Jigawa", "Bauchi", "Gombe", "Yobe", "Borno",
              "Adamawa", "Taraba", "Plateau", "Nasarawa", "Kogi",
              "Benue", "FCT – Abuja", "Other",
            ].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="label-dhi">Why are you applying? *</label>
        <textarea
          name="motivation"
          value={form.motivation}
          onChange={handleChange}
          required
          rows={4}
          className="input-dhi resize-none"
          placeholder="Tell us briefly why you want to join this programme and what you hope to gain..."
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center"
      >
        {loading ? "Submitting..." : "Submit Application"}
        <ArrowRight size={16} />
      </button>
      <p className="text-xs text-gray-400 text-center">
        Fields marked with * are required.
      </p>
    </form>
  );
}

export default function ApplyClient({ formConfig }: { formConfig: FormConfig }) {
  const [activeTab, setActiveTab] = useState<"home_cfo" | "scholarship">("home_cfo");

  const showAny = formConfig.show_home_cfo_form || formConfig.show_scholarship_form;

  return (
    <>
      {/* Hero */}
      <section className="bg-[#F5F5F5] py-20 lg:py-28">
        <div className="container-dhi">
          <span className="section-label">Take Action</span>
          <h1 className="font-display text-5xl lg:text-7xl font-light text-black mb-6 max-w-3xl">
            Apply / Register
          </h1>
          <p className="text-[#4A4A4A] text-lg max-w-2xl">{formConfig.apply_page_intro}</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-dhi">
          {!showAny ? (
            <div className="text-center py-20">
              <p className="text-[#4A4A4A] text-lg mb-6">
                Applications are currently closed. Check back soon or subscribe to our newsletter for updates.
              </p>
              <Link href="/more#newsletter" className="btn-primary">
                Subscribe for Updates
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <h2 className="font-display text-3xl font-light text-black mb-6">
                  Choose a Programme
                </h2>
                <div className="space-y-3">
                  {formConfig.show_home_cfo_form && (
                    <button
                      onClick={() => setActiveTab("home_cfo")}
                      className={`w-full text-left p-5 border-2 transition-all ${
                        activeTab === "home_cfo"
                          ? "border-[#BF4E14] bg-[#FEF0E7]"
                          : "border-[#E8E8E8] hover:border-[#BF4E14]"
                      }`}
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-[#BF4E14] mb-1">
                        Course
                      </p>
                      <p className="font-semibold text-black">Home CFO Course</p>
                      <p className="text-xs text-gray-500 mt-1">Financial literacy for households</p>
                    </button>
                  )}
                  {formConfig.show_scholarship_form && (
                    <button
                      onClick={() => setActiveTab("scholarship")}
                      className={`w-full text-left p-5 border-2 transition-all ${
                        activeTab === "scholarship"
                          ? "border-[#BF4E14] bg-[#FEF0E7]"
                          : "border-[#E8E8E8] hover:border-[#BF4E14]"
                      }`}
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-[#BF4E14] mb-1">
                        Scholarship
                      </p>
                      <p className="font-semibold text-black">Hausa Tech Training Scholarship</p>
                      <p className="text-xs text-gray-500 mt-1">Data literacy & tech training</p>
                    </button>
                  )}
                </div>

                <div className="mt-8 p-5 bg-[#F5F5F5]">
                  <p className="text-xs font-bold uppercase tracking-wide text-[#BF4E14] mb-2">
                    Questions?
                  </p>
                  <p className="text-sm text-[#4A4A4A]">
                    Reach out to us at{" "}
                    <a href="mailto:info@dahausa.org" className="text-[#BF4E14] underline">
                      info@dahausa.org
                    </a>
                  </p>
                </div>
              </div>

              {/* Form panel */}
              <div className="lg:col-span-2">
                {activeTab === "home_cfo" && formConfig.show_home_cfo_form && (
                  <div>
                    <div className="mb-8">
                      <h2 className="font-display text-3xl font-light text-black mb-2">
                        Home CFO Course
                      </h2>
                      <p className="text-[#4A4A4A] text-sm">
                        Learn to manage household finances with confidence and clarity.
                      </p>
                    </div>
                    {formConfig.home_cfo_use_google_form && formConfig.home_cfo_google_link ? (
                      <div className="text-center py-12 border border-[#E8E8E8]">
                        <p className="text-[#4A4A4A] mb-6 text-sm">
                          This application uses a Google Form. Click below to apply.
                        </p>
                        <a
                          href={formConfig.home_cfo_google_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center gap-2"
                        >
                          Open Application Form
                          <ExternalLink size={15} />
                        </a>
                      </div>
                    ) : (
                      <ApplicationForm
                        title="Home CFO Course"
                        description=""
                        formType="home_cfo"
                      />
                    )}
                  </div>
                )}

                {activeTab === "scholarship" && formConfig.show_scholarship_form && (
                  <div>
                    <div className="mb-8">
                      <h2 className="font-display text-3xl font-light text-black mb-2">
                        Hausa Tech Training Scholarship
                      </h2>
                      <p className="text-[#4A4A4A] text-sm">
                        Access funded data literacy training — Excel, Power BI, and more.
                      </p>
                    </div>
                    {formConfig.scholarship_use_google_form && formConfig.scholarship_google_link ? (
                      <div className="text-center py-12 border border-[#E8E8E8]">
                        <p className="text-[#4A4A4A] mb-6 text-sm">
                          This application uses a Google Form. Click below to apply.
                        </p>
                        <a
                          href={formConfig.scholarship_google_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary inline-flex items-center gap-2"
                        >
                          Open Application Form
                          <ExternalLink size={15} />
                        </a>
                      </div>
                    ) : (
                      <ApplicationForm
                        title="Hausa Tech Training Scholarship"
                        description=""
                        formType="scholarship"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
