import Image from "next/image";
import Link from "next/link";
import { HeroMotion } from "@/components/HeroMotion";
import { CountUp, QuoteCarousel, ServiceStack } from "@/components/HomeInteractive";
import { Intro } from "@/components/Intro";
import { Price } from "@/components/Price";
import { ButtonLink } from "@/components/ui";
import { homeFaq } from "@/data/homeFaq";
import { projects } from "@/data/projects";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { TOOL_COUNT } from "@/data/tools";
import { faqSchema } from "@/lib/schema";

/**
 * Home. Title, description, canonical and Open Graph come from the root
 * metadata, and the organisation / founder / website JSON-LD from
 * RootDocument; this page adds the FAQ it answers.
 *
 * Everything here is a claim the site already makes; nothing is invented.
 */
const colors = ["#b5533c", "#2f5f8f", "#2f7c78", "#5c4d8f", "#a3541f", "#7a4f6d", "#4f7d55", "#2c4a70", "#4b4f93", "#8a5a2b", "#3f6f6a", "#6b4a7e", "#3b5a8a"];

const expect = [
  { t: "A fixed, itemised quote before any work starts", s: "Every screen and workflow named and priced. Nothing vague, nothing added mid-project." },
  { t: "A business website live in three to six weeks", s: "Applications are sliced so you see working software in weeks, not months." },
  { t: "Source code, documentation and access handed over", s: "At launch, everything is yours. Every project includes a support period." },
  { t: "A reply within one business day, from the engineer", s: "No account managers, no handoffs: the person you talk to writes your software." },
];

