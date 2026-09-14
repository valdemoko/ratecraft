# Phase 3 Report — Calculator Product

> Date: September 14, 2026. Scope: the 7 existing calculators only. No new tools, no URL
> changes, no metadata/canonical changes. All formulas verified by an independent test
> suite: **39/39 PASS** (`tests/math-verification.mjs`).

## Audit findings (before editing)

- `num()` used `parseFloat`, so "12abc" silently became 12 — validation and math disagreed.
- LiveRegion existed on only 2 of 7 calculators.
- No copy/print; no worked examples; no contextual next-step linking; result context was a
  single paragraph; errors existed for a few division-by-zero cases only, without
  explanations.
- The markup↔margin conversion table was the only "teaching" element; formulas were listed
  in symbols but never substituted with the user's own numbers.

## What every calculator got (shared system)

1. **LiveRegion** (`aria-live` result announcements) — all 7 calculators now.
2. **YourCalculation block** — the formula in symbols *plus the user's live numbers
   substituted and solved* (e.g. `$1,909.00 ÷ 0.65 = $2,936.92`).
3. **ResultActions** — Copy result (Clipboard API + `execCommand` fallback, polite live
   confirmation) and Print (print CSS outputs a clean worksheet: header with tool name,
   date, disclaimer; header/footer/actions hidden).
4. **Field validation** — non-numeric input marks the field (`aria-invalid`, red border)
   and shows an actionable `role="alert"` message ("Enter a valid number for …").
5. **Contextual zero/limit guards with explained messages** — hourly rate with 0 billable
   hours, labor burden with 0 billable hours, break-even with price ≤ cost, margin ≥ 100%.
6. **Worked example** — realistic trade scenario with inputs, step-by-step calculation
   table, result, interpretation, and a **prefill link**.
7. **"What the result means"** — explains what the number means for the business, not what
   it's called.
8. **Continue with…** — one contextual next tool per calculator (see linking section).

## Per-calculator improvements

| Calculator | Worked example | Continue with | Specific additions |
|---|---|---|---|
| Markup | Bathroom refresh ($1,650 → $2,062.50) | Margin Calculator | YourCalculation on the price formula; margin meaning tied to overhead share |
| Margin | Panel upgrade ($2,600/$1,950 → 25%) | Markup Calculator | Explicit "margin ≥ 100% is impossible" error; target-margin YourCalculation |
| Job Pricing | Exterior repaint ($1,909 → $2,936.92) | Margin Calculator (sanity-check the quote) | Multiply-vs-divide warning made concrete ($2,577 vs $2,937) |
| Labor Burden | HVAC installer ($25 → $36.94/hr) | Job Pricing (build a price with this rate) | Billable=0 guard with explanation; YourCalculation notes the billable-hours division |
| Hourly Rate | Solo handyman ($83,000 ÷ 1,152 = $72.05) | Labor Burden (if you have employees) | Billable=0 guard; "floor not target" interpretation kept |
| Overhead | Landscaping crew ($1,670 → $3.34/hr) | Break-Even (how many jobs cover it) | Cross-check line: burden + overhead = $40.28/hr floor |
| Break-Even | One-van plumbing (10 jobs) | Job Pricing (re-price to lower it) | Price≤cost guard with "no number of jobs ever breaks even"; $1,300 price → 9 jobs leverage note |

## Prefillable examples (`?example=key`)

- Only the canonical example key works; unknown keys are ignored (defaults load).
- Prefill values are **hardcoded in the registry** — no arbitrary state from the URL.
- **No SEO duplication**: the query string is not in any sitemap/hreflist, and the page's
  canonical tag stays the clean URL.
- Verified: `/calculators/job-pricing-calculator?example=exterior-paint` loads hours=16,
  materials=900; plain URL unchanged.

## Mathematical verification (mandatory step)

`tests/math-verification.mjs` — expected values derived by hand, NOT by calling app code:

- 39 assertions across all 7 calculators: defaults, each worked example, round-trips
  (price × (1−m) = cost), conversions (markup↔margin), cross-calculator chains (burden
  $36.94 + overhead $3.34 = $40.28 floor), and every zero/limit edge case (0 markup, 100%
  margin, PTO ≥ paid hours, utilization 0, price = cost, price < cost).
- **Result: 39 passed, 0 failed.**
- One real discrepancy found and fixed during this phase: `parseFloat` → `Number()` in
  `num()` so parsing matches validation ("12abc" is now invalid, not 12).

## UX improvements

- Result panel: headline → math chain → your-calculation → breakdown → actions →
  interpretation, in that order (2-second comprehension).
- Copy output is plain text, formatted for pasting into a quote email or notes.
- Print stylesheet produces a clean calculation worksheet with date + disclaimer.
- Errors explain cause and fix, never just "Invalid input".

## Accessibility improvements

- All 7 calculators announce results via `aria-live` (was 2/7).
- Field errors: `aria-invalid` + `role="alert"` + `aria-describedby` wiring.
- Copy confirmation announced politely; color never the sole signal (text + icon in button
  state).
- Keyboard: everything remains native inputs/buttons; no focus traps; focus-visible rings
  unchanged.

## SEO improvements

- Supporting content structure per page: What the result means → When to use → Common
  mistakes → FAQ → worked example (H2 per section, no padding).
- Internal links use descriptive anchors ("Check the margin on this price", not "Click
  here").
- URLs, titles, meta descriptions, canonicals: **unchanged** (verified canonical output).
- `dynamicParams = false` added (cleaner 404s for unknown calculator slugs).

## Internal linking

The chain now links contextually in both directions: Hourly Rate → Labor Burden → Job
Pricing → Margin; Overhead → Break-Even → Job Pricing; Markup ↔ Margin. Each link states
*why* the next step helps. Plus existing related-tools/guides cards.

## Performance impact

Bundle: calculator routes +~1.5 kB total (ResultActions, YourCalculation). First Load JS
shared unchanged at 103 kB. All 28 pages still static. Print = CSS only. Copy = Clipboard
API with no dependency.

## Files changed

`lib/format.ts` (num strictness + isInvalidInput) · `lib/site.ts` (workedExamples +
continueWith registries) · **new** `components/calculator/ResultActions.tsx`,
`YourCalculation.tsx` · `components/calculator/Field.tsx` (validation) · all 7 calculator
components · `app/calculators/[slug]/page.tsx` (example sections, continue-with, prefill,
print header, dynamicParams) · `styles/globals.css` (error state, actions, print CSS) ·
**new** `tests/math-verification.mjs` · this report.

## Remaining weaknesses

1. Copy text is per-calculator hardcoded strings — fine now, revisit if output formats
   diverge further.
2. `?example=` links are plain `<Link>`s (client nav recreates state correctly because
   `prefill` seeds `useState`); only the first mount picks up prefill — switching examples
   in-place would need a `key` reset. Acceptable: examples are entry points, not runtime
   switches.
3. Print CSS covers the calculation; a future "save as PDF" could use the browser's print
   dialog (no library needed).
4. Worked examples currently one per calculator; a second scenario per trade could come
   later with data.

## Recommended Phase 4

Per the master roadmap order: trades research first (Electrical/Plumbing/HVAC keyword +
SERP analysis), then the Flat Rate Pricing Calculator as the first trade-specific tool —
built on the shared calculator system this phase hardened.
