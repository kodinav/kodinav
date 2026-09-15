/**
 * Visitor country without storing IPs or buying a geo database.
 *
 * Order of trust:
 *  1. A country header set by a CDN in front of the app, if one is present.
 *  2. The browser's IANA timezone (Asia/Hong_Kong → HK). Reliable for the
 *     markets that matter here: Hong Kong and Taiwan each have their own zone.
 *  3. The region in the browser language (en-US → US). Weak, last resort.
 */

const COUNTRY_HEADERS = [
  "cf-ipcountry",
  "x-vercel-ip-country",
  "cloudfront-viewer-country",
  "x-country-code",
  "x-geo-country",
  "x-client-geo-country",
];

// Zones → ISO 3166-1 alpha-2. Covers the zones that account for nearly all
// real traffic; unlisted zones fall through to the language region.
const ZONES: Record<string, string> = {
  "Asia/Hong_Kong": "HK", "Asia/Macau": "MO", "Asia/Taipei": "TW", "Asia/Shanghai": "CN", "Asia/Chongqing": "CN",
  "Asia/Urumqi": "CN", "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "Asia/Dubai": "AE", "Asia/Singapore": "SG",
  "Asia/Kuala_Lumpur": "MY", "Asia/Tokyo": "JP", "Asia/Seoul": "KR", "Asia/Manila": "PH", "Asia/Bangkok": "TH",
  "Asia/Jakarta": "ID", "Asia/Ho_Chi_Minh": "VN", "Asia/Saigon": "VN", "Asia/Karachi": "PK", "Asia/Dhaka": "BD",
  "Asia/Kathmandu": "NP", "Asia/Colombo": "LK", "Asia/Riyadh": "SA", "Asia/Qatar": "QA", "Asia/Bahrain": "BH",
  "Asia/Kuwait": "KW", "Asia/Muscat": "OM", "Asia/Jerusalem": "IL", "Asia/Tel_Aviv": "IL", "Asia/Tehran": "IR",
  "Asia/Yangon": "MM", "Asia/Phnom_Penh": "KH", "Asia/Ulaanbaatar": "MN", "Asia/Almaty": "KZ", "Asia/Tashkent": "UZ",
  "Europe/London": "GB", "Europe/Dublin": "IE", "Europe/Paris": "FR", "Europe/Berlin": "DE", "Europe/Madrid": "ES",
  "Europe/Rome": "IT", "Europe/Amsterdam": "NL", "Europe/Brussels": "BE", "Europe/Zurich": "CH", "Europe/Vienna": "AT",
  "Europe/Stockholm": "SE", "Europe/Oslo": "NO", "Europe/Copenhagen": "DK", "Europe/Helsinki": "FI", "Europe/Warsaw": "PL",
  "Europe/Prague": "CZ", "Europe/Budapest": "HU", "Europe/Lisbon": "PT", "Europe/Athens": "GR", "Europe/Istanbul": "TR",
  "Europe/Kiev": "UA", "Europe/Kyiv": "UA", "Europe/Moscow": "RU", "Europe/Bucharest": "RO", "Europe/Sofia": "BG",
  "America/New_York": "US", "America/Chicago": "US", "America/Denver": "US", "America/Los_Angeles": "US",
  "America/Phoenix": "US", "America/Anchorage": "US", "America/Detroit": "US", "America/Indiana/Indianapolis": "US",
  "Pacific/Honolulu": "US", "America/Toronto": "CA", "America/Vancouver": "CA", "America/Edmonton": "CA",
  "America/Winnipeg": "CA", "America/Halifax": "CA", "America/Mexico_City": "MX", "America/Sao_Paulo": "BR",
  "America/Argentina/Buenos_Aires": "AR", "America/Buenos_Aires": "AR", "America/Santiago": "CL", "America/Bogota": "CO",
  "America/Lima": "PE", "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU",
  "Australia/Perth": "AU", "Australia/Adelaide": "AU", "Pacific/Auckland": "NZ", "Africa/Lagos": "NG",
  "Africa/Johannesburg": "ZA", "Africa/Cairo": "EG", "Africa/Nairobi": "KE", "Africa/Casablanca": "MA",
  "Africa/Accra": "GH",
};

export function countryFrom(request: Request, timezone?: string, language?: string): string {
  for (const name of COUNTRY_HEADERS) {
    const value = request.headers.get(name)?.trim().toUpperCase();
    if (value && /^[A-Z]{2}$/.test(value) && value !== "XX") return value;
  }
  if (timezone && ZONES[timezone]) return ZONES[timezone];
  const region = language?.match(/[-_]([A-Za-z]{2})\b/)?.[1];
  if (region) return region.toUpperCase();
  return "ZZ";
}

let regionNames: Intl.DisplayNames | null = null;

const SHORT_NAMES: Record<string, string> = { HK: "Hong Kong", MO: "Macau", TW: "Taiwan", AE: "UAE", US: "United States" };

export function countryName(code: string): string {
  if (code === "ZZ") return "Unknown";
  if (SHORT_NAMES[code]) return SHORT_NAMES[code];
  try {
    regionNames ??= new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code) ?? code;
  } catch {
    return code;
  }
}

export function deviceFrom(userAgent: string, width?: number): "mobile" | "tablet" | "desktop" {
  if (/iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i.test(userAgent)) return "tablet";
  if (/Mobi|iPhone|iPod|Android|Windows Phone/i.test(userAgent)) return "mobile";
  if (width && width < 768) return "mobile";
  return "desktop";
}

export const BOT_UA =
  /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|gtmetrix|pingdom|uptime|monitor|curl|wget|python|node-fetch|axios|go-http|java\/|preview|facebookexternalhit|embedly|quora link|bingpreview|scrap/i;
