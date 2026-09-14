# Phase 4 Implementation Report — Flat Rate Pricing Calculator

> Implementation of `docs/phase-4-flat-rate-spec.md`, exactly as authorized. No redesign,
> no new dependencies, no other calculators, Phase 3 system reused throughout.

## Files changed

| File | Change |
|---|---|
| `src/lib/site.ts` | New `Tool` entry (metadata, 8 formulas, 5 FAQs, related links incl. markup-vs-margin guide); canonical worked example (electrician/ceiling-fan); **new `moreExamples` registry** with the 4 remaining examples (plumber/HVAC/handyman/painter); continue-with entry (→ Margin Calculator) |
| `src/components/calculators/FlatRateCalculator.tsx` | **New.** 10 inputs in 4 groups, exact spec chain, min-charge suggestion, rounding, LiveRegion, YourCalculation, ResultActions (copy/print), validation |
| `src/app/calculators/[slug]/page.tsx` | Registered component; prefill now resolves extra examples; "More worked examples" loadable-card section |
| `src/app/page.tsx` | Toolkit: added to "Price a job" group (data-driven, no structural change) |
| `tests/math-verification.mjs` | New section 8: 42 flat-rate assertions |
| `docs/phase-4-flat-rate-spec.md` | Research + spec (Phase 4a, no code) |

## Formulas implemented (spec F-section, in order)

1. `laborCost = hours × burdenedRate`
2. `directCost = labor + trip + materials + other`
3. `overhead = directCost × overhead%`
4. `totalCost = directCost + overhead`
5. `rawPrice = totalCost ÷ (1 − margin%)` (division, never ×(1+markup)) — guarded 0 < margin < 100
6. `suggestedMin = roundUp((labor+trip) burdened+overhead ÷ (1 − margin%), roundTo)` — shown in the hint as an editable suggestion, never applied silently
7. `afterMin = max(rawPrice, minimum)` + visible warning when the minimum raises the price
8. `price = ceil(afterMin ÷ roundTo) × roundTo` (roundTo floored at 1)
9. `profit = price − totalCost` and `marginAchieved = profit ÷ price` — **always from the FINAL rounded price**
10. `markup = profit ÷ totalCost` (equivalence display) and `multiplier = price ÷ totalCost`
11. Guard message: "Pricing to a 50% margin requires a 100% markup on cost."

## Tests and results

- **Math suite: 91/91 PASS** (`node tests/math-verification.mjs`), including the new section 8 — 42 flat-rate assertions: all 5 spec examples (labor/direct/overhead/total/raw/price/profit/margin, hand-derived expected values, not app code), rounding boundaries (exact-hit, up at 5 and 25, roundTo 0 treated as 1), minimum charge below (no effect) and above (overrides, 398.08→500), suggested-minimum derivation, margin 0/100/negative guard predicates, hours = 0, all-zero inputs, markup/margin equivalence, effective multiplier, and profit/margin computed from the FINAL price.
- `typecheck` ✓ · `lint` ✓ · `build` ✓ 29/29 static pages.
- Route checks: `/calculators/flat-rate-calculator` 200, all 5 `?example=` variants 200, unknown `?example=bogus` safely falls back to defaults, `/sitemap.xml` contains `flat-rate-calculator`, `/robots.txt` 200, OG image 200.
- Live DOM (preview): defaults → **$400.00, profit $141.25, achieved margin 35.3%** (matches e1); water-heater prefill → **$2,250 / $686 / 30.5%**; setting minimum 500 live-updates to **$500 / 48.3%** with the visible "raised to your minimum" explanation; aria-live announces all three values; margin guard fires for 0 and ≥100.

## SEO

- Single indexable URL `/calculators/flat-rate-calculator`; canonical clean (example URLs are non-canonical parameters, values validated server-side from the registry — no arbitrary state).
- Title/meta/H1 per spec; H2 structure: How this calculator works (8 formulas) · What the result means · When to use it · Worked example (electrician) · More worked examples (4 trades) · Common mistakes · Minimum charge & trip costs covered in FAQ + input hints · Flat rate vs hourly (FAQ) · 5 FAQs (+ FAQPage schema) · WebApplication schema · Continue with… · Related tools & guides.
- No thin/duplicate pages: one tool, five verified examples inside one URL.

## UX

Groups exactly as specified: On-site work / Getting there / Parts & other / Your business. Result panel: Flat-rate price headline → math chain → YourCalculation with the user's numbers (`$258.75 ÷ 0.65 = $398.08 → $400.00`) → full breakdown → profit + achieved margin vs target → copy/print/reset. Trip cost presented as a real cost ("fuel, vehicle wear and unbillable drive time — a real cost, not a surcharge"). All examples labeled "Illustrative example — not market data"; prefill via the existing `?example=` system.

## Accessibility

Labeled inputs with unit affixes and `aria-describedby` hints; `role="alert"` validation with cause + fix (zero labor rate, margin 0/≥100); `aria-live` result announcements; visible warning (not color-only) when the minimum charge raises the price; keyboard-operable; focus states inherited from the Phase 3 system.

## Performance

No new dependencies. Calculator route client JS consistent with Phase 3 calculators (~2 kB tool code); shared First Load JS unchanged at ~103 kB; page is statically prerendered; all computation client-side.

## Known limitations

- Sales tax not included (documented in spec as out of scope).
- One helper-technician line, overtime and emergency premiums deferred (spec L).
- Minimum-charge suggestion assumes the same hours/rate for the smallest call — editable by design.

## Explicitly deferred (spec L)

Good/Better/Best options · technician flat-rate pay calculator · per-trade preset pages · price-book export · sales tax · overtime multipliers · emergency premiums.

## Recommended Phase 5

Per the master roadmap: high-quality guides (markup vs margin exists; add "How to price a job", "Labor burden", "Flat rate vs hourly") before any further calculators.
