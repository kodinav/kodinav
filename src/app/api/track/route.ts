import { recordEvent, visitorHash } from "@/lib/analytics";
import { BOT_UA, countryFrom, deviceFrom } from "@/lib/geo";
import { clientIp, rateLimit } from "@/lib/rateLimit";
import { classifySource } from "@/lib/trafficSource";

/**
 * Beacon collector for the first-party analytics script (lib/trackerScript.ts).
 * Always answers 204 so a blocked or malformed beacon never surfaces an error
 * in a visitor's console; the `x-track` header says what happened.
 */
const done = (status: string) => new Response(null, { status: 204, headers: { "x-track": status } });

const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
const ID = /^[a-z0-9]{6,32}$/;

export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") ?? "";
  if (!ua || BOT_UA.test(ua)) return done("bot");

  const ip = clientIp(request);
  if (!rateLimit(`track:${ip}`, 300, 10 * 60_000).ok) return done("rate-limited");

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > 2048) return done("too-large");
    body = JSON.parse(raw);
  } catch {
    return done("invalid");
  }

  const ts = Date.now();
  const path = str(body.p, 200);
  const tz = str(body.tz, 60);
  const language = str(body.nl, 20);
  // Validate without storing — lets a deploy check exercise the endpoint
  // without adding a fake visit to the numbers.
  const test = body.test === true;

  try {
    if (body.t === "pv") {
      const id = str(body.id, 32);
      const sid = str(body.sid, 32);
      if (!ID.test(id) || !ID.test(sid) || !path.startsWith("/")) return done("invalid");
      const referrer = str(body.r, 300);
      const utmSource = str(body.us, 100) || undefined;
      const utmMedium = str(body.um, 100) || undefined;
      const { source, channel } = classifySource({ referrer, utmSource, utmMedium, gclid: body.g === 1 });
      if (test) return done("valid-test");
      await recordEvent({
        t: "pv",
        ts,
        id,
        sid,
        v: visitorHash(ip, ua, ts),
        p: path,
        ref: referrer.replace(/^https?:\/\//, "").slice(0, 200),
        src: source,
        ch: channel,
        us: utmSource,
        um: utmMedium,
        uc: str(body.uc, 150) || undefined,
        c: countryFrom(request, tz, language),
        lang: str(body.l, 10) || "en",
        dev: deviceFrom(ua, typeof body.w === "number" ? body.w : undefined),
        ...(body.n === 1 ? { n: 1 as const } : {}),
      });
      return done("stored");
    }

    if (body.t === "lv") {
      const id = str(body.id, 32);
      const ms = typeof body.ms === "number" ? Math.round(body.ms) : 0;
      if (!ID.test(id) || ms <= 0) return done("invalid");
      if (test) return done("valid-test");
      await recordEvent({ t: "lv", ts, id, ms: Math.min(ms, 30 * 60_000) });
      return done("stored");
    }

    if (body.t === "ev") {
      const name = str(body.n, 20);
      // "lead" is recorded server-side by /api/lead, never trusted from a beacon
      if (!["whatsapp", "email", "phone", "audit"].includes(name)) return done("invalid");
      if (test) return done("valid-test");
      const sid = str(body.sid, 32);
      await recordEvent({
        t: "ev",
        ts,
        n: name,
        p: path,
        s: str(body.s, 60) || undefined,
        sid: ID.test(sid) ? sid : "",
        v: visitorHash(ip, ua, ts),
        c: countryFrom(request, tz, language),
      });
      return done("stored");
    }
  } catch (err) {
    console.error("Analytics write failed:", err);
    return done("error");
  }

  return done("invalid");
}
