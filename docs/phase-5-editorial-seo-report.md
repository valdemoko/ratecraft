# Phase 5 — Editorial SEO Report

> First editorial batch: 5 new guides built on clusters, SERP-validated. No product
> changes, no redesign, no new dependencies. Architecture and prioritization in
> `docs/phase-5-content-architecture.md`.

## 1. Initial SEO state
8 calculators (all interlinked via continue-with + related), 2 guides, 9 static pages,
sitemap 21 URLs. Tool intent fully covered; informational intent nearly empty — every
informational query in the niche was landing on competitor blogs.

## 2. Competitive research (live SERPs, September 2026)
Checked labor burden, estimate writing, GC markup, flat rate vs hourly, service call /
minimum charge, and profit margins SERPs. Findings:

- **Labor burden**: vendor blogs (ConstructionCoverage, Miter, eBacon, Projul, Rippling)
  stop at "wage + extras" and skip the billable-hours divisor that makes the number
  priceable. PAA: typical %, labor burden vs overhead, formula.
- **Estimate writing**: template/software pages (FreshBooks, InvoiceFly, Billdu) focus on
  document formatting; nobody connects each line to the costing decision behind it.
- **GC markup**: numerically incoherent SERP — Angi 15–20%, foreman.co 20–33%, Buildern
  "30–50%", Reddit 9–100%. No page explains *why* ranges differ or converts correctly.
- **Flat rate vs hourly**: FSM software marketing (ServiceTitan, FieldEdge, FieldNation);
  pro/con lists, no math, no decision method.
- **Service call / minimum charge**: survey page (SmartService, $75–150 attributed) +
  forum threads. PAA-heavy. No method page.
- **Profit margins**: multiple data reports with conflicting figures — rejected (see §5).

## 3. Clusters detected
8 clusters analyzed (architecture doc §2): Pricing · Markup & Margin · Labor & Hourly ·
Overhead & Job Costing · Flat-Rate · Service Calls & Minimums · Trade-specific ·
Estimating & Profitability. Cluster 2 already complete; 1, 3, 5, 6 got new pages this
phase; 4 covered by existing tool pages; 7 and 8 deferred.

## 4. Opportunities found
Five gaps where RateCraft's calculator math + worked examples beat the existing SERP:
labor burden method (billable-hours divisor), estimate-as-costing-document, GC markup
method + attributed ranges, flat rate vs hourly with the same job priced both ways,
minimum service charge built from own costs.

## 5. Pages rejected and why
- **construction-profit-margins** — SERP is conflicting data reports; citing them without
  independent verification violates the honesty rules. Revisit only with an attributable
  dataset. (Class D)
- **Trade pricing pages** (/electrician-pricing etc.) — would fail the swap-the-noun test
  today; no differentiated trade-specific content yet. (Class C, revisit with GSC data)
- **"Typical labor burden percentage" standalone page** — cannibalizes the labor-burden
  guide; covered in its FAQ. (Class D)
- **Material markup guide** — no evidence of intent distinct from the markup calculator.
  (Class B, wait for GSC)

## 6. Pages selected (Class A) and implemented
| # | URL | Primary keyword/intent | Type | Tools paired |
|---|---|---|---|---|
| 1 | /guides/how-to-calculate-labor-burden | how to calculate labor burden (+ typical %, burden vs overhead) | Method + worked table | labor-burden, hourly-rate |
| 2 | /guides/how-to-write-an-estimate | how to write an estimate / what should it include | Line-by-line structure | job-pricing, flat-rate |
| 3 | /guides/general-contractor-markup | general contractor markup / typical markup | Explainer + method, attributed ranges | markup, margin, overhead |
| 4 | /guides/flat-rate-vs-hourly | flat rate vs hourly | Decision guide + dual worked pricing | flat-rate, hourly-rate |
| 5 | /guides/minimum-service-charge | minimum service charge / trip fee / service call price | Method + worked table | flat-rate, labor-burden |

## 7. Final architecture
Two strong clusters with pillars and spokes: **Pricing** (how-to-price-a-job pillar +
estimate + GC markup + markup-vs-margin) and **Flat-Rate/Service** (flat-rate tool +
vs-hourly + minimum-charge), plus **Labor** (burden tool + guide). Every guide links
2–4 tools and 2 guides; every new guide is linked from the guides hub and from at least
one calculator page (verified non-orphan below).

## 8. Interlinking strategy
- Guide → tool: mid-body `ctaTool` blocks at the point of decision, plus "Tools for this"
  list.
- Tool → guide: related-guide cards on calculator pages (title map now data-driven from
  the guides registry).
- Guide ↔ guide: relatedGuides both directions (existing guides updated to point at the
  new batch where contextually honest).
- No link blocks, no repetitive anchors: each CTA label is specific to the page's math.

## 9. Implementation notes
- New file `src/lib/guides-batch2.ts` (5 guides, same Block/Guide system), merged in
  `guides.ts` — zero template changes needed; sitemap inclusion is automatic via the
  registry.
- Calculator template now derives guide-card titles from the registry (removes the
  hardcoded two-title conditional).
- Existing guides' relatedGuides extended; no body edits needed to existing guides.

## 10. Test results
- **Math suite: 105/105 PASS** — new section 9 verifies every guide example against the
  calculator formulas with independent hand math: burden build-up ($65,160 ÷ 1,764 =
  $36.94), estimate table ($2,323 → $2,671.45 → $4,109.92), HVAC dual pricing ($277.92 →
  $280, fast profit $113.25, slow profit $9.75), minimum charge ($97.75 → $150.38 → $155
  quoted), GC conversions (33% margin ⇄ 49.25% markup). Two draft errors were caught and
  fixed by this verification before publication (HVAC hourly-column arithmetic; minimum
  rounding to a real quote increment).
- typecheck ✓ · lint ✓ · build ✓ **34/34 static pages**.
- All 5 new URLs 200 with unique titles and clean canonicals; sitemap now 7 guide URLs,
  all present in the hub and linked from ≥1 calculator page (no orphans).

## 11. Remaining risks
- **Flat-rate-vs-hourly vs flat-rate FAQ**: the FAQ answers briefly and the guide is the
  depth page — one intent, two depths. Watch in GSC after indexing; merge signal if both
  rank poorly.
- GC-markup ranges are attributed to named sources; if any source updates its figures,
  the guide needs a review (updated date is set for this).
- Only 7 guides total — cluster authority is a start, not a moat. The B-list (job
  profitability review, material markup, overhead recovery) is the natural next batch,
  ideally steered by early Search Console queries.

## 12. Next opportunities
1. Deploy + Search Console, then let query data arbitrate the B-list.
2. Trade-specific pricing content only when each page can prove non-swappable specifics
   (Phase 5E test).
3. Glossary entries (estimate vs quote vs bid; cost-plus vs fixed price) as low-effort
   Tier-3 support once the main clusters hold rankings.

Detenido. Espero instrucciones para la siguiente fase.
