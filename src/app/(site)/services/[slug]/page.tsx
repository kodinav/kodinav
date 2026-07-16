import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Chip, Eyebrow, SectionHeading } from "@/components/ui";
import { getService, services } from "@/data/services";
import { site } from "@/data/site";
import { ogImage } from "@/lib/og";
import { breadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const service = getService((await params).slug);
  if (!service) return {};
  return {
    title: `${service.name} — Development Services`,
    description: service.short,
    keywords: [
      service.name,
      `${service.name} USA`,
      `${service.name} Dubai`,
      `${service.name} India`,
      `${service.name} development`,
      ...service.stack,
      "Kodinav",
    ],
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.name} | Kodinav`,
      description: service.short,
      url: `${site.url}/services/${service.slug}`,
      type: "website",
      images: ogImage(service.name, "Service"),
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.short,
    provider: {
      "@type": "ProfessionalService",
      name: site.name,
      url: site.url,
    },
    areaServed: ["US", "AE", "IN"],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // Curated related services, falling back to thematic neighbours in the list
  const relatedSlugs =
    service.related ??
    services
      .filter((s) => s.slug !== slug)
      .slice(0, 3)
      .map((s) => s.slug);
  const relatedServices = relatedSlugs
    .map((s) => getService(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const crumbs = breadcrumbSchema([
    { name: "Services", path: "/services" },
    { name: service.name, path: `/services/${service.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }}
      />

      <section className="bg-noise relative overflow-hidden pt-40 pb-16 sm:pt-48">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-6">
          <Reveal className="flex flex-col gap-6">
            <nav aria-label="Breadcrumb" className="annotation flex items-center gap-2">
              <Link href="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
              <span aria-hidden>/</span>
              <Link href="/services" className="transition-colors hover:text-foreground">
                Services
              </Link>
              <span aria-hidden>/</span>
              <span className="text-foreground/70">{service.name}</span>
            </nav>
            <Eyebrow>{service.name}</Eyebrow>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              {service.headline}
            </h1>
            <p className="prose-justify max-w-2xl text-lg leading-relaxed text-muted">
              {service.intro}
            </p>
            <div className="flex flex-wrap gap-2">
              {service.stack.map((t) => (
                <Chip key={t}>{t}</Chip>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <Reveal>
          <div className="glass rounded-md p-7">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
              Who this is for
            </p>
            <p className="prose-justify mt-3 leading-relaxed text-muted">{service.forWho}</p>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <Reveal>
          <SectionHeading eyebrow="Scope" title="What's included." />
        </Reveal>
        <Stagger className="mt-10 grid gap-3 sm:grid-cols-2">
          {service.deliverables.map((d) => (
            <StaggerItem key={d}>
              <div className="flex items-start gap-3 rounded-xl border border-line p-4">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                <span className="text-sm leading-relaxed text-muted">{d}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <Reveal>
          <SectionHeading eyebrow="Approach" title="How I build this." />
        </Reveal>
        <div className="mt-10 flex flex-col gap-4">
          {service.approach.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.05}>
              <div className="glass flex gap-6 rounded-md p-7">
                <span className="font-mono text-sm text-accent-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="mb-1.5 font-semibold tracking-tight">{a.title}</h3>
                  <p className="prose-justify text-sm leading-relaxed text-muted">{a.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Common questions." />
        </Reveal>
        <div className="mt-10">
          <Faq items={service.faqs} />
        </div>
      </section>

      {/* Related services — internal linking */}
      {relatedServices.length > 0 && (
        <section className="mx-auto max-w-4xl px-6 py-12 pb-20">
          <Reveal>
            <SectionHeading eyebrow="Related Services" title="Also worth knowing." />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {relatedServices.map((r) => (
              <Reveal key={r.slug}>
                <Link
                  href={`/services/${r.slug}`}
                  className="card-hover glass group flex h-full flex-col gap-3 p-6"
                >
 <h3 className="font-display text-xl leading-none transition-colors group-hover:text-accent">
                    {r.name}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{r.short}</p>
                  <span className="annotation mt-auto pt-2 text-accent">
                    View service →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CtaSection
        title={`Discuss your ${service.name.toLowerCase()} project.`}
        lead="A discovery call gives you an honest scope and a fixed quote. And a clear 'this isn't worth building' if that's the truth."
      />
    </>
  );
}
