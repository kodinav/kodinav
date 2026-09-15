import { site } from "@/data/site";
import { fontVariables } from "@/lib/fonts";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#studio`,
  name: site.name,
  alternateName: `${site.name} ${site.tagline}`,
  description: site.description,
  url: site.url,
  email: site.email,
  telephone: site.phoneRaw,
  image: `${site.url}/founder.jpg`,
  slogan: "We build software that helps businesses grow.",
  founder: { "@id": `${site.url}/#founder` },
  foundingDate: "2024",
  // Primary target markets first — Hong Kong and Taiwan lead (2026-09),
  // then the established US/UAE markets, then India
  areaServed: [
    { "@type": "AdministrativeArea", name: "Hong Kong" },
    { "@type": "Country", name: "Taiwan" },
    { "@type": "Country", name: "United States" },
    { "@type": "Country", name: "United Arab Emirates" },
    { "@type": "City", name: "Dubai" },
    ...site.serviceAreas.map((name) => ({ "@type": "City", name })),
    { "@type": "Country", name: "India" },
    "Worldwide",
  ],
  availableLanguage: ["English", "Hindi"],
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressRegion: "Delhi NCR",
    addressCountry: "IN",
  },
  sameAs: ["https://github.com/kodinav"],
  knowsAbout: [
    "Website Development",
    "Custom Website Development",
    "Web Application Development",
    "Landing Page Development",
    "E-Commerce Development",
    "Mobile App Development",
    "React Development",
    "Next.js Development",
    "SEO-Friendly Website Development",
    "Multilingual Website Development",
    "Learning Management Systems",
    "CRM Development",
    "ERP Development",
    "AI Integration",
  ],
  makesOffer: [
    "Business Website Development",
    "Custom Web Applications",
    "Landing Page Development",
    "E-Commerce Development",
    "Mobile Apps",
    "Website Redesign",
    "Website Maintenance",
    "Performance & SEO Optimization",
  ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name } })),
};

const founderSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${site.url}/#founder`,
  name: site.founder,
  jobTitle: "Founder & Software Engineer",
  description:
    "Freelance web developer and full stack engineer in Delhi NCR, India. Founder of Kodinav. Builds websites, web applications and mobile apps with React, Next.js, Node.js and Flutter.",
  url: `${site.url}/about`,
  image: `${site.url}/founder.jpg`,
  email: site.email,
  telephone: site.phoneRaw,
  worksFor: { "@id": `${site.url}/#studio` },
  address: {
    "@type": "PostalAddress",
    addressRegion: "Delhi NCR",
    addressCountry: "IN",
  },
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "TypeScript",
    "Flutter",
    "PostgreSQL",
    "Website Development",
    "Full Stack Development",
  ],
  sameAs: ["https://github.com/kodinav"],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  url: site.url,
  name: site.name,
  description: site.description,
  publisher: { "@id": `${site.url}/#studio` },
  inLanguage: ["en", "zh-HK", "zh-TW"],
};

// GA4 Measurement ID. Public by design (it ships in the page HTML); override
// with the NEXT_PUBLIC_GA_ID env var if the property ever changes.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-X8JNSHE7G2";

// Meta Pixel, rendered server-side exactly like the GA4 tag above. The earlier
// version used a client component with usePathname() in this root layout, which
// broke the production build; keep this a plain inline script. Empty = pixel off.
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

/**
 * The <html>/<body> document shared by every root layout. Each document
 * language gets its own root layout (Next only lets a root layout set
 * <html lang>), and they all render through this so fonts, structured data,
 * analytics and the pre-paint region script stay identical everywhere.
 */
export function RootDocument({
  lang,
  children,
}: {
  lang: "en" | "zh-HK" | "zh-TW";
  children: React.ReactNode;
}) {
  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Geo-aware pricing: set the region flags before paint (no flash).
            India (Asia/Kolkata timezone or en-IN locale) sees ₹, else USD;
            Hong Kong / Macau and Taiwan (timezone or zh-HK/zh-TW locale)
            additionally get data-market so prices show HK$ / NT$. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=(Intl.DateTimeFormat().resolvedOptions().timeZone||'');var l=(navigator.language||'');var india=/Kolkata|Calcutta/i.test(t)||/[-_]IN$/i.test(l);var r=document.documentElement;r.setAttribute('data-region',india?'in':'intl');var hk=/Hong_Kong|Macau/i.test(t)||/^zh[-_](HK|MO)/i.test(l);var tw=/Taipei/i.test(t)||/^zh[-_]TW/i.test(l);if(hk)r.setAttribute('data-market','hk');else if(tw)r.setAttribute('data-market','tw');}catch(e){document.documentElement.setAttribute('data-region','in');}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(founderSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${GA_ID}');`,
              }}
            />
          </>
        )}
        {/* Meta Pixel */}
        {META_PIXEL_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`,
            }}
          />
        )}
      </body>
    </html>
  );
}
