import { NextResponse } from "next/server";
import { recordEvent, visitorHash } from "@/lib/analytics";
import { countryFrom } from "@/lib/geo";
import { addLead } from "@/lib/leads";
import { clientIp } from "@/lib/rateLimit";

const str = (v: unknown, max = 500) =>
  typeof v === "string" ? v.trim().slice(0, max) : undefined;

/**
 * Lead intake: every submission is persisted for the /admin panel.
 * Optionally mirrors to LEAD_WEBHOOK_URL (Zapier/Make/Sheets/WhatsApp bot).
 */
export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const name = str(data.name, 120);
  const email = str(data.email, 200);
  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  // First-touch attribution captured by the analytics script (lib/attribution.ts)
  const attr = (typeof data.attribution === "object" && data.attribution !== null
    ? data.attribution
    : {}) as Record<string, unknown>;
  const attribution = {
    landingPage: str(attr.landingPage, 200) || undefined,
    referrer: str(attr.referrer, 300) || undefined,
    utmSource: str(attr.utmSource, 100) || undefined,
    utmMedium: str(attr.utmMedium, 100) || undefined,
    utmCampaign: str(attr.utmCampaign, 150) || undefined,
    gclid: attr.gclid === true || undefined,
    country: countryFrom(request, str(attr.timezone, 60), str(attr.language, 20)),
  };

  let lead;
  try {
    lead = await addLead({
      name,
      email,
      source: str(data.source, 60) ?? "website",
      phone: str(data.phone, 40),
      organization: str(data.organization, 200),
      website: str(data.website, 300),
      budget: str(data.budget, 100),
      timeline: str(data.timeline, 100),
      projectType: str(data.projectType, 100),
      message: str(data.message, 3000),
      userAgent: request.headers.get("user-agent") ?? undefined,
      ...attribution,
    });
    void recordEvent({
      t: "ev",
      ts: Date.now(),
      n: "lead",
      p: attribution.landingPage ?? "",
      s: str(data.source, 60),
      sid: str(attr.sid, 40) ?? "",
      v: visitorHash(clientIp(request), request.headers.get("user-agent") ?? "", Date.now()),
      c: attribution.country ?? "ZZ",
    }).catch(() => {});
  } catch (err) {
    console.error("Lead persistence failed:", err);
    // Fall through — still try the webhook so the lead is not lost silently
  }

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead ?? data),
      });
    } catch (err) {
      console.error("Lead webhook delivery failed:", err);
    }
  }

  if (!lead && !webhook) {
    return NextResponse.json(
      { error: "Could not record your enquiry. Please WhatsApp directly." },
      { status: 500 }
    );
  }

  console.log("New lead:", JSON.stringify(lead ?? data));
  return NextResponse.json({ ok: true });
}
