import { site } from "@/data/site";

/** WebApplication JSON-LD for a free tool page. */
export function toolSchema(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    url: `${site.url}${path}`,
    description,
    provider: { "@id": `${site.url}/#studio` },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
}

/** FAQPage JSON-LD from the page's visible FAQ items. */
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** BreadcrumbList JSON-LD for detail pages. */
export function breadcrumbSchema(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", path: "/" },
      ...items,
    ].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}
