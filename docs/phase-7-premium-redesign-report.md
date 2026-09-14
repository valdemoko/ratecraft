# Phase 7 — Premium Redesign Report

> Full visual/UX redesign over the existing product. Constraints held: URLs, slugs,
> canonicals, metadata, schema, sitemap, math, formulas, examples, tests and static
> generation untouched. No new dependencies; all motion is CSS-only.

## 1. What changed

**Art direction: "Estimate ledger."** The Phase 1 "job-sheet precision" direction was
right but underdeveloped — it was warm paper with one blue. v2 completes it into a
three-voice identity:

- **Ink navy** (`#1d3a5f`) — brand surfaces: hero estimate header, math-step highlights,
  final CTA band, and the footer (now navy, the anchor of every page).
- **Brass** (`#a06a1c`) — editorial accent: eyebrows, group indices, why-item rules,
  methodology callout border. Reads as "numbered ledger", not decoration.
- **Warm paper** — background system deepened (`--color-bg-deep` added) so alternating
  sections band visibly instead of blurring into one scroll.

## 2. New components

| Component | Purpose |
|---|---|
| `HeroStream` | Ambient hero background: 10 fragments of the pricing chain (labor × rate → burden → overhead → price → profit) rising slowly like adding-machine tape. Static text + pure CSS keyframes; no JS, no canvas; disabled under `prefers-reduced-motion` |
| `eyebrow-rule` | Eyebrow with a 48px rule — editorial section marker |
| `group-head` / `group-index` | Numbered problem groups (01/02/03) on toolkit + calculator index |
| `estimate-price` row | The hero worksheet's "Recommended price" line inverts to navy — the quote is the loudest row |
| `hero-trust` | Three factual trust markers (formula shown / runs in browser / no signup) — lowercase claims the product can prove |
| `calc-shell` + `calc-eyebrow-row` + "N formulas shown" badge | Calculator page furniture: consistent 1080px column with provenance badge at top |
| `form.card > h2` restyle | Input-group headings as ledger small-caps |
| `btn-arrow` hover | CTA arrows nudge 3px on hover |
| Section bands (`.section-band(--deep)`) | Alternating paper/surface rhythm on long pages |

## 3. Homepage

- Hero rebuilt: radial navy wash + graph-paper substrate + ambient stream; headline kept
  ("Price your work with the numbers behind it."), sub rewritten to name the actual costs
  ("the costs most quotes guess at"), dual CTA, and the three trust markers.
- Worksheet upgraded: cent-precise values, navy price row, footer line that teaches
  ("A 25% markup carries a 20% margin — RateCraft shows both, always.").
- Problem section now two cards (cost vs decision) instead of bare columns.
- Chain band: the "Price" step is the navy highlight (was generic last-step highlight).
- Essentials/toolkit/why/methodology/guides restyled with the new tokens; final CTA band
  is now full navy with inverted button — a deliberate brand closer.

## 4. Calculators

- Page header: category eyebrow + "N formulas shown" badge (provenance, not marketing).
- All supporting sections aligned to the shared 1080px calc shell.
- "Continue with…" renamed "Next step" (utility language, not filler).
- Result panel: white surface + navy top rule; result figure in navy; highlighted math
  step inverts to navy with white value — the chain reads as input→output.
- Inputs: semibold tabular figures, softer error-state wash, unchanged validation logic.
- Verified live: defaults → $400.00 / $141.25 / 35.3% (identical to pre-redesign), margin
  50 live-edit recomputes to $520.00 instantly, group headings intact, continue-with and
  worked-example prefill working.

## 5. Guides

Lead paragraph promoted in size; serif body unchanged (it was already right). Cards and
meta strip inherit the new system. No structural content changes.

## 6. Tables

Ledger treatment: numeric cells now semibold right-aligned tabular figures; subtle hover
wash on rows; total rows keep their double rule. No borders-everywhere; no row shadows.

## 7. Typography

