import { Check, ShieldCheck, Timer, UserRound } from "lucide-react";
import { Faq } from "@/components/Faq";
import { LeadForm } from "@/components/LeadForm";
import { Reveal, Stagger, StaggerItem } from "@/components/motion";
import { ProjectShot } from "@/components/ProjectVisual";
import { Eyebrow, SectionHeading } from "@/components/ui";
import { Price } from "@/components/Price";
import { site } from "@/data/site";
import type { Project } from "@/data/projects";

export type LandingContent = {
  eyebrow: string;
  headline: [string, string]; // [plain part, gradient part]
  subheading: string;
  audienceLabel: string;
  orgLabel: string;
  source: string;
  painPoints: { title: string; body: string }[];
  outcomes: string[];
  proofProject: Project;
  proofNote: string;
  steps: { title: string; body: string }[];
  /** override LeadForm budget bands (e.g. USD for international pages) */
  budgets?: string[];
  faqs: { q: string; a: string }[];
  formTitle: string;
};

const trustSignals = [
  { icon: UserRound, text: "You work directly with the founder. No salespeople" },
  { icon: Timer, text: "Response within one business day, usually sooner" },
  { icon: ShieldCheck, text: "Fixed written quote. The price doesn't move" },
];

export function LandingPage({ content }: { content: LandingContent }) {
  const c = content;
  return (
    <>
      {/* Hero */}
      <section className="bg-noise relative overflow-hidden pt-36 pb-16 sm:pt-44">
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div
          aria-hidden
          className="orb -top-32 left-1/2 h-96 w-160 -translate-x-1/2"
          style={{ background: "var(--glow-blue)", opacity: 0.45 }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal className="flex flex-col items-center gap-6">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h1 className="text-balance text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
              {c.headline[0]} <span className="text-gradient">{c.headline[1]}</span>
            </h1>
            <p className="max-w-2xl text-pretty text-lg leading-relaxed text-muted">
              {c.subheading}
            </p>
            <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#lead-form"
                className="inline-flex min-h-13 items-center justify-center gap-3 border border-accent bg-accent px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-[#efeae0] transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground hover:bg-foreground hover:text-background active:scale-[0.98]"
              >
                Book Free Strategy Call
              </a>
              <a
                href="#lead-form"
                className="inline-flex min-h-13 items-center justify-center gap-3 border border-line-strong px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent active:scale-[0.98]"
              >
                Get a Free Website Audit
              </a>
            </div>
            <p className="text-sm text-faint">
              Pricing starts from <Price inr={site.priceFloor} usd={site.priceFloorUsd} /> · Fixed quotes · No obligation
            </p>
          </Reveal>

          <Stagger className="mx-auto mt-12 grid max-w-3xl gap-3 sm:grid-cols-3">
            {trustSignals.map((t) => (
              <StaggerItem key={t.text}>
                <div className="glass flex h-full items-start gap-3 rounded-2xl p-4 text-left">
                  <t.icon className="mt-0.5 size-4 shrink-0 text-accent-soft" />
                  <span className="text-xs leading-relaxed text-muted">{t.text}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Pain points */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Sound familiar?"
              title={`Why most ${c.audienceLabel} lose enquiries online.`}
            />
          </Reveal>
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-3">
            {c.painPoints.map((p) => (
              <StaggerItem key={p.title}>
                <div className="glass h-full rounded-2xl p-6">
                  <h3 className="mb-2 font-semibold tracking-tight">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{p.body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Outcomes */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <Reveal>
            <SectionHeading
              eyebrow="What you get"
              title="A website built to convert, not just to exist."
            />
          </Reveal>
          <Stagger className="mt-10 grid gap-3 sm:grid-cols-2">
            {c.outcomes.map((o) => (
              <StaggerItem key={o}>
                <div className="flex items-start gap-3 rounded-xl border border-line p-4">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                  <span className="text-sm leading-relaxed text-muted">{o}</span>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Proof */}
      <section className="relative overflow-hidden border-t border-line">
        <div
          aria-hidden
          className="orb top-0 right-0 h-80 w-80"
          style={{ background: "var(--glow-violet)", opacity: 0.3 }}
        />
        <div className="mx-auto max-w-4xl px-6 py-20">
          <Reveal>
            <SectionHeading eyebrow="Recent Work" title={c.proofProject.name} lead={c.proofNote} />
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <ProjectShot
              image={c.proofProject.images.cover}
              caption={c.proofProject.name}
              sizes="(max-width: 1024px) 100vw, 900px"
            />
          </Reveal>
          <Stagger className="mt-6 grid gap-3 sm:grid-cols-3">
            {c.proofProject.impact.map((i) => (
              <StaggerItem key={i}>
                <div className="glass h-full rounded-2xl p-5">
                  <p className="text-sm leading-relaxed text-muted">{i}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Steps */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <Reveal>
            <SectionHeading eyebrow="How it works" title="Three steps to launch." />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {c.steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.07}>
                <div className="glass h-full rounded-2xl p-6">
                  <span className="font-mono text-sm text-accent-soft">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 mb-2 font-semibold tracking-tight">{s.title}</h3>
                  <p className="text-sm leading-relaxed text-muted">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Lead form */}
      <section id="lead-form" className="relative overflow-hidden border-t border-line scroll-mt-24">
        <div
          aria-hidden
          className="orb -bottom-24 left-1/2 h-80 w-160 -translate-x-1/2"
          style={{ background: "var(--glow-blue)", opacity: 0.35 }}
        />
        <div className="relative mx-auto max-w-3xl px-6 py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Free Strategy Call"
              title={c.formTitle}
              lead="Fill this in and you'll hear back within one business day, with real observations about your current online presence, not a canned pitch."
              align="center"
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <div className="glass rounded-3xl p-7 sm:p-10">
              <LeadForm orgLabel={c.orgLabel} source={c.source} budgets={c.budgets} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <Reveal>
            <SectionHeading eyebrow="FAQ" title="Fair questions." align="center" />
          </Reveal>
          <div className="mt-10">
            <Faq items={c.faqs} />
          </div>
          <Reveal className="mt-12 text-center">
            <a
              href="#lead-form"
              className="inline-flex min-h-13 w-full items-center justify-center gap-3 border border-accent bg-accent px-8 py-4 font-mono text-xs uppercase tracking-[0.18em] text-[#efeae0] transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground hover:bg-foreground hover:text-background active:scale-[0.98] sm:w-auto"
            >
              Book Free Strategy Call
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
