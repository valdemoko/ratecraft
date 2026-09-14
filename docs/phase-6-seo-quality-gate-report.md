# Phase 6 — SEO Quality Gate Report

> Audit date: September 14, 2026. Scope: all 26 sitemap URLs crawled and inspected
> (title/meta/H1/canonical/robots/schema/inbound+outbound links), cannibalization review
> of the 11 key pages, structured-data validation, E-E-A-T scan, performance and
> mobile/a11y smoke tests. Method: scripted crawler + live DOM checks, run against a
> production-env build (`NEXT_PUBLIC_SITE_URL` set) so indexability was tested in the
> mode Google will actually see.

## 1. URLs audited

26 indexable URLs: 1 home · 2 hubs (/calculators, /guides) · 8 calculators · 2 category
pages (/pricing, /costs) · 7 guides · 6 static pages. Every URL returned 200; every one
has exactly 1 H1, unique title, unique canonical, and at least 1 internal inbound link
(no orphans; weakest page has 3 inbound). Full link counts in the audit transcript
(outbound 17–28 per page).

## 2. Problems found

1. **All pages carried `noindex, nofollow` when audited initially** — root cause: this is
   the intentional draft guard (Phase 0), which activates unless `NEXT_PUBLIC_SITE_URL`
   is set to a non-localhost value. **Not a bug**: verified that a production-env build
   emits no robots meta at all, with canonicals/OG/robots.txt all switching to the
   production domain. The guard does its job; deploying with the env var set flips the
   whole site to indexable atomically.
2. **Footer linked only 4 of 8 calculators** (`tools.slice(0, 4)`) — link-equity gap for
   hourly-rate, overhead, break-even and flat-rate. **Fixed**: footer now lists all 8
   (verified live: 8 calculator links sitewide).
3. Meta descriptions on 6 calculator pages exceed 165 chars (166–195) — Google truncates
   rather than penalizes; flagged as polish, not corrected (see §4).
4. Several titles 66–94 chars (guides longest) — same category: truncation risk only.
5. `/contact` title (19 chars) is short but accurate; left as is.

## 3. Problems fixed

