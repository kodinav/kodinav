"use client";

import { useState } from "react";

/**
 * Schema markup generator — builds JSON-LD from a form, entirely client-side.
 * Only fields the visitor actually fills are emitted; empty keys would be
 * noise in their markup and dishonest boilerplate in ours.
 */

const inputCls =
  "w-full border border-line-strong bg-transparent px-4 py-3 text-base text-foreground placeholder:text-faint outline-none transition-colors focus:border-accent sm:text-sm";
const labelCls = "annotation mb-2 block";

type SchemaType = "LocalBusiness" | "Organization" | "FAQPage" | "Service";

const TYPES: { id: SchemaType; label: string; blurb: string }[] = [
  { id: "LocalBusiness", label: "Local Business", blurb: "Shops, clinics, institutes, restaurants" },
  { id: "Organization", label: "Organization", blurb: "Companies without a walk-in location" },
  { id: "Service", label: "Service", blurb: "A specific service you offer" },
  { id: "FAQPage", label: "FAQ Page", blurb: "Question-and-answer sections" },
];

function clean(obj: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === "" || v === null || v === undefined) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}

export function SchemaGenerator() {
  const [type, setType] = useState<SchemaType>("LocalBusiness");
  const [copied, setCopied] = useState(false);
  // Shared fields
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  // LocalBusiness
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [country, setCountry] = useState("");
  const [hours, setHours] = useState("");
  const [priceRange, setPriceRange] = useState("");
  // Service
  const [providerName, setProviderName] = useState("");
  const [area, setArea] = useState("");
  // FAQ
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([{ q: "", a: "" }]);

  let schema: Record<string, unknown>;
  if (type === "FAQPage") {
    schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs
        .filter((f) => f.q.trim() && f.a.trim())
        .map((f) => ({
          "@type": "Question",
          name: f.q.trim(),
          acceptedAnswer: { "@type": "Answer", text: f.a.trim() },
        })),
    };
  } else if (type === "Service") {
    schema = clean({
      "@context": "https://schema.org",
      "@type": "Service",
      name,
      description,
      url,
      areaServed: area,
      provider: providerName
        ? clean({ "@type": "Organization", name: providerName, url })
        : undefined,
    });
  } else {
    const address = clean({
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: city,
      addressRegion: region,
      addressCountry: country,
    });
    schema = clean({
      "@context": "https://schema.org",
      "@type": type,
      name,
      description,
      url,
      telephone: phone,
      email,
      priceRange: type === "LocalBusiness" ? priceRange : "",
      openingHours: type === "LocalBusiness" ? hours : "",
      address: Object.keys(address).length > 1 ? address : undefined,
    });
  }

  const json = JSON.stringify(schema, null, 2);
  const snippet = `<script type="application/ld+json">\n${json}\n</script>`;
  const filled =
    type === "FAQPage"
      ? faqs.some((f) => f.q.trim() && f.a.trim())
      : Boolean(name.trim());

  const copy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
      <div className="flex flex-col gap-6">
        <fieldset>
          <legend className={labelCls}>Schema type</legend>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={type === t.id}
                onClick={() => setType(t.id)}
                className={`border px-4 py-2.5 text-left transition-colors ${
                  type === t.id
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-line-strong text-muted hover:border-foreground hover:text-foreground"
                }`}
              >
                <span className="font-mono text-xs uppercase tracking-[0.14em]">{t.label}</span>
                <span className="mt-1 block text-xs text-faint">{t.blurb}</span>
              </button>
            ))}
          </div>
        </fieldset>

        {type !== "FAQPage" && (
          <>
            <div>
              <label htmlFor="sg-name" className={labelCls}>
                {type === "Service" ? "Service name" : "Business name"} *
              </label>
              <input id="sg-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder={type === "Service" ? "Website Development" : "Sunrise Dental Clinic"} />
            </div>
            <div>
              <label htmlFor="sg-desc" className={labelCls}>Description</label>
              <textarea id="sg-desc" rows={2} className={`${inputCls} resize-y`} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="One or two honest sentences about what you do." />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="sg-url" className={labelCls}>Website URL</label>
                <input id="sg-url" className={inputCls} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
              </div>
              {type === "Service" ? (
                <div>
                  <label htmlFor="sg-area" className={labelCls}>Area served</label>
                  <input id="sg-area" className={inputCls} value={area} onChange={(e) => setArea(e.target.value)} placeholder="Dubai / United States / Worldwide" />
                </div>
              ) : (
                <div>
                  <label htmlFor="sg-phone" className={labelCls}>Phone</label>
                  <input id="sg-phone" className={inputCls} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971 50 123 4567" />
                </div>
              )}
            </div>
            {type === "Service" && (
              <div>
                <label htmlFor="sg-provider" className={labelCls}>Provider (your business name)</label>
                <input id="sg-provider" className={inputCls} value={providerName} onChange={(e) => setProviderName(e.target.value)} placeholder="Sunrise Dental Clinic" />
              </div>
            )}
            {type !== "Service" && (
              <div>
                <label htmlFor="sg-email" className={labelCls}>Email</label>
                <input id="sg-email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="hello@example.com" />
              </div>
            )}
            {type === "LocalBusiness" && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sg-street" className={labelCls}>Street address</label>
                    <input id="sg-street" className={inputCls} value={street} onChange={(e) => setStreet(e.target.value)} placeholder="12 Marina Walk" />
                  </div>
                  <div>
                    <label htmlFor="sg-city" className={labelCls}>City</label>
                    <input id="sg-city" className={inputCls} value={city} onChange={(e) => setCity(e.target.value)} placeholder="Dubai" />
                  </div>
                  <div>
                    <label htmlFor="sg-region" className={labelCls}>State / Emirate</label>
                    <input id="sg-region" className={inputCls} value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Dubai" />
                  </div>
                  <div>
                    <label htmlFor="sg-country" className={labelCls}>Country code</label>
                    <input id="sg-country" className={inputCls} value={country} onChange={(e) => setCountry(e.target.value)} placeholder="AE / US / IN" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="sg-hours" className={labelCls}>Opening hours</label>
                    <input id="sg-hours" className={inputCls} value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Mo-Sa 09:00-18:00" />
                  </div>
                  <div>
                    <label htmlFor="sg-price" className={labelCls}>Price range</label>
                    <input id="sg-price" className={inputCls} value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder="$$" />
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {type === "FAQPage" && (
          <div className="flex flex-col gap-4">
            {faqs.map((f, i) => (
              <div key={i} className="border border-line p-4">
                <label className={labelCls}>Question {i + 1}</label>
                <input
                  className={inputCls}
                  value={f.q}
                  onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))}
                  placeholder="How long does delivery take?"
                />
                <label className={`${labelCls} mt-3`}>Answer</label>
                <textarea
                  rows={2}
                  className={`${inputCls} resize-y`}
                  value={f.a}
                  onChange={(e) => setFaqs(faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))}
                  placeholder="Orders ship within 2 business days…"
                />
              </div>
            ))}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFaqs([...faqs, { q: "", a: "" }])}
                className="border border-line-strong px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent"
              >
                + Add question
              </button>
              {faqs.length > 1 && (
                <button
                  type="button"
                  onClick={() => setFaqs(faqs.slice(0, -1))}
                  className="border border-line-strong px-4 py-2 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  − Remove last
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Output */}
      <div className="ink relative h-fit self-start p-7 sm:p-8 lg:sticky lg:top-28">
        <div aria-hidden className="absolute -top-1.5 -left-1.5 size-3 border border-line-strong bg-background" />
        <p className="annotation mb-4">Your JSON-LD — paste before &lt;/head&gt;</p>
        {filled ? (
          <>
            <pre className="max-h-96 overflow-auto border border-line p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground/90">
              {snippet}
            </pre>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 border border-accent bg-accent px-5 py-3 font-mono text-xs tracking-[0.14em] text-accent-contrast uppercase transition-transform hover:-translate-y-0.5"
              >
                {copied ? "Copied ✓" : "Copy snippet"}
              </button>
              <a
                href="https://validator.schema.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-line-strong px-5 py-3 font-mono text-xs tracking-[0.14em] text-foreground uppercase transition-colors hover:border-accent hover:text-accent"
              >
                Validate it →
              </a>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted">
              Only fields you filled are included — empty properties are noise.
              Everything you type stays in your browser.
            </p>
          </>
        ) : (
          <p className="text-sm leading-relaxed text-muted">
            Fill the form and the ready-to-paste snippet appears here. Schema
            markup is how you tell Google what your business is in its own
            vocabulary — it powers rich results like stars, FAQs and business
            panels.
          </p>
        )}
      </div>
    </div>
  );
}
