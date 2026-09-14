# Phase 2 Report — Homepage, Navigation & First Impression

> Date: September 14, 2026. Scope: full product homepage, header/navigation upgrades,
> OG image. No new tools, no new content pages, no category changes, math untouched.

## What the old homepage got wrong (inspected before coding)

1. The hero promised "Know your costs…" but the page never *showed* numbers — no visual
   proof of the product.
2. Seven equal cards = no hierarchy; a first-time visitor couldn't tell where to start.
3. Nothing explained the *problem* (a job costs more than materials; a price has to decide
   more than markup) — the "why" was missing entirely.
4. The differentiation/trust content existed but read like a feature list, not an argument.
5. No guides surfaced, no worked example, no final CTA — the page just… stopped.

## New homepage structure (top → bottom)

1. **Hero** — eyebrow "Contractor pricing tools", H1 "Price your work with the numbers
   behind it.", supporting line naming labor/burden/materials/overhead/markup/margin, CTAs
   **Explore Calculators** (primary) and **How the pricing works** (→ #chain anchor).
   Right side: **estimate worksheet visual** (ESTIMATE — JOB #1042: materials $1,000, labor
   $500, overhead $150, total $1,650, +25% markup, **price $2,062.50**, profit $412.50,
   margin 20%) — the product itself as the hero image, no stock photography.
2. **The problem** — "Pricing a job is more than adding up materials": two columns (what a
   job really costs / what the price has to decide) + the busy-but-broke warning.
3. **The chain** — the 8-step Labor→…→Profit visual (from Phase 1, now with anchor target).
4. **Worked example** — same worksheet repeated as a teaching artifact, with inline links to
   Job Pricing, Markup and Margin calculators. Numbers mathematically correct and consistent
   with the calculators' defaults.
5. **Start with the essentials** — 3 tools with real sentences about *who* each is for and
   *what you get* (no "Calculate your markup" filler).
6. **The RateCraft toolkit** — grouped by problem: Price a job / Understand your costs /
   Understand your business. Grows by adding a group entry — no code changes.
7. **Built for service businesses** — trade badges (GCs, electricians, plumbers, HVAC,
   roofers, painters, landscapers, handymen) with honest copy: core math applies today,
   trade-specific tools coming over time. No empty-category claims.
8. **What makes it different** — Show the math / Understand the full cost / Price for
   profit / Free and practical. All four are true of the product today.
9. **How we calculate** — methodology card linking to /about; states plainly that results
   are planning estimates and nothing leaves the browser.
10. **Learn** — existing guides surfaced with type + read-time badges, and an honest line
    that more are coming (no fake library).
11. **Final CTA** — "Stop guessing what a job should cost." → Explore the calculators.

## Navigation

- Desktop: Calculators · Guides · Pricing & Profit · Labor & Overhead · About + a compact
  primary CTA button in the nav.
- Mobile: `MobileMenu` extracted into a small client island — the menu now **closes itself
  on link tap** (Fase 1 weakness fixed). Only JS on static pages (~1 kB for the island).

## SEO

- Homepage title/description rewritten to match the actual page (contractor pricing tools;
  markup/margin/job pricing/labor burden/overhead/break-even) — no stuffing.
- Single H1; section H2s follow search language (markup, margin, job pricing, costs).
- Canonical to site root; OG/Twitter metadata at layout level; schema unchanged (correct).
- Internal links added: 3 calculators inside the worked example, methodology → /about,
  guides hub + guide cards, final CTA → /calculators.

## OG image

`src/app/opengraph-image.tsx` — build-time-rendered 1200×630 PNG via `next/og`, drawn from
the brand system (paper bg, blue logo mark, headline, and a mini estimate worksheet ending
in "$2,063 · Margin 20.0%"). Served at `/opengraph-image`, verified: HTTP 200, actual PNG
1200×630. Wired into layout OpenGraph + Twitter card.

## Mobile

Composed for mobile, not compressed: hero stacks copy-above-worksheet; worksheet rows stay
scannable at 375px; chips wrap; all sections single-column. Verified in preview at 375px
across the full page.

## Accessibility

Single H1, logical H2/H3 order, CTAs are real links with text, worksheet visuals marked
`aria-hidden` (decorative duplicate) or `aria-label` (worked example), color contrast
unchanged (AA), keyboard operable header and menu.

## Performance

Homepage remains a **server component with zero client JS** except the tiny MobileMenu
island. First Load JS shared: **103 kB (unchanged)**. OG image renders once at build. No
videos, sliders, or libraries added. Build: 28/28 static pages.

## Files changed

`src/app/page.tsx` (full rewrite) · `src/components/Header.tsx` · **new**
`src/components/MobileMenu.tsx` · **new** `src/app/opengraph-image.tsx` ·
`src/app/layout.tsx` (OG/Twitter) · `src/styles/globals.css` (hero grid, estimate card,
why-items, chips, final CTA, nav CTA) · `docs/design-system.md` · this file.

## Tests

- `typecheck` ✓ · `lint` ✓ · `build` ✓ (28/28 static).
- Routes: 9/9 spot checks HTTP 200 incl. `/opengraph-image`.
- OG image verified as real PNG 1200×630.
- Math audit: **19/19 PASS** — no calculator touched.
- Live preview: hero, problem, chain, worked example, toolkit groups, why-items,
  methodology all render; mobile menu opens (6 links) and closes on navigation.

## Build

Clean. One build error during the phase (an `onClick` handler in a server component) was
fixed properly by extracting the `MobileMenu` client island — the correct Next.js pattern.

## Remaining weaknesses

1. Guides section shows 2 items — will look thin until Phase 5 adds content.
2. Trade badges are informational only (no trade pages yet) — by design, per no-empty-
   categories rule.
3. `next/og` fonts fall back to system sans in the OG image (Libre Franklin in ImageResponse
   requires font data fetching — polish item).
4. Worked example numbers are static; a future "numbers update live" variant could deep-link
   pre-filled calculators (Phase 3 idea).

## Recommended Phase 3

Deepen the calculators (per the master roadmap): LiveRegion on all 7, copy/print results,
worked-example tabs per tool, richer per-tool supporting content — the highest-leverage
product work before scaling content.
