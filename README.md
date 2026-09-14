# RateCraft

Free pricing, estimating and profit calculators for contractors and service businesses — with the math explained on every page.

Built with Next.js (App Router) + TypeScript. Static-first, no database, no backend.

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build (all pages statically generated)
npm run lint
npm run typecheck
```

## Project structure

```
src/
  app/                 # Routes (App Router)
    page.tsx           # Homepage
    calculators/       # Calculator hub + [slug] tool pages
    [category]/        # pricing / costs category pages
    guides/            # Guides hub + [slug] articles
    about|contact|privacy|terms|cookies|disclaimer/
    sitemap.ts robots.ts manifest.ts icon.svg
  components/
    Header.tsx Footer.tsx Logo.tsx Breadcrumbs.tsx AdSlot.tsx
    calculator/        # Reusable Field, ResultRow
    calculators/       # One component per calculator
    GuideBlocks.tsx
  lib/
    site.ts            # Site config + tool registry (single source of truth)
    guides.ts          # Guide registry (typed content blocks)
    format.ts          # Currency/percent formatting
  styles/globals.css   # Design tokens + base styles
docs/                  # Strategy & research documents
```

## Adding a new calculator

1. Add a `Tool` entry to `src/lib/site.ts` (metadata, formulas, FAQs, related links).
2. Create the client component in `src/components/calculators/`.
3. Register it in the `calculators` map in `src/app/calculators/[slug]/page.tsx`.

Metadata, sitemap, schema, breadcrumbs and footer links update automatically.

## Adding a guide

Add a `Guide` entry to `src/lib/guides.ts` (typed blocks: paragraphs, tables, callouts, tool CTAs). Routing, schema and index pages are generated.

## Configuration

Copy `.env.example` to `.env.local`:

- `NEXT_PUBLIC_SITE_URL` — canonical URL (required in production)
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — optional, GA4
- `NEXT_PUBLIC_ADSENSE_ENABLED` + `NEXT_PUBLIC_ADSENSE_CLIENT` — optional; ads render only when both are set. The site is fully usable with ads off (default).

Never commit `.env.local`.

## Documentation

See `docs/` for keyword research, competitor analysis, SEO strategy, design system, differentiation, content strategy, AdSense readiness and the roadmap.
