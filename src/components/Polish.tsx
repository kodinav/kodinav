"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * The finish: the small, continuous motion that makes a page feel made.
 * Renders nothing; attaches to the document once JavaScript is running and
 * only ever adds motion, so the server HTML is untouched.
 *
 *   · a cursor of its own — a dot and a ring that grows over links and turns
 *     into "View" over the work — and a magnetic pull on every pill button
 *     (fine pointers only)
 *   · headings on every page revealed word by word as they scroll in; cards,
 *     covers and figures rising in with a soft clip
 *   · a slight tilt on cards and covers that follows the pointer
 *   · the drifting work rows skew with scroll speed; a reading-progress line
 *   · a fade between pages
 *
 * Nothing runs under prefers-reduced-motion beyond the reveals settling.
 */
const MAGNETS = "a.rounded-full, button.rounded-full, .bar-cta, .bar-more, .bar-wa, .dock-round, .quotes-nav button, .foot-round";
const TILTS = ".cover, .glass, .expect-card, .work-card, .who-card, .lead-card, .card-hover";
const VIEW = ".work-card, .cover, .worklist a, .expect-card";

export function Polish() {
  const pathname = usePathname();

  // headings split into words; cards and figures marked for the reveal
  useEffect(() => {
    const root = document.getElementById("main-content") ?? document.querySelector("main");
    if (!root) return;
    const heads = [...root.querySelectorAll<HTMLElement>("h1, h2")].filter((h) => !h.closest(".hero") && !h.dataset.split);
    for (const h of heads) {
      h.dataset.split = "1";
      let i = 0;
      const walk = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent ?? "";
          if (!text.trim()) return;
          const frag = document.createDocumentFragment();
          const parts = text.split(/(\s+)/);
          for (const part of parts) {
            if (!part) continue;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(" "));
              continue;
            }
            const w = document.createElement("span");
            w.className = "sw";
            w.style.setProperty("--i", String(i++));
            const inner = document.createElement("span");
            inner.textContent = part;
            w.appendChild(inner);
            frag.appendChild(w);
          }
          node.parentNode?.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE && !(node as HTMLElement).classList.contains("sw")) {
          [...node.childNodes].forEach(walk);
        }
      };
      [...h.childNodes].forEach(walk);
      if (!h.hasAttribute("data-reveal")) h.setAttribute("data-reveal", "");
    }
    for (const el of root.querySelectorAll<HTMLElement>("figure, .glass, .cover, .card-hover, article.cover-card, .worklist li")) {
      if (el.closest(".works-set, .expect-row, [data-reveal]") || el.hasAttribute("data-reveal")) continue;
      el.setAttribute("data-reveal", "");
    }
    // the reveal observer runs once at mount; take over for what was added here
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).classList.add("in");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    for (const el of root.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)")) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add("in");
      else io.observe(el);
    }
    return () => io.disconnect();
  }, [pathname]);

  // a fade between pages
  useEffect(() => {
    const main = document.getElementById("main-content") ?? document.querySelector("main");
    if (!main || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    main.animate([{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }], { duration: 650, easing: "cubic-bezier(.22,1,.36,1)" });
  }, [pathname]);

  // pointer-driven finish, once
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const doc = document.documentElement;
    let raf = 0;

    // scroll: velocity for the skew, progress for the line
    let lastY = window.scrollY, lastT = performance.now(), vel = 0;
    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY, dt = Math.max(1, now - lastT);
      vel = Math.max(-1, Math.min(1, (dy / dt) * 0.35));
      lastY = window.scrollY;
      lastT = now;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      doc.style.setProperty("--prog", (window.scrollY / max).toFixed(4));
      if (!reduce) doc.style.setProperty("--vel", vel.toFixed(3));
    };
    const settle = () => {
      vel *= 0.85;
      if (!reduce) doc.style.setProperty("--vel", Math.abs(vel) < 0.005 ? "0" : vel.toFixed(3));
      raf = requestAnimationFrame(settle);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    raf = requestAnimationFrame(settle);

    if (!fine || reduce) return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };

    // the cursor
    doc.classList.add("has-cursor");
    const dot = document.createElement("div");
    dot.className = "cur-dot";
    dot.setAttribute("aria-hidden", "true");
    const ring = document.createElement("div");
    ring.className = "cur-ring";
    ring.setAttribute("aria-hidden", "true");
    ring.innerHTML = "<span>View</span>";
    document.body.append(dot, ring);
    let px = -100, py = -100, rx = -100, ry = -100, seen = false;
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;
    const frame = () => {
      rx += (px - rx) * 0.18;
      ry += (py - ry) * 0.18;
      dot.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!seen) {
        seen = true;
        doc.classList.add("cur-on");
      }
      const t = e.target as HTMLElement | null;
      const link = t?.closest("a, button, [role=button], label, input, select, textarea");
      ring.classList.toggle("is-link", !!link);
      ring.classList.toggle("is-view", !!t?.closest(VIEW));
      // magnetic pull
      const m = t?.closest<HTMLElement>(MAGNETS) ?? null;
      if (magnet && magnet !== m) {
        magnet.style.transform = "";
        magnet.classList.remove("is-magnet");
      }
      magnet = m;
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        m.classList.add("is-magnet");
        m.style.transform = `translate(${(dx * 0.22).toFixed(1)}px, ${(dy * 0.22).toFixed(1)}px)`;
      }
      // tilt
      const c = t?.closest<HTMLElement>(TILTS) ?? null;
      if (tilt && tilt !== c) {
        tilt.style.transform = "";
        tilt.classList.remove("is-tilt");
      }
      tilt = c;
      if (c) {
        const r = c.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5, ny = (e.clientY - r.top) / r.height - 0.5;
        c.classList.add("is-tilt");
        c.style.transform = `perspective(900px) rotateX(${(-ny * 6).toFixed(2)}deg) rotateY(${(nx * 7).toFixed(2)}deg) translateZ(4px)`;
      }
    };
    const onLeave = () => doc.classList.remove("cur-on");
    const onEnter = () => doc.classList.add("cur-on");
    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      dot.remove();
      ring.remove();
      doc.classList.remove("has-cursor", "cur-on");
    };
  }, []);

  return null;
}
