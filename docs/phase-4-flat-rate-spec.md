# Phase 4 Spec — Flat Rate Pricing Calculator (research + product spec, NO code)

> Research date: September 2026. Market audit from live SERPs; competitor tools inspected;
> formulas derived from standard accounting definitions (consistent with the 7 existing
> calculators). **No code written or modified in this phase.**

---

## A. MARKET OPPORTUNITY

**The hole:** flat-rate pricing is how residential service trades increasingly sell — the
customer gets a price before work starts, and the contractor protects margin and closes
more jobs. But the tools serving it split into two camps:

1. **Software vendors** (ServiceTitan, Housecall Pro, FieldEdge, flatratesoftware.com…):
   their "calculators" are funnels into paid price-book software. The free tools are thin
   (2–4 inputs) and never show the math.
2. **Blog formulas** (wexfsm, fieldedge, subcontractorhub, leadduo): articles repeat a
   formula like `(hourly rate × hours) + (parts + parts × markup)` but: they conflate
   markup with margin, ignore overhead as a separate recoverable line, ignore labor burden
   (most say "your hourly rate" without defining it), and never explain how the pieces
   (burden, overhead, trip cost) should be built in the first place.

**Evidence of demand:** PAA across SERPs: "How to calculate flat rate pricing?", "How much
should I charge for a service call?", "What is flat rate pricing in HVAC?"; dedicated tool
pages from leadduo and callmonkey rank with minimal depth; long-tail related searches
("flat rate pay calculator", "trip charge", "minimum service call fee").

**Why us, now:** Phase 3 built exactly the pieces the blog formulas skip — burdened labor
rate, overhead per billable hour, margin-correct pricing. RateCraft can be the first free
tool that builds a flat-rate price from *true* costs with every step visible.

## B. COMPETITION

| Type | Examples | Weaknesses we exploit |
|---|---|---|
| FSM software free tools | callmonkey, leadduo, flatratesoftware | Lead-gen; 3–4 inputs; no formulas; generic ("overhead %", no burden); no explanation of results |
| Vendor blog formulas | wexfsm, fieldedge, subcontractorhub | Markup/margin confusion; "loaded labor rate" never defined; overhead merged into multipliers; no interactivity |
| Price-book software | flatratesoftware, ServiceTitan | Paid, per-tech pricing; overkill for a solo operator who wants one number |
| Reddit/forums (mikeholt, plumbingzone, electriciantalk) | Threads on trip charges, 1-hr minimums | Real questions, no systematic answers — content signal for FAQs |

**Differentiation (continues Phase 3 identity):** show the math with the user's own
numbers; use burdened labor (link to Labor Burden Calculator); recover overhead explicitly;
price to a *margin* by division; show profit in dollars and what happens if the price
changes.

## C. SEARCH INTENT (prioritized)

| Query | Intent | Our play |
|---|---|---|
| flat rate pricing calculator | **Tool** | The calculator page (primary) |
| hvac / plumbing / electrical flat rate pricing formula | Informational leaning tool | Calculator's "How it works" + worked examples cover it; no separate article yet |
| how much to charge for a service call / service call fee | Informational | FAQ + trip-cost section on the calculator page |
| minimum service charge / trip charge | Informational | Minimum-charge input + explanation |
| flat rate vs hourly | Informational/commercial | FAQ comparison; possible Phase 5 guide |
| flat rate pricing book / software | Commercial/software | **Do not chase** — we're not software |
| markup vs margin (exists) | Informational | Already covered by existing guide |

Rejected: "flat rate pay calculator" (that's *technician pay* on commission/flat-rate —
different product), price-book creation, per-trade pricing guides (Phase 5+, only with
real content).

## D. PRODUCT SPEC — how it should work

Concept: the contractor describes the service job once; the tool builds the price from
true costs, in this exact order:

```
true labor cost  →  + trip cost  →  + materials cost (at cost)
→  = direct cost  →  + overhead allowance
→  = total cost  →  ÷ (1 − target margin)  →  flat-rate price
→  − total cost = profit  →  profit ÷ price = margin
→  enforce minimum charge  →  final price
```