export default function Home() {
  const first = site.founder.split(" ")[0];
  // the reference mixes wide and tall cards in each row; tall ones take the phone screen
  const mixed = (ps: typeof projects) => ps.map((p, i) => (i % 2 ? { p, tall: true, im: p.images.mobile[0] ?? p.images.cover } : { p, tall: false, im: p.images.cover }));
  const rowA = mixed(projects.slice(0, 4));
  const rowB = mixed(projects.slice(4, 8));
  const fanL = [projects[0], projects[1], projects[2]].map((p) => p.images.desktop[0] ?? p.images.cover);
  const fanR = [projects[3], projects[4], projects[5]].map((p) => p.images.mobile[0] ?? p.images.cover);
  const lead = services[0];
  const rest = services.slice(1).map((s, i) => ({ slug: s.slug, name: s.name, short: s.short, color: colors[(i + 1) % colors.length], n: i + 2 }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(homeFaq)) }} />

      {/* ---------- hero ---------- */}
      <section className="hero">
        <Intro />
        <HeroMotion />
        <div className="hero-in">
          <h1 className="hero-h">
            <span className="hl">
              <span>Build A Website</span>
            </span>{" "}
            <span className="hl">
              <span className="hero-line">
                That <hr />
              </span>
            </span>{" "}
            <span className="hl hl-it">
              <span className="hero-it">Performs</span>
            </span>
          </h1>
          <div className="hero-side">
            <p>
              Templates made every business website look the same. I build websites and software that work for the business
              behind them — designed, engineered and supported by one engineer, from discovery and structure to launch and
              support. A fixed, written quote, live in weeks, and you own the code.
            </p>
            <div className="hero-cta">
              <ButtonLink href="/process" variant="outline">
                How I build websites
              </ButtonLink>
            </div>
          </div>
        </div>
        <div className="hero-feat">
          <p className="annotation">Built for</p>
          <div className="feat-marquee">
            <div className="feat-track">
              {[0, 1].map((k) => (
                <ul key={k} aria-hidden={k === 1}>
                  {projects.map((p, i) => (
                    <li key={p.slug} style={{ "--i": i } as React.CSSProperties}>
                      {p.name}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- featured work: two rows drifting past ---------- */}
      <section className="works" id="work">
        <h2 className="works-h">Featured work</h2>
        {[rowA, rowB].map((row, r) => (
          <div key={r} className={`works-row ${r ? "is-rev" : ""}`}>
            <div className="works-track">
              {[0, 1].map((k) => (
                <div key={k} className="works-set" aria-hidden={k === 1}>
                  {row.map(({ p, tall, im }) => (
                    <Link key={p.slug} href={`/work/${p.slug}`} className={`work-card ${tall ? "is-tall" : "is-wide"}`} tabIndex={k ? -1 : 0}>
                      <Image src={im.src} alt={k ? "" : im.alt} width={tall ? 378 : 1200} height={tall ? 800 : 750} sizes={tall ? "(max-width: 768px) 44vw, 330px" : "(max-width: 768px) 78vw, 600px"} />
                      <span className="work-chip">
                        <span className="work-name">{p.name}</span>
                        <span className="work-tag">{p.industry.split(" · ")[0]}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="works-cta">
          <ButtonLink href="/work" variant="outline">
            View all projects
          </ButtonLink>
        </div>
      </section>

      {/* ---------- who, and the figures ---------- */}
      <section className="intro" data-reveal>
        <p className="intro-k">
          {site.name} is an independent software studio based in {site.serviceAreas[4]}, working with businesses in India, Hong Kong,
          Taiwan, the US and the UAE.
        </p>
        <p className="intro-big">
          Business owners trust one engineer to solve their online problems end to end: business websites and stores, web
          applications, learning platforms, CRMs, ERPs, dashboards and mobile apps, plus the performance, search and support
          that keep them working. Every project is scoped in writing, built personally, and handed over completely.
        </p>
        <dl className="stats">
          <div>
            <dd>
              <CountUp value={projects.length} />
            </dd>
            <dt>Projects live</dt>
          </div>
          <div>
            <dd>
              <CountUp value={services.length} />
            </dd>
            <dt>Services</dt>
          </div>
          <div>
            <dd>
              <CountUp value={TOOL_COUNT} />
            </dd>
            <dt>Free tools</dt>
          </div>
          <div>
            <dd>
              <CountUp value={1} />
            </dd>
            <dt>Engineer, start to finish</dt>
          </div>
        </dl>
      </section>

      {/* ---------- step into the work: fanned screens ---------- */}
      <section className="fan">
        <div className="fan-side fan-l" aria-hidden>
          {fanL.map((im, i) => (
            <Image key={im.src} src={im.src} alt="" width={640} height={400} sizes="22vw" className={`f${i}`} />
          ))}
        </div>
        <div className="fan-mid" data-reveal>
          <p className="annotation">Real screens, real products</p>
          <h2 className="fan-h">
            Step Into
            <br />
            The Work
          </h2>
          <p className="fan-sub">Explore the screens, systems and stories behind every project.</p>
          <ButtonLink href="/work" variant="outline">
            Start exploring
          </ButtonLink>
        </div>
        <div className="fan-side fan-r" aria-hidden>
          {fanR.map((im, i) => (
            <Image key={im.src} src={im.src} alt="" width={378} height={800} sizes="14vw" className={`f${i}`} />
          ))}
        </div>
      </section>

      {/* ---------- the services, stacked in colour (on the light band) ---------- */}
      <section className="ink band">
      {/* ---------- one engineer, every discipline ---------- */}
      <div className="disc" data-reveal>
        <div>
          <h2 className="disc-h">
            <em>One Engineer.</em>
            <br />
            Every Discipline.
          </h2>
          <ButtonLink href="/services" variant="outline">
            See all services
          </ButtonLink>
        </div>
        <div className="disc-p">
          <p>
            As an independent studio, {site.name} covers what an agency splits across a team: structure and content planning,
            interface design, engineering, performance, search visibility and support. One person holds the whole picture,
            so nothing is lost between a designer, a developer and an account manager.
          </p>
          <p>
            Every engagement runs the same way: a short discovery call, a fixed and itemised quote naming every screen and
            workflow, working software in weeks, and a complete handover — source code, documentation and infrastructure
            access — at launch. Projects start from <Price inr={site.priceFloor} usd={site.priceFloorUsd} />.
          </p>
        </div>
      </div>

        <article className="lead-card" style={{ background: colors[0] }} data-reveal>
          <span className="lead-minus" aria-hidden />
          <div className="lead-copy">
            <span className="lead-n">1</span>
            <h3 className="lead-t">{lead.name}</h3>
            <p>{lead.short}</p>
            <p>{lead.headline}</p>
            <ButtonLink href={`/services/${lead.slug}`} variant="outline">
              Learn more
            </ButtonLink>
          </div>
          <div className="lead-img">
            <Image src={projects[5].images.cover.src} alt={projects[5].images.cover.alt} width={1200} height={750} sizes="(max-width: 768px) 92vw, 40vw" />
          </div>
        </article>
        <ServiceStack items={rest} />
      </section>

      {/* ---------- fair questions, honest answers ---------- */}
      <section className="qa" data-reveal>
        <h2 className="qa-h">Fair questions, honest answers</h2>
        <QuoteCarousel items={homeFaq} badges={projects.slice(0, 3).map((p) => p.name)} />
      </section>

      {/* ---------- the names, drifting past ---------- */}
      <section className="names" data-reveal>
        <p className="annotation names-h">Projects delivered for</p>
        <div className="names-track" aria-hidden>
          {[0, 1].map((k) => (
            <span key={k} className="names-set">
              {projects.map((p) => (
                <span key={p.slug}>{p.name}</span>
              ))}
            </span>
          ))}
        </div>
      </section>

      {/* ---------- what you can expect ---------- */}
      <section className="expect">
        <h2 className="expect-h" data-reveal>
          What You Can
          <br />
          <em>Expect</em>
          <br />
          From Me
        </h2>
        <div className="expect-row" tabIndex={0} role="region" aria-label="What you can expect" data-reveal>
          {expect.map((e, i) => (
            <article key={e.t} className="expect-card">
              <Image src={projects[i + 1].images.cover.src} alt="" width={800} height={500} sizes="(max-width: 768px) 78vw, 26vw" />
              <p className="expect-t">{e.t}</p>
              <p className="expect-s">{e.s}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- the person, and the call ---------- */}
      <section className="who" data-reveal>
        <div className="who-card">
          <div className="who-photo">
            <Image src="/founder.jpg" alt={`${site.founder}, founder of ${site.name}`} width={800} height={800} sizes="(max-width: 768px) 70vw, 300px" />
            <h3>{site.founder}</h3>
            <p>Founder of {site.name} · Full-stack engineer</p>
          </div>
          <div className="who-copy">
            <h2>
              Your Website Might Look Fine.
              <br />
              <em>But Is It Working?</em>
            </h2>
            <p>Learn where your website is losing speed, search visibility or enquiries, and what should happen next.</p>
            <p className="who-book">
              Book a <em>Free Discovery Call</em> with {first}
            </p>
            <ButtonLink href="/contact" variant="outline">
              Contact me now
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
