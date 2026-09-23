# Roadmap — RateCraft

## ✅ Phase 1 — Foundation (done)

- Research: keyword research (120 keywords evaluated, 40 mapped in detail), competitor analysis (10).
- Architecture: Next.js App Router + TS, static-first, no DB; two evidence-based categories.
- Design system: "job-sheet precision" identity, Libre Franklin, original SVG logo/favicon.
- 7 flagship calculators (markup, margin, job pricing, labor burden, hourly rate, overhead,
  break-even) with formula transparency and markup↔margin table.
- 2 flagship guides; homepage; hubs; legal pages; About/Contact; AdSlot (off); sitemap/robots;
  schema; breadcrumbs; security headers; full docs.

## Phase 2 — Validate & instrument (next)

- Buy domain, deploy to Vercel, set env vars.
- Search Console + GA4 (env-gated); submit sitemap.
- Manual QA pass on real devices; PageSpeed/Core Web Vitals check.
- Add ads.txt stub; prep AdSense application.

## ✅ Phase 3 — Content depth (done)

Built where the checklist in content-strategy passed: How to Write an Estimate ✅ ·
How to Calculate Labor Burden ✅ · General Contractor Markup ✅ · Flat Rate vs Hourly ✅ ·
Minimum Service Charge ✅. Construction Profit Margins was dropped: publishing benchmark
margins would mean citing numbers we can't verify (see Phase 8, "Rejected on purpose").

## Phase 4 — Trades categories

Only if GSC shows traction on core tools: flat-rate pricing calculator first, then
/electrical, /plumbing, /hvac, /handyman category pages each with ≥2 real tools + 1 guide.
No empty category pages.

## Phase 5 — 30–50 tools

Expand from GSC query data: what people search that lands on existing pages but isn't served
(e.g., material markup split, reverse markup, equipment rate, T&M vs fixed-price helper,
estimate vs quote glossary).

## Phase 6 — 50–100 tools + specialization

Deep trade pages, state/region considerations where legal, glossary completion, printable
estimate templates (PDF via client-side generation), possibly saved scenarios (localStorage).

## Phase 7 — Data-driven expansion only

Quarterly: GSC impressions/position review → build only where signals exist; prune or merge
pages that never earn impressions (avoid index bloat).

## ✅ Phase 8 — Selective expansion (done, 2026-09-23)

Three calculators that close real gaps (job profitability, discount impact, hire vs.
subcontract) and four paired guides (billable hours & income goal, job costing, what a
discount costs, hire or subcontract). Metadata, schema, sitemap, internal linking and two
rendering bugs repaired along the way. Full detail, verification results and the list of
candidates rejected on purpose: `docs/phase-8-content-expansion-report.md`.

## Standing rules

- Quality gate before anything ships: keyword-map entry + differentiation check + content
  checklist.
- No page without a reason; no category without content; no metric invented.