- Footer tool links 4 → 8 (link equity for the four weakest-linked calculators:
  break-even had 7 inbound, now 9+ from every page's footer).
- No other code changes were needed — deliberate: the audit found no broken links, no
  duplicate titles/H1s/canonicals, no schema errors, no orphans.

## 4. Deliberately NOT corrected (and why)

- **Long titles/descriptions on tool pages.** They contain the differentiating keywords
  and are well under hard limits; truncation at ~60/155 chars cuts marketing tail, not
  meaning. Shortening risks uniqueness for zero ranking gain. Revisit only with GSC
  CTR data showing a real problem.
- **`?example=` URLs** remain accessible (200, canonicalized to the clean URL — verified)
  but are excluded from the sitemap (0 query URLs present). Correct per Phase 4 spec.
- **Legacy-URL check**: no references to any old domain exist; all canonicals/OG/sitemap
  derive from the single `site.url` source.

## 5. Cannibalization audit (11 key pages)

| Pair | Primary vs secondary intent | Should rank / support | Risk | Action |
|---|---|---|---|---|
| Flat Rate Calculator ↔ Flat Rate vs Hourly | compute vs decide-between-models | tool / guide | **Low** | None — see §5.1 |
| Job Pricing ↔ Markup ↔ Margin calculators | whole-job build-up vs cost-adder vs price-checker | each its own SERP segment | Low | None; continue-with chain differentiates |
| GC Markup guide ↔ Markup Calculator | "what's typical / why" vs compute | guide for informational, tool for tool intent | Low | Already guarded: guide links down to tool, tool FAQ answers "typical markup" briefly and links up to guide |
| Minimum Service Charge guide ↔ Flat Rate Calculator min-charge feature | method vs number | guide / tool | Low | Tool's suggested-minimum hint is a feature, not a page |
| Labor Burden guide ↔ Labor Burden Calculator | explain vs compute | text-book split | Low | Same pattern |
| Hourly Rate Calculator ↔ Labor Burden pair | owner floor vs employee cost | distinct intents | Low | None |
| How to Write an Estimate ↔ How to Price a Job | document structure vs costing method | complementary steps of one workflow | Low | Cross-linked both ways |
| Flat Rate Calculator FAQ "Is flat rate better than hourly?" ↔ vs-hourly guide | brief answer vs depth | FAQ is 3 sentences + link | **Watch** | Left as-is; one intent, two depths. Re-check in GSC after indexing; merge if both underperform |

**5.1 Flat-rate special analysis (decision: A — coexist as-is).** The calculator targets
tool intent ("flat rate pricing calculator", formula queries); the guide targets
decision intent ("flat rate vs hourly", "should I charge by the hour"). The calculator's
hourly-related content is one FAQ answer that defers to the comparison explicitly; the
guide's pricing math defers to the tool via two CTAs. No content removal performed:
the overlap is a linking handshake, not duplication.

## 6. Calculator status (8/8 pass)

Each has: defined intent (own keyword cluster), sufficient explanation, visible formulas,
worked example (all prefillable), result interpretation, when-to-use, common mistakes,
related tools + continue-with. They share components by design; content and inputs are
genuinely distinct (verified in Phases 3–4 audits). No "same form, different name" case
found.

## 7. Guide status (7/7 pass)

All have: direct answer to a real query, worked numeric examples (math suite-verified),
tables where they add value, formulas, FAQ sections answering observed PAAs, 2–4 tool
links, 2+ guide links. E-E-A-T scan: **0 unsupported statistics** — every market figure
is attributed (Angi, foreman.co, Buildern, SmartService) and labeled; all other numbers
are marked illustrative examples; formulas reproducible (105/105 test assertions).

## 8. Sitemap

26 URLs, valid XML, zero `?example=` or parameter URLs, only pages we want indexed.
Guides carry `lastmod` from their `updated` dates.

## 9. Robots

`Allow: /` + absolute sitemap URL. Draft guard: when `NEXT_PUBLIC_SITE_URL` is unset or
localhost → sitewide `noindex, nofollow` (verified active in dev mode); with a
production URL → no robots meta (verified). No preview URLs referenced.

## 10. Canonicals

Unique, absolute, self-referencing on all 26 pages — verified programmatically in BOTH
modes (dev: localhost:3000; prod build: the env domain). Example-URLs canonical to clean
URLs. No crossed canonicals.

## 11. Structured data

Programmatic validation of every page: WebApplication+FAQPage+BreadcrumbList on all 8
calculators; Article+FAQPage+BreadcrumbList on all 7 guides; WebSite/Organization
sitewide. 0 issues: no localhost URLs in schema, WebApplication names match H1s, every
FAQ-schema question exists as visible page text, Article dateModified matches the
visible "Reviewed and updated" date.

## 12. Performance

Build: 34/34 static pages. Shared First Load JS: **103 kB** (unchanged since Phase 1);
only calculator routes hydrate. Fonts self-hosted with `display: swap`; zero external
requests; OG image is a build-time static asset. No CLS risks detected (no
layout-shifting late content; calculator hydration re-renders values in place).

## 13. Accessibility / mobile

Live DOM checks on production build: no horizontal overflow, single H1, ordered
headings, skip link, `:focus-visible` styles present, labeled inputs, aria-live result
announcements, `role="alert"` validation (verified in Phases 3–4), tables wrapped for
horizontal scroll, print stylesheet hides chrome.

## 14. Tests

typecheck ✓ · lint ✓ · build ✓ 34/34 · math **105/105** · route checks 10/10 (prod-env
server) · crawler inventory 26/26 · schema validator 0 issues · sitemap/robots/canonical
checks pass. All prior tests maintained.

## 15. Priority URLs for Search Console submission (after deploy, in order)

1. `/` (homepage)
2. `/calculators` · `/guides` (hubs)
3. `/calculators/flat-rate-calculator` (newest, highest-opportunity)
4. `/calculators/markup-calculator` · `/calculators/job-pricing-calculator` · `/calculators/labor-burden-calculator`
5. `/guides/markup-vs-margin` · `/guides/how-to-price-a-job`
6. `/guides/how-to-calculate-labor-burden` · `/guides/general-contractor-markup` · `/guides/flat-rate-vs-hourly` · `/guides/minimum-service-charge` · `/guides/how-to-write-an-estimate`
7. Remaining calculators and `/pricing`, `/costs`

(Submit the sitemap once; individual submission only for the first wave if desired.)

## 16. Remaining SEO risks

1. **Content volume** — 7 guides is a start; cluster authority needs the B-list batch
   once GSC shows which queries warrant it.
2. **Flat-rate FAQ vs guide** — the one intentional two-depth pair; monitor after
   indexing.
3. **Long meta descriptions/titles** — truncation risk only; revisit with CTR data.
4. **No external signals** — backlinks/authority out of scope for this phase.

---

## RATECRAFT — READY FOR INDEXING

One deployment action remains (out of scope by instruction): buy the domain, deploy to
Vercel with `NEXT_PUBLIC_SITE_URL=https://<domain>`, submit the sitemap in Search
Console, then request indexing for the priority list above.

Detenido. Espero instrucciones.
