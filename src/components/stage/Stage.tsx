"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Price } from "@/components/Price";
import { getAttribution } from "@/lib/attribution";
import { trackLead } from "@/lib/fbq";
import { chapters, SCREENS, type StageContent } from "./content";
import { Film, filmAt } from "./film";
import { StageButton, StageSubmit } from "./StageButton";

/**
 * The homepage is one pinned viewport over a long scroll track. Scroll
 * position becomes a single smoothed number, 0 → 1, and that number drives
 * everything: the film behind the type, which "beats" of copy are on stage,
 * the travelling work column, the rail, the tone of the chrome.
 *
 * Every beat is ordinary server-rendered HTML — headings, paragraphs, links,
 * a form — so crawlers and screen readers get the whole page in order. Only
 * its presentation is choreographed. Tabbing into a beat that is off stage
 * scrolls the stage to it; with JavaScript off, the noscript rules in the
 * page un-pin everything into a plain readable column.
 */

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Splits copy into words that arrive one after another (see `.w`). */
function Words({ text, from = 0 }: { text: string; from?: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i}>
          <span className="w" style={{ "--i": from + i } as CSSProperties}>
            {word}
          </span>{" "}
        </span>
      ))}
    </>
  );
}
const count = (s: string) => s.split(" ").length;

/* Where each answer lands on a wide screen — scattered, not stacked. */
const QA_SPOTS = [
  { x: "44vw", y: "53%" },
  { x: "63vw", y: "58%" },
  { x: "24vw", y: "57%" },
  { x: "52vw", y: "50%" },
  { x: "35vw", y: "55%" },
];

