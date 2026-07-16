"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/lib/leadTypes";

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-accent text-accent-contrast border-accent",
  contacted: "bg-foreground text-background border-foreground",
  qualified: "border-accent text-accent",
  won: "bg-[#2d6a4f] text-accent-contrast border-[#2d6a4f]",
  lost: "border-line-strong text-faint",
};

const sourceLabels: Record<string, string> = {
  "contact-page": "Contact page",
  "meta-ads-coaching": "Ads — Coaching",
  "meta-ads-clinic": "Ads — Clinic",
  "website-audit": "★ Audit order",
  website: "Website",
};

// Captured once when the dashboard loads — stable across re-renders,
// and a Refresh re-runs the module on navigation anyway.
const LOADED_AT = Date.now();

function timeAgo(iso: string): string {
  const diff = LOADED_AT - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function waLink(phone?: string): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (digits.length === 10) digits = `91${digits}`;
  return digits.length >= 11 ? `https://wa.me/${digits}` : null;
}

export function AdminDashboard({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter();
  const [leads, setLeads] = useState(initialLeads);
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const sources = useMemo(
    () => Array.from(new Set(leads.map((l) => l.source))).sort(),
    [leads]
  );

  const filtered = leads.filter(
    (l) =>
      (statusFilter === "all" || l.status === statusFilter) &&
      (sourceFilter === "all" || l.source === sourceFilter)
  );

  const stats = useMemo(() => {
    const weekAgo = LOADED_AT - 7 * 24 * 60 * 60 * 1000;
    return [
      { label: "Total leads", value: leads.length },
      {
        label: "New — untouched",
        value: leads.filter((l) => l.status === "new").length,
      },
      {
        label: "Last 7 days",
        value: leads.filter((l) => new Date(l.receivedAt).getTime() > weekAgo)
          .length,
      },
      { label: "Won", value: leads.filter((l) => l.status === "won").length },
    ];
  }, [leads]);

  async function patch(id: string, body: { status?: LeadStatus; note?: string }) {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...body } : l)));
    await fetch("/api/admin/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this lead permanently?")) return;
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await fetch(`/api/admin/leads?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-8">
      {/* header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <p className="annotation flex items-center gap-3">
            <span className="crosshair text-accent" aria-hidden />
            Lead Register
          </p>
          <h1 className="text-4xl sm:text-5xl">Enquiries.</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.refresh()}
            className="border border-line-strong px-4 py-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase transition-colors hover:border-accent hover:text-accent"
          >
            Refresh
          </button>
          <a
            href="/api/admin/export"
            className="border border-line-strong px-4 py-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase transition-colors hover:border-accent hover:text-accent"
          >
            Export CSV
          </a>
          <button
            onClick={logout}
            className="border border-line-strong px-4 py-2.5 font-mono text-[0.625rem] tracking-[0.16em] uppercase text-faint transition-colors hover:border-accent hover:text-accent"
          >
            Log out
          </button>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-background p-5">
 <p className="font-display text-4xl">{s.value}</p>
            <p className="annotation mt-1.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* filters */}
      <div className="flex flex-wrap items-center gap-2">
        {(["all", ...LEAD_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`border px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-colors ${
              statusFilter === s
                ? "border-foreground bg-foreground text-background"
                : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
        {sources.length > 1 && (
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="ml-auto border border-line-strong bg-transparent px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.14em] uppercase"
          >
            <option value="all">All sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {sourceLabels[s] ?? s}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* leads */}
      {filtered.length === 0 ? (
        <div className="border border-line-strong p-10 text-center">
          <p className="font-serif text-2xl italic">No leads here yet.</p>
          <p className="mt-2 text-sm text-muted">
            {leads.length === 0
              ? "When someone submits a form on the site, it appears in this register instantly."
              : "Nothing matches the current filters."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col border-t border-line-strong">
          {filtered.map((lead) => {
            const wa = waLink(lead.phone);
            const open = expanded === lead.id;
            return (
              <li key={lead.id} className="border-b border-line">
                <button
                  onClick={() => setExpanded(open ? null : lead.id)}
                  className="grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 py-4 text-left sm:grid-cols-[1.2fr_1fr_auto_auto]"
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium">
                      {lead.name}
                      {lead.organization && (
                        <span className="text-muted"> — {lead.organization}</span>
                      )}
                    </span>
                    <span className="annotation text-faint">
                      {sourceLabels[lead.source] ?? lead.source} ·{" "}
                      {timeAgo(lead.receivedAt)}
                    </span>
                  </span>
                  <span className="hidden truncate text-sm text-muted sm:block">
                    {lead.budget ?? lead.projectType ?? lead.email}
                  </span>
                  <span
                    className={`border px-2.5 py-1 font-mono text-[0.5625rem] tracking-[0.14em] uppercase ${statusStyles[lead.status]}`}
                  >
                    {lead.status}
                  </span>
                  <span
                    aria-hidden
                    className={`hidden font-mono text-faint transition-transform sm:block ${open ? "rotate-90" : ""}`}
                  >
                    →
                  </span>
                </button>

                {open && (
                  <div className="grid gap-6 border-t border-line py-5 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="flex flex-col gap-3 text-sm">
                      <dl className="grid grid-cols-[7rem_1fr] gap-y-2">
                        {(
                          [
                            ["Email", lead.email],
                            ["Phone", lead.phone],
                            ["Website", lead.website],
                            ["Project", lead.projectType],
                            ["Budget", lead.budget],
                            ["Timeline", lead.timeline],
                            [
                              "Received",
                              new Date(lead.receivedAt).toLocaleString("en-IN"),
                            ],
                          ] as const
                        )
                          .filter(([, v]) => v)
                          .map(([k, v]) => (
                            <div key={k} className="contents">
                              <dt className="annotation">{k}</dt>
                              <dd className="break-words text-muted">{v}</dd>
                            </div>
                          ))}
                      </dl>
                      {lead.message && (
                        <p className="border-l-2 border-accent pl-4 leading-relaxed text-muted">
                          {lead.message}
                        </p>
                      )}
                      <div className="mt-1 flex flex-wrap gap-2">
                        {wa && (
                          <a
                            href={wa}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-foreground bg-foreground px-4 py-2 font-mono text-[0.625rem] tracking-[0.14em] text-background uppercase transition-colors hover:border-accent hover:bg-accent hover:text-accent-contrast"
                          >
                            WhatsApp →
                          </a>
                        )}
                        {lead.phone && (
                          <a
                            href={`tel:${lead.phone}`}
                            className="border border-line-strong px-4 py-2 font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-colors hover:border-accent hover:text-accent"
                          >
                            Call
                          </a>
                        )}
                        <a
                          href={`mailto:${lead.email}`}
                          className="border border-line-strong px-4 py-2 font-mono text-[0.625rem] tracking-[0.14em] uppercase transition-colors hover:border-accent hover:text-accent"
                        >
                          Email
                        </a>
                        <button
                          onClick={() => remove(lead.id)}
                          className="ml-auto border border-line px-4 py-2 font-mono text-[0.625rem] tracking-[0.14em] text-faint uppercase transition-colors hover:border-accent hover:text-accent"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="annotation mb-2">Status</p>
                        <div className="flex flex-wrap gap-1.5">
                          {LEAD_STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => patch(lead.id, { status: s })}
                              className={`border px-3 py-1.5 font-mono text-[0.5625rem] tracking-[0.14em] uppercase transition-colors ${
                                lead.status === s
                                  ? statusStyles[s]
                                  : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="annotation mb-2">Notes</p>
                        <textarea
                          defaultValue={lead.note ?? ""}
                          rows={3}
                          placeholder="Follow-up notes… (saved when you click away)"
                          onBlur={(e) => {
                            if (e.target.value !== (lead.note ?? "")) {
                              patch(lead.id, { note: e.target.value });
                            }
                          }}
                          className="w-full border border-line-strong bg-transparent px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
