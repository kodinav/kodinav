import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Kodinav handles personal information: what the contact forms, analytics and free tools collect, what they don't, and your rights.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy — Kodinav",
    description: "What this website collects, what it doesn't, and your rights.",
    url: `${site.url}/privacy-policy`,
    type: "website",
  },
};

const updated = "15 July 2026";

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mt-10 mb-3 text-xl font-semibold tracking-tight">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 leading-relaxed text-muted">{children}</p>;
}

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-noise relative overflow-hidden pt-36 pb-20 sm:pt-44">
      <div aria-hidden className="bg-grid absolute inset-0" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-5">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="text-4xl sm:text-5xl">Privacy Policy</h1>
          <p className="annotation">Last updated: {updated}</p>
        </Reveal>

        <Reveal className="mt-8">
          <P>
            Kodinav (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is the independent
            software studio of {site.founder}, based in India. This policy
            explains, in plain language, what personal information this website
            collects, why, and the choices you have. The short version: we
            collect only what we need to reply to you and understand how the
            site is used, and we do not sell personal information to anyone.
          </P>

          <H>What we collect</H>
          <P>
            <strong className="text-foreground">Enquiry and lead forms.</strong>{" "}
            When you send an enquiry, request an audit, or fill any form here,
            we receive what you typed — typically your name, email or phone,
            and details about your project or website. We use it to reply and
            to provide what you asked for. It is stored securely on our server
            and in our working correspondence.
          </P>
          <P>
            <strong className="text-foreground">Analytics.</strong> We use
            Google Analytics to understand how visitors use the site — pages
            viewed, approximate location, device type. This uses cookies and is
            aggregated; it does not identify you to us personally. If we run
            advertising, ad platforms such as Meta or Google may also set a
            measurement cookie so we know an ad led to a visit.
          </P>
          <P>
            <strong className="text-foreground">Free tools.</strong> Most of
            our free tools (QR codes, invoices, signatures, calculators,
            policy and schema generators, image compression) run entirely in
            your browser — what you type or upload never reaches our server.
            Tools that scan a website (the audit, speed test, link and SSL
            checks) send the URL you enter to our server so the scan can run;
            we log scanned URLs and results to operate and improve the tools.
            Requests to our server, like requests to any web server, include
            your IP address, which we also use for rate limiting.
          </P>

          <H>What we don&apos;t do</H>
          <P>
            No selling of personal data. No marketing emails without your
            consent. No accounts, no trackers beyond the analytics and
            advertising measurement described above.
          </P>

          <H>Who we share data with</H>
          <P>
            Only the service providers needed to run this website: our hosting
            provider, Google (Analytics; Search tools), and — if advertising
            measurement is active — Meta or Google Ads. Each processes data
            under its own privacy policy. We do not share your enquiries with
            anyone else.
          </P>

          <H>How long we keep it</H>
          <P>
            Enquiries and correspondence are kept for as long as needed to
            serve you and for reasonable business records, then deleted. You
            can ask us to delete your information at any time.
          </P>

          <H>Your rights</H>
          <P>
            Subject to applicable law — including India&apos;s Digital Personal
            Data Protection Act, 2023 and, where they apply to you, laws such
            as the GDPR or CCPA — you can ask what information we hold about
            you, ask us to correct it, or ask us to delete it. Write to{" "}
            <a href={`mailto:${site.email}`} className="u-draw text-accent">
              {site.email}
            </a>{" "}
            and we will respond within a reasonable time.
          </P>

          <H>Changes and contact</H>
          <P>
            If this policy changes, the new version appears on this page with
            an updated date. Questions:{" "}
            <a href={`mailto:${site.email}`} className="u-draw text-accent">
              {site.email}
            </a>
            . See also our{" "}
            <Link href="/terms" className="u-draw text-accent">
              Terms of Service
            </Link>
            .
          </P>
        </Reveal>
      </div>
    </section>
  );
}