Design decisions (each field must earn its place):

- **Labor is entered as burdened rate × hours** (with a hint linking to the Labor Burden
  Calculator). The blog formulas' fatal flaw is skipping this.
- **Trip cost is a real input** (fuel + vehicle wear + unbillable drive time), separate
  from labor. The tool shows a computed **minimum charge** = direct cost + overhead + a
  sane floor, because "what do I charge just to show up?" is a top PAA question.
- **Materials at cost, no separate markup multiplier** — instead one target margin over
  the whole job. Rationale: dual markups (parts × 2.5 *then* margin) double-count profit
  and are the #1 conceptual error in the wild. The tool will *show* the effective parts
  multiplier the final price implies, so users comparing against price books can relate.
- **Overhead allowance** mirrors Job Pricing Calculator (% of direct cost) for consistency.
- **Target margin** (not markup) with the division formula, consistent with Job Pricing.
- **Rounding**: user-set rounding increment (default $5) applied to the final price —
  flat rates are quoted in round numbers in the real world.

## E. INPUTS (definitive list)

| # | Input | Unit | Default | Required | Why |
|---|---|---|---|---|---|
| 1 | Labor hours on job | hrs | 2 | yes | drives labor cost |
| 2 | Burdened labor rate | $/hr | 45 | yes | true labor cost (hint → Labor Burden calc) |
| 3 | Second-technician? (helper hours at own rate) — **deferred** (see L) | — | — | no | keep v1 solo-crew simple |
| 4 | Trip cost (fuel, vehicle, drive time) | $ | 25 | yes (can be 0) | real cost of showing up |
| 5 | Materials cost (at cost) | $ | 120 | yes (can be 0) | parts/supplies |
| 6 | Permits / disposal / other direct | $ | 0 | optional | realism without clutter |
| 7 | Overhead allowance | % | 15 | yes | consistent with Job Pricing |
| 8 | Target margin | % | 35 | yes | margin, not markup |
| 9 | Minimum charge | $ | auto-suggested | optional | floor for tiny jobs |
| 10 | Round price to nearest | $ | 5 | yes (can be 1) | real-world quoting |

All numeric fields validated like Phase 3 (non-numeric rejected; margin < 100; rate >
0 if hours > 0; negatives rejected except none expected — all inputs ≥ 0).

## F. FORMULAS (name / formula / example / edges)

```
1. Labor cost
   laborCost = hours × burdenedRate
   ex: 2 × $45 = $90
   edges: hours = 0 → labor 0 (diag-only job, allowed); rate = 0 with hours > 0 → warning
   ("a free labor rate means no charge for your time — intended?")

2. Direct cost
   directCost = laborCost + tripCost + materials + otherDirect
   ex: 90 + 25 + 120 + 0 = $235
   edges: all zero → direct 0 → total 0 → margin division guarded

3. Overhead allowance
   overheadAmt = directCost × overheadPct/100
   ex: 235 × 0.15 = $35.25

4. Total cost
   totalCost = directCost + overheadAmt
   ex: 235 + 35.25 = $270.25

5. Flat-rate price (margin-correct division)
   rawPrice = totalCost / (1 − marginPct/100)   [valid 0 < margin < 100]
   ex: 270.25 / 0.65 = $415.77

6. Rounded price
   price = ceil(rawPrice / roundTo) × roundTo
   ex: ceil(415.77 / 5) × 5 = $420
   edge: roundTo = 1 → exact; roundTo = 0 → guard to 1

7. Gross profit
   profit = price − totalCost
   ex: 420 − 270.25 = $149.75

8. Achieved margin
   margin = profit / price × 100
   ex: 149.75 / 420 = 35.65%  (rounding raises it slightly above target — show this honestly)

9. Minimum charge (auto-suggestion)
   suggestedMinimum = ceil((totalCost at 0 materials + target margin) / roundTo) × roundTo
     — i.e. price the job with materials = 0; the smallest sensible call
   ex (labor 2×45, trip 25, OH 15%, margin 35%): total = (90+25)×1.15 = 132.25;
      132.25/0.65 = 203.46 → $205
   edge: user minimum > computed price → final price = user minimum, with an explicit
   note ("price raised to your minimum charge")

10. Effective parts multiplier (display-only, for price-book comparison)
    materialsMultiplier = (materials × (1 + profit/totalCost)) / materials  → simplified:
    shown as: price ÷ totalCost = overall multiplier on cost
    ex: 420 / 270.25 = 1.55×
    edge: materials = 0 → hide the line

11. Markup equivalence (display-only, ties to Markup Calculator)
    markup = profit / totalCost × 100
    ex: 149.75 / 270.25 = 55.4%
```

