"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { Price } from "@/components/Price";
import { getAttribution } from "@/lib/attribution";
import { trackLead } from "@/lib/fbq";
import { chapters, eras, SCREENS, type StageContent } from "./content";
import { Film } from "./film";
import { StageButton, StageSubmit } from "./StageButton";

/**
 * The homepage is one pinned viewport over a long scroll track. Scroll
 * position becomes a single smoothed number, 0 → 1, and that number drives
 * everything: the film behind the type, which "beats" of copy are on stage,
 * the travelling work column, the rail, the tone of the chrome.
 *
 * The film tells one story — the evolution of a human being, in paintings —
 * and the copy captions it (see `film.ts`).
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

/* Where each answer lands on a wide screen — scattered, not stacked, and clear of the perch. */
const QA_SPOTS = [
  { x: "38vw", y: "53%" },
  { x: "50vw", y: "57%" },
  { x: "20vw", y: "57%" },
  { x: "44vw", y: "50%" },
  { x: "29vw", y: "55%" },
];

/** Deep time, to three significant figures. */
function yearsAgo(y: number) {
  if (y < 1) return "Today";
  if (y < 1000) return `${Math.round(y)} years ago`;
  const mag = Math.pow(10, Math.floor(Math.log10(y)) - 2);
  return `${(Math.round(y / mag) * mag).toLocaleString("en-US")} years ago`;
}
function eraAt(p: number) {
  let i = 0;
  eras.forEach((e, k) => {
    if (p >= e.at) i = k;
  });
  const e = eras[i];
  const next = eras[i + 1];
  if (e.years === null) return { label: e.label, value: e.note ?? "" };
  if (!next || next.years === null) return { label: e.label, value: yearsAgo(e.years) };
  const t = clamp((p - e.at) / (next.at - e.at));
  return { label: e.label, value: yearsAgo(e.years + (next.years - e.years) * t) };
}

/**
 * The lineage, drawn as a naturalist would: one root, a few clades, and every
 * service the studio offers as a tip. It inks itself in as the beat is scrolled.
 */
