import AdminEventsClient from "@/components/admin/AdminEventsClient";

export const dynamic = "force-dynamic";

export default function AdminEventsPage() {
  return (
    <div className="lg:mt-0 mt-14">
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Admin</p>
        <h1 className="font-display text-3xl font-light text-black">Events</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create, edit, and manage all events. Changes are published immediately.
        </p>
      </div>
      <AdminEventsClient />
    </div>
  );
}