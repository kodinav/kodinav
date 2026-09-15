/**
 * First-touch attribution for a lead: where the visit that produced the form
 * submission came from. Captured by the analytics tracker (trackerScript.ts)
 * in sessionStorage when the visit starts; every lead form sends it with the
 * submission so /admin can show which channel and campaign brought each lead.
 */
export function getAttribution(): Record<string, unknown> | undefined {
  if (typeof window === "undefined") return undefined;
  const base: Record<string, unknown> = { language: navigator.language };
  try {
    base.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    // older browsers
  }
  try {
    const raw = sessionStorage.getItem("kdn_attr");
    const a = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    return {
      ...base,
      landingPage: a.lp,
      referrer: a.ref,
      utmSource: a.us,
      utmMedium: a.um,
      utmCampaign: a.uc,
      gclid: a.g === 1,
      sid: sessionStorage.getItem("kdn_sid") ?? undefined,
    };
  } catch {
    return base;
  }
}
