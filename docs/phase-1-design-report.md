# Phase 1 Design Report — RateCraft

> Date: September 14, 2026. Scope: visual identity, UX hierarchy, header/footer, calculator
> experience, homepage presentation, guides reading experience. No new tools, no new pages,
> no architecture changes; all calculator math unchanged (19/19 audit assertions PASS).

## What was visually wrong (from live inspection)

1. **Fonts never loaded** — the Phase-0 site rendered on system-ui fallback; Libre Franklin
   existed only as a CSS variable pointing to nothing.
2. Header nav wrapped into two ragged lines on mobile; no mobile menu at all.
3. Footer was a thin single-band strip; didn't read as a product's footer.
4. Calculator inputs were 5–10 stacked fields with no grouping; results were a plain list —
   no hierarchy between "the answer" and the breakdown.
5. Homepage presented 7 identical cards in a grid — no hierarchy, truncated one-line
   descriptions ("Work backwards"), no explanation of the system.
6. Guides rendered in sans at body size; no reading typography, no review-date presence.
7. Pages had weak section rhythm: everything either bare text or a card; no eyebrows,
   no bands, no dividers.

## What changed

### Foundations
- **Real fonts** via `next/font` (self-hosted, zero runtime requests): Libre Franklin (UI) +
  Source Serif 4 (guide prose), with CSS variables wired into all tokens.
- **Complete token system**: expanded palette (bg/alt/sunken surfaces, 3 text levels, 2
  border levels, accent + soft/border pair, success/warning/danger), type scale with display
  size, 9-step spacing, radii, two shadows.
- **Component classes** replacing ad-hoc inline styles: buttons (3 variants, press
  feedback), sticky header, worksheet tables (`td.num`, `.total-row`), result panel, math
  flow, callouts, badges, eyebrows, tool cards, hero band, footer grid.

### Header / nav
Sticky 60px header; ≥768px inline nav; <768px "Menu" `<details>` disclosure — pure HTML/CSS,
keyboard and screen-reader friendly, zero JavaScript.

### Footer
5-column product footer (Brand · Tools · Categories/Resources · Company · Legal) +
bottom bar with disclaimer line. Responsive 5→3→2 columns.

### Calculators (all 7)
- Inputs grouped under real headings (Job costs / Your business costs / Labor on this job /
  Non-billable time / etc.).
- **Result panel**: accent wash, uppercase label, huge tabular headline (e.g. **$2,063**).
- **"Show the math" chain** on every tool: Cost → Markup → Price → Profit → Margin with live
  values and highlighted final step (new `MathFlow` component).
- Job pricing + overhead got true worksheet tables (right-aligned tabular numbers, bold
  total row); overhead cost lines are inline-editable rows.
- Reset buttons with honest labels ("Reset to example values").
- Supporting content blocks: When to use it · Common mistakes (per-tool, specific — no
  filler) alongside formulas + FAQ, and related links as cards.

### Homepage
New hero (eyebrow + display headline "Know your costs. Price your work. Protect your
profit." + audience line + both CTAs) over a subtle paper-grid background. Tools presented
with hierarchy: **The essentials** (markup, job pricing, hourly rate) → **The system** band
showing the Labor→Burden→Overhead→Job cost→Markup→Margin→Price→Profit chain → **Every tool
in the chain** grid → categories → trust panel. No truncated copy.

### Guides
Serif reading experience (1.08rem/1.75 line height), ruled H2 section breaks, badge +
review-date meta, sans callouts, sans headers. Docs-like feel without leaving the UI shell.

## Files changed
`globals.css` (full rewrite), `layout.tsx` (fonts), `Header.tsx`, `Footer.tsx`, `Logo.tsx`,
**new** `icons.tsx`, `Field.tsx`, **new** `MathFlow.tsx`, `ResultRow.tsx`, all 7 calculator
components, `calculators/[slug]/page.tsx`, `page.tsx` (home), `guides/[slug]/page.tsx`,
`calculators/page.tsx`, `[category]/page.tsx`, 7 static pages (page-pad alignment),
`docs/design-system.md`.

## New components
`MathFlow` (show-the-math chain) · `icons.tsx` (9 original line icons) · CSS component
library (~30 classes) · `<details>`-based mobile nav pattern.

## Responsive
Verified at 375px (single column, menu button, stacked panels, math-flow wraps) · 768px
(two-column calculators) · 1024/1440px (full layout, 1140px content width). Footer collapses
5→3→2. No horizontal scroll at any width.

## Accessibility
Phase 0 gains preserved: skip link→`#main`, labeled inputs + `aria-describedby` hints,
`aria-live` results, `role="alert"` no-profit warning. Added: focus rings on all interactive
elements, `prefers-reduced-motion` support, math chain exposed as `role="img"` with text
summary, menu as native disclosure element.

## Performance
- First Load JS unchanged: **103 kB shared**; only calculator routes hydrate (+~9 kB).
- Fonts self-hosted via next/font with `display: swap`; no external requests.
- All 27 pages still fully static; zero new dependencies; icons are inline SVG (no icon
  font/library).

## SEO impact
Neutral-to-positive: same URLs, same canonicals/schema/sitemap; better heading hierarchy,
non-truncated descriptions, richer internal linking (related-links cards, chain CTAs). No
indexable page added or removed.

## Tests
- `typecheck` ✓ · `lint` ✓ · `build` ✓ (27/27 static).
- All 19 route checks HTTP 200 (home, hubs, 7 calculators, 2 guides, 5 legal, 2 categories,
  robots, sitemap).
- Math audit script: **19/19 PASS** (markup $2,062.50 / 20.0%; job pricing $2,936.92; burden
  $36.94/hr; break-even 10 jobs; etc.) — formulas byte-identical to Phase 0.
- Live DOM verification: result headline $2,063 ✓, math-flow steps ✓, guide serif = Source
  Serif 4 ✓, stylesheet served complete ✓.

## Build note
One transient issue during the phase: an accidental overwrite truncated `globals.css`, and
the running production server kept serving the stale build. Root-caused, stylesheet
rewritten in full, server restarted — final build serves the complete stylesheet (verified
in the compiled CSS and in-browser).

## Remaining weaknesses (for later phases)
1. LiveRegion only on markup/break-even calculators (Phase 3 rolls it out).
2. Copy/print/share of results still deferred (Phase 3).
3. Calculator supporting content is shared-quality; per-tool "example" walkthroughs can go
   deeper (Phase 3).
4. Guide count still low (2) — guides index looks sparse (Phase 5).
5. No OG image asset yet (Phase 2/11).
6. Mobile menu doesn't auto-close after navigation (harmless with full-page navigation;
   polish item).

## Recommendation for Phase 2
Build the full homepage per the master spec (problem explanation, how-it-works, examples,
about strip) using the components this phase created — the hero, chain band, tool cards and
trust panel are ready to be arranged into that longer narrative. Include an OG image and the
menu auto-close polish.
