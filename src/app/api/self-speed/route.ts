import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fetchSpeed } from "@/lib/audit";
import { site } from "@/data/site";

/**
 * Google PageSpeed's mobile lab score for THIS site, for the homepage's
 * instrument panel. Google's number, not ours — with the time it was taken.
 *
 * PSI is slow (10–30 s) and quota-limited, so the result is memoised for six
 * hours in memory and on disk (the same writable data/ dir the lead register
 * uses, so it survives a restart). A failed run is never cached and is not
 * retried more than every 15 minutes; the last good reading stays on show
 * with its real timestamp until a fresh one lands. No good reading yet →
 * { ok: false } and the panel says so, rather than inventing a score.
 */
export const dynamic = "force-dynamic";

type Reading = {
  ok: true;
  performance: number;
  lcpMs: number | null;
  cls: number | null;
  measuredAt: number;
};

const TTL = 6 * 60 * 60 * 1000;
const RETRY_AFTER = 15 * 60 * 1000;
const FILE = path.join(process.cwd(), "data", "self-speed.json");

let memo: Reading | null = null;
let lastAttempt = 0;
let inflight: Promise<Reading | null> | null = null;

async function readDisk(): Promise<Reading | null> {
  try {
    const parsed = JSON.parse(await fs.readFile(FILE, "utf8")) as Partial<Reading>;
    if (parsed?.ok && typeof parsed.performance === "number" && typeof parsed.measuredAt === "number") {
      return parsed as Reading;
    }
  } catch {
    /* no reading on disk yet */
  }
  return null;
}

async function writeDisk(r: Reading): Promise<void> {
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(r), "utf8");
  } catch {
    /* read-only disk: the in-memory copy still serves this process */
  }
}

async function measure(): Promise<Reading | null> {
  try {
    const s = await fetchSpeed(site.url);
    if (s.performance === null) return null;
    const r: Reading = {
      ok: true,
      performance: s.performance,
      lcpMs: s.lcpMs,
      cls: s.cls,
      measuredAt: Date.now(),
    };
    memo = r;
    await writeDisk(r);
    return r;
  } catch {
    return null;
  }
}

export async function GET() {
  if (!memo) memo = await readDisk();
  const stale = !memo || Date.now() - memo.measuredAt > TTL;

  if (stale && Date.now() - lastAttempt > RETRY_AFTER) {
    lastAttempt = Date.now();
    if (!inflight) {
      inflight = measure().finally(() => {
        inflight = null;
      });
    }
    // First reading ever: wait for it. Otherwise serve the last good one now
    // and let the refresh land in the background.
    if (!memo) await inflight;
  }

  return NextResponse.json(memo ?? { ok: false }, {
    headers: { "Cache-Control": "no-store" },
  });
}
