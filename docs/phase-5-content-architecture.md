# Phase 5 — Editorial Architecture & Prioritization

> Research date: September 2026. SERPs checked live for each A/B candidate; competitor
> weaknesses noted per cluster. Quality > quantity: a small batch of pages with a reason
> to exist beats a list of keyword posts.

## 1. Starting state (audit)

- **Tools:** 8 calculators, all hardened in Phases 0–4, all internally linked via
  continue-with chains and related-tools sections. The tool network covers the *compute*
  intent for markup, margin, job pricing, labor burden, hourly rate, overhead, break-even
  and flat rate.
- **Content:** only 2 guides exist (markup-vs-margin, how-to-price-a-job). Both are strong
  and pair with tools, but the informational surface is thin: no labor-burden explainer,
  no estimate-structure guide, no GC markup guide, no flat-rate-vs-hourly decision guide,
  no margin benchmarks page.
- **Static pages:** about, contact, privacy, terms, cookies, disclaimer — fine.
- **Internal linking:** strong hub→tool→tool; weak tool↔guide (only 2 guides to link).
- **Intent gaps (already-covered vs not):** covered — markup/margin conversion, job
  pricing method, flat-rate computation, break-even, overhead per hour. NOT covered —
  labor burden explained (PAA-heavy SERP), estimate structure ("what should an estimate
  include"), GC markup "what's typical" (high-volume commercial-intent question, current
  SERP is vendor blogs with numbers ranging 7.5%–50% and no method), flat rate vs hourly
  (decision intent, answered only by FSM software blogs), service-call/minimum-charge
  (PAA-heavy, answered by forums), profit margins (data SERP — see rejection below).

## 2. Clusters

| Cluster | Pillar | Supporting | Related tools | SEO priority | Cannibalization risk |
|---|---|---|---|---|---|
| 1. Contractor Pricing | how-to-price-a-job ✅ | how-to-write-an-estimate; general-contractor-markup | job-pricing, markup | **High** | Low (method vs document vs rate question) |
| 2. Markup & Margin | markup-vs-margin ✅ | — (conversion table lives in the tool; no more pages needed) | markup, margin | Done | Guard already documented |
| 3. Labor & Hourly | **how-to-calculate-labor-burden** (new) | (hourly-rate covered by tool page) | labor-burden, hourly-rate | **High** | Low — tool computes, guide explains |
| 4. Overhead & Job Costing | overhead tool page ✅ | (fold job-costing depth into estimate guide) | overhead, job-pricing | Medium | — |
| 5. Flat-Rate | flat-rate tool ✅ | **flat-rate-vs-hourly** (new) | flat-rate, hourly-rate | **High** | Low — decision intent vs compute intent |
| 6. Service Calls & Minimums | **minimum-service-charge** (new) | — | flat-rate (min-charge feature), hourly-rate | Medium-High | None — nothing covers it |
| 7. Trade-specific | none yet | rejected this phase (see §4) | — | Future | High if done lazily |
| 8. Estimating & Profitability | covered by cluster 1 guides | construction-profit-margins → rejected for now | margin | Future | — |

## 3. SERP evidence (live checks, September 2026)

- **Labor burden:** SERP = ConstructionCoverage, Miter, eBacon, Projul, Rippling, ToolGrit —
  all vendor blogs. PAA: "How do I calculate labor burden?", "What is a typical labor
  burden percentage?", "Labor burden vs overhead". Most articles stop at "add up the
  extras" without the billable-hours adjustment that makes the number *usable for
  pricing*. Opportunity: explain burden as a build-up **and** the billable-hours divisor,
  paired with the calculator that does both.
- **How to write an estimate:** SERP = template/ledger-software pages (FreshBooks,
  InvoiceFly, Billdu) focused on document formatting. Nobody connects the estimate's
  structure to the pricing math behind each line. Opportunity: an estimate structure
  guide where every line maps to a costing decision + tool.
- **GC markup:** SERP numbers are all over the place (Angi 15–20%, Buildern 30–50%,
  foreman.co 20–33%, Reddit anecdotes). No page explains *why* markups differ (cost
  basis, overhead structure, risk) or converts markup to margin correctly. Opportunity:
  a guide that explains markup as a consequence of your costs, with a conversion table
  and worked examples — no invented "industry standard" claims, ranges attributed.
