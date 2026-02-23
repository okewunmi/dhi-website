import { Suspense } from "react";
import UnsubscribeClient from "@/components/UnsubscribeClient";

export default function UnsubscribePage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6">
      <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
        <UnsubscribeClient />
      </Suspense>
    </div>
  );
}
