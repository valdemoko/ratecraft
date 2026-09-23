# Phase 8 — Selective content expansion (calculators + guides)

**Date:** 2026-09-23 · **Scope:** 3 new calculators, 4 new guides, SEO/metadata repairs,
calculator-level fixes, internal-linking and design corrections.

The rule for this phase was deliberately restrictive: **only build a page where the
decision it supports is real, and where we can say something the current page set
doesn't already say.** Several obvious candidates were rejected for that reason
(listed at the end).

---

## 1. New calculators (3)

| URL | Problem it solves | Why it earns a page |
|---|---|---|
| `/calculators/job-profitability-calculator` | "Did this job actually make the margin I planned?" | The toolset could price a job but never checked the result. This closes the feedback loop: planned vs. actual margin, margin points lost, profit variance, and the price the real cost would have required. |
| `/calculators/discount-impact-calculator` | "What does giving 10% off cost me?" | No existing page covered the discount decision. Outputs are distinct: profit erased as a share (not just dollars) and the volume multiplier needed to stand still, plus a live discount table. |
| `/calculators/hire-vs-subcontract-calculator` | "Should this work be done by an employee or a subcontractor?" | A fixed-cost-vs-variable-cost decision the costs cluster was missing. Break-even billable hours, effective cost per billable hour at real utilisation, and the utilisation sensitivity table. |

Each tool ships with: registry metadata (title/description updated for length),
formulas shown on the page, a verified worked example loadable into the calculator,
supporting "what the result means / when to use it / common mistakes" copy, 4–5 FAQs,
related tools and related guides, `WebApplication` + `FAQPage` schema, breadcrumbs and
a review date.

## 2. New guides (4)

| URL | Question it answers | Pairs with |
|---|---|---|
| `/guides/billable-hours-and-income-goal` | How many hours can I actually sell, and what must the year earn (including tax)? | Hourly rate, overhead, labor burden calculators |
| `/guides/job-costing` | How do I compare a finished job with its estimate, and what do I change afterwards? | Job profitability calculator |
| `/guides/what-a-discount-costs` | What does a discount really cost, and what should I offer instead? | Discount impact calculator |
| `/guides/hire-or-subcontract` | At what workload does hiring beat subcontracting? | Hire vs. subcontract calculator |

No new "billable hours calculator" was built: its inputs and outputs would have been the
same arithmetic as the hourly rate calculator's utilisation input, i.e. an artificial
variation. The topic is covered as a guide instead, which is where the explanation of
capacity and tax gross-up belongs.

## 3. Changes to existing pages

- **Break-even calculator:** added a target-profit input. Outputs now include jobs for
  the profit goal, the extra jobs beyond break-even, and the revenue at that goal —
  `jobs = (fixed + target) ÷ contribution`. Break-even itself is unchanged.
- **Flat-rate calculator:** "Apply the suggested minimum" button (the suggestion was
  previously a hint the user had to retype).
- **Markup calculator:** warning when markup is 0%, which sells the job at cost with no
  profit to cover overhead.
- **Category hubs** (`/pricing`, `/costs`): per-category guide lists (they previously
  hardcoded the same two guides), cross-link between the two hubs, extra glossary terms
  (discount, job costing, billable hours, utilisation), and `dynamicParams = false`.
- **Guides hub:** guides are now grouped into three topic clusters with a safety net
  (`guideSections()`) so a future guide cannot be silently dropped from the hub.
- **Homepage:** featured six guides instead of all (the hub now groups all of them),
  adds the job-profitability closing-the-loop link in the chain section.
- **About:** author anchor (`#author`), and a "how pages are reviewed and dated" section
  describing the review dates and the formula test suite.
- **Contact:** expanded from a 237-word stub into a real page (what to include, how
  corrections are handled, what we can't answer, where to look first).
- **Guide pages:** author byline linking to `/about#author`, `Person` author in
  `Article` schema, publisher logo corrected to the actual logo asset.

## 4. SEO / technical repairs

1. **Tool pages dropped the sitewide draft guard.** `generateMetadata` set
   `robots: { googleBot: … }`, and metadata merges shallowly — so that object replaced
   the layout's `noindex, nofollow`. On a preview deployment without
   `NEXT_PUBLIC_SITE_URL`, the eleven calculator pages were the only indexable routes.
   Fixed with a shared `isIndexable` flag in `lib/site.ts`; the layout and the tool
   page both respect it (verified: production env indexable, no-env build `noindex`).
2. **Homepage title double-branded.** The root layout's `title.template` applies to child
   segments, so the homepage rendered "…Tools | RateCraft". Now uses `title.absolute`.
3. **Title/description length.** Trimmed 17 titles to ≤ 71 characters including the brand
   suffix, and the descriptions that ran past ~165 characters. Zero duplicate titles and
   zero duplicate descriptions across the 29 indexable pages.
4. **Sitemap:** tool pages use each tool's own review date instead of one global
   `lastmod`; legal pages stay excluded; 29 URLs (5 static + 2 categories + 11 tools +
   11 guides).
5. **Schema:** `dateModified` and `isAccessibleForFree` on `WebApplication`; `Person`
   author and publisher logo on `Article`.

## 5. UX / design corrections

- **`MathFlow` steps rendered as "PRICE$1,650.00"** — the label and value spans were
  inline despite a stacked layout being intended (`display: block` added in
  `globals.css`). This affected all eleven calculators and the homepage chain band.
- **Horizontal overflow on mobile** from a long `ResultRow` value
  ("Employee cheaper by $11,840.00" inside a `nowrap` cell). The row was restructured so
  the value stays short and the comparison sits in the hint.

## 6. Verification

- `npm run typecheck`, `npm run lint`: clean.
- `npm test` (formulas): **205 assertions pass**, up from 105. New sections cover job
  profitability, discount impact, hire-vs-subcontract, the target-profit extension, and
  every number published in the four new guides. Two tautological tests from the original
  suite (`rev0Guard` always returning 1, a meaningless `0.0001 × 0` assertion) were
  replaced with real guard assertions.
- `npm run build`: 41 routes, all prerendered.
- `node scripts/check-links.mjs`: 55 URLs, 0 failures; unknown calculator, guide and
  category slugs all return 404.
- Content audit across all 29 indexable pages: no page under 600 words except the
  utility contact page (now expanded); no duplicate titles or descriptions; no
  duplicated FAQ answers across pages.
- Manual desktop (1280px) and mobile (390px) checks of the new pages.

## 7. Rejected on purpose

| Candidate | Why not |
|---|---|
| Billable-hours calculator | Same inputs and arithmetic as the hourly rate calculator's utilisation input — a unit-level variation, not a new decision. Covered as a guide. |
| Materials/parts markup calculator | Same intent as the markup calculator with a different noun. The parts-multiplier logic already appears in the flat-rate tool and its FAQs. |
| "Reverse markup" calculator | Already served by the margin calculator's target-margin panel. |
| Tax gross-up calculator | Requires jurisdiction-specific rates we won't invent. Covered honestly in the billable-hours guide using the reader's own effective rate. |
| Construction profit-margin benchmark guide | Would require benchmark statistics we can't source reliably. |
| Trade-specific hubs (electrical, plumbing, HVAC) | No real tools behind them yet; empty category pages are worse than none. |