export function Stage({ content }: { content: StageContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const pctRef = useRef<HTMLParagraphElement>(null);
  const railRef = useRef<HTMLElement>(null);

  const [active, setActive] = useState(0);
  const [workNear, setWorkNear] = useState(false);
  const [form, setForm] = useState<"idle" | "sending" | "done" | "error">("idle");

  const { hero, studioBeats, work, terms, questions, brief, signoff } = content;

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const canvas = canvasRef.current;
    if (!root || !pin || !canvas) return;
    const scope = root.closest<HTMLElement>(".stage-scope");

    const narrowMq = window.matchMedia("(max-width: 720px)");
    // The film re-frames earlier than the layout does: from a small laptop down
    // the instrument plays smaller, and on a portrait tablet it sits above the
    // type rather than behind it.
    const tallMq = window.matchMedia("(max-width: 1100px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let narrow = narrowMq.matches;

    let tall = tallMq.matches;
    let portrait = window.innerHeight > window.innerWidth;
    const film = new Film(canvas, window.innerWidth <= 900);
    if (film.ok) pin.classList.add("has-film");
    // No WebGL (or a driver that rejects the shader): step aside and let the
    // CSS sky behind the canvas carry the stage.
    else canvas.style.display = "none";

    type Beat = { el: HTMLElement; a: number; b: number; fi: number; fo: number; on: boolean | null; v: number; o: number };
    const beats: Beat[] = [...pin.querySelectorAll<HTMLElement>("[data-in]")].map((el) => ({
      el,
      a: Number(el.dataset.in),
      b: Number(el.dataset.out),
      fi: Number(el.dataset.fi ?? 0.012),
      fo: Number(el.dataset.fo ?? 0.007),
      on: null,
      v: -1,
      o: -1,
    }));
    const railLinks = [...(railRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])];

    let max = 1;
    let vh = window.innerHeight;
    let trackH = 0;
    let itemMids: number[] = [];
    const measure = () => {
      vh = pin.offsetHeight;
      max = Math.max(1, root.offsetHeight - vh);
      narrow = narrowMq.matches;
      tall = tallMq.matches;
      portrait = window.innerHeight > window.innerWidth;
      const track = trackRef.current;
      if (track) {
        trackH = track.offsetHeight;
        itemMids = [...track.children].map((li) => {
          const el = li as HTMLElement;
          return el.offsetTop + Math.min(el.offsetHeight, 260) / 2;
        });
      }
      film.resize();
    };

    let target = 0;
    let cur = 0;
    let last = performance.now();
    let tone = "";
    let chapter = -2;
    let activeItem = -1;
    let near = false;
    let raf = 0;
    let frames = 0;
    let slow = 0;
    let settled = 0;
    const t0 = performance.now();

    const apply = (p: number, time: number) => {
      // beats
      for (const bt of beats) {
        const inside = p >= bt.a - 0.0005 && p <= bt.b + bt.fo;
        const enter = clamp((p - bt.a) / bt.fi);
        const exit = clamp((bt.b + bt.fo - p) / bt.fo);
        const v = inside ? Math.round(easeOut(enter) * 1000) / 1000 : 0;
        const o = inside ? Math.round(Math.min(1, enter * 3) * exit * 1000) / 1000 : 0;
        if (v !== bt.v) {
          bt.el.style.setProperty("--v", String(v));
          bt.v = v;
        }
        if (o !== bt.o) {
          bt.el.style.setProperty("--o", String(o));
          bt.o = o;
        }
        const on = o > 0.5;
        if (on !== bt.on) {
          bt.el.classList.toggle("is-on", on);
          bt.on = on;
        }
      }

      // film + tone of the chrome
      const state = filmAt(p, narrow ? "narrow" : tall ? "tablet" : "wide", reduce ? 0 : time, portrait);
      film.render(state, reduce ? 0 : time);
      const nextTone = state.paper > 0.52 ? "light" : "dark";
      if (nextTone !== tone && scope) {
        scope.dataset.tone = nextTone;
        tone = nextTone;
      }

      // the work column travels through the frame
      const lp = clamp((p - work.range[0]) / (work.range[1] - work.range[0]));
      const wr = workRef.current;
      if (wr && trackH) {
        const colH = narrow ? vh - (84 + window.innerWidth * 0.52 + 34) : vh;
        const from = colH * 0.82;
        const to = -(trackH - colH * 0.5);
        const ty = from + (to - from) * lp;
        wr.style.setProperty("--ty", `${ty.toFixed(1)}px`);
        if (pctRef.current) pctRef.current.textContent = `${Math.round(lp * 100)}%`;
        const focusY = colH * 0.42;
        let best = 0;
        let bestD = Infinity;
        itemMids.forEach((mid, i) => {
          const d = Math.abs(ty + mid - focusY);
          if (d < bestD) {
            bestD = d;
            best = i;
          }
        });
        if (best !== activeItem) {
          activeItem = best;
          setActive(best);
        }
      }
      if (!near && p > work.range[0] - 0.09) {
        near = true;
        setWorkNear(true);
      }

      // rail
      let ch = -1;
      chapters.forEach((c, i) => {
        if (p >= c.at - 0.012) ch = i;
      });
      if (p > 0.806) ch = -1;
      if (ch !== chapter) {
        railLinks.forEach((a, i) => a.classList.toggle("is-active", i === ch));
        chapter = ch;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      target = clamp((window.scrollY - root.offsetTop) / max);
      if (reduce) cur = target;
      else {
        cur += (target - cur) * (1 - Math.exp(-dt * 7.5));
        if (Math.abs(target - cur) < 0.00004) cur = target;
      }
      // Quality governor: a GPU that cannot hold the film steps it down rather
      // than dropping frames (checked over the first few seconds only).
      frames++;
      if (frames > 20 && frames < 400) {
        slow = dt > 0.03 ? slow + 1 : Math.max(0, slow - 1);
        if (slow > 24) {
          film.degrade();
          slow = 0;
        }
      }
      // At rest only the clouds drift, so every other frame is plenty.
      settled = cur === target ? settled + 1 : 0;
      if (!document.hidden && (settled < 2 || settled % 2 === 0)) apply(cur, (now - t0) / 1000);
      raf = requestAnimationFrame(tick);
    };

    const goTo = (at: number) => {
      window.scrollTo({ top: root.offsetTop + at * max + 2, behavior: reduce ? "auto" : "smooth" });
    };
    const onGo = (e: Event) => goTo((e as CustomEvent<number>).detail);
    const onHash = () => {
      const c = chapters.find((x) => `#${x.id}` === window.location.hash);
      if (c) goTo(c.at + 0.01);
      else if (window.location.hash === "#brief") goTo(brief.range[0] + 0.02);
    };
    // Tabbing into a beat that is off stage brings the stage to it.
    const onFocus = (e: FocusEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-in]");
      if (!el) return;
      const bt = beats.find((x) => x.el === el);
      if (bt && bt.o < 0.5) goTo(bt.a + Math.min(bt.fi * 2, (bt.b - bt.a) / 2));
    };
    const onPointer = (e: PointerEvent) => {
      film.pointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(pin);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    window.addEventListener("stage:go", onGo);
    window.addEventListener("hashchange", onHash);
    pin.addEventListener("focusin", onFocus);
    if (!reduce) window.addEventListener("pointermove", onPointer, { passive: true });
    if (window.location.hash) window.setTimeout(onHash, 60);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("stage:go", onGo);
      window.removeEventListener("hashchange", onHash);
      pin.removeEventListener("focusin", onFocus);
      window.removeEventListener("pointermove", onPointer);
      film.destroy();
    };
  }, [work.range, brief.range]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (form === "sending") return;
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setForm("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "home-stage", attribution: getAttribution() }),
      });
      if (!res.ok) throw new Error(String(res.status));
      trackLead("home-stage");
      setForm("done");
    } catch {
      setForm("error");
    }
  }

  const go = (at: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("stage:go", { detail: at + 0.008 }));
  };

  const current = work.items[active] ?? work.items[0];

  return (
    <section ref={rootRef} className="stage" style={{ "--screens": SCREENS } as CSSProperties} aria-label="Kodinav">
      <div ref={pinRef} className="pin">
        <canvas ref={canvasRef} className="film" aria-hidden />

        <div className="frame" aria-hidden>
          <i className="vx1" />
          <i className="vx2" />
          <i className="hy1" />
          <i className="hy2" />
          <i className="mk mk1" />
          <i className="mk mk2" />
        </div>

        <nav ref={railRef} className="rail" aria-label="Chapters">
          {chapters.map((c) => (
            <a key={c.id} href={`#${c.id}`} onClick={go(c.at)}>
              <span>{c.label}</span>
            </a>
          ))}
        </nav>

        {/* ---------------- hero ---------------- */}
        <div className="beat b-hero" data-in={hero.range[0] - 0.01} data-out={hero.range[1]} data-fi="0.0001">
          <h1 className="t-display" style={{ "--n": count(hero.title) } as CSSProperties}>
            <Words text={hero.title} />
          </h1>
          <p className="sub t-serif">
            {hero.sub.map((l) => (
              <span key={l}>{l}</span>
            ))}
          </p>
          <div className="cta">
            <StageButton href={hero.cta.href}>{hero.cta.label}</StageButton>
          </div>
        </div>
        <div className="beat b-lower is-hero" data-in={hero.range[0] - 0.01} data-out={hero.range[1]} data-fi="0.0001">
          <span className="chip">{hero.chip}</span>
          <p className="t-body">{hero.body}</p>
        </div>

        {/* ---------------- 1 · the studio ---------------- */}
        {studioBeats.map((bt, i) => (
          <div key={bt.chip} id={i === 0 ? "studio" : undefined}>
            <div className="beat b-say" data-in={bt.range[0]} data-out={bt.range[1]} data-fi="0.011">
              <h2 className="t-display" style={{ "--n": count(bt.lines.join(" ")) } as CSSProperties}>
                {bt.lines.map((ln, k) => (
                  <span className="ln" key={ln}>
                    <Words text={ln} from={bt.lines.slice(0, k).join(" ").split(" ").filter(Boolean).length} />
                  </span>
                ))}
              </h2>
            </div>
            <div className="beat b-lower" data-in={bt.range[0] + 0.003} data-out={bt.range[1]} data-fi="0.011">
              <span className="chip rise">{bt.chip}</span>
              <p className="t-body" style={{ "--n": count(bt.body) } as CSSProperties}>
                <Words text={bt.body} />
              </p>
            </div>
          </div>
        ))}

        {/* ---------------- 2 · the work ---------------- */}
        <div
          ref={workRef}
          id="work"
          className="beat b-work"
          data-in={work.range[0]}
          data-out={work.range[1]}
          data-fi="0.014"
          data-fo="0.012"
        >
          <figure className="plate">
            <i className="mk" style={{ left: -6, top: -6 }} aria-hidden />
            <i className="mk" style={{ right: -6, bottom: 17 }} aria-hidden />
            <div className="plate-img">
              {workNear &&
                work.items.map((it, i) => (
                  <Image
                    key={it.slug}
                    src={it.cover.src}
                    alt={i === active ? it.cover.alt : ""}
                    fill
                    sizes="(max-width: 720px) 84vw, 46vw"
                    className={`object-cover object-top ${i === active ? "is-active" : ""}`}
                  />
                ))}
            </div>
            <figcaption className="plate-cap">
              <span>
                {String(active + 1).padStart(2, "0")} / {String(work.items.length).padStart(2, "0")}
              </span>
              <span>{current.title}</span>
            </figcaption>
          </figure>

          <div className="work-rule" aria-hidden />
          <div className="work-ticks" aria-hidden />
          <p ref={pctRef} className="work-pct" aria-hidden>
            0%
          </p>
          <div className="work-col">
            <ol ref={trackRef} className="work-track">
              {work.items.map((it) => (
                <li key={it.slug} className="work-item">
                  <span className="chip">{it.chip}</span>
                  <h2 className="t-serif">{it.title}</h2>
                  <p className="t-body">{it.body}</p>
                  <Link href={`/work/${it.slug}`} className="work-link">
                    Case file <span aria-hidden>→</span>
                  </Link>
                  {it.url && (
                    <a href={it.url} target="_blank" rel="noopener noreferrer" className="work-link">
                      Live site <span aria-hidden>↗</span>
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* ---------------- 3 · the terms ---------------- */}
        {terms.map((g, gi) => (
          <div
            key={g.label}
            id={gi === 0 ? "terms" : undefined}
            className={`beat b-terms ${g.side === "right" ? "is-right" : "is-left"}`}
            data-in={g.range[0]}
            data-out={g.range[1]}
            data-fi="0.014"
          >
            <h2 className="t-display" style={{ "--n": count(g.lines.join(" ")) } as CSSProperties}>
              {g.lines.map((ln, k) => (
                <span className="ln" key={ln}>
                  <Words text={ln} from={g.lines.slice(0, k).join(" ").split(" ").filter(Boolean).length} />
                </span>
              ))}
            </h2>
            <p className="lead t-serif rise">
              {g.lead}
              {g.price && (
                <>
                  {" "}
                  <Price inr={g.price.inr} usd={g.price.usd} />.
                </>
              )}
            </p>
            <div className="fine rise">
              <span className="label">{g.label}</span>
              <div>
                <p className="t-body">{g.body}</p>
                <div className="links">
                  {g.links.map((l) => (
                    <Link key={l.href} href={l.href} className="work-link">
                      {l.label} <span aria-hidden>→</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* ---------------- 4 · questions ---------------- */}
        <div
          id="questions"
          className="beat b-sign"
          data-in={questions.range[0]}
          data-out={questions.range[1]}
          data-fi="0.016"
          data-fo="0.012"
        >
          <p style={{ "--n": count(questions.sign) } as CSSProperties}>
            <Words text={questions.sign} />
          </p>
        </div>
        {questions.items.map((qa, i) => {
          const start = questions.range[0] + 0.024 + i * 0.0216;
          const last = i === questions.items.length - 1;
          return (
            <article
              key={qa.q}
              className="beat b-qa"
              style={{ "--x": QA_SPOTS[i % QA_SPOTS.length].x, "--y": QA_SPOTS[i % QA_SPOTS.length].y } as CSSProperties}
              data-in={start}
              data-out={last ? questions.range[1] : start + 0.0196}
              data-fi="0.008"
              data-fo="0.004"
            >
              <h3>{qa.q}</h3>
              <p className="t-body">{qa.a}</p>
            </article>
          );
        })}

        {/* ---------------- the brief ---------------- */}
        <div id="brief" className="beat b-brief" data-in={brief.range[0]} data-out={brief.range[1]} data-fi="0.014" data-fo="0.01">
          <div className="brief-intro">
            <span className="chip rise">{brief.chip}</span>
            <p className="t-serif" style={{ "--n": count(brief.intro) } as CSSProperties}>
              <Words text={brief.intro} />
            </p>
          </div>
          <form className="brief-form rise" onSubmit={onSubmit} aria-label="Start a project">
            <label>
              <span className="sr-only">{brief.fields.name}</span>
              <input name="name" required autoComplete="name" placeholder={brief.fields.name} disabled={form === "done"} />
            </label>
            <label>
              <span className="sr-only">{brief.fields.email}</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder={brief.fields.email}
                disabled={form === "done"}
              />
            </label>
            <label className="full">
              <span className="sr-only">{brief.fields.message}</span>
              <textarea name="message" required placeholder={brief.fields.message} disabled={form === "done"} />
            </label>
            <div className="brief-foot">
              <p className="brief-note" role="status" data-state={form}>
                {form === "done"
                  ? brief.done
                  : form === "error"
                    ? "That didn’t send. Email abhinav@kodinav.com instead."
                    : "No obligation · Reply within one business day"}
              </p>
              <StageSubmit disabled={form === "sending" || form === "done"}>
                {form === "sending" ? "Sending" : form === "done" ? "Sent" : brief.submit}
              </StageSubmit>
            </div>
          </form>
        </div>

        {/* ---------------- sign-off ---------------- */}
        <footer className="beat b-end" data-in={signoff.range[0]} data-out={signoff.range[1]} data-fi="0.02">
          <div className="end-panel">
            <p className="end-word" aria-hidden>
              Kodinav<i>.</i>
            </p>
            <p className="end-line t-serif" style={{ "--n": count(signoff.line.join(" ")) } as CSSProperties}>
              {signoff.line.map((ln, k) => (
                <span key={ln}>
                  <Words text={ln} from={signoff.line.slice(0, k).join(" ").split(" ").filter(Boolean).length} />
                </span>
              ))}
            </p>
            <nav className="end-index" aria-label="Site index">
              {signoff.index.map((l) => (
                <Link key={l.href} href={l.href} lang={"lang" in l ? l.lang : undefined} hrefLang={"lang" in l ? l.lang : undefined}>
                  {l.label}
                </Link>
              ))}
              <Link href="/privacy-policy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </nav>
            <div className="end-legal">
              <p>{signoff.legal}</p>
              <p>
                <a href={`mailto:${content.email}`}>{content.email}</a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
