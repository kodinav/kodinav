import { NextResponse } from "next/server";

/**
 * Lead intake endpoint.
 *
 * TODO before launch — deliver leads somewhere real. Recommended options:
 *  1. Resend (email):   npm i resend  → send to hello@kodinav.com
 *  2. Google Sheets / Notion webhook
 *  3. WhatsApp Cloud API notification
 * Set LEAD_WEBHOOK_URL to forward leads to any webhook (Zapier/Make/n8n/Sheets).
 */
export async function POST(request: Request) {
  let data: Record<string, unknown>;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const name = typeof data.name === "string" ? data.name.trim() : "";
  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  const lead = {
    ...data,
    receivedAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? undefined,
  };

  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch (err) {
      console.error("Lead webhook delivery failed:", err);
      // Still log the lead so it isn't lost
    }
  }

  console.log("New lead:", JSON.stringify(lead));
  return NextResponse.json({ ok: true });
}
