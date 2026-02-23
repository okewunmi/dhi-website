"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileEdit,
  Users,
  FormInput,
  Send,
  Settings,
  LogOut,
  Globe,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: "Content (CMS)",
    icon: <FileEdit size={18} />,
    children: [
      { href: "/admin/content/home", label: "Home" },
      { href: "/admin/content/about", label: "About" },
      { href: "/admin/content/programmes", label: "Programmes" },
      { href: "/admin/content/more", label: "More Page" },
    ],
  },
  {
    href: "/admin/subscribers",
    label: "Subscribers",
    icon: <Users size={18} />,
  },
  {
    href: "/admin/forms",
    label: "Form Settings",
    icon: <FormInput size={18} />,
  },
  {
    href: "/admin/email",
    label: "Send Newsletter",
    icon: <Send size={18} />,
  },
  {
    href: "/admin/settings",
    label: "Site Settings",
    icon: <Settings size={18} />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>("Content (CMS)");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    toast.success("Logged out.");
    router.push("/admin");
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#E8E8E8]">
        <div className="relative w-[120px] h-[42px]">
          <Image src="/logo.jpeg" alt="DHI" fill className="object-contain object-left" />
        </div>
        <p className="text-[10px] text-[#BF4E14] font-bold uppercase tracking-widest mt-2">
          Admin Panel
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          if (item.children) {
            const isOpen = expanded === item.label;
            const isActive = item.children.some((c) => pathname === c.href);
            return (
              <div key={item.label}>
                <button
                  onClick={() => setExpanded(isOpen ? null : item.label)}
                  className={cn(
                    "admin-sidebar-link w-full justify-between",
                    isActive && "text-[#BF4E14]"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="text-[#BF4E14] opacity-80">{item.icon}</span>
                    {item.label}
                  </span>
                  <ChevronRight
                    size={14}
                    className={cn("transition-transform", isOpen && "rotate-90")}
                  />
                </button>
                {isOpen && (
                  <div className="ml-8 mt-1 space-y-1 mb-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "block px-3 py-2 text-xs font-medium rounded transition-colors",
                          pathname === child.href
                            ? "text-[#BF4E14] bg-[#FEF0E7]"
                            : "text-gray-500 hover:text-[#BF4E14]"
                        )}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "admin-sidebar-link",
                pathname === item.href && "active"
              )}
            >
              <span className="text-[#BF4E14] opacity-80">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-[#E8E8E8] p-3 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-sidebar-link"
        >
          <Globe size={16} className="text-[#BF4E14] opacity-80" />
          View Website
        </a>
        <button onClick={handleLogout} className="admin-sidebar-link w-full">
          <LogOut size={16} className="text-red-400" />
          <span className="text-red-500">Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-[#E8E8E8] z-40">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E8E8E8] flex items-center justify-between px-4 h-14">
        <div className="relative w-[100px] h-[36px]">
          <Image src="/logo.jpeg" alt="DHI Admin" fill className="object-contain object-left" />
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-black p-2">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile sidebar drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 mt-14">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