- **Flat rate vs hourly:** SERP = ServiceTitan/FieldEdge/FieldNation (software content
  marketing). All cover pros/cons; none give the underlying math or a decision method.
  Opportunity: a decision guide grounded in the same cost math as the calculators, with
  a worked example showing the same job priced both ways.
- **Service call / minimum charge:** SERP = SmartService survey page ($75–100 clusters,
  attributed), Commusoft "three methods", forum threads (Mike Holt, ElectricianTalk).
  PAA: four questions. Opportunity: a method page — build the floor from your costs
  (trip + burdened first hour + overhead share ÷ margin), explicitly rejecting
  copy-the-neighbor's-number, paired with the flat-rate calculator's suggested minimum.
- **Profit margins:** SERP has multiple data reports with diverging figures (5–6% net,
  18–25% residential gross). Honest coverage requires real sourced data we can't
  independently verify → **reject for now** (see §4).

## 4. Prioritization

**A — build now (this phase):**
1. `/guides/how-to-calculate-labor-burden` — validated demand, clear tool pairing, real
   gap (billable-hours divisor), no cannibalization.
2. `/guides/how-to-write-an-estimate` — high informational demand; unique angle (each
   line = a costing decision); pairs with job-pricing + flat-rate tools.
3. `/guides/general-contractor-markup` — high-volume commercial-intent question; SERP
   numerically incoherent; we add method + attribution instead of another number.
4. `/guides/flat-rate-vs-hourly` — decision intent feeding two tools; current SERP is
   software marketing; unique worked-example angle.
5. `/guides/minimum-service-charge` — PAA-heavy, forum-served; method + tool pairing.

**B — good opportunity, next batch (post-Search-Console data):**
- Job profitability review guide (checking finished jobs against estimates).
- Material markup deep-dive (only if GSC shows demand distinct from markup calculator).
- Overhead recovery guide (if the overhead tool page's FAQ traffic grows).

**C — future:**
- Trade pricing pages (electrical/plumbing/HVAC) — only with trade-specific cost
  structures and examples that can't be generated by find-replace; revisit after
  Search Console signals.
- Glossary entries (estimate vs quote vs bid; cost-plus vs fixed price).

**D — rejected (with reasons):**
- `construction-profit-margins` — the SERP is data reports with conflicting figures;
  citing them without independent verification violates the honesty rules, and we
  can't produce original industry data. Revisit only if we adopt a specific,
  attributable dataset.
- `employee cost calculator` split — ADP/QuickBooks SERP (already rejected in map).
- Any `/electrician-pricing`-style page now — would be a keyword URL with swappable
  nouns; fails the Phase 5E test.
- "Typical labor burden percentage" as its own page — covered inside the labor-burden
  guide; separate page would cannibalize.

## 5. Batch architecture (5 new guides)

| Slug | Primary intent | Type | Tool pairings | Interlinks |
|---|---|---|---|---|
| how-to-calculate-labor-burden | how to calculate labor burden (+ typical %) | Method + worked example | labor-burden (primary), hourly-rate, job-pricing | how-to-price-a-job, minimum-service-charge |
| how-to-write-an-estimate | what should an estimate include / how to write one | Structure guide, line-by-line | job-pricing (primary), flat-rate, markup | how-to-price-a-job, markup-vs-margin |
| general-contractor-markup | what markup do general contractors use / typical markup | Explainer + method, attributed ranges | markup (primary), margin | markup-vs-margin, how-to-price-a-job |
| flat-rate-vs-hourly | flat rate vs hourly / which is better | Decision guide + worked dual pricing | flat-rate (primary), hourly-rate | minimum-service-charge, how-to-price-a-job |
| minimum-service-charge | how much to charge for a service call / trip charge | Method + worked example | flat-rate (primary), labor-burden | flat-rate-vs-hourly, how-to-calculate-labor-burden |

Cluster fit: Pricing (estimate, GC markup) · Labor (burden) · Flat-rate (vs hourly,
minimum charge). Every new guide links to ≥2 tools and ≥2 guides; every existing guide
gains a contextual link to the new pages where genuinely relevant.

## 6. Cannibalization guards

- GC-markup guide vs markup calculator: explain-vs-compute, guard as with markup-vs-margin.
- Flat-rate-vs-hourly vs flat-rate calculator FAQ "Is flat rate better than hourly?":
  the FAQ answers briefly and the guide is the depth page — one intent, two depths;
  watch in GSC.
- Minimum-service-charge vs flat-rate calculator's min-charge input hints: guide explains
  method; tool computes. Same pattern as burden.
- No two new guides target the same head term.
