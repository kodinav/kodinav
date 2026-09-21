import Image from "next/image";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { LeadForm } from "@/components/LeadForm";
import { Price } from "@/components/Price";
import { questions } from "@/components/stage/content";
import { ButtonLink } from "@/components/ui";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { faqSchema } from "@/lib/schema";

/**
 * Home, for buyers. An owner deciding whether to spend their own money wants
 * four answers, fast: do you build what I need, can I see it working, what
 * does it cost and how long, and how do I reach you. So: the offer and the
 * price in one screen, the real work straight after, the person, the process,
 * the numbers, the questions, a short form. The long-form film is at /story.
 *
 * Every claim here is one the site already made; nothing is invented.
 */
const steps = [
  { n: "01", title: "A short call", body: "You explain the business and what is stuck. No deck, no sales team: you talk to the engineer who would build it." },
  { n: "02", title: "A fixed, written quote", body: "Every screen and workflow is named and priced. Nothing vague, nothing added mid-project." },
  { n: "03", title: "Launch, and a support period", body: "A typical business website is live in three to six weeks. Source code, documentation and access are handed over: you own it completely." },
];

export default function Home() {
  return (
    <div className="home">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(questions.items)) }} />

      {/* ---------- the offer, in one screen ---------- */}
      <section className="h-hero">
        <div className="h-sky" aria-hidden>
          <i className="h-cloud c1" />
          <i className="h-cloud c2" />
          <i className="h-cloud c3" />
          <i className="h-march" />
        </div>
        <div className="h-wrap">
          <p className="h-eyebrow">Independent software studio · {site.location}</p>
          <h1>
            Websites, web apps and mobile apps, <em>built by one engineer.</em>
          </h1>
          <p className="h-lead">
            A fixed, written quote. A typical business website live in three to six weeks. You own the code. Projects
            start from <Price inr={site.priceFloor} usd={site.priceFloorUsd} />.
          </p>
          <div className="h-cta">
            <ButtonLink href={site.whatsapp} external size="lg">
              WhatsApp {site.founder.split(" ")[0]}
            </ButtonLink>
            <ButtonLink href="/contact" variant="outline" size="lg">
              Book a call
            </ButtonLink>
          </div>
          <ul className="h-facts">
            <li>
              <b>
                From <Price inr={site.priceFloor} usd={site.priceFloorUsd} />
              </b>
              <span>fixed, itemised quote</span>
            </li>
            <li>
              <b>3 to 6 weeks</b>
              <span>typical business website</span>
            </li>
            <li>
              <b>You own the code</b>
              <span>handed over at launch</span>
            </li>
            <li>
              <b>1 business day</b>
              <span>to hear back from me</span>
            </li>
          </ul>
        </div>
      </section>

      {/* ---------- proof: the real work ---------- */}
      <section id="work" className="h-sec">
        <header className="h-head">
          <p className="h-label">The work · {projects.length} projects</p>
          <h2>Real projects, built and shipped.</h2>
          <p>Every one designed, engineered and supported by the same person you would be talking to.</p>
        </header>
        <ol className="h-work">
          {projects.map((p, i) => (
            <li key={p.slug}>
              <Link href={`/work/${p.slug}`} className="h-shot" aria-label={`${p.name}: case file`}>
                <Image src={p.images.cover.src} alt={p.images.cover.alt} width={1600} height={1000} sizes="(max-width: 760px) 92vw, 44vw" priority={i < 2} />
              </Link>
              <p className="h-label">
                {p.industry.split(" · ")[0]} · {p.year}
              </p>
              <h3>{p.name}</h3>
              <p>{p.summary}</p>
              <p className="h-links">
                <Link href={`/work/${p.slug}`}>Case file →</Link>
                {p.url && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer">
                    Visit live site ↗
                  </a>
                )}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- the person ---------- */}
      <section className="h-sec h-founder">
        <Image src="/founder.jpg" alt={`${site.founder}, founder of ${site.name}`} width={800} height={800} sizes="(max-width: 760px) 60vw, 300px" />
        <div>
          <p className="h-label">Who you deal with</p>
          <h2>You talk to the person who builds it.</h2>
          <p>
            I’m {site.founder}. {site.name} is an independent studio, not an agency that hands your work to juniors. No
            account managers, no handoffs: the engineer on your first call is the one who writes your software and
            answers when something needs fixing.
          </p>
          <p className="h-links">
            <Link href="/about">About me →</Link>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:${site.phoneRaw}`}>{site.phone}</a>
          </p>
        </div>
      </section>

      {/* ---------- the process ---------- */}
      <section className="h-sec">
        <header className="h-head">
          <p className="h-label">How it works</p>
          <h2>Three steps, no surprises.</h2>
        </header>
        <ol className="h-steps">
          {steps.map((s) => (
            <li key={s.n}>
              <span className="h-label">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- the numbers ---------- */}
      <section className="h-sec h-price">
        <div>
          <p className="h-label">What it costs</p>
          <h2>
            From <Price inr={site.priceFloor} usd={site.priceFloorUsd} />, fixed in writing.
          </h2>
          <p>
            Projects scale with scope, from a five-page business website to a full ERP. All {services.length} services
            are quoted the same way: every screen named, every price fixed.
          </p>
          <p className="h-links">
            <Link href="/pricing">How pricing works →</Link>
            <Link href="/website-cost-calculator">Estimate your project →</Link>
            <Link href="/services">All {services.length} services →</Link>
          </p>
        </div>
        <aside>
          <p className="h-label">Not sure what you need?</p>
          <h3>Start with a website audit.</h3>
          <p>
            A real engineer tells you why your site is slow, invisible on Google or losing enquiries, with a prioritised
            fix list in {site.audit.turnaround}.
          </p>
          <ButtonLink href="/free-website-audit" variant="outline">
            See the audit
          </ButtonLink>
        </aside>
      </section>

      {/* ---------- the questions ---------- */}
      <section className="h-sec">
        <header className="h-head">
          <p className="h-label">Fair questions</p>
          <h2>What people ask first.</h2>
        </header>
        <Faq items={questions.items} />
      </section>

      {/* ---------- the brief ---------- */}
      <section id="brief" className="h-sec h-form">
        <header className="h-head">
          <p className="h-label">Start here</p>
          <h2>Tell me what you’re building.</h2>
          <p>You’ll hear back within one business day, from the engineer who would build it.</p>
          <p className="h-links">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
              Or message me on WhatsApp ↗
            </a>
            <Link href="/story">The long version: our story →</Link>
          </p>
        </header>
        <LeadForm source="home" />
      </section>
    </div>
  );
}
