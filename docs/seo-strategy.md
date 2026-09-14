# SEO Strategy — RateCraft

## Architecture (evidence-based)

Keyword research showed two dominant, distinct clusters:

1. **Tool intent** — "X calculator" for markup, margin, job cost, labor burden, hourly rate,
   overhead, break-even. → Flat URLs under `/calculators/`, one tool per page, no depth.
2. **Learning intent** — "markup vs margin", "how to price a job", "how to write an estimate",
   benchmark questions. → `/guides/`, each guide paired with the tool it references.

Trades directories (`/electrical`, `/plumbing`…) are **deferred**: research showed those SERPs
are currently mixed homeowner/software intent and we'd launch empty categories (thin-content
risk). They return in Phase 4 with real tools per trade. Two content-bearing categories exist
now: `/pricing` (tools) and `/costs` (tools) — both have ≥3 real tools, so no empty category.

Final URL map:

```
/
/calculators
/calculators/{markup,margin,job-pricing,labor-burden,hourly-rate,overhead,break-even}-calculator
/pricing            (category: markup, margin, job pricing, break-even)
/costs              (category: labor burden, hourly rate, overhead)
/guides
/guides/markup-vs-margin
/guides/how-to-price-a-job
/about /contact /privacy /terms /cookies /disclaimer
```

## On-page standards

- One H1; keyword in title, H1, URL slug, first paragraph — naturally.
- Title ≤ 60 chars-ish; description 140–160, written for clicks not stuffing.
- Canonical on every page (`metadataBase` + `alternates.canonical`).
- Open Graph + Twitter cards on tool and guide pages.
- Breadcrumbs (visible + BreadcrumbList JSON-LD) on tools and guides.

## Structured data policy (no fake schema)

- `WebApplication` on calculator pages — they genuinely are interactive applications; free offer.
- `FAQPage` only where visible FAQ content exists on the page (it does — rendered Q&A sections).
- `Article` on guides with real `dateModified`; author = Organization (no invented experts).
- `BreadcrumbList` matching the visible breadcrumb.
- No Review/AggregateRating (nothing rated exists — adding it would violate guidelines).

## Sitemap / robots

- `sitemap.ts` enumerates only real, indexable URLs (no tag pages, no params, no empty cats).
- `robots.ts` allows everything; sitemap referenced. No crawl-trap paths exist (static site).

## Internal linking model

- Tool → related tools + relevant guide (every calculator page).
- Guide → primary tool CTA mid-body + tools list at end + related guides.
- Category pages ↔ tools ↔ guides (hub-and-spoke, two spokes at launch).
- Footer links all tools + categories + guides + legal (crawl paths everywhere, depth ≤ 3).

## E-E-A-T

- Methodology page (`/about`) explaining formula sources and limits.
- Every tool lists formulas, assumptions, limitations; ranges labeled as heuristics.
- Review date on guides; visible correction channel (`/contact`).
- No invented authors, credentials, or statistics.

## Measurement plan (post-launch)

1. GSC: submit sitemap; watch tool pages for query data at 2–4 weeks.
2. Prioritize Phase 2/3 pages by: impressions with avg pos < 20 (low-hanging), and PAA terms
   not covered.
3. Watch markup-vs-margin guide vs tool query overlap for cannibalization (guard documented
   in keyword-map).
