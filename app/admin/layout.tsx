// import { redirect } from "next/navigation";
// import { requireAdminAuth } from "@/lib/auth";
// import AdminSidebar from "@/components/admin/AdminSidebar";

// export default async function AdminLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const isAuth = await requireAdminAuth();

//   if (!isAuth) {
//     redirect("/admin");
//   }

//   return (
//     <div className="flex min-h-screen bg-[#F5F5F5]">
//       <AdminSidebar />
//       <main className="flex-1 ml-0 lg:ml-64 min-h-screen">
//         <div className="p-6 lg:p-8">{children}</div>
//       </main>
//     </div>
//   );
// }

import AdminSidebar from "@/components/admin/AdminSidebar";

// Auth protection is handled by middleware.ts for /admin/* routes.
// This layout only wraps the visual shell — the login page at /admin
// is excluded via the middleware pattern (requires /admin/ with trailing slash).

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      <AdminSidebar />
      <main className="flex-1 ml-0 lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
