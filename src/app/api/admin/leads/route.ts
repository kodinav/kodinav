import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/adminAuth";
import {
  deleteLead,
  LEAD_STATUSES,
  listLeads,
  updateLead,
  type LeadStatus,
} from "@/lib/leads";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ leads: await listLeads() });
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { id?: string; status?: string; note?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  if (!body.id) {
    return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
  }
  const patch: { status?: LeadStatus; note?: string } = {};
  if (body.status !== undefined) {
    if (!LEAD_STATUSES.includes(body.status as LeadStatus)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    patch.status = body.status as LeadStatus;
  }
  if (body.note !== undefined) patch.note = String(body.note).slice(0, 2000);

  const lead = await updateLead(body.id, patch);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return NextResponse.json({ lead });
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing lead id" }, { status: 400 });
  }
  const removed = await deleteLead(id);
  return NextResponse.json({ ok: removed });
}
