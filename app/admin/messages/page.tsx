import AdminMessagesClient from "@/components/admin/AdminMessagesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function AdminMessagesPage() {
  return (
    <div className="lg:mt-0 mt-14">
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Admin</p>
        <h1 className="font-display text-3xl font-light text-black">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage contact form submissions.
        </p>
      </div>
      <AdminMessagesClient />
    </div>
  );
}