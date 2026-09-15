import { getAnalyticsSummary } from "@/lib/analytics";
import { adminConfigured, isAdmin } from "@/lib/adminAuth";
import { listLeads } from "@/lib/leads";
import { AdminDashboard } from "./AdminDashboard";
import { AdminLogin } from "./AdminLogin";
import { AdminNav, type AdminTab } from "./AdminNav";
import { OverviewPanel, TrafficPanel } from "./panels";
import { SearchPanel } from "./SearchPanel";

export const dynamic = "force-dynamic";

const TABS: AdminTab[] = ["overview", "traffic", "search", "leads"];

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!(await isAdmin())) {
    return <AdminLogin configured={adminConfigured()} />;
  }
  const params = await searchParams;
  const tab = TABS.find((t) => t === params.tab) ?? "overview";
  const days = [7, 30, 90].includes(Number(params.range)) ? Number(params.range) : 30;

  const leads = await listLeads();
  const summary = tab === "overview" || tab === "traffic" ? await getAnalyticsSummary(days, leads) : null;

  return (
    <div className="flex flex-col gap-10">
      <AdminNav tab={tab} days={days} newLeads={leads.filter((l) => l.status === "new").length} />
      {tab === "overview" && summary && <OverviewPanel summary={summary} leads={leads} />}
      {tab === "traffic" && summary && <TrafficPanel summary={summary} />}
      {tab === "search" && <SearchPanel />}
      {tab === "leads" && <AdminDashboard initialLeads={leads} />}
    </div>
  );
}
