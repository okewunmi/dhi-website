// "use client";

// import Link from "next/link";
// import { useState } from "react";
// import { Send, ArrowRight } from "lucide-react";
// import toast from "react-hot-toast";

// interface NewsletterData {
//   headline?: string;
//   body?: string;
//   cta_text?: string;
//   cta_link?: string;
// }

// export default function HomeNewsletter({ data }: { data: NewsletterData }) {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!email) return;
//     setLoading(true);
//     try {
//       const res = await fetch("/api/subscribe", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, name }),
//       });
//       const json = await res.json();
//       if (res.ok) {
//         toast.success("Subscribed successfully!");
//         setEmail("");
//         setName("");
//       } else {
//         toast.error(json.error || "Something went wrong.");
//       }
//     } catch {
//       toast.error("Connection error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="section-padding bg-[#BF4E14] text-white">
//       <div className="container-dhi">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           <div>
//             <span className="text-xs font-bold uppercase tracking-widest text-orange-200 mb-4 block">
//               Newsletter
//             </span>
//             <h2 className="font-display text-4xl lg:text-5xl font-light text-white mb-4">
//               {data.headline || "Stay Connected"}
//             </h2>
//             <p className="text-orange-100 leading-relaxed max-w-md">
//               {data.body ||
//                 "Join our newsletter for updates on programmes, research, and resources tailored for Northern Nigeria."}
//             </p>
//           </div>

//           <div>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Your name (optional)"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full bg-white/10 border border-white/30 text-white text-sm px-4 py-3.5 placeholder-white/50 focus:outline-none focus:border-white transition-colors"
//               />
//               <div className="flex">
//                 <input
//                   type="email"
//                   placeholder="Your email address"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                   className="flex-1 bg-white/10 border border-white/30 border-r-0 text-white text-sm px-4 py-3.5 placeholder-white/50 focus:outline-none focus:border-white transition-colors"
//                 />
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="bg-black hover:bg-[#1A1A1A] text-white px-6 py-3.5 flex items-center gap-2 text-sm font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
//                 >
//                   {loading ? "..." : <>Subscribe <Send size={14} /></>}
//                 </button>
//               </div>
//               <p className="text-xs text-orange-200">
//                 No spam, ever. Unsubscribe at any time.
//               </p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }


"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

interface NewsletterData {
  headline?: string;
  body?: string;
}

export default function HomeNewsletter({ data }: { data: NewsletterData }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const json = await res.json();
      if (res.ok) {
        toast.success("Subscribed successfully!");
        setEmail("");
        setName("");
      } else {
        toast.error(json.error || "Something went wrong.");
      }
    } catch {
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-padding bg-[#BF4E14] text-white">
      <div className="container-dhi">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">

          {/* Left: copy */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-200 mb-4 block">
              Newsletter
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-white mb-4">
              {data.headline || "Stay Connected"}
            </h2>
            <p className="text-orange-100 leading-relaxed max-w-md text-sm sm:text-base">
              {data.body ||
                "Join our newsletter for updates on programmes, research, and resources tailored for Northern Nigeria."}
            </p>
          </div>

          {/* Right: form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 border border-white/30 text-white text-sm px-4 py-3.5 placeholder-white/50 focus:outline-none focus:border-white transition-colors"
              />

              {/* Email + button: stacked on mobile, inline on sm+ */}
              <div className="flex flex-col sm:flex-row gap-0">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full sm:flex-1 bg-white/10 border border-white/30 sm:border-r-0 text-white text-sm px-4 py-3.5 placeholder-white/50 focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-black hover:bg-[#1A1A1A] text-white px-6 py-3.5 flex items-center justify-center gap-2 text-sm font-semibold transition-colors disabled:opacity-50 border border-black"
                >
                  {loading ? "Sending..." : (
                    <>
                      Subscribe <Send size={14} />
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-orange-200">
                No spam, ever. Unsubscribe at any time.
              </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}