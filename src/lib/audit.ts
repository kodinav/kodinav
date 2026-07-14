import { lookup } from "node:dns/promises";
import { isIPv4 } from "node:net";
import {
  CATEGORIES,
  type AuditResult,
  type Category,
  type Finding,
  type Severity,
  type SpeedResult,
} from "./auditTypes";

export * from "./auditTypes";

/* ------------------------------------------------------------------ *
 * SSRF guard
 *
 * This scanner fetches a URL that a stranger typed into a public form, so
 * it is a confused-deputy waiting to happen: without these checks anyone
 * could point it at 127.0.0.1, 169.254.169.254 (cloud metadata) or a box
 * inside the host's private network and read the response back off the
 * results page. Every hop is therefore resolved to its real IP and
 * rejected if that IP is not publicly routable. Redirects are followed by
 * hand for the same reason — `redirect: "follow"` would skip the check.
 * ------------------------------------------------------------------ */

function isPrivateIp(ip: string): boolean {
  if (isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 0 || a === 10 || a === 127) return true;
    if (a === 169 && b === 254) return true; // link-local + cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
    if (a >= 224) return true; // multicast / reserved
    return false;
  }
  const s = ip.toLowerCase().split("%")[0];
  if (s === "::" || s === "::1") return true;
  if (s.startsWith("::ffff:")) return isPrivateIp(s.slice(7)); // v4-mapped
  if (s.startsWith("fe80")) return true; // link-local
  const head = parseInt(s.split(":")[0] || "0", 16);
  if ((head & 0xfe00) === 0xfc00) return true; // fc00::/7 unique-local
  return false;
}

export class AuditError extends Error {}

async function assertPublicUrl(url: URL): Promise<void> {
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new AuditError("Only http:// and https:// addresses can be scanned.");
  }
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    !host.includes(".")
  ) {
    throw new AuditError("That address is not a public website.");
  }

  let addresses: { address: string }[];
  try {
    addresses = await lookup(host, { all: true });
  } catch {
    throw new AuditError(
      "That domain does not resolve. Check the spelling and try again."
    );
  }
  if (addresses.length === 0 || addresses.some((a) => isPrivateIp(a.address))) {
    throw new AuditError("That address is not a public website.");
  }
}

const UA =
  "Mozilla/5.0 (compatible; KodinavAudit/1.0; +https://kodinav.com/free-website-audit)";
const MAX_BYTES = 3_000_000;
const TIMEOUT_MS = 15_000;

type Fetched = {
  finalUrl: URL;
  status: number;
  headers: Headers;
  html: string;
  /** Decoded size of the HTML we received. */
  bytes: number;
  /** Time to response headers: DNS + TLS + server think time. */
  ttfbMs: number;
};

async function readCapped(res: Response): Promise<{ text: string; bytes: number }> {
  if (!res.body) return { text: "", bytes: 0 };
  const reader = res.body.getReader();
  const chunks: Buffer[] = [];
  let bytes = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    chunks.push(Buffer.from(value));
    if (bytes > MAX_BYTES) {
      await reader.cancel();
      break;
    }
  }
  return { text: Buffer.concat(chunks).toString("utf8"), bytes };
}

/** Fetches a page, validating every redirect hop against the SSRF guard. */
async function safeFetch(start: URL, maxHops = 4): Promise<Fetched> {
  let url = start;
  const began = Date.now();

  for (let hop = 0; hop <= maxHops; hop++) {
    await assertPublicUrl(url);

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(url, {
        redirect: "manual",
        signal: controller.signal,
        headers: { "user-agent": UA, accept: "text/html,*/*" },
        cache: "no-store",
      });
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof AuditError) throw err;
      const aborted = err instanceof Error && err.name === "AbortError";
      throw new AuditError(
        aborted
          ? "The site took longer than 15 seconds to respond, so the scan timed out. That is itself a finding."
          : "Could not reach that site. Check the address, or try again in a moment."
      );
    }
    clearTimeout(timer);
    const ttfbMs = Date.now() - began;

    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      if (hop === maxHops) throw new AuditError("That site redirects too many times.");
      try {
        url = new URL(location, url);
      } catch {
        throw new AuditError("That site sent an invalid redirect.");
      }
      continue;
    }

    if (res.status >= 400) {
      throw new AuditError(
        `The site returned HTTP ${res.status}. Nothing to scan at that address.`
      );
    }

    const { text, bytes } = await readCapped(res);
    return { finalUrl: url, status: res.status, headers: res.headers, html: text, bytes, ttfbMs };
  }
  throw new AuditError("That site redirects too many times.");
}

/* ------------------------------------------------------------------ *
 * HTML parsing — regex, deliberately. Adding a parser dependency to read
 * a handful of head tags would cost more than it buys.
 * ------------------------------------------------------------------ */

const stripComments = (html: string) => html.replace(/<!--[\s\S]*?-->/g, "");

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  rsquo: "’",
  lsquo: "‘",
  ldquo: "“",
  rdquo: "”",
};

/**
 * Decodes entities in text we quote back to the visitor. Without this a title
 * reads as "Design &amp; Build" and, worse, its character count is wrong — the
 * five characters of "&amp;" are one character to Google.
 */
function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

function tagsOf(html: string, name: string): string[] {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? [];
}

function attrOf(tag: string, name: string): string | undefined {
  const m = tag.match(
    new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>]+))`, "i")
  );
  if (!m) return undefined;
  return (m[1] ?? m[2] ?? m[3] ?? "").trim();
}

const hasAttr = (tag: string, name: string) =>
  new RegExp(`\\b${name}(\\s*=|[\\s/>])`, "i").test(tag);

function metaOf(html: string, key: "name" | "property", value: string) {
  for (const t of tagsOf(html, "meta")) {
    if (attrOf(t, key)?.toLowerCase() === value.toLowerCase()) {
      return attrOf(t, "content");
    }
  }
  return undefined;
}

/** True when a sub-resource is loaded over plain http on an https page. */
function isInsecure(u: string | undefined) {
  return Boolean(u && /^http:\/\//i.test(u));
}

type Probe = { ok: boolean; body: string; type: string };

/**
 * Probes a well-known file. Status alone is not trustworthy: plenty of hosts
 * answer /robots.txt and /favicon.ico with a 200 and their HTML 404 page, and
 * reporting that as "you have a robots.txt" would be a false finding. Callers
 * therefore verify what came back actually looks like the file they asked for.
 */
async function probe(url: URL): Promise<Probe> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "user-agent": UA },
      cache: "no-store",
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return { ok: false, body: "", type: "" };
    const type = (res.headers.get("content-type") ?? "").toLowerCase();
    const body = (await res.text()).slice(0, 20_000);
    return { ok: true, body, type };
  } catch {
    return { ok: false, body: "", type: "" };
  }
}

/** A real robots.txt is plain text and contains at least one directive. */
const isRealRobots = (p: Probe) =>
  p.ok &&
  !p.type.includes("html") &&
  /^\s*(user-agent|disallow|allow|sitemap)\s*:/im.test(p.body);

/** A real sitemap is XML, not a themed 404 page. */
const isRealSitemap = (p: Probe) =>
  p.ok && !p.type.includes("html") && /<(urlset|sitemapindex)[\s>]/i.test(p.body);

/** A real favicon is an image, not an HTML error page. */
const isRealFaviconFile = (p: Probe) =>
  p.ok && (p.type.startsWith("image/") || p.type.includes("icon"));

/* ------------------------------------------------------------------ *
 * Scoring
 * ------------------------------------------------------------------ */

const PENALTY: Record<Severity, number> = { critical: 30, warning: 12, pass: 0 };

/** Ordered worst-first. The first hit becomes the headline sentence. */
const HEADLINE_ORDER = [
  "mobile-viewport",
  "https",
  "mixed-content",
  "contact-path",
  "ttfb",
  "title",
  "html-size",
  "render-blocking",
  "dom-size",
  "meta-description",
  "analytics",
  "og-image",
];

export async function auditSite(input: string): Promise<AuditResult> {
  const trimmed = input.trim();
  if (!trimmed) throw new AuditError("Enter a website address.");

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  } catch {
    throw new AuditError("That does not look like a website address.");
  }

  const page = await safeFetch(url);
  const html = stripComments(page.html);
  const headEnd = html.search(/<\/head>/i);
  const head = headEnd === -1 ? html : html.slice(0, headEnd);
  const https = page.finalUrl.protocol === "https:";
  const origin = new URL(page.finalUrl.origin);

  const [robotsProbe, faviconProbe] = await Promise.all([
    probe(new URL("/robots.txt", origin)),
    probe(new URL("/favicon.ico", origin)),
  ]);
  const hasRobots = isRealRobots(robotsProbe);
  const hasFaviconFile = isRealFaviconFile(faviconProbe);

  const findings: Finding[] = [];
  const add = (
    id: string,
    category: Category,
    severity: Severity,
    title: string,
    detail: string,
    fix?: string
  ) => findings.push({ id, category, severity, title, detail, fix });

  /* ---------- Speed ---------- */

  const ttfb = page.ttfbMs;
  add(
    "ttfb",
    "speed",
    ttfb > 1800 ? "critical" : ttfb > 800 ? "warning" : "pass",
    "Server response time",
    ttfb > 800
      ? `Your server took ${(ttfb / 1000).toFixed(1)}s just to send the first byte of the page. Nothing at all is on screen until that finishes.`
      : `Your server answered in ${ttfb}ms, which is healthy.`,
    ttfb > 800
      ? "Usually cheap hosting, an unoptimised database, or no caching. Fixing this speeds up every single page at once."
      : undefined
  );

  const kb = Math.round(page.bytes / 1024);
  add(
    "html-size",
    "speed",
    page.bytes > 300_000 ? "critical" : page.bytes > 100_000 ? "warning" : "pass",
    "Page weight",
    page.bytes > 100_000
      ? `The HTML alone is ${kb} KB before a single image or script loads. On a 4G phone that is a real wait.`
      : `The HTML is ${kb} KB, which is lean.`,
    page.bytes > 100_000
      ? "Usually page-builder bloat. The visible content is a fraction of what is being shipped."
      : undefined
  );

  const domElements = (html.match(/<[a-zA-Z][^\s/>]*/g) ?? []).length;
  add(
    "dom-size",
    "speed",
    domElements > 2500 ? "critical" : domElements > 1400 ? "warning" : "pass",
    "Page complexity",
    domElements > 1400
      ? `The page has roughly ${domElements.toLocaleString()} HTML elements. Google flags anything over 1,400 — phones burn battery and time just laying this out.`
      : `Roughly ${domElements.toLocaleString()} HTML elements, which is comfortable.`,
    domElements > 1400 ? "Almost always a page builder emitting nested wrappers." : undefined
  );

  // A script only blocks rendering if a modern browser will actually stop for it:
  // async/defer do not, type=module is deferred by definition, and a nomodule
  // script is skipped outright by every browser that supports modules.
  const blocking = tagsOf(head, "script").filter(
    (t) =>
      attrOf(t, "src") &&
      !hasAttr(t, "async") &&
      !hasAttr(t, "defer") &&
      !hasAttr(t, "nomodule") &&
      attrOf(t, "type")?.toLowerCase() !== "module"
  ).length;
  add(
    "render-blocking",
    "speed",
    blocking > 3 ? "critical" : blocking > 0 ? "warning" : "pass",
    "Render-blocking scripts",
    blocking > 0
      ? `${blocking} script${blocking === 1 ? "" : "s"} in the page head ${blocking === 1 ? "blocks" : "block"} rendering. The visitor stares at a blank screen until ${blocking === 1 ? "it downloads" : "they all download"}.`
      : "No render-blocking scripts in the head.",
    blocking > 0 ? "Adding `defer` is often a one-line fix per script." : undefined
  );

  const sheets = tagsOf(head, "link").filter((t) =>
    attrOf(t, "rel")?.toLowerCase().includes("stylesheet")
  );
  add(
    "stylesheets",
    "speed",
    sheets.length > 6 ? "warning" : "pass",
    "Stylesheets",
    sheets.length > 6
      ? `${sheets.length} separate stylesheets load before anything paints. Each one is another round trip.`
      : `${sheets.length} stylesheet${sheets.length === 1 ? "" : "s"}, which is reasonable.`,
    sheets.length > 6 ? "A sign of accumulated plugins. Bundling them is routine." : undefined
  );

  /* ---------- Mobile ---------- */

  const viewport = metaOf(head, "name", "viewport");
  add(
    "mobile-viewport",
    "mobile",
    !viewport ? "critical" : !/width\s*=\s*device-width/i.test(viewport) ? "warning" : "pass",
    "Mobile viewport",
    !viewport
      ? "The page has no mobile viewport tag at all. On a phone it renders at desktop width, so visitors land on tiny text and have to pinch and zoom to read anything."
      : !/width\s*=\s*device-width/i.test(viewport)
        ? `The viewport tag does not set width=device-width, so the layout does not adapt to the phone it is on.`
        : "The page declares a proper mobile viewport.",
    !viewport
      ? "One line of HTML. It is the single highest-impact fix on this list, because most of your visitors are on a phone."
      : undefined
  );

  const zoomBlocked = Boolean(
    viewport && /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*1(\.0)?\b/i.test(viewport)
  );
  if (zoomBlocked) {
    add(
      "mobile-zoom",
      "mobile",
      "warning",
      "Pinch-to-zoom disabled",
      "The page stops visitors from zooming in. Anyone with less than perfect eyesight cannot enlarge your text.",
      "Remove user-scalable=no. It is an accessibility failure and it annoys people."
    );
  }

  const imgs = tagsOf(html, "img");
  const noDims = imgs.filter((t) => !hasAttr(t, "width") || !hasAttr(t, "height")).length;
  if (imgs.length > 0) {
    add(
      "image-dimensions",
      "mobile",
      noDims >= 3 ? "warning" : "pass",
      "Images that shift the layout",
      noDims >= 3
        ? `${noDims} of ${imgs.length} images have no width or height set. The page jumps around as they load, which is how visitors end up tapping the wrong thing.`
        : "Images reserve their space while loading.",
      noDims >= 3 ? "Setting width and height on each image stops the jumping." : undefined
    );
  }

  /* ---------- Findability (SEO) ---------- */

  const titleRaw = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const title = titleRaw ? decodeEntities(titleRaw).replace(/\s+/g, " ").trim() : undefined;
  add(
    "title",
    "seo",
    !title ? "critical" : title.length > 65 || title.length < 15 ? "warning" : "pass",
    "Page title",
    !title
      ? "The page has no title tag. This is the blue line Google shows in its results, so you are handing it nothing to display."
      : title.length > 65
        ? `Your title is ${title.length} characters, so Google will cut it off: “${title.slice(0, 60)}…”`
        : title.length < 15
          ? `Your title is only ${title.length} characters (“${title}”), which wastes the most valuable text on the page.`
          : `“${title}” — a good length at ${title.length} characters.`,
    !title || title.length > 65 || title.length < 15
      ? "Aim for 50 to 60 characters that say what you do and where."
      : undefined
  );

  const descRaw = metaOf(head, "name", "description");
  const desc = descRaw ? decodeEntities(descRaw).replace(/\s+/g, " ").trim() : undefined;
  add(
    "meta-description",
    "seo",
    !desc ? "warning" : desc.length > 160 || desc.length < 50 ? "warning" : "pass",
    "Search description",
    !desc
      ? "There is no meta description, so Google invents one by scraping text off the page. You are letting it write your advert for you."
      : desc.length > 160
        ? `Your description is ${desc.length} characters and will be truncated in search results.`
        : desc.length < 50
          ? `Your description is only ${desc.length} characters, which is thin.`
          : `Present, at ${desc.length} characters.`,
    !desc ? "Write 140 to 155 characters that give someone a reason to click." : undefined
  );

  const h1s = tagsOf(html, "h1").length;
  add(
    "h1",
    "seo",
    h1s === 1 ? "pass" : "warning",
    "Main heading",
    h1s === 0
      ? "The page has no H1 heading, so neither Google nor a screen reader can tell what the page is actually about."
      : h1s > 1
        ? `The page has ${h1s} H1 headings. When everything is the main heading, nothing is.`
        : "Exactly one H1, as it should be.",
    h1s !== 1 ? "One H1 per page, saying plainly what the page is for." : undefined
  );

  const canonical = tagsOf(head, "link").some(
    (t) => attrOf(t, "rel")?.toLowerCase() === "canonical"
  );
  add(
    "canonical",
    "seo",
    canonical ? "pass" : "warning",
    "Canonical URL",
    canonical
      ? "A canonical URL is declared."
      : "No canonical URL is declared, so Google may treat several addresses as separate pages and split your ranking between them.",
    canonical ? undefined : "One line in the head."
  );

  const jsonLd = /<script[^>]+type\s*=\s*["']application\/ld\+json["']/i.test(html);
  add(
    "structured-data",
    "seo",
    jsonLd ? "pass" : "warning",
    "Structured data",
    jsonLd
      ? "The page ships structured data, so Google can read it properly."
      : "No structured data. Google cannot show your rating, address, prices or opening hours in the results, so competitors who do have it take up more space than you.",
    jsonLd ? undefined : "Schema.org JSON-LD. Adds nothing visible to the page, changes how you appear in search."
  );

  const lang = tagsOf(html, "html").some((t) => attrOf(t, "lang"));
  add(
    "lang",
    "seo",
    lang ? "pass" : "warning",
    "Language declaration",
    lang
      ? "The page declares its language."
      : "The page does not declare a language, which affects both search and screen readers.",
    lang ? undefined : "One attribute on the html tag."
  );

  const sitemapDeclared =
    (hasRobots && /^\s*sitemap\s*:/im.test(robotsProbe.body)) ||
    isRealSitemap(await probe(new URL("/sitemap.xml", origin)));
  add(
    "robots-sitemap",
    "seo",
    hasRobots && sitemapDeclared ? "pass" : "warning",
    "robots.txt and sitemap",
    !hasRobots
      ? "There is no robots.txt, and no sitemap Google can find. You are relying on Google to stumble across your pages."
      : !sitemapDeclared
        ? "You have a robots.txt but no sitemap, so Google has no list of the pages you want indexed."
        : "robots.txt and a sitemap are both in place.",
    hasRobots && sitemapDeclared ? undefined : "Both are generated automatically by any competent setup."
  );

  const noAlt = imgs.filter((t) => !hasAttr(t, "alt")).length;
  if (imgs.length >= 3) {
    const share = noAlt / imgs.length;
    add(
      "image-alt",
      "seo",
      noAlt >= 3 && share > 0.3 ? "warning" : "pass",
      "Image alt text",
      noAlt >= 3 && share > 0.3
        ? `${noAlt} of ${imgs.length} images have no alt text. They are invisible to Google Images and to anyone using a screen reader.`
        : "Images carry alt text.",
      noAlt >= 3 && share > 0.3 ? "Describe each image in a few plain words." : undefined
    );
  }

  /* ---------- Enquiries (conversion) ---------- */

  const tel = /href\s*=\s*["']tel:/i.test(html);
  const mail = /href\s*=\s*["']mailto:/i.test(html);
  const wa = /wa\.me|api\.whatsapp\.com/i.test(html);
  const form = /<form\b/i.test(html);
  const contactable = tel || mail || wa || form;

  add(
    "contact-path",
    "conversion",
    contactable ? "pass" : "critical",
    "A way to reach you",
    contactable
      ? `Visitors can reach you from this page (${[tel && "click-to-call", wa && "WhatsApp", mail && "email", form && "a form"].filter(Boolean).join(", ")}).`
      : "There is no phone link, no email link, no WhatsApp link and no form on this page. A visitor who is ready to buy has no way to tell you so without leaving and looking you up elsewhere. Most will not bother.",
    contactable ? undefined : "This is the most expensive thing on this list. Everything else is upstream of it."
  );

  add(
    "click-to-call",
    "conversion",
    tel ? "pass" : "warning",
    "Click-to-call",
    tel
      ? "Your phone number is a tappable link."
      : "Your phone number is not a tappable link, so a visitor on a phone has to memorise it, leave, and dial by hand.",
    tel ? undefined : "Wrap the number in a tel: link. It takes a minute."
  );

  const analytics =
    /gtag\(|googletagmanager|google-analytics|fbq\(|plausible\.io|umami|clarity\.ms|matomo|hotjar/i.test(
      html
    );
  add(
    "analytics",
    "conversion",
    analytics ? "pass" : "warning",
    "Measurement",
    analytics
      ? "The site is tracking visitors, so you can see what works."
      : "No analytics of any kind is installed. You currently have no idea how many people visit, where they come from, or where they give up.",
    analytics ? undefined : "Free to fix. Until it is, every decision about the site is a guess."
  );

  /* ---------- Trust ---------- */

  add(
    "https",
    "trust",
    https ? "pass" : "critical",
    "HTTPS",
    https
      ? "The site is served over HTTPS."
      : "The site is served over plain HTTP. Chrome shows visitors a “Not secure” warning in the address bar, right next to your name.",
    https ? undefined : "A certificate is free and takes minutes. Nothing else on this list matters more to a stranger's first impression."
  );

  const subresources = [
    ...tagsOf(html, "script").map((t) => attrOf(t, "src")),
    ...tagsOf(html, "iframe").map((t) => attrOf(t, "src")),
    ...tagsOf(html, "img").map((t) => attrOf(t, "src")),
    ...sheets.map((t) => attrOf(t, "href")),
  ];
  const mixed = https ? subresources.filter(isInsecure).length : 0;
  if (https) {
    add(
      "mixed-content",
      "trust",
      mixed > 0 ? "critical" : "pass",
      "Mixed content",
      mixed > 0
        ? `${mixed} resource${mixed === 1 ? "" : "s"} on this secure page ${mixed === 1 ? "is" : "are"} loaded over insecure HTTP. Browsers block them, which means part of your site is silently not loading for visitors.`
        : "Every resource loads securely.",
      mixed > 0 ? "Usually old hardcoded URLs. Each one is a find-and-replace." : undefined
    );
  }

  // An `href="data:,"` icon link is a real tag pointing at nothing — it declares
  // "I have no favicon" rather than providing one, so it does not count.
  const iconLink = tagsOf(head, "link").some((t) => {
    if (!attrOf(t, "rel")?.toLowerCase().includes("icon")) return false;
    const href = attrOf(t, "href")?.trim() ?? "";
    return href.length > 0 && !/^data:,?$/.test(href);
  });
  const hasFavicon = iconLink || hasFaviconFile;
  add(
    "favicon",
    "trust",
    hasFavicon ? "pass" : "warning",
    "Favicon",
    hasFavicon
      ? "The site has a favicon."
      : "There is no favicon, so your site shows a blank grey page icon in every browser tab and bookmark. It reads as unfinished.",
    hasFavicon ? undefined : "A single image file."
  );

  const ogImage = metaOf(head, "property", "og:image") ?? metaOf(head, "name", "og:image");
  const ogTitle = metaOf(head, "property", "og:title") ?? metaOf(head, "name", "og:title");
  add(
    "og-image",
    "trust",
    ogImage && ogTitle ? "pass" : "warning",
    "Link previews",
    ogImage && ogTitle
      ? "Shared links show a proper preview card."
      : "The page has no social preview tags. When anyone shares your link on WhatsApp or LinkedIn it appears as a bare grey box with no image, which looks broken and gets fewer clicks.",
    ogImage && ogTitle ? undefined : "Open Graph tags. Two lines, and every share you ever get looks professional."
  );

  /* ---------- Scores ---------- */

  const scores = {} as Record<Category, number>;
  for (const c of CATEGORIES) {
    const inCat = findings.filter((f) => f.category === c);
    const lost = inCat.reduce((sum, f) => sum + PENALTY[f.severity], 0);
    scores[c] = Math.max(0, Math.min(100, 100 - lost));
  }
  const overall = Math.round(
    CATEGORIES.reduce((sum, c) => sum + scores[c], 0) / CATEGORIES.length
  );

  const problems = findings.filter((f) => f.severity !== "pass");
  const byPriority = [...problems].sort((a, b) => {
    const rank = (f: Finding) => {
      const i = HEADLINE_ORDER.indexOf(f.id);
      const base = f.severity === "critical" ? 0 : 1000;
      return base + (i === -1 ? 500 : i);
    };
    return rank(a) - rank(b);
  });
  const headline =
    byPriority[0]?.detail ??
    "Nothing here is broken. This site clears every check in this scan, which is rare.";

  return {
    url: url.toString(),
    finalUrl: page.finalUrl.toString(),
    fetchedAt: new Date().toISOString(),
    ttfbMs: ttfb,
    htmlBytes: page.bytes,
    domElements,
    overall,
    scores,
    findings,
    headline,
  };
}

/* ------------------------------------------------------------------ *
 * Google PageSpeed Insights — the credible outside number.
 *
 * Kept separate from auditSite() because a lab run takes 10 to 30 seconds
 * and regularly fails under load. The scan must never wait on it: the page
 * renders our own findings first and folds this in when (if) it lands.
 * Works without a key at low volume; set PAGESPEED_API_KEY to raise quota.
 * ------------------------------------------------------------------ */

type PsiResponse = {
  lighthouseResult?: {
    categories?: { performance?: { score?: number } };
    audits?: Record<string, { numericValue?: number }>;
  };
};

export async function fetchSpeed(input: string): Promise<SpeedResult> {
  const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  await assertPublicUrl(url);

  const api = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
  api.searchParams.set("url", url.toString());
  api.searchParams.set("strategy", "mobile");
  api.searchParams.set("category", "performance");
  if (process.env.PAGESPEED_API_KEY) {
    api.searchParams.set("key", process.env.PAGESPEED_API_KEY);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45_000);
  try {
    const res = await fetch(api, { signal: controller.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`PSI ${res.status}`);
    const data = (await res.json()) as PsiResponse;
    const lh = data.lighthouseResult;
    const perf = lh?.categories?.performance?.score;
    const audits = lh?.audits ?? {};
    return {
      performance: typeof perf === "number" ? Math.round(perf * 100) : null,
      lcpMs: audits["largest-contentful-paint"]?.numericValue ?? null,
      tbtMs: audits["total-blocking-time"]?.numericValue ?? null,
      cls: audits["cumulative-layout-shift"]?.numericValue ?? null,
    };
  } finally {
    clearTimeout(timer);
  }
}
