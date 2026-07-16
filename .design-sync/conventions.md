# Kodinav — "The Draftsman's Studio"

An independent software studio's design language: **bone paper, ink, and exactly one accent — International Orange `#ff4400`**. Drafting-table cues (hairlines, registration crosshairs, `FIG.` labels, a rotating stamp) over a poster-grade type stack. Restraint is the whole point: one accent, one idea per section, no gradients-as-decoration.

## Setup — no provider needed

Components are plain React. There is **no** ThemeProvider, no context, no wrapper to remember: import and render. Two things matter instead.

**1. Tokens are CSS variables, and `.ink` remaps them.** `:root` defines the paper palette (`--background: #efeae0`, `--foreground: #16140f`, `--muted`, `--faint`, `--surface`, `--surface-raised`, `--border`, `--border-strong`, `--accent`, `--card-bg`). Putting `className="ink"` on any element **redefines those same variables to the dark palette for that subtree** and sets its background/color. That is how the site inverts a whole band without a single dark-mode conditional — and every component below adapts automatically. Use `.ink` for inverted sections; never hand-pick dark colors.

**2. Fonts.** `--font-anton` (display), `--font-instrument` (serif italic accents), `--font-space-mono` (annotations), `--font-archivo` (body). The stylesheet loads them; use the `font-display` / `font-serif` / `font-mono` utilities rather than naming families.

## The styling idiom — Tailwind v4 utilities over brand tokens

Style with these utilities. Do **not** invent color names or reach for raw hex; every one below resolves to a token that flips correctly inside `.ink`.

| Family | Real class names |
|---|---|
| Surface | `bg-background` `bg-surface` `bg-surface-raised` |
| Text | `text-foreground` `text-muted` `text-faint` `text-accent` |
| Accent | `bg-accent` `text-accent` `border-accent` |
| Lines | `border-line` `border-line-strong` |
| Type | `font-display` (Anton, uppercase posters) `font-serif` (Instrument Serif, italic pull-quotes) `font-mono` (Space Mono, labels) |

Studio classes that carry the aesthetic (all shipped in the stylesheet):

- `.ink` — invert a section (the token remap above)
- `.annotation` — the mono, uppercase, wide-tracked micro-label used everywhere
- `.crosshair` — small registration mark; pairs with `Eyebrow`
- `.u-draw` — underline that draws in on hover, for inline links
- `.text-gradient` — accent treatment for one emphasized word in a heading
- `.bg-noise` / `.bg-grid` — paper texture and drafting grid on hero/section backgrounds
- `.card-hover` / `.glass` — raised card affordances
- `.prose-justify` — justified body copy
- `.hatch` — 45° hatch fill for warning states (texture, not hue — status survives greyscale)
- `.reveal-line` / `.rise-soft` / `.animate-marquee` / `.animate-blink` — the CSS-driven entrances

Headings are Anton, uppercase, tight-leading, often `text-balance`. Body is Archivo at `leading-relaxed text-muted`. Labels are Space Mono uppercase with `tracking-[0.18em]`.

## Where the truth lives

Read `_ds/<folder>/styles.css` and its `@import` closure before styling — it is the compiled stylesheet with every token and utility above. Each component's `.prompt.md` carries its props and examples; the `.d.ts` is the API contract.

## One idiomatic build

```jsx
<section className="ink bg-noise border-t border-line-strong">
  <div className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
    <SectionHeading
      eyebrow="Fig. 02 — Services"
      title="One studio. The full stack."
      lead="From a five-page business website to a full ERP."
    />
    <Stagger className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-3">
      {items.map((s) => (
        <StaggerItem key={s.slug} className="bg-background">
          <div className="flex h-full flex-col gap-3 p-7">
            <span className="font-mono text-[0.625rem] text-faint">01</span>
            <h3 className="font-display text-2xl uppercase">{s.name}</h3>
            <p className="text-sm leading-relaxed text-muted">{s.short}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
    <ButtonLink href="/contact" size="lg">Book Discovery Call</ButtonLink>
  </div>
</section>
```

**Notes.** `Price` renders both currencies and CSS shows one based on `data-region` on `<html>` (`in` → ₹, anything else → $); it defaults to ₹. `BackToTop`, `StickyCta` and `WhatsAppFab` are `position: fixed` page furniture — render them once at page level, not inside layout flow.
