import { redirect } from "next/navigation";
import { isAuthorized } from "@/lib/admin-auth";
import { getRawObjects, readOverrides } from "@/lib/data";
import { AdminDashboard } from "@/components/admin/admin-dashboard";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthorized())) redirect("/admin/login");
  const [objects, overrides] = await Promise.all([
    getRawObjects(),
    readOverrides(),
  ]);
  return <AdminDashboard objects={objects} initialOverrides={overrides} />;
}
