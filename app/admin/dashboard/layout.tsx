import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getSession } from "@/lib/auth/session";
import { logout } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-cream md:flex-row">
      <AdminSidebar email={session.email} logoutAction={logout} />
      <div className="flex-1 px-6 py-10 md:px-10">{children}</div>
    </div>
  );
}
