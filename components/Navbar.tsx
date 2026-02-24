// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import { Menu, X } from "lucide-react";
// import { cn } from "@/lib/utils";

// const NAV_LINKS = [
//   { href: "/", label: "Home" },
//   { href: "/about", label: "About" },
//   { href: "/programmes", label: "Programmes" },
//   { href: "/apply", label: "Apply / Register" },
//   { href: "/more", label: "More" },
// ];

// export default function Navbar() {
//   const pathname = usePathname();
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     setMobileOpen(false);
//   }, [pathname]);

//   return (
//     <header
//       className={cn(
//         "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
//         scrolled
//           ? "bg-white border-b border-[#E8E8E8] shadow-sm"
//           : "bg-white border-b border-[#E8E8E8]"
//       )}
//     >
//       <div className="container-dhi">
//         <div className="flex items-center justify-between h-[70px]">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-3 flex-shrink-0">
//             <div className="relative w-[120px] h-[90px]">
//               <Image
//                 src="/logo.jpeg"
//                 alt="Da Hausa Initiative"
//                 fill
//                 className="object-contain object-left"
//                 priority
//               />
//             </div>
//           </Link>

//           {/* Desktop Nav */}
//           <nav className="hidden lg:flex items-center gap-8">
//             {NAV_LINKS.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className={cn(
//                   "nav-link",
//                   pathname === link.href && "active text-brand-orange border-brand-orange"
//                 )}
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </nav>

//           {/* CTA + Mobile Toggle */}
//           <div className="flex items-center gap-3">
//             <Link href="/apply" className="hidden lg:inline-flex btn-primary text-sm">
//               Apply Now
//             </Link>
//             <button
//               onClick={() => setMobileOpen(!mobileOpen)}
//               className="lg:hidden p-2 text-black"
//               aria-label="Toggle menu"
//             >
//               {mobileOpen ? <X size={22} /> : <Menu size={22} />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Nav */}
//       {mobileOpen && (
//         <div className="lg:hidden bg-white border-t border-[#E8E8E8] animate-fade-in">
//           <div className="container-dhi py-4">
//             {NAV_LINKS.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className={cn(
//                   "block py-3 px-2 text-sm font-medium border-b border-[#F5F5F5] uppercase tracking-wide",
//                   pathname === link.href
//                     ? "text-brand-orange"
//                     : "text-black hover:text-brand-orange"
//                 )}
//               >
//                 {link.label}
//               </Link>
//             ))}
//             <div className="pt-4">
//               <Link href="/apply" className="btn-primary w-full justify-center">
//                 Apply Now
//               </Link>
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }

"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/programmes", label: "Programmes" },
  { href: "/apply", label: "Apply / Register" },
  { href: "/more", label: "More" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white shadow-sm" : "bg-white",
        "border-b border-[#E8E8E8]"
      )}
    >
      <div className="container-dhi">
        <div className="flex items-center justify-between h-[64px] md:h-[70px]">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <div className="relative w-[80px] h-[56px] md:w-[80px] md:h-[56px]">
              <Image
                src="/logo.jpeg"
                alt="Da Hausa Initiative"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "nav-link text-sm",
                  pathname === link.href && "active text-brand-orange border-brand-orange"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA (hidden on mobile — already in mobile menu) */}
          <div className="hidden lg:flex items-center">
            <Link href="/apply" className="btn-primary text-sm">
              Apply Now
            </Link>
          </div>

          {/* Mobile hamburger only */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-black rounded hover:bg-[#F5F5F5] transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-[#E8E8E8] animate-fade-in">
          <div className="container-dhi py-2 pb-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center py-3.5 px-2 text-sm font-medium border-b border-[#F5F5F5] uppercase tracking-wide transition-colors",
                  pathname === link.href
                    ? "text-[#BF4E14]"
                    : "text-black hover:text-[#BF4E14]"
                )}
              >
                {pathname === link.href && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#BF4E14] mr-3 flex-shrink-0" />
                )}
                {link.label}
              </Link>
            ))}
            {/* Apply button inside mobile menu */}
            <div className="pt-5">
              <Link href="/apply" className="btn-primary w-full justify-center text-sm">
                Apply Now
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}