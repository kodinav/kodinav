import { adminConfigured, isAdmin } from "@/lib/adminAuth";
import { listLeads } from "@/lib/leads";
import { AdminDashboard } from "./AdminDashboard";
import { AdminLogin } from "./AdminLogin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminLogin configured={adminConfigured()} />;
  }
  const leads = await listLeads();
  return <AdminDashboard initialLeads={leads} />;
}
