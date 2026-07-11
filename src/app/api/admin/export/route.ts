import { isAdmin } from "@/lib/adminAuth";
import { listLeads } from "@/lib/leads";

const COLUMNS = [
  "receivedAt",
  "status",
  "source",
  "name",
  "phone",
  "email",
  "organization",
  "projectType",
  "budget",
  "timeline",
  "website",
  "message",
  "note",
] as const;

function cell(value: unknown): string {
  const s = value == null ? "" : String(value);
  return `"${s.replaceAll('"', '""')}"`;
}

export async function GET() {
  if (!(await isAdmin())) {
    return new Response("Unauthorized", { status: 401 });
  }
  const leads = await listLeads();
  const rows = [
    COLUMNS.join(","),
    ...leads.map((lead) =>
      COLUMNS.map((c) => cell(lead[c as keyof typeof lead])).join(",")
    ),
  ];
  return new Response(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="kodinav-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