Libre Franklin + Source Serif 4 **kept — justified**: Franklin's grotesque skeleton gives
the workmanlike US tone (it's a Morgue-file-era American news sans), Source Serif 4 gives
editorial credibility, and both have excellent tabular figures. What changed is how
numbers are used: heavier weights, tabular-nums enforced on every data cell/step/result,
tighter letter-spacing on display sizes, balanced text wrapping on the display heading.
The typographic voice now comes from weight+numerals discipline rather than font novelty.

## 8. Color

Full token set per spec: bg/bg-deep/surface/surface-alt/sunken, 3 text levels, 2 border
levels, brand navy (+hover/soft), action blue (+hover/soft/border), brass (+soft),
success/warning/danger (+soft). Blue remains reserved for actions and links; navy for
brand surfaces; brass marks editorial structure. Zero gradients except one 8%-opacity
radial wash in the hero.

## 9. Animation

- Hero stream: 26–40s linear loops, opacity ≤0.14 — ambient, never attention-seeking.
- Section `reveal`: 480ms 10px rise on homepage cards only (skipped under reduced motion).
- Micro: button arrow nudge, nav underline grow, card lift (-2px + float shadow), input
  focus ring, result hover washes.
- `prefers-reduced-motion`: stream frozen (static 5% opacity), reveals/transitions off —
  verified the media queries cover `*` and the stream specifically.

## 10. Anti-AI-design measures

- Zero emojis (scanned `src/` programmatically + live DOM: none; arrows `→` are
  typographic, not emoji).
- No fake social proof, counters, testimonials, invented logos or statistics — trust
  markers state only verifiable facts ("every formula shown", "no signup").
- No blobs, glass (one functional 8px header blur), floating-card clusters, neon, or
  gradient decoration.
- Copy edits removed generic phrasing; CTAs say what they open ("Open a calculator",
  "Read how to price a job"), not what they empower.
- Original visual language: the pricing chain, worksheet, and numbered groups are
  RateCraft-specific, not template patterns.

## 11. Test results

- typecheck ✓ · lint ✓ (0 errors, 0 warnings) · build ✓ **34/34 static**
- Math tests: **105/105 PASS** (untouched, as required)
- Routes: 12/12 spot checks 200 (home, hubs, 2 calculators, guide, about, contact,
  categories, sitemap, robots)
- SEO: titles/canonicals/schema verified unchanged (Phase 6 crawler logic still applies;
  no DOM heading-level or metadata changes were made)
- Live DOM: calculator math byte-identical; prefill, validation, live announcements,
  continue-with all functional

## 12. Performance

First Load JS shared: **103 kB — unchanged** (redesign is CSS + one tiny server
component). The stream adds ~1 kB of server-rendered HTML. No new dependencies, no
client-side motion library, no images. Static generation unchanged at 34 pages.

## 13. Problems found during QA

- Hero stream fragments originally crossed the hero copy at mobile width → repositioned
  to left/right rails with staggered delays and max-width clamps; re-verified 0 overlaps.
- One lint warning (unused import in calculators index) → removed.

## 14. Deliberately NOT changed

- Fonts (justified above), URLs, slugs, canonicals, metadata, schema, formulas, examples,
  worked-example data, test suite, static architecture, ad-slot placements.
- Guide body copy: already passed editorial review in Phase 5; redesign is presentation.

## 15. Self-evaluation

| Area | Score |
|---|---|
| Brand | 8.5 |
| Visual design | 8.5 |
| UX | 8.5 |
| Calculator UX | 9 |
| Editorial design | 8 |
| Mobile | 8.5 |
| Accessibility | 8.5 (motion/a11y preserved; stream decorative & aria-hidden) |
| Performance | 9.5 (zero regression) |
| SEO preservation | 10 (nothing touched) |
| Trust | 9 (provenance badge, factual markers) |
| Originality | 8.5 (estimate-ledger language is ownable) |
