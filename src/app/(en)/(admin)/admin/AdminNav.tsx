"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export type AdminTab = "overview" | "traffic" | "search" | "leads";

const TABS: { id: AdminTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "traffic", label: "Traffic" },
  { id: "search", label: "Search" },
  { id: "leads", label: "Leads" },
];

const RANGES = [7, 30, 90] as const;

/** Tabs + the one filter row (date range) that scopes everything below it. */
export function AdminNav({ tab, days, newLeads }: { tab: AdminTab; days: number; newLeads: number }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line-strong">
        <nav aria-label="Admin sections" className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={`/admin?tab=${t.id}&range=${days}`}
              aria-current={tab === t.id ? "page" : undefined}
              className={`flex items-center gap-2 border-b-2 px-3 py-3 text-sm whitespace-nowrap transition-colors sm:px-4 ${
                tab === t.id
                  ? "border-accent font-medium text-foreground"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {t.label}
              {t.id === "leads" && newLeads > 0 && (
                <span className="rounded-full bg-accent px-1.5 py-px text-[0.625rem] font-medium text-accent-contrast">
                  {newLeads} new
                </span>
              )}
            </Link>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mb-2 border border-line-strong px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] text-faint uppercase transition-colors hover:border-accent hover:text-accent"
        >
          Log out
        </button>
      </div>

      {(tab === "overview" || tab === "traffic") && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="annotation mr-1">Period</span>
          {RANGES.map((r) => (
            <Link
              key={r}
              href={`/admin?tab=${tab}&range=${r}`}
              aria-current={days === r ? "true" : undefined}
              className={`border px-3 py-1.5 text-xs transition-colors ${
                days === r
                  ? "border-foreground bg-foreground text-background"
                  : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
              }`}
            >
              Last {r} days
            </Link>
          ))}
          <button
            onClick={() => router.refresh()}
            className="ml-auto border border-line-strong px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
          >
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
