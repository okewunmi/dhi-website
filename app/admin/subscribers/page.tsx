import { createServerClient } from "@/lib/supabase-server";
import { formatDate } from "@/lib/utils";
import SubscriberActions from "@/components/admin/SubscriberActions";

export default async function SubscribersPage() {
  const db = createServerClient();
  const { data: subscribers } = await db
    .from("subscribers")
    .select("*")
    .order("subscribed_at", { ascending: false });

  const active = subscribers?.filter((s) => s.status === "active") || [];
  const unsubscribed = subscribers?.filter((s) => s.status === "unsubscribed") || [];

  return (
    <div className="lg:mt-0 mt-14">
      <div className="mb-8">
        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Manage</p>
        <h1 className="font-display text-3xl font-light text-black">Subscribers</h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-[#E8E8E8] p-5">
          <p className="text-3xl font-bold text-black">{active.length}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Active</p>
        </div>
        <div className="bg-white border border-[#E8E8E8] p-5">
          <p className="text-3xl font-bold text-gray-400">{unsubscribed.length}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Unsubscribed</p>
        </div>
        <div className="bg-white border border-[#E8E8E8] p-5">
          <p className="text-3xl font-bold text-black">{(subscribers || []).length}</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Total</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#E8E8E8] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E8E8] flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14]">
            All Subscribers
          </h2>
          <SubscriberActions subscribers={active} />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F5F5]">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {(subscribers || []).map((sub) => (
                <tr
                  key={sub.id}
                  className="border-b border-[#F5F5F5] hover:bg-[#FAFAFA] transition-colors"
                >
                  <td className="px-6 py-4 text-black">{sub.email}</td>
                  <td className="px-6 py-4 text-gray-600">{sub.name || "—"}</td>
                  <td className="px-6 py-4 text-gray-500">
                    {formatDate(sub.subscribed_at)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block text-xs font-bold px-2 py-1 ${
                        sub.status === "active"
                          ? "bg-green-50 text-green-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!subscribers?.length && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                    No subscribers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
