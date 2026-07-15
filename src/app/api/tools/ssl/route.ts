import { NextResponse } from "next/server";
import { AuditError } from "@/lib/audit";
import { inspectCertificate } from "@/lib/ssl";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const limit = rateLimit(`ssl:${clientIp(request)}`, 15, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "That is a lot of checks. Try again in a few minutes." },
      { status: 429, headers: { "retry-after": String(limit.retryAfterSec) } }
    );
  }
  const host = new URL(request.url).searchParams.get("host")?.trim().slice(0, 200);
  if (!host) return NextResponse.json({ error: "Enter a domain." }, { status: 400 });
  try {
    return NextResponse.json(await inspectCertificate(host));
  } catch (err) {
    if (err instanceof AuditError) return NextResponse.json({ error: err.message }, { status: 422 });
    return NextResponse.json({ error: "The check failed unexpectedly. Try again." }, { status: 500 });
  }
}
