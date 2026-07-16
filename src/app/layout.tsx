import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk, Fragment_Mono } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

// Re-generate prerendered pages at most every 5 minutes. This caps the
// s-maxage sent to Hostinger's CDN, so a fresh deploy stops being masked by
// year-long cached HTML that references deleted asset chunks.
export const revalidate = 300;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Extend the paper background under the iPhone notch / Dynamic Island;
  // fixed elements pad themselves with env(safe-area-inset-*).
  viewportFit: "cover",
  themeColor: "#f3f1e9",
};

/* "The Ledger" type stack. The CSS variable names are frozen across
   redesigns (globals.css and older tooling reference them) — only the
   fonts bound to them change: display + serif are both Fraunces, the
   body is Hanken Grotesk, numerals and annotations are Fragment Mono. */

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-anton",
});

const fragmentMono = Fragment_Mono({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-space-mono",
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    // ≤60 chars so Google shows it untruncated in SERPs
    default: `${site.name} — Website Development & Custom Web Apps`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  keywords: [...site.keywords],
  authors: [{ name: site.founder, url: site.url }],
  creator: site.founder,
  publisher: site.name,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    title: site.name,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  // Google Search Console verification. Present both as a DNS TXT record and
  // here as an HTML meta tag, so a URL-prefix property verifies instantly
  // without waiting on Google's DNS cache. Override via env var if needed.
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "9EfehS5fC17OPIdiq4iYrrrTR5EeBVwhno6duhgYp3A",
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
};

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
  // Primary target markets first — US and UAE lead, India follows
  areaServed: [
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
  inLanguage: "en",
};

// GA4 Measurement ID. Public by design (it ships in the page HTML); override
// with the NEXT_PUBLIC_GA_ID env var if the property ever changes.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-X8JNSHE7G2";

// Meta Pixel, rendered server-side exactly like the GA4 tag above. The earlier
// version used a client component with usePathname() in this root layout, which
// broke the production build; keep this a plain inline script. Empty = pixel off.
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || "";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${fragmentMono.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Geo-aware pricing: set the region flag before paint (no flash).
            India (Asia/Kolkata timezone or en-IN locale) sees ₹, else USD. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=(Intl.DateTimeFormat().resolvedOptions().timeZone||'');var l=(navigator.language||'');var india=/Kolkata|Calcutta/i.test(t)||/[-_]IN$/i.test(l);document.documentElement.setAttribute('data-region',india?'in':'intl');}catch(e){document.documentElement.setAttribute('data-region','in');}})();`,
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