function Tree({ lineage }: { lineage: StageContent["lineage"] }) {
  const tips = lineage.clades.flatMap((c) => c.tips);
  const rows = tips.length;
  const y = (row: number) => (row + 0.5) * 10;
  const pct = (units: number) => `${(units / (rows * 10)) * 100}%`;
  const clades = lineage.clades.map((c, i) => {
    const first = lineage.clades.slice(0, i).reduce((n, x) => n + x.tips.length, 0);
    const last = first + c.tips.length - 1;
    return { ...c, first, last, mid: (y(first) + y(last)) / 2 };
  });
  const top = clades[0].mid;
  const bottom = clades[clades.length - 1].mid;
  return (
    <div className="beat b-tree" data-in={lineage.range[0] + 0.004} data-out={lineage.range[1]} data-fi="0.012" data-t>
      {/* Plain 1px rules, each growing from where it branches: crisper than SVG at any size. */}
      <div className="rules" aria-hidden>
        <i className="h" style={{ left: "1%", top: pct((top + bottom) / 2), width: "11%", "--d": 0 } as CSSProperties} />
        <i className="v" style={{ left: "12%", top: pct(top), height: pct(bottom - top), "--d": 0.5 } as CSSProperties} />
        {clades.map((c, i) => (
          <span key={c.label}>
            <i className="h" style={{ left: "12%", top: pct(c.mid), width: "15%", "--d": 1 + i * 0.15 } as CSSProperties} />
            <i
              className="v"
              style={{ left: "27%", top: pct(y(c.first)), height: pct(y(c.last) - y(c.first)), "--d": 1.5 + i * 0.15 } as CSSProperties}
            />
            {c.tips.map((t, k) => (
              <i
                key={t.slug}
                className="h"
                style={{ left: "27%", top: pct(y(c.first + k)), width: "14%", "--d": 2 + (c.first + k) * 0.09 } as CSSProperties}
              />
            ))}
          </span>
        ))}
      </div>
      {clades.map((c, i) => (
        <span key={c.label} className="clade" style={{ top: pct(c.mid), "--d": 1.2 + i * 0.15 } as CSSProperties}>
          {c.label}
        </span>
      ))}
      <ul>
        {tips.map((t, k) => (
          <li key={t.slug} style={{ top: pct(y(k)), "--d": 2.5 + k * 0.09 } as CSSProperties}>
            <Link href={`/services/${t.slug}`} prefetch={false}>
              {t.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Stage({ content }: { content: StageContent }) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const pctRef = useRef<HTMLParagraphElement>(null);
  const railRef = useRef<HTMLElement>(null);
  const eraLabelRef = useRef<HTMLSpanElement>(null);
  const eraValueRef = useRef<HTMLSpanElement>(null);
  const filmRef = useRef<Film | null>(null);

  const [active, setActive] = useState(0);
  const [workNear, setWorkNear] = useState(false);
  const [form, setForm] = useState<"idle" | "sending" | "done" | "error">("idle");

  const { hero, statements, notebook, work, lineage, questions, brief, signoff, plates } = content;

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const canvas = canvasRef.current;
    if (!root || !pin || !canvas) return;
    const scope = root.closest<HTMLElement>(".stage-scope");

    const narrowMq = window.matchMedia("(max-width: 720px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let narrow = narrowMq.matches;
    // In any upright frame the plates sit above the type and the paintings are seen in a tall slice.
    let portrait = window.innerHeight > window.innerWidth;
    const film = new Film(canvas, window.innerWidth <= 900);
    filmRef.current = film;
    if (film.ok) pin.classList.add("has-film");
    // No WebGL (or a driver that rejects the shader): step aside for the CSS backdrop.
    else canvas.style.display = "none";

    type Beat = { el: HTMLElement; a: number; b: number; fi: number; fo: number; on: boolean | null; v: number; o: number; t: number };
    const beats: Beat[] = [...pin.querySelectorAll<HTMLElement>("[data-in]")].map((el) => ({
      el,
      a: Number(el.dataset.in),
      b: Number(el.dataset.out),
      fi: Number(el.dataset.fi ?? 0.012),
      fo: Number(el.dataset.fo ?? 0.007),
      on: null,
      v: -1,
      o: -1,
      t: el.hasAttribute("data-t") ? -1 : -2, // −2: this beat does not track its own progress
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
    let eraText = "";
    let framing = "";
    let progress = "";
    let speed = 0; // how fast the scroll is moving, smoothed: the film leans into it
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
        if (bt.t > -2) {
          const t = inside ? Math.round(clamp((p - bt.a) / (bt.b - bt.a)) * 1000) / 1000 : 0;
          if (t !== bt.t) {
            bt.el.style.setProperty("--t", String(t));
            bt.t = t;
          }
        }
        const on = o > 0.5;
        if (on !== bt.on) {
          bt.el.classList.toggle("is-on", on);
          bt.on = on;
        }
      }

      // film + tone of the chrome
      const shot = film.frame(p, reduce ? 0 : time, narrow || portrait, reduce ? 0 : speed);
      // what is pinned to the picture (the labels on Huxley's last skeleton) follows the camera
      const fr = `${shot.ax.toFixed(4)},${shot.ay.toFixed(4)},${shot.au.toFixed(4)}`;
      if (fr !== framing) {
        pin.style.setProperty("--ox", shot.ax.toFixed(4));
        pin.style.setProperty("--oy", shot.ay.toFixed(4));
        pin.style.setProperty("--os", shot.au.toFixed(4));
        framing = fr;
      }
      const pr = p.toFixed(4);
      if (pr !== progress) {
        pin.style.setProperty("--p", pr);
        progress = pr;
      }
      // the clock in the top band
      const era = eraAt(p);
      const et = `${era.label}|${era.value}`;
      if (et !== eraText && eraLabelRef.current && eraValueRef.current) {
        eraLabelRef.current.textContent = era.label;
        eraValueRef.current.textContent = era.value;
        eraText = et;
      }
      const nextTone = shot.light ? "light" : "dark";
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
      if (p > questions.range[1] + 0.006) ch = -1;
      if (ch !== chapter) {
        railLinks.forEach((a, i) => a.classList.toggle("is-active", i === ch));
        chapter = ch;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      target = clamp((window.scrollY - root.offsetTop) / max);
      const before = cur;
      if (reduce) cur = target;
      else {
        cur += (target - cur) * (1 - Math.exp(-dt * 7.5));
        if (Math.abs(target - cur) < 0.00004) cur = target;
      }
      speed += (((cur - before) / Math.max(dt, 0.001)) * 9 - speed) * 0.18;
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
      else if (window.location.hash === "#studio") goTo(chapters[0].at + 0.01); // the old name of chapter one
    };
    // Tabbing into a beat that is off stage brings the stage to it.
    const onFocus = (e: FocusEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-in]");
      if (!el) return;
      const bt = beats.find((x) => x.el === el);
      if (bt && bt.o < 0.5) goTo(bt.a + Math.min(bt.fi * 2, (bt.b - bt.a) / 2));
    };
    const onPointer = (e: PointerEvent) => {
      if (e.pointerType === "mouse") film.pointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
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
      filmRef.current = null;
      film.destroy();
    };
  }, [work.range, brief.range, questions.range]);

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
      filmRef.current?.flare(); // the lamps in the cave flare
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

        <p className="era" aria-hidden>
          <span ref={eraLabelRef}>{eras[0].label}</span>
          <span ref={eraValueRef}>{yearsAgo(eras[0].years ?? 0)}</span>
        </p>

        <p className="cue" aria-hidden>
          <i />
          Scroll to evolve
        </p>
        <i className="progress" aria-hidden />

        {/* ---------------- hero ---------------- */}
        <div className="beat b-hero" data-in={hero.range[0] - 0.01} data-out={hero.range[1]} data-fi="0.0001">
          <h1 className="t-display" style={{ "--n": count(hero.title) } as CSSProperties}>
            {hero.lines.map((ln, k) => (
              <span className="ln" key={ln}>
                <Words text={ln} from={hero.lines.slice(0, k).join(" ").split(" ").filter(Boolean).length} />
              </span>
            ))}
          </h1>
          <p className="kicker t-display">{hero.kicker}</p>
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

        {/* ---------------- the statements: one caption per scene ---------------- */}
        {statements.map((bt) => (
          <div key={bt.key} id={bt.id}>
            <div className="beat b-say" data-in={bt.range[0]} data-out={bt.range[1]} data-fi="0.011" data-t>
              <h2 className="t-display" style={{ "--n": count(bt.lines.join(" ")) } as CSSProperties}>
                {bt.lines.map((ln, k) => (
                  <span className="ln" key={ln}>
                    <Words text={ln} from={bt.lines.slice(0, k).join(" ").split(" ").filter(Boolean).length} />
                  </span>
                ))}
              </h2>
            </div>
            <div className="beat b-lower" data-in={bt.range[0] + 0.003} data-out={bt.range[1]} data-fi="0.011" data-t>
              <span className="chip rise">{bt.chip}</span>
              <p className="t-body" style={{ "--n": count(bt.body) } as CSSProperties}>
                <Words text={bt.body} />
              </p>
            </div>
          </div>
        ))}

        {/* ---------------- the notebook: the specimen, every part named ---------------- */}
        <div className="beat b-specimen" data-in={notebook.range[0] + 0.002} data-out={notebook.range[1]} data-fi="0.012" aria-hidden>
          <div className="specimen">
            <svg viewBox="-2 -1.5 4 3" preserveAspectRatio="none">
              {notebook.parts.map((pt, i) => (
                <g key={pt.n} style={{ "--i": i } as CSSProperties}>
                  <line
                    x1={pt.ax}
                    y1={-pt.ay}
                    x2={pt.ax + (pt.lx - pt.ax) * 0.86}
                    y2={-(pt.ay + (pt.ly - pt.ay) * 0.86)}
                    pathLength={1}
                  />
                  <circle cx={pt.ax} cy={-pt.ay} r={0.014} />
                </g>
              ))}
            </svg>
            {notebook.parts.map((pt, i) => (
              <span key={pt.n} className="part" style={{ "--lx": pt.lx, "--ly": pt.ly, "--i": i } as CSSProperties}>
                <b>{pt.n}</b>
                {pt.label}
              </span>
            ))}
            <span className="fig">{notebook.fig}</span>
          </div>
        </div>
        <div id={notebook.id} className="beat b-terms is-right is-notebook" data-in={notebook.range[0]} data-out={notebook.range[1]} data-fi="0.014">
          <h2 className="t-display" style={{ "--n": count(notebook.lines.join(" ")) } as CSSProperties}>
            {notebook.lines.map((ln, k) => (
              <span className="ln" key={ln}>
                <Words text={ln} from={notebook.lines.slice(0, k).join(" ").split(" ").filter(Boolean).length} />
              </span>
            ))}
          </h2>
          <p className="lead t-serif rise">
            {notebook.lead} <Price inr={notebook.price.inr} usd={notebook.price.usd} />.
          </p>
          <div className="fine rise">
            <span className="label">{notebook.label}</span>
            <div>
              <p className="t-body">{notebook.body}</p>
              <div className="links">
                {notebook.links.map((l) => (
                  <Link key={l.href} href={l.href} className="work-link">
                    {l.label} <span aria-hidden>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- the cabinet: the real work, catalogued ---------------- */}
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
                Fig. {String(active + 1).padStart(2, "0")} / {String(work.items.length).padStart(2, "0")}
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

        {/* ---------------- the lineage: every service, as the tips of one tree ---------------- */}
        <div id="terms" className="beat b-terms is-left" data-in={lineage.range[0]} data-out={lineage.range[1]} data-fi="0.014">
          <h2 className="t-display" style={{ "--n": count(lineage.lines.join(" ")) } as CSSProperties}>
            {lineage.lines.map((ln, k) => (
              <span className="ln" key={ln}>
                <Words text={ln} from={lineage.lines.slice(0, k).join(" ").split(" ").filter(Boolean).length} />
              </span>
            ))}
          </h2>
          <p className="lead t-serif rise">{lineage.lead}</p>
          <div className="fine rise">
            <span className="label">{lineage.label}</span>
            <div>
              <p className="t-body">{lineage.body}</p>
              <div className="links">
                {lineage.links.map((l) => (
                  <Link key={l.href} href={l.href} className="work-link">
                    {l.label} <span aria-hidden>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Tree lineage={lineage} />

        {/* ---------------- questions, under the stars ---------------- */}
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
          const step = (questions.range[1] - questions.range[0] - 0.03) / questions.items.length;
          const start = questions.range[0] + 0.022 + i * step;
          const last = i === questions.items.length - 1;
          return (
            <article
              key={qa.q}
              className="beat b-qa"
              style={{ "--x": QA_SPOTS[i % QA_SPOTS.length].x, "--y": QA_SPOTS[i % QA_SPOTS.length].y } as CSSProperties}
              data-in={start}
              data-out={last ? questions.range[1] : start + step - 0.002}
              data-fi="0.008"
              data-fo="0.004"
            >
              <h3>{qa.q}</h3>
              <p className="t-body">{qa.a}</p>
            </article>
          );
        })}

        {/* ---------------- the egg: the brief ---------------- */}
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
            <p className="end-plates">
              <span>Plates</span> {plates.join(" · ")}
            </p>
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
