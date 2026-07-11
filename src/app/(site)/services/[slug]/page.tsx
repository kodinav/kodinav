import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { Chip, Eyebrow, SectionHeading } from "@/components/ui";
import { getService, services } from "@/data/services";
import { site } from "@/data/site";

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
    title: `${service.name} — Development Services in India`,
    description: service.short,
    keywords: [
      service.name,
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
    areaServed: "IN",
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

      <section className="bg-noise relative overflow-hidden pt-40 pb-16 sm:pt-48">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div
          aria-hidden
          className="orb -top-24 left-1/2 h-96 w-160 -translate-x-1/2"
          style={{ background: "var(--glow-blue)", opacity: 0.35 }}
        />
        <div className="relative mx-auto max-w-4xl px-6">
          <Reveal className="flex flex-col gap-6">
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" /> All services
            </Link>
            <Eyebrow>{service.name}</Eyebrow>
            <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              {service.headline}
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
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
          <div className="glass rounded-2xl p-7">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-faint">
              Who this is for
            </p>
            <p className="mt-3 leading-relaxed text-muted">{service.forWho}</p>
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
              <div className="glass flex gap-6 rounded-2xl p-7">
                <span className="font-mono text-sm text-accent-soft">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="mb-1.5 font-semibold tracking-tight">{a.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{a.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-12 pb-20">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Common questions." />
        </Reveal>
        <div className="mt-10">
          <Faq items={service.faqs} />
        </div>
      </section>

      <CtaSection
        title={`Discuss your ${service.name.toLowerCase()} project.`}
        lead="A discovery call gives you an honest scope and a fixed quote — and a clear 'this isn't worth building' if that's the truth."
      />
    </>
  );
}
