# AdSense Readiness Checklist — RateCraft

> Honest checklist. "✅" = done and verified in the repo. "⚠️" = needs a real-world step only
> you can do (domain, deployment, identity). Nothing here claims a guarantee of approval.

## Content

- [x] Sufficient original content: 7 tool pages + 2 in-depth guides + hub/about pages (~15 substantial pages)
- [x] Content is original — written for this project, no scraped/AI-spun filler
- [x] Clear purpose per page: each answers a specific trades question or calculation
- [x] No thin pages: every indexable URL has real content (verified against sitemap)
- [x] No mass-generated pages: 7 tools, each justified in keyword-map
- [x] No duplicate-intent pages: cannibalization guards in keyword-map

## Navigation & UX

- [x] Header nav (categories + guides + about), footer (all tools, categories, guides, legal)
- [x] Breadcrumbs on tools/guides
- [x] Mobile-first calculator layout (single column < 640px, large touch targets)
- [x] Keyboard accessible, visible focus states, labeled inputs
- [x] Custom 404
- [ ] ⚠️ Human pass on real device after deployment

## Legal & trust (required by AdSense policies)

- [x] Privacy Policy — describes actual data practices (none/minimal), AdSense disclosure written
- [x] Cookie Policy — states no cookies today; ads/consent plan documented
- [x] Terms of Use
- [x] Disclaimer (estimates ≠ professional advice)
- [x] About & Methodology
- [x] Contact (⚠️ replace placeholder email with a real monitored inbox before applying)

## Technical

- [x] robots.txt (metadata route) — allows all, references sitemap
- [x] sitemap.xml (metadata route) — only real URLs
- [x] Canonicals on every page
- [x] Structured data: WebApplication, FAQPage, Article, BreadcrumbList — all matching visible content
- [x] Manifest + SVG favicon + theme color
- [x] Security headers (nosniff, referrer, frame, permissions)
- [x] Static generation; no client JS on legal/hub pages; calculators hydrate small client islands
- [ ] ⚠️ Run PageSpeed Insights after deploy (expect strong: no images, system-served fonts subset via next/font option)

## Ad implementation (when approved)

- [x] `AdSlot` component exists (client, lazy-loads script only when enabled)
- [x] Off by default — double env switch (`NEXT_PUBLIC_ADSENSE_ENABLED` + `_CLIENT`)
- [x] No fake publisher IDs anywhere
- [x] Placement plan: 1 horizontal after calculator, 1 in-content rectangle before FAQ; guides 1 in-content; no interstitials/anchors
- [x] Content never gated behind ads; site fully usable with ads off
- [ ] ⚠️ Add `ads.txt` at domain root with your pub ID after approval
- [ ] ⚠️ Enable consent mechanism (e.g., Google's Consent Mode / CMP) for EEA/UK traffic before serving personalized ads

## Application order (recommended)

1. Buy domain, deploy to Vercel, set `NEXT_PUBLIC_SITE_URL`.
2. Replace contact email; add ads.txt stub; verify in Search Console; submit sitemap.
3. Let the site index (1–2 weeks), fix anything GSC surfaces.
4. Apply to AdSense with the site live and stable.
