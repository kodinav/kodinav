# design-sync notes — kodinav

## What this repo is (read this first)

kodinav is a **Next.js marketing app**, not a component library: `private: true`, no
`dist`, no exports, no Storybook. The sync therefore runs the **package shape in
synth-entry mode** against a **scratch build package** assembled outside the repo.
Nothing in `src/` is modified by the sync.

Scope: **22 design-system components** out of 46 in `src/components`. The other 24 are
app features (tool UIs, 12 of which call `/api` routes) or site chrome (Navbar, Footer,
Hero, ToolShell, LandingPage, BlogList) and are excluded via `componentSrcMap` nulls.

## The scratch build package (rebuild this every sync)

`package-build.mjs` resolves the package from `<node-modules>/<pkg>`, and esbuild
resolves bare imports **from the importing file upward** — so the sources must sit
beside the shimmed `node_modules`, outside the repo. Recreate it before any build:

1. `PKG=<scratch>/dspkg` (must be OUTSIDE the repo — a self-symlink inside the repo
   makes ts-morph recurse until `ENAMETOOLONG`).
2. `rsync -a --exclude 'app/' <repo>/src/ $PKG/src/` — **exclude `src/app/`**: its
   routes import `next/og` (@vercel/og wasm) and `src/lib/audit.ts` pulls `node:fs`
   / `child_process`, all of which fail the esbuild bundle.
3. Keep **only the 15 DS files** in `$PKG/src/components` (`ui, motion, Stamp,
   Wordmark, Price, Faq, ProcessTimeline, TechStack, Breadcrumbs, ProjectCard,
   ProjectVisual, CtaSection, BackToTop, WhatsAppFab, StickyCta`). This is what
   scopes the bundle: `componentSrcMap` nulls filter the component *list*, **not the
   synth entry**, which exports one line per file in `srcDir`. Leaving the rest in
   pulls `qrcode`, `fflate` and `src/lib/fbq.ts` into the bundle — and fbq.ts is the
   source of `ReferenceError: process is not defined` in every preview
   (`process.env.NEXT_PUBLIC_META_PIXEL_ID`). Bundle drops 861 KB → 390 KB when trimmed.
4. Copy `tsconfig.json` (for the `@/*` → `./src/*` alias), `.design-sync/docs` →
   `$PKG/docs`, and the compiled CSS → `$PKG/kodinav.css`.
5. `node_modules`: symlink every real dep from `<repo>/node_modules` **except `next`**,
   then self-link `ln -sfn $PKG $PKG/node_modules/kodinav`.

## The `next/*` shims (why they exist, why they're safe)

`ui.tsx`, `CtaSection`, `Breadcrumbs`, `ProjectCard`, `StickyCta` and others import
`next/link`; `ProjectVisual` imports `next/image`. Outside a Next runtime these throw
(Link needs the app-router context). `$PKG/node_modules/next/` is a hand-written
package (`type: module`) with `link.js`, `image.js`, `navigation.js` that render the
same DOM (`<a>`, `<img>`) minus the framework wiring. This is a **build-time
substitution only** — the repo and the real site are untouched, and the rendered
output is identical, which is what the design agent needs.

## CSS + fonts

The whole visual language is **Tailwind v4 utilities + CSS custom properties**, so a
compiled stylesheet is mandatory or every preview renders unstyled. `cfg.buildCmd`
compiles `.design-sync/.cache/ds-entry.css` (which imports `src/app/globals.css`, adds
`@source` for `src` + `previews`, and defines the `--font-*` vars) to
`.design-sync/.cache/kodinav.css` (~104 KB). Fonts come from a Google Fonts `@import`
because `next/font/google` doesn't exist outside Next — hence the standing
`[FONT_REMOTE]` line, which is expected, not a defect.

## Known render warns (expected — a warn NOT listed here is new)

- `[FONT_REMOTE] "Archivo", "Space Mono", "Anton", "Instrument Serif"` — by design (above).
- `tokens: 3 missing, below threshold` — non-blocking.
- `[NO_DIST] no built entry — synthesizing from 15 src files` — by design; there is no dist.
- `2 showing the typographic floor card` — BackToTop + StickyCta, deliberate (below).

## Deliberate floor cards

**BackToTop** and **StickyCta** ship functional (bundle + `.d.ts` + `.prompt.md`) with
the floor card. Both are `position: fixed` **and scroll-gated** (`window.scrollY > 1600`
and `> 900` respectively), so no static screenshot is truthful. Three approaches were
tried and all render the wrapper but not the component: an inner scroller, a real
`window.scrollTo` + dispatched `scroll` event, and `Object.defineProperty(window,
'scrollY')` at module scope. Shipping the honest floor card beat shipping a card where
the component looks invisible. **Don't re-attempt without a new idea** — and if you do,
the trick that DOES contain a `fixed` element inside a card is a `transform:
translateZ(0)` ancestor (that's what makes `WhatsAppFab` work).

## Other gotchas

- `dtsPropsFor` is **required** for all 22: synth-entry mode has no `.d.ts` to read, so
  every extracted props body came out as `[key: string]: unknown`. The bodies are
  hand-written from source — **re-check them whenever a component's props change**.
- `guidelinesGlob` must stay `guides/**/*.md` (a path that doesn't exist). The default
  (`docs/*.md`) swallows the per-component stub docs in `.design-sync/docs/` and
  duplicates all 22 `.prompt.md` files into `guidelines/`.
- Grouping comes from the `category:` frontmatter in `.design-sync/docs/<Name>.md`, bound
  via `cfg.docsDir=docs`. Adding a component means adding its stub doc.
- Render check: no playwright browser is installed. `npm i playwright` with
  `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` and set
  `DS_CHROMIUM_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"` —
  drives the system Chrome and skips the ~200 MB download.

## Re-sync risks (what can silently go stale)

- **The scratch package is a COPY of `src/`.** Every re-sync must re-run the rsync +
  trim, or it syncs yesterday's components. This is the single biggest staleness risk.
- **`dtsPropsFor` is hand-maintained** and will drift the moment a component's props
  change — nothing in the pipeline catches this, and a wrong `.d.ts` misleads the
  design agent on every build.
- **The 15-file allowlist in `$PKG/src/components` is hand-maintained.** A new DS
  component won't appear until it's added there AND given a stub doc; a kept file that
  starts importing an excluded module (especially anything touching `@/lib/fbq` or a
  node built-in) will break the bundle.
- **`ProjectShot`/`PhoneShot`/`ProjectCard` previews use inline SVG stand-ins**, not the
  real `public/projects/*.jpg` (those aren't reachable from the bundle). If real
  screenshots ever matter, they'd need to ship as bundle assets.
- **Fonts load from Google at runtime.** If the design app blocks remote fonts, all four
  families silently fall back and every card renders in the wrong type.
- Tailwind CLI is invoked as `@tailwindcss/cli@4` via npx (network); the repo pins
  `tailwindcss` v4 but not the CLI.
