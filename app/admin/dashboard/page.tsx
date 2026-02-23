// import { createServerClient } from "@/lib/supabase-server";
// import Link from "next/link";
// import { Users, MessageSquare, Send, FileEdit, ArrowRight } from "lucide-react";
// import { formatDate } from "@/lib/utils";

// async function getDashboardStats() {
//   const db = createServerClient();

//   const [subscribers, contacts, campaigns] = await Promise.all([
//     db.from("subscribers").select("id, subscribed_at, status").order("subscribed_at", { ascending: false }),
//     db.from("contact_submissions").select("id, name, email, subject, submitted_at, is_read").order("submitted_at", { ascending: false }).limit(5),
//     db.from("newsletter_campaigns").select("id, subject, sent_at, recipient_count").order("sent_at", { ascending: false }).limit(5),
//   ]);

//   const activeSubscribers = subscribers.data?.filter((s) => s.status === "active") || [];
//   const unreadContacts = contacts.data?.filter((c) => !c.is_read).length || 0;

//   return {
//     totalSubscribers: activeSubscribers.length,
//     unreadContacts,
//     totalCampaigns: campaigns.data?.length || 0,
//     recentContacts: contacts.data || [],
//     recentCampaigns: campaigns.data || [],
//   };
// }

// export default async function AdminDashboard() {
//   const stats = await getDashboardStats();

//   const statCards = [
//     {
//       label: "Active Subscribers",
//       value: stats.totalSubscribers,
//       icon: <Users size={22} strokeWidth={1.5} />,
//       link: "/admin/subscribers",
//       color: "text-[#BF4E14]",
//     },
//     {
//       label: "Unread Messages",
//       value: stats.unreadContacts,
//       icon: <MessageSquare size={22} strokeWidth={1.5} />,
//       link: "/admin/settings",
//       color: "text-[#BF4E14]",
//     },
//     {
//       label: "Campaigns Sent",
//       value: stats.totalCampaigns,
//       icon: <Send size={22} strokeWidth={1.5} />,
//       link: "/admin/email",
//       color: "text-[#BF4E14]",
//     },
//   ];

//   return (
//     <div className="lg:mt-0 mt-14">
//       <div className="mb-8">
//         <h1 className="font-display text-3xl font-light text-black">Dashboard</h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Welcome to the Da Hausa Initiative admin panel.
//         </p>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
//         {statCards.map((card) => (
//           <Link
//             key={card.label}
//             href={card.link}
//             className="bg-white border border-[#E8E8E8] p-6 hover:border-[#BF4E14] transition-colors group"
//           >
//             <div className="flex items-start justify-between mb-4">
//               <div className={`${card.color}`}>{card.icon}</div>
//               <ArrowRight size={14} className="text-gray-300 group-hover:text-[#BF4E14] transition-colors" />
//             </div>
//             <p className="text-3xl font-bold text-black mb-1">{card.value}</p>
//             <p className="text-xs text-gray-500 uppercase tracking-wide">{card.label}</p>
//           </Link>
//         ))}
//       </div>

//       <div className="grid lg:grid-cols-2 gap-6">
//         {/* Quick actions */}
//         <div className="bg-white border border-[#E8E8E8] p-6">
//           <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-5">
//             Quick Actions
//           </h2>
//           <div className="space-y-2">
//             {[
//               { href: "/admin/content/home", label: "Edit Home Page", icon: <FileEdit size={15} /> },
//               { href: "/admin/content/programmes", label: "Edit Programmes", icon: <FileEdit size={15} /> },
//               { href: "/admin/forms", label: "Manage Application Forms", icon: <FileEdit size={15} /> },
//               { href: "/admin/email", label: "Send Newsletter", icon: <Send size={15} /> },
//               { href: "/admin/subscribers", label: "View Subscribers", icon: <Users size={15} /> },
//             ].map((action) => (
//               <Link
//                 key={action.href}
//                 href={action.href}
//                 className="flex items-center gap-3 p-3 hover:bg-[#F5F5F5] rounded transition-colors text-sm"
//               >
//                 <span className="text-[#BF4E14]">{action.icon}</span>
//                 {action.label}
//                 <ArrowRight size={12} className="ml-auto text-gray-300" />
//               </Link>
//             ))}
//           </div>
//         </div>

//         {/* Recent contacts */}
//         <div className="bg-white border border-[#E8E8E8] p-6">
//           <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-5">
//             Recent Messages
//           </h2>
//           {stats.recentContacts.length === 0 ? (
//             <p className="text-sm text-gray-400">No messages yet.</p>
//           ) : (
//             <div className="space-y-3">
//               {stats.recentContacts.map((contact: Record<string, unknown>) => (
//                 <div
//                   key={contact.id as string}
//                   className={`p-3 border-l-2 ${!contact.is_read ? "border-[#BF4E14] bg-[#FEF0E7]" : "border-[#E8E8E8]"}`}
//                 >
//                   <div className="flex items-start justify-between gap-2">
//                     <div>
//                       <p className="text-sm font-medium text-black">{contact.name as string}</p>
//                       <p className="text-xs text-gray-400">{contact.email as string}</p>
//                       {contact.subject && (
//                         <p className="text-xs text-gray-600 mt-0.5">{contact.subject as string}</p>
//                       )}
//                     </div>
//                     <span className="text-xs text-gray-400 flex-shrink-0">
//                       {formatDate(contact.submitted_at as string)}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Recent campaigns */}
//       {stats.recentCampaigns.length > 0 && (
//         <div className="mt-6 bg-white border border-[#E8E8E8] p-6">
//           <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-5">
//             Recent Newsletter Campaigns
//           </h2>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-[#E8E8E8]">
//                   <th className="text-left py-3 text-xs text-gray-400 uppercase tracking-wide font-semibold">Subject</th>
//                   <th className="text-left py-3 text-xs text-gray-400 uppercase tracking-wide font-semibold">Sent</th>
//                   <th className="text-left py-3 text-xs text-gray-400 uppercase tracking-wide font-semibold">Recipients</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {stats.recentCampaigns.map((c: Record<string, unknown>) => (
//                   <tr key={c.id as string} className="border-b border-[#F5F5F5]">
//                     <td className="py-3 text-black">{c.subject as string}</td>
//                     <td className="py-3 text-gray-500">{formatDate(c.sent_at as string)}</td>
//                     <td className="py-3 text-[#BF4E14] font-semibold">{c.recipient_count as number}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { createServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { Users, MessageSquare, Send, FileEdit, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