**Markup-vs-margin guard (the classic error, prevented):** the tool prices by division and
displays both margin and markup with a note. If the user enters "50%" thinking markup,
they get a 50% *margin* price — the UI states this plainly ("You're pricing to a 50%
margin — that's a 100% markup on cost").

## G. EXAMPLES (illustrative — clearly labeled, not market data)

**1. Electrician — ceiling fan install (2 hrs)**
inputs: 2 hrs × $55 burdened · trip $30 · materials $85 (fan box, wire, connectors) ·
OH 15% · margin 35% · round $5
calc: labor 110 + 30 + 85 = 225 direct · OH 33.75 · total 258.75 ·
price 258.75/0.65 = 398.08 → **$400** · profit $141.25 · margin 35.3%

**2. Plumber — water heater replacement (3 hrs)**
inputs: 3 × $50 · trip $35 · materials $1,100 (heater, fittings) · other $75 (permit) ·
OH 15% · margin 30% · round $25
calc: labor 150; direct 1,360 · OH 204 · total 1,564 ·
price 1,564/0.70 = 2,234.29 → **$2,225** (rounds down to nearest 25 via ceil of
2225? — no: ceil(2234.29/25)×25 = $2,250) · profit $686 · margin 30.5%

**3. HVAC — capacitor swap (1 hr)**
inputs: 1 × $60 · trip $40 · materials $45 (capacitor) · OH 15% · margin 40% · round $5
calc: direct 145 · OH 21.75 · total 166.75 ·
price 166.75/0.60 = 277.92 → **$280** · profit $113.25 · margin 40.4%

**4. Handyman — TV mount + shelf (1.5 hrs)**
inputs: 1.5 × $45 · trip $20 · materials $40 (anchors, brackets) · OH 10% · margin 30% ·
round $5
calc: labor 67.50; direct 127.50 · OH 12.75 · total 140.25 ·
price 140.25/0.70 = 200.36 → **$205** · profit $64.75 · margin 31.6%

**5. Painter — interior door repaint (2.5 hrs)**
inputs: 2.5 × $38 · trip $15 · materials $55 (paint, brushes) · OH 12% · margin 32% ·
round $5
calc: labor 95; direct 165 · OH 19.80 · total 184.80 ·
price 184.80/0.68 = 271.76 → **$275** · profit $90.20 · margin 32.8%

All five will be verified in the implementation test suite (E-section numbers included).

## H. SEO SPEC

- **URL:** `/calculators/flat-rate-calculator` (flat, consistent with siblings; "pricing"
  omitted to keep the slug tight and match the head term "flat rate calculator").
- **Title:** "Flat Rate Pricing Calculator — Price Service Calls with Real Costs"
- **Meta description:** "Free flat rate pricing calculator for plumbers, electricians and
  HVAC. Build a service call price from burdened labor, trip cost, materials, overhead and
  your target margin — with the math shown."
- **H1:** "Flat Rate Pricing Calculator"
- **Intro:** who it's for + what it produces (one paragraph, tool first).
- **Supporting H2s:** How this calculator works (formulas) · What the result means ·
  Worked example: [electrician] · Common mistakes · Minimum charge & trip costs (PAA
  coverage) · Flat rate vs hourly (FAQ) · FAQ (4–5 real questions) · Continue with…
- **FAQs (draft):** What is flat rate pricing? · How do I calculate a flat rate price? ·
  How much should a service call / trip charge be? · Should I use markup or margin on
  parts? · Is flat rate better than hourly? (answers must stay honest, no invented stats)
- **Internal links:** Labor Burden (before), Job Pricing (bigger jobs), Margin
  (verification), Markup (equivalence), markup-vs-margin guide.
- **Category:** joins "Pricing & Profit" (4 tools). Sitemap/canonical/schema via the
  existing Phase 3 system — zero new patterns. One indexable URL; `?example=` links
  non-canonical as established.

## I. UX SPEC (flow)

1. Inputs grouped: **On-site work** (hours, burdened rate) → **Getting there** (trip cost)
   → **Parts & other costs** (materials, other direct) → **Your business** (overhead %,
   target margin, minimum charge, rounding).
2. Result panel: **Flat-rate price** (rounded, the star) → math chain (Cost → +Overhead →
   ÷Margin → Price → Profit) → YourCalculation with live numbers → breakdown rows
   (labor/trip/materials/other/overhead/total) → profit & margin rows → note showing
   achieved vs target margin and the effective cost multiplier.
3. Copy/print (ResultActions), reset, LiveRegion, same visual system as Phase 3 — no new
   design language.
4. Worked example (electrician) + continue-with → Margin Calculator ("verify the margin on
   this price") and Job Pricing ("bigger job? price the full project").
5. Mobile: same grid-2 stacking; worksheet table scrolls horizontally if needed.

## J. MATH TEST PLAN (for implementation)

Extend `tests/math-verification.mjs` with a FLAT RATE section (~20 assertions):

- G-section examples 1–5: price, profit, margin (15 asserts, hand-derived expected values)
- rounding: roundTo 5/25/1 behaviors incl. exact-boundary (415.00 stays 415 with roundTo 1;
  220 → 225 with roundTo 5)
- minimum-charge override: user min > computed → final = min; min < computed → no effect
- margin 0 → guard (invalid); margin 100 → guard; margin negative → reject
- hours 0 → labor 0, price still computes from trip+materials
- all-zero inputs → total 0 → guarded result (no Infinity/NaN rendered)
- markup equivalence: markup = profit/totalCost consistent with example numbers
- effective multiplier: price/totalCost = 1.55× on the spec example

## K. IMPLEMENTATION PLAN (files to touch when approved)

1. `lib/site.ts` — add Tool entry (metadata, formulas, FAQs, related), worked example,
   continueWith entry; add slug to ESSENTIALS? no — goes in "Price a job" group on
   homepage toolkit; add to Header category pages automatically (data-driven already).
2. **new** `components/calculators/FlatRateCalculator.tsx` — reuses Field, MathFlow,
   YourCalculation, ResultRow, ResultActions, LiveRegion as-is; adds a small rounding
   helper (pure function, testable).
3. `app/calculators/[slug]/page.tsx` — register in `calculators` map + `support` entry.
4. `tests/math-verification.mjs` — new FLAT RATE section per J.
5. Homepage — no structural change needed (toolkit group picks it up from data);
   essentials trio unchanged.
6. Footer/calculators hub — automatic via registries.
No new dependencies. No design-system changes.

## L. SCOPE CONTROL

**Not building now:**
- Good/Better/Best three-option presentation (price-book territory; wait for user signal)
- Technician flat-rate *pay* calculator (different product; different keyword)
- Per-trade presets saved as separate pages (thin-content risk; one tool, five examples)
- Price-book export/multi-item lists (software feature, not calculator)
- Second-technician/helper labor line (defer: adds a column for a minority case; the
  "other direct costs" field can carry a sub cost meanwhile)
- Sales-tax handling (jurisdiction-dependent; documented as a limitation, per Phase 0
  honesty rules)
- Overtime/after-hours multipliers (attractive but low frequency; note as limitation)

**Explicitly attractive-but-not-worth-it:** emergency-call premium multipliers (social-media
popular, but it's just a markup on the same math — a note, not a feature).
