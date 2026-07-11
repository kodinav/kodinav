# Kodinav — Independent Software Studio

Marketing site for Kodinav, built with Next.js 16 (App Router), Tailwind CSS v4 and Framer Motion. Every page statically prerendered.

## Design language — "The Draftsman's Studio"

Software presented like precision engineering drawings:

- **Palette**: bone paper `#efeae0`, ink `#16140f`, International Orange `#ff4400` (the only accent). Ink-inverted sections via the `.ink` class (remaps all tokens, so `text-muted` etc. adapt automatically).
- **Type**: Anton (poster display, all h1/h2 via global rule) · Instrument Serif italic (accent words — the `.text-gradient` class renders them lowercase italic orange) · Space Mono (annotations, labels, buttons) · Archivo (body).
- **Signatures**: drafting hairlines and 48px grid, crosshair registration marks, `FIG. 0X` annotations, file-numbered index rows, rotating studio stamp (`Stamp.tsx`), hard orange offset shadows on hover (`.card-hover`), orange marquee band, giant footer wordmark, blueprint-style project mockups (`ProjectVisual.tsx`).

## Commands

```bash
npm run dev     # local development (http://localhost:3000)
npm run build   # production build
npm run start   # serve the production build
npm run lint    # eslint
```

## Structure

```
src/
  data/          # ALL site content lives here — edit copy without touching components
    site.ts      # name, email, phone, WhatsApp, Calendly URL, price floor, nav
    services.ts  # 9 services → /services/[slug] pages
    projects.ts  # 4 case studies → /work/[slug] pages
    posts.ts     # blog articles → /blog/[slug] pages
    testimonials.ts
  components/    # shared UI (Hero, Navbar, forms, motion primitives, …)
  app/
    (site)/      # main site: home, about, work, services, process, pricing, blog, contact
    (landing)/   # Meta Ads landing pages (minimal chrome, no nav — one goal, one CTA)
      coaching-institute-websites/
      clinic-websites/
    api/lead/    # lead intake endpoint (forms POST here)
    sitemap.ts, robots.ts, manifest.ts, opengraph-image.tsx
```

## Real projects & images

The four case studies are **real projects** with **real screenshots** (no mockups):

| Project | What it is | Source captured |
|---|---|---|
| Lighthouse Classes | Urdu/English/Persian language-learning LMS | `Desktop/lighthouseclasses` (static export) |
| Achiever's Hive | CBSE Psychology EdTech platform | `Desktop/Achievers-Hive` (static export) |
| Triplipi | Editorial travel-discovery platform + CMS | `Desktop/aetheria` (Node app) |
| Trinket | D2C personalised-keepsake e-commerce | `Downloads/TRINKET ASSETS WEBSITE` |

Screenshots live in `public/projects/` (JPEG, ~4 MB total) and are declared per project in `src/data/projects.ts` (`images.cover / desktop[] / mobile[]`, each with alt text). Displayed via `<Image>` inside the drafting browser/phone frames in `ProjectVisual.tsx` (`ProjectShot` / `PhoneShot`). To refresh a screenshot, replace the file in `public/projects/` keeping the same name.

## Mobile / iPhone engineering

Desktop breakpoints are untouched; everything below is gated to small screens or touch devices:

- **Safe areas**: `viewport-fit=cover` + `env(safe-area-inset-*)` (`.pt-safe` / `.pb-safe`) on the fixed navbar, menu overlay, sticky CTA and footers — content clears the notch/Dynamic Island and home indicator.
- **Dynamic viewport**: hero uses `min-h-dvh`, menu overlay `h-dvh` — no jumping when iOS Safari's toolbar collapses.
- **No zoom-on-focus**: all form inputs are 16px on mobile (`text-base sm:text-sm`); selects are flattened (`appearance:none`) with a custom drafting-style chevron.
- **Touch feedback**: hover lifts are gated to `@media (hover:hover)`; touch devices get `:active` press states (scale/opacity) instead, and the grey iOS tap flash is disabled.
- **Thumb ergonomics**: hero/landing CTAs go full-width on mobile, ≥44px tap targets on the menu button and all buttons, sticky CTA sits above the home indicator.
- **Menu overlay**: full-height ink panel with giant type, `overscroll-contain`, body scroll locked, header colors flip correctly over ink.

## SEO

Per-page `title`/`description`/`keywords`/canonical + Open Graph. Structured data: `ProfessionalService` + `WebSite` (root), `CollectionPage` (work), `Service` + `FAQPage` (service pages), `Article` (case studies + blog). Sitemap, robots and a dynamic OG image are generated. Alt text on every project image.

## Admin panel — lead register

**`/admin`** — password-protected dashboard where every form submission lands. Stats (total / new / last-7-days / won), filter by status and source, per-lead detail with one-tap WhatsApp / Call / Email, status pipeline (new → contacted → qualified → won/lost), follow-up notes, delete, and CSV export.

**Environment variables:**

| Var | Required | Purpose |
|---|---|---|
| `ADMIN_PASSWORD` | **Yes (prod)** | Login password + session-signing secret. Without it, `/admin` refuses logins in production. |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | On serverless | Persistent lead storage. **Required on Vercel** — without it leads write to `data/leads.json`, which does not survive serverless deploys. Free tier at upstash.com is plenty. |
| `LEAD_WEBHOOK_URL` | Optional | Mirrors every lead to a webhook (Zapier/Make/Sheets) as backup/notification. |

Locally, no setup needed: leads go to `data/leads.json` (gitignored) and the dev password is `kodinav-dev-admin`. `/admin` is noindexed and disallowed in robots.txt.

## Before launch — checklist

1. ~~Phone/WhatsApp~~ **Done** (+91 81266 61493 site-wide). **Calendly URL** in `src/data/site.ts` is still a placeholder — replace when the account exists.
2. **Lead delivery** — leads now persist to the `/admin` panel. Set `ADMIN_PASSWORD` (+ Upstash vars on Vercel) per the Admin section above; `LEAD_WEBHOOK_URL` remains an optional mirror.
3. ~~Founder photo~~ **Done** — `public/founder.jpg` on the home founder band and About page.
4. **Case-study figures** — numbers in `src/data/projects.ts` are either capability statements or figures shown on the live products (e.g. Achiever's Hive "1.8L+ students"). Confirm before publishing.
5. **Real client testimonials** — none are shown (the home "Note from the studio" is Abhinav's own, honest voice). Add real, attributed client quotes when you have permission.
6. **Google Maps** — add the embed in `(site)/contact/page.tsx` once an office address is public.
7. **Analytics** — add analytics (Vercel Analytics / Plausible / GA4) plus the Meta Pixel on the two landing pages before running ads.

## Deployment

Built for Vercel (zero config) but works anywhere Node runs. All pages are static except `/api/lead` and the OG image.
