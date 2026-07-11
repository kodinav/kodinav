import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import type { Lead } from "./leadTypes";

export { LEAD_STATUSES, type Lead, type LeadStatus } from "./leadTypes";

/**
 * Storage backends, picked by environment:
 *  - Upstash Redis (set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN):
 *    survives serverless deploys — use this on Vercel.
 *  - JSON file at data/leads.json: zero-setup persistence for a VPS or local dev.
 */
const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const REDIS_KEY = "kodinav:leads";

const FILE_PATH =
  process.env.LEADS_FILE || path.join(process.cwd(), "data", "leads.json");

async function redis(command: (string | number)[]): Promise<unknown> {
  const res = await fetch(REDIS_URL as string, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis error ${res.status}`);
  const data = (await res.json()) as { result: unknown };
  return data.result;
}

const useRedis = Boolean(REDIS_URL && REDIS_TOKEN);

async function readFileStore(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(FILE_PATH, "utf8");
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}

async function writeFileStore(leads: Lead[]): Promise<void> {
  await fs.mkdir(path.dirname(FILE_PATH), { recursive: true });
  const tmp = `${FILE_PATH}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(leads, null, 2), "utf8");
  await fs.rename(tmp, FILE_PATH);
}

export async function addLead(
  input: Omit<Lead, "id" | "receivedAt" | "status">
): Promise<Lead> {
  const lead: Lead = {
    ...input,
    id: randomUUID(),
    receivedAt: new Date().toISOString(),
    status: "new",
  };
  if (useRedis) {
    await redis(["HSET", REDIS_KEY, lead.id, JSON.stringify(lead)]);
  } else {
    const leads = await readFileStore();
    leads.push(lead);
    await writeFileStore(leads);
  }
  return lead;
}

export async function listLeads(): Promise<Lead[]> {
  let leads: Lead[];
  if (useRedis) {
    // HGETALL returns [field, value, field, value, ...]
    const flat = (await redis(["HGETALL", REDIS_KEY])) as string[];
    leads = [];
    for (let i = 1; i < flat.length; i += 2) {
      try {
        leads.push(JSON.parse(flat[i]) as Lead);
      } catch {
        // skip corrupt entries
      }
    }
  } else {
    leads = await readFileStore();
  }
  return leads.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
}

export async function updateLead(
  id: string,
  patch: Partial<Pick<Lead, "status" | "note">>
): Promise<Lead | null> {
  if (useRedis) {
    const raw = (await redis(["HGET", REDIS_KEY, id])) as string | null;
    if (!raw) return null;
    const lead = { ...(JSON.parse(raw) as Lead), ...patch };
    await redis(["HSET", REDIS_KEY, id, JSON.stringify(lead)]);
    return lead;
  }
  const leads = await readFileStore();
  const index = leads.findIndex((l) => l.id === id);
  if (index === -1) return null;
  leads[index] = { ...leads[index], ...patch };
  await writeFileStore(leads);
  return leads[index];
}

export async function deleteLead(id: string): Promise<boolean> {
  if (useRedis) {
    const removed = (await redis(["HDEL", REDIS_KEY, id])) as number;
    return removed > 0;
  }
  const leads = await readFileStore();
  const next = leads.filter((l) => l.id !== id);
  if (next.length === leads.length) return false;
  await writeFileStore(next);
  return true;
}
