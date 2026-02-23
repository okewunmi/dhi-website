"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        toast.success("Welcome to the admin panel.");
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        toast.error("Invalid credentials.");
      }
    } catch {
      toast.error("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="relative w-[140px] h-[52px] mx-auto mb-6">
            <Image src="/logo.jpeg" alt="Da Hausa Initiative" fill className="object-contain" />
          </div>
          <h1 className="font-display text-2xl font-light text-black">Admin Panel</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to manage website content</p>
        </div>

        <div className="bg-white border border-[#E8E8E8] p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label-dhi">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-dhi pr-12"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center"
            >
              <Lock size={15} />
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Da Hausa Initiative · Admin Access Only
        </p>
      </div>
    </div>
  );
}
