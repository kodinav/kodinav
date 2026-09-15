import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/motion";
import { Eyebrow } from "@/components/ui";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms for using kodinav.com, its free tools, and engaging Kodinav for development work or the paid website audit.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms of Service — Kodinav",
    description: "Plain-language terms for the website, the free tools, and our services.",
    url: `${site.url}/terms`,
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

export default function TermsPage() {
  return (
    <section className="bg-noise relative overflow-hidden pt-36 pb-20 sm:pt-44">
      <div aria-hidden className="bg-grid absolute inset-0" />
      <div className="relative mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-5">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="text-4xl sm:text-5xl">Terms of Service</h1>
          <p className="annotation">Last updated: {updated}</p>
        </Reveal>

        <Reveal className="mt-8">
          <P>
            These terms cover using kodinav.com — including its free tools —
            and, in outline, how engagements with Kodinav work. They are
            written to be read, not to intimidate. Kodinav is the independent
            software studio of {site.founder}, based in India.
          </P>

          <H>Using this website and the free tools</H>
          <P>
            The free tools are provided as-is, without warranty. They are
            honest but automated: results (audits, scans, generated documents,
            calculations) are informational and not professional, legal or tax
            advice. Generated documents such as privacy policies and invoices
            are templates you use at your own responsibility. Don&apos;t abuse
            the tools — automated scraping of them, attempts to scan private
            infrastructure, or circumventing rate limits may result in blocked
            access. Only scan websites you own or are authorised to check.
          </P>

          <H>Development services</H>
          <P>
            Project work is governed by the written scope and quote you receive
            after a discovery call — that document, and anything else we agree
            in writing, takes precedence over this page. The standing
            principles: quotes are fixed and itemised; what is agreed is what
            is billed; on full payment you own the deliverables — code, design
            and content created for you; and every project includes the support
            period named in its scope.
          </P>

          <H>The paid website audit</H>
          <P>
            The paid audit ({site.audit.priceUsd} / {site.audit.priceInr}) is a
            manual, written review of your website delivered within{" "}
            {site.audit.turnaround} of payment and receipt of your site
            details. If we have not started the work, you can cancel for a full
            refund. If we fail to deliver within the promised window, you get a
            full refund. Once delivered, the fee is credited toward the fixes
            if you engage us to implement them.
          </P>

          <H>Intellectual property</H>
          <P>
            The content of this website — text, design, imagery, code — belongs
            to Kodinav unless noted otherwise. Case-study names and logos
            belong to their respective clients and are shown with permission.
          </P>

          <H>Liability</H>
          <P>
            To the maximum extent permitted by law, Kodinav is not liable for
            indirect or consequential losses arising from use of this website
            or its free tools. For paid engagements, liability is limited to
            the amount paid for the engagement concerned. Nothing here limits
            liability that cannot lawfully be limited.
          </P>

          <H>Governing law, changes, contact</H>
          <P>
            These terms are governed by the laws of India. If they change, the
            new version appears here with an updated date. Questions:{" "}
            <a href={`mailto:${site.email}`} className="u-draw text-accent">
              {site.email}
            </a>
            . See also the{" "}
            <Link href="/privacy-policy" className="u-draw text-accent">
              Privacy Policy
            </Link>
            .
          </P>
        </Reveal>
      </div>
    </section>
  );
}
