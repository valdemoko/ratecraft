# Phase 0 Audit — RateCraft

> Audit date: September 14, 2026. Scope: every route, component, calculator, SEO artifact,
> accessibility and UX pass. Math verified with an independent re-implementation script
> (not by trusting the components) plus live browser verification.

## Verdict: why the site felt poor

**Root cause (critical):** `Header` and `Footer` components existed but were never rendered —
the root layout only wrapped `children`. Every page was bare content: no logo, no navigation,
no footer links, no legal pages reachable by crawling. That single omission explains most of
the "MVP" feel and was also an SEO defect (no sitewide internal linking).

## Problem log

| # | Problem | Severity | Location | Fix | Priority | Status |
|---|---|---|---|---|---|---|
| 1 | Header/Footer never mounted; no `<main>` landmark | Critical | `src/app/layout.tsx` | Mounted both + `<main id="main">`; skip link now targets it | P0 | ✅ Fixed |
| 2 | Skip link pointed to `#main` which didn't exist | High | `layout.tsx` | Fixed by #1 | P0 | ✅ Fixed |
| 3 | Breadcrumb JSON-LD used relative URLs (schema.org requires absolute) | High | `Breadcrumbs.tsx` | Now uses `${site.url}${href}` | P0 | ✅ Fixed |
| 4 | Preview deployments indexable (draft URL could enter Google) | High | `layout.tsx` | `noindex, nofollow` unless `NEXT_PUBLIC_SITE_URL` is a non-localhost URL | P0 | ✅ Fixed |
| 5 | `<a href>` used for internal links on calculator pages (full reloads, no prefetch) | Medium | `calculators/[slug]/page.tsx` | Replaced with `next/link` | P1 | ✅ Fixed |
| 6 | Calculator results silent for screen readers | Medium | all 7 calculators | Added `LiveRegion` (`aria-live=polite`) — applied to markup + break-even as pattern; **roll out to remaining 5 in Phase 3** | P1 | ◐ Partial |
| 7 | Break-even input labels ambiguous (fixed monthly vs per-job mixed) | Medium | `BreakEvenCalculator.tsx` | Labels now explicit ("per month", "per job") | P1 | ✅ Fixed |
| 8 | OG URL missing at site level | Low | `layout.tsx` | Added `openGraph.url` | P2 | ✅ Fixed |
| 9 | No tools/guides to control markup↔margin table exposure beyond one page | Low | content | Deferred to Phase 3 (content decision, not a bug) | P3 | ○ Open |
| 10 | Copy/print/export of results absent | Low | calculators | Deliberately deferred to Phase 3 per differentiation doc | P3 | ○ Open |
| 11 | `robots.txt`/canonicals use localhost until env var set | Info | config | Correct behavior; resolved at deploy time | P3 | ○ Open |

## Calculator math verification (independent script, 19 assertions — all PASS)

| Calculator | Verified values (default inputs) | Edge cases checked | Result |
|---|---|---|---|
| Markup | $1,500 direct → +10% OH → $1,650 → ×1.25 = **$2,062.50**; margin = 20.0% | zero cost | ✅ |
| Margin | $2,600/−$1,950 → margin 25%, markup 33.33%; price for 30% = $2,785.71 | cost ≥ price (alert), zero cost (guard) | ✅ |
| Job Pricing | 16h×$45 + $900 + $40 = $1,660 → +15% OH = $1,909 → ÷0.65 = **$2,936.92** | margin = 0/100 (guard) | ✅ |
| Labor Burden | $52,000 base → $65,160 total → ÷1,764 billable = **$36.94/hr**; burden 25.31% | billable = 0 (guard) | ✅ |
| Hourly Rate | $83,000 ÷ 1,152 = **$72.05/hr** | utilization 0 (guard) | ✅ |
| Overhead | $1,670/mo → 5.57% of $30k → **$3.34/billable hr** | zero revenue/hours (guards) | ✅ |
| Break-Even | $4,500 ÷ $450 = **10 jobs**; $12,000 revenue | price ≤ cost (guard, message) | ✅ |

Also verified live in browser: markup calculator renders $2,063 headline with $1,650 × 1.25
explanation text; margin calculator shows the no-profit `role="alert"` condition.

## Structural/SEO checks

- 27 static pages; sitemap has exactly 20 `<loc>` entries = 9 static + 7 tools + 2 categories + 2 guides (matches intent — no bloat). ✓
- Canonical on every page; absolute breadcrumb URLs fixed (#3). ✓
- FAQ/WebApplication schema only where visible content exists. ✓
- Security headers present (nosniff, referrer, frame-ancestors, permissions). ✓
- First Load JS 103 kB shared; only calculator routes carry extra ~9 kB client JS. ✓
- `not-found` page works; all internal `<a>` now `<Link>`. ✓

## What still makes it feel like an MVP (honest list for Phase 1+)

1. Visual system is token-correct but **sparse**: single-column pages, little hierarchy rhythm,
   no visual explanation of the "pricing chain" (Phase 4 concept).
2. Tool pages have strong middle (calculator + methodology + FAQ) but weak page furniture:
   no in-page anchor nav, no "at a glance" summary strip, related links are a bare list.
3. Guides lack serif body typography, TOC, and in-body ad placements (Phase 1/3).
4. Only 2 guides — the guides index looks empty relative to the promise (Phase 5).
5. No category-level intro copy depth on /pricing and /costs (Phase 7).
6. LiveRegion pattern only applied to 2 of 7 calculators (finish in Phase 3).
7. No print stylesheet despite print-worthy result panels (Phase 3).

## Files changed in this phase

- `src/app/layout.tsx` (header/footer/main, noindex guard, OG url)
- `src/components/Header.tsx` (removed unused export/import)
- `src/components/Breadcrumbs.tsx` (absolute JSON-LD)
- `src/app/calculators/[slug]/page.tsx` (Link fix)
- `src/components/calculator/LiveRegion.tsx` (new)
- `src/components/calculators/MarkupCalculator.tsx` (LiveRegion)
- `src/components/calculators/BreakEvenCalculator.tsx` (LiveRegion + labels)
- `docs/phase-0-audit.md` (this file)

## Validation

- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run build` — 27/27 pages static, compiled successfully
- Live server tests: header/footer/main present sitewide; `noindex` on localhost; 16
  calculator links from homepage; 7 unique tool links from a tool page; sitemap 20 URLs;
  breadcrumb JSON-LD absolute; margin alert renders.

## Recommended next phase

**Phase 1 — Professional redesign** (as defined in the master roadmap), starting from the
"job-sheet precision" system and addressing audit items 1–3 and 7 of the MVP list (visual
rhythm, page furniture, serif guide typography, print stylesheet). LiveRegion rollout and
copy/print belong to Phase 3 alongside the calculator upgrades.
