import { redirect } from "next/navigation";
import { isAuthorized } from "@/lib/admin-auth";
import { AdminLogin } from "@/components/admin/admin-login";

export default async function AdminLoginPage() {
  if (await isAuthorized()) {
    redirect("/admin");
  }
  return <AdminLogin />;
}
