import { createSign } from "node:crypto";

/**
 * Google Search Console, read-only, through a service account.
 *
 * Setup (once): Google Cloud → create a service account → create a JSON key.
 * Enable the "Google Search Console API". In Search Console → Settings →
 * Users and permissions → add the service account's email (Restricted is
 * enough). Then set GOOGLE_SERVICE_ACCOUNT_JSON to the key file's contents
 * (raw JSON or base64). Optional GSC_SITE_URL, e.g. "sc-domain:kodinav.com";
 * without it the property is picked from the sites the account can see.
 *
 * Signed with node:crypto (RS256 JWT → OAuth token), so no Google SDK.
 */

type Credentials = { client_email: string; private_key: string };

export type GscRow = { keys: string[]; clicks: number; impressions: number; ctr: number; position: number };

function credentials(): Credentials | null {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  try {
    const json = raw.startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const c = JSON.parse(json) as Credentials;
    return c.client_email && c.private_key ? c : null;
  } catch {
    return null;
  }
}

export const searchConsoleConfigured = () => credentials() !== null;
export const serviceAccountEmail = () => credentials()?.client_email ?? null;

const b64url = (input: string | Buffer) => Buffer.from(input).toString("base64url");

let token: { value: string; exp: number } | null = null;

async function accessToken(): Promise<string> {
  if (token && token.exp > Date.now() + 60_000) return token.value;
  const c = credentials();
  if (!c) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set");
  const now = Math.floor(Date.now() / 1000);
  const unsigned = `${b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64url(
    JSON.stringify({
      iss: c.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  )}`;
  const signature = createSign("RSA-SHA256").update(unsigned).sign(c.private_key.replace(/\\n/g, "\n"));
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${b64url(signature)}`,
    }),
    cache: "no-store",
  });
  const data = (await res.json()) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!res.ok || !data.access_token) throw new Error(`Google auth failed: ${data.error_description ?? res.status}`);
  token = { value: data.access_token, exp: Date.now() + (data.expires_in ?? 3600) * 1000 };
  return token.value;
}

async function google<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: body ? "POST" : "GET",
    headers: { Authorization: `Bearer ${await accessToken()}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) throw new Error(data.error?.message ?? `Search Console error ${res.status}`);
  return data;
}

let siteCache: string | null = null;

/** The Search Console property to query: env override, else a kodinav.com property the account can see. */
export async function siteUrl(): Promise<string> {
  if (process.env.GSC_SITE_URL) return process.env.GSC_SITE_URL;
  if (siteCache) return siteCache;
  const data = await google<{ siteEntry?: { siteUrl: string; permissionLevel: string }[] }>(
    "https://www.googleapis.com/webmasters/v3/sites"
  );
  const sites = (data.siteEntry ?? []).filter((s) => s.permissionLevel !== "siteUnverifiedUser").map((s) => s.siteUrl);
  const pick =
    sites.find((s) => s === "sc-domain:kodinav.com") ??
    sites.find((s) => /^https?:\/\/(www\.)?kodinav\.com\/?$/.test(s));
  if (!pick) {
    throw new Error(
      `The service account can't see a kodinav.com property yet. Add ${serviceAccountEmail()} under Search Console → Settings → Users and permissions.`
    );
  }
  siteCache = pick;
  return pick;
}

export async function searchAnalytics(options: {
  startDate: string;
  endDate: string;
  dimensions: ("date" | "query" | "page" | "country" | "device")[];
  country?: string; // ISO 3166-1 alpha-3, lowercase (hkg, twn)
  rowLimit?: number;
}): Promise<GscRow[]> {
  const site = await siteUrl();
  const data = await google<{ rows?: GscRow[] }>(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    {
      startDate: options.startDate,
      endDate: options.endDate,
      dimensions: options.dimensions,
      rowLimit: options.rowLimit ?? 25,
      dataState: "all",
      ...(options.country && {
        dimensionFilterGroups: [{ filters: [{ dimension: "country", operator: "equals", expression: options.country }] }],
      }),
    }
  );
  return data.rows ?? [];
}

export type IndexStatus = {
  url: string;
  verdict: string;
  coverageState: string;
  lastCrawlTime?: string;
  googleCanonical?: string;
};

export async function inspectUrl(url: string): Promise<IndexStatus> {
  const data = await google<{
    inspectionResult?: {
      indexStatusResult?: { verdict?: string; coverageState?: string; lastCrawlTime?: string; googleCanonical?: string };
    };
  }>("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    inspectionUrl: url,
    siteUrl: await siteUrl(),
  });
  const r = data.inspectionResult?.indexStatusResult ?? {};
  return {
    url,
    verdict: r.verdict ?? "UNKNOWN",
    coverageState: r.coverageState ?? "Unknown",
    lastCrawlTime: r.lastCrawlTime,
    googleCanonical: r.googleCanonical,
  };
}

export async function sitemaps(): Promise<
  { path: string; lastSubmitted?: string; lastDownloaded?: string; isPending?: boolean; errors?: string; warnings?: string; contents?: { type: string; submitted: string }[] }[]
> {
  const data = await google<{ sitemap?: [] }>(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(await siteUrl())}/sitemaps`
  );
  return data.sitemap ?? [];
}