async function getDashboardStats() {
  const db = createServerClient();

  const [subscribers, contacts, campaigns] = await Promise.all([
    db.from("subscribers").select("id, subscribed_at, status").order("subscribed_at", { ascending: false }),
    db.from("contact_submissions").select("id, name, email, subject, submitted_at, is_read").order("submitted_at", { ascending: false }).limit(5),
    db.from("newsletter_campaigns").select("id, subject, sent_at, recipient_count").order("sent_at", { ascending: false }).limit(5),
  ]);

  const activeSubscribers = subscribers.data?.filter((s) => s.status === "active") || [];
  const unreadContacts = contacts.data?.filter((c) => !c.is_read).length || 0;

  return {
    totalSubscribers: activeSubscribers.length,
    unreadContacts,
    totalCampaigns: campaigns.data?.length || 0,
    recentContacts: (contacts.data || []) as Array<{
      id: string;
      name: string;
      email: string;
      subject: string | null;
      submitted_at: string;
      is_read: boolean;
    }>,
    recentCampaigns: (campaigns.data || []) as Array<{
      id: string;
      subject: string;
      sent_at: string;
      recipient_count: number;
    }>,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const statCards = [
    { label: "Active Subscribers", value: stats.totalSubscribers, icon: <Users size={22} strokeWidth={1.5} />, link: "/admin/subscribers" },
    { label: "Unread Messages", value: stats.unreadContacts, icon: <MessageSquare size={22} strokeWidth={1.5} />, link: "/admin/settings" },
    { label: "Campaigns Sent", value: stats.totalCampaigns, icon: <Send size={22} strokeWidth={1.5} />, link: "/admin/email" },
  ];

  return (
    <div className="lg:mt-0 mt-14">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-black">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome to the Da Hausa Initiative admin panel.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {statCards.map((card) => (
          <Link key={card.label} href={card.link} className="bg-white border border-[#E8E8E8] p-6 hover:border-[#BF4E14] transition-colors group">
            <div className="flex items-start justify-between mb-4">
              <div className="text-[#BF4E14]">{card.icon}</div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-[#BF4E14] transition-colors" />
            </div>
            <p className="text-3xl font-bold text-black mb-1">{card.value}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">{card.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#E8E8E8] p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-5">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { href: "/admin/content/home", label: "Edit Home Page", icon: <FileEdit size={15} /> },
              { href: "/admin/content/programmes", label: "Edit Programmes", icon: <FileEdit size={15} /> },
              { href: "/admin/forms", label: "Manage Application Forms", icon: <FileEdit size={15} /> },
              { href: "/admin/email", label: "Send Newsletter", icon: <Send size={15} /> },
              { href: "/admin/subscribers", label: "View Subscribers", icon: <Users size={15} /> },
            ].map((action) => (
              <Link key={action.href} href={action.href} className="flex items-center gap-3 p-3 hover:bg-[#F5F5F5] rounded transition-colors text-sm">
                <span className="text-[#BF4E14]">{action.icon}</span>
                {action.label}
                <ArrowRight size={12} className="ml-auto text-gray-300" />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#E8E8E8] p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-5">Recent Messages</h2>
          {stats.recentContacts.length === 0 ? (
            <p className="text-sm text-gray-400">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentContacts.map((contact) => (
                <div key={contact.id} className={`p-3 border-l-2 ${!contact.is_read ? "border-[#BF4E14] bg-[#FEF0E7]" : "border-[#E8E8E8]"}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium text-black">{contact.name}</p>
                      <p className="text-xs text-gray-400">{contact.email}</p>
                      {contact.subject ? <p className="text-xs text-gray-600 mt-0.5">{contact.subject}</p> : null}
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(contact.submitted_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {stats.recentCampaigns.length > 0 && (
        <div className="mt-6 bg-white border border-[#E8E8E8] p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#BF4E14] mb-5">Recent Newsletter Campaigns</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8E8E8]">
                  <th className="text-left py-3 text-xs text-gray-400 uppercase tracking-wide font-semibold">Subject</th>
                  <th className="text-left py-3 text-xs text-gray-400 uppercase tracking-wide font-semibold">Sent</th>
                  <th className="text-left py-3 text-xs text-gray-400 uppercase tracking-wide font-semibold">Recipients</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentCampaigns.map((c) => (
                  <tr key={c.id} className="border-b border-[#F5F5F5]">
                    <td className="py-3 text-black">{c.subject}</td>
                    <td className="py-3 text-gray-500">{formatDate(c.sent_at)}</td>
                    <td className="py-3 text-[#BF4E14] font-semibold">{c.recipient_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}