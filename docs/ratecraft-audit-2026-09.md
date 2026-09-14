# RateCraft — Full Critical Audit (Pre-Domain Decision)

> Date: September 14, 2026. Scope: decide whether RateCraft deserves a domain, deployment
> and continued investment as an AdSense project for the US market.
> Method: full project inspection (26 indexable URLs, 8 calculators, 7 guides, all docs),
> live SERP research, workspace comparison, and published 2025–2026 industry data where
> citable. **Nothing below is invented; unverifiable items are marked.**
> **No code was modified during this audit.**

---

# PART I — WHAT RATECRAFT IS

## 1. Project state (verified)

- Next.js + TypeScript, App Router, 34 static pages, 103 kB shared JS, zero runtime deps
  beyond Next/React. 8 client-side calculators, 7 guides, 9 static pages. Full design
  system, print styles, a11y (aria-live, focus-visible, skip link), schema validated
  programmatically, 105/105 math assertions. Phase 0–6 documentation complete.
- Technical quality: genuinely high. This is not the risk. The risk is the market.

## 2. The real niche (not "calculator website")

**Market:** pricing/costing decision support for owner-operators and very small residential
service businesses in the US (plumbing, electrical, HVAC, handyman, painting, landscaping,
remodeling).

**User:** the person who both owns the business and prices the jobs — searching things like
"contractor markup calculator", "how much should I charge for a service call", "labor
burden calculator". They are a *business buyer* audience: FSM software, invoicing,
insurance, accounting, banking all advertise to them.

**Economic problem solved:** underpricing (busy but broke) and pricing fear. The answer
has real dollar value, which is why the SERP is full of commercial software players.

**Search intent mix:** tool (compute), informational (learn), commercial (compare
methods/software). RateCraft covers tool + informational; it deliberately does not chase
software-comparison intent.

**Does the niche have what AdSense needs?** Yes on the fundamentals: US audience (highest
AdSense RPM geography), business-finance-adjacent topic with real advertiser demand,
recurring question patterns (every trade, every pricing concept), and room for genuinely
distinct pages. The weak point is *volume*: this is a professional micro-niche, not a
consumer one. Contractors are a small share of the population, and pricing questions are
occasional, not daily habits.

---

# PART II — MARKET ANALYSIS

## 3. Segment classification (US)

| Segment | Class | Reasoning |
|---|---|---|
| General contractors / remodelers | **A** | Highest pricing complexity, most markup/margin confusion, biggest ticket sizes → highest advertiser value; searches match our core tools |
| HVAC / plumbing / electrical service | **A** | Flat-rate pricing culture (price books), service-call economy, established advertiser bidding on these pros |
| Handyman / solo operators | **B** | High search volume for hourly-rate/how-much-to-charge, but lower ticket → lower commercial value |
| Painting / landscaping | **B** | Real pricing pain, seasonal; good long-tail, thin high-value intent |
| Roofers | **C** | Job-estimating intent is homeowner-dominated (we rejected those SERPs in Phase 1); roofer-specific *business* intent exists but is narrow |
| Commercial construction | **D** | Estimating there is software + Dedicated teams; not our product, not our SERP |

## 4. Competitive landscape (live SERP research, September 2026)

Direct SERP for "contractor markup calculator" (checked): Omnicalculator (DR very high),
busybusy (FSM software, 1,700+ review ratings visible), Harvest (major SaaS brand),
buildwithdave, SubcontractorHub, Contractor Growth Network, InvoiceOwl, Enerpize, GrowZbl.
**Ten results, and nine of them are software companies with domains far older and more
authoritative than anything we can launch.** This pattern repeats across labor burden,
overhead, hourly rate, flat rate SERPs (ServiceTitan, Housecall Pro, FieldEdge,
ConstructionCoverage, eBacon…).

**Honest read:** the calculators face *brand-dominated, software-funnel SERPs*. The
existing players' tools are thin (2–4 inputs, no math shown) — that's real and documented
in our Phase 4 research — but thin competitors with high authority still beat deep tools
with zero authority in most cases.

**Where the gap is actually plausible:** the informational/decision layer (how-to guides,
conversion explainers, decision pages) is served by software blogs whose content exists to
funnel to sales pages — and by 2025–2026 these pages face AI Overview compression (see §8).
The minimum-charge / service-call / flat-rate-vs-hourly cluster showed forum-quality
competition (Mike Holt threads, Reddit) — the weakest SERPs we found.

**NO VERIFICABLE CON LOS DATOS DISPONIBLES:** exact backlink profiles, domain authority
scores, and traffic volumes of competitors (would require Ahrefs/Semrush access).

## 5. Per-calculator competitive table

(Demand/competition are qualitative SERP-based judgments, not volumes. CPC potential is an
inference from advertiser presence, NOT a measured CPC — **NO VERIFICABLE CON LOS DATOS
DISPONIBLES** without keyword-tool access.)

| Tool | Demanda | Competencia | CPC potencial* | Intención comercial | Potencial SEO | Potencial AdSense | Dificultad | Mantener |
|---|---|---|---|---|---|---|---|---|
| Markup Calculator | media-alta | Muy alta (Omnicalculator, Harvest, busybusy…) | medio-alto | alta | bajo-medio | medio | Alta | ✅ (core) |
| Margin Calculator | media | Alta (mismos dominios) | medio | alta | bajo | medio | Alta | ✅ (core) |
| Job Pricing Calculator | baja-media | Media (fragmentada) | medio-alto | alta | **medio** | medio-alto | Media | ✅ (diferenciado) |
| Labor Burden Calculator | media | Alta (eBacon, ConstructionCoverage, ToolGrit) | alto (payroll/insurance advertisers) | alta | bajo | **alto** | Alta | ✅ |
| Hourly Rate Calculator | media | Media-alta (ADP/QuickBooks en SERPs afines) | medio | media | bajo | medio | Alta | ✅ (solo-operator angle) |
| Overhead Calculator | baja | Media | medio | media | medio | medio | Media | ✅ |
| Break-Even Calculator | media | Alta (genéricas financieras fuertes) | medio | baja (genérica) | bajo | bajo-medio | Alta | ⚠️ mantener como soporte del sistema, no como apuesta de tráfico |
| Flat Rate Calculator | media | **Baja-media** (lead-gen tools thin; foros) | **alto** (FSM software bids aggressively) | alta | **medio-alto** | **alto** | **Media** | ✅ (mejor apuesta) |

Key takeaway: the two tools with the best odds are the two we built most recently — flat
rate (weakest SERP, strong commercial intent) and job pricing (fragmented SERP). The
generic markup/margin SERPs are the hardest and should be treated as long shots.

## 6. Guides assessment

All 7 guides target queries where the current SERP is software-marketing blogs or forums;
each has a worked-example backbone verified by tests, attributed market figures only where
citable, and real tool pairing. Risks: none is thin content; but none has *earned* any
ranking signal yet. Guides are the most defensible asset (they can rank in long-tail
without brand strength sooner than tool pages can) and simultaneously the most exposed to
AI Overview click compression.

- markup-vs-margin: strong, evergreen, defensible. Keep.
- how-to-price-a-job: pillar-quality. Keep.
- labor-burden guide: good; competes with well-funded content. Realistic long shot.
- general-contractor-markup: differentiated method angle. Good.
- flat-rate-vs-hourly, minimum-service-charge: **best guide bets** (weakest SERPs).
- how-to-write-an-estimate: crowded by template sites; medium odds.

## 7. Content ceiling — how many real pages does this niche support?

Conservative inventory of genuinely-distinct pages (no find-replace trades):

- **Tier 1 (must exist):** the current 8 tools + 7 guides = 15. Plus ~3 more tools already
  justified by research (service-call/quote builder, sales-tax-on-jobs explainer tool,
  estimate-vs-invoice page) and ~4 more guides (job profitability review, construction
  bids, quoting follow-up, material pricing volatility). → **~22 pages of real value.**
- **Tier 2 (strong if demand shows):** per-trade pricing *angles* ONLY where inputs and
  examples genuinely differ (flat-rate for HVAC ≈ plumbing is already borderline), a
  glossary (10–15 terms), comparison pages (estimating software categories — commercial
  intent). → **+15–25 pages max.**
- **Tier 3 (only on GSC evidence):** long-tail problem pages. Unbounded but demand-gated.
- **DESCARTAR:** per-trade duplicates of existing guides, "X calculator for
  electricians/plumbers" series, city pages, any page whose body survives a
  find-replace test.

**Realistic ceiling: a strong 40–70 page site, not a 500-page one.** Anyone promising more
is describing filler.

## 8. The structural risk nobody should ignore: AI Overviews

Verified published data (2025–2026): AI Overviews appear in a large and growing share of
queries (one 2026 industry analysis: 13% of queries tracked in March 2026, others ~48% of
searches; Seer Interactive measured organic CTR on AIO queries falling from 1.76% to
0.61% during 2025; informational how-to queries reported 30–61% CTR declines). "How to
calculate X" is exactly the query type AI Overviews answer inline.

**Implication:** the informational layer's expected CTR must be discounted heavily. Tool
queries ("calculator") historically retain clicks better — users searching a calculator
want to *use* one — which shifts the strategic weight further onto the 8 tool pages and
away from the guides. This is the single biggest external threat to the plan and favors
sites where the interactive tool is the product.

## 9. Semantic / topical-authority verdict

With 26 pages in one tightly-linked cluster, RateCraft *reads* as a topical authority in
embryo — the chain architecture (labor→burden→overhead→margin→price→profit) is a genuine
structure, not a blog. But authority is demonstrated to Google through links and clicks,
which a new domain has none of. **Today it is a very well-organized collection of
calculators with a coherent spine. It becomes an authority only if/when queries and links
say so. NO VERIFICABLE CON LOS DATOS DISPONIBLES how fast that transition happens.**

---

# PART III — MONETIZATION

## 10. AdSense candidacy

🟡→🟢 **Buen candidato, con una condición (volumen).** Original utility content ✓, clear
purpose ✓, US audience ✓, business-finance adjacency ✓, clean UX with sane ad slots ✓,
legal pages ✓, no thin/mass content ✓. The blocker is not quality — it's that AdSense
approval reviews want to see a real site (achievable now) while *revenue* wants volume
(that takes 6–12 months of SEO). Note: no CMS/comments/author-bios fake signals — that's
fine, but the About/methodology transparency we have is the right substitute.

## 11. Revenue scenarios (scenarios, NOT predictions)

RPM ranges are deliberately wide because **NO VERIFICABLE CON LOS DATOS DISPONIBLES** for
this exact niche without running ads. Business/finance-adjacent US traffic is commonly
reported in the $10–30+ RPM band by ad-market commentary, while generic calculator traffic
is often far lower ($2–10). Assume blended **$5–20 RPM** and treat the low end as base
case until real data exists:

| Pageviews/mo | Pesimista ($4 RPM) | Realista ($10) | Bueno ($18) | Excelente ($30) |
|---|---:|---:|---:|---:|
| 1,000 | $4 | $10 | $18 | $30 |
| 5,000 | $20 | $50 | $90 | $150 |
| 10,000 | $40 | $100 | $180 | $300 |
| 25,000 | $100 | $250 | $450 | $750 |
| 50,000 | $200 | $500 | $900 | $1,500 |
| 100,000 | $400 | $1,000 | $1,800 | $3,000 |

**The number that matters:** at realistic RPM, RateCraft needs ~20–50k pageviews/month to
produce meaningful income (hundreds of $/mo) and ~100k+ to be life-changing. Calculator
pages are low-pages-per-session (user gets answer, leaves) — expect ~1.1–1.5 pages/session,
which the table already reflects since it counts pageviews.

## 12. Commercial value beyond AdSense

This audience is worth more than the ads. Advertisers actively bidding at these searches:
FSM/estimating software (Jobber, ServiceTitan ecosystem, Housecall Pro), invoicing
(InvoiceOwl etc.), payroll (Gusto/QuickBooks — labor burden pages), business insurance
(nextinsurance ranks with content!), banking/fintech. Affiliate/sponsored potential is
real *later*; flagged only as optionality, not a plan change. If organic traffic
materializes, RPM upside via premium ad networks (Ezoic/Mediavine/Raptive tiers) exceeds
raw AdSense.

---

# PART IV — BRAND, UX, EXECUTION RISKS

## 13. Branding: **RateCraft — 7.5/10**

Pros: short, pronounceable, professional, plausible US B2B feel, expandable beyond
calculators (rates → pricing intelligence), no obvious confusion with major existing
brands in this space (**not exhaustively trademark-searched — NO VERIFICABLE**). Cons:
"Rate" evokes finance more than trades; slightly generic startup-ish; doesn't say
"contractor". Verdict: good enough to launch; the site's quality is the brand.

## 14. Design/UX brutal honesty

Verified visually across phases: this looks like a focused professional tool product
(job-sheet aesthetic, real typography, worksheet tables), NOT a generic calculator farm.
A US contractor would take it seriously; nothing screams template or AI-slop. Weakness:
visual minimalism means the site relies on typography trust rather than imagery — fine for
this audience. 8.5/10 UX.

## 15. Differentiation — real or copyable?

"Show the math" + burdened-labor correctness + margin-not-markup discipline + connected
chain is a **real product advantage today** (verified: competitor tools are thin funnels).
But it is **copyable in weeks by any competitor who cares** — the moat is not the feature,
it's the accumulated content, verified examples, and eventual authority. Expect
imitation if any page ranks. Doesn't change the launch decision; changes the urgency
(gaining rankings before the niche gets more crowded has mild value).

## 16. Ranking barriers (severity)

| Barrier | Severity |
|---|---|
| Zero backlinks/authority (new domain) | **CRÍTICO** |
| Tool SERPs dominated by high-authority software brands | **CRÍTICO** |
| AI Overviews compressing informational CTR | **ALTO** |
| Small absolute niche volume (professional micro-niche) | **ALTO** |
| No link-attraction assets yet (no data studies, no free embeddables) | ALTO |
| E-E-A-T for YMYL-adjacent money content (no verifiable authors/experience) | MEDIO |
| Calculator-only pages give few "linkable" formats | MEDIO |
| Technical SEO | BAJO (already clean) |

## 17. Realistic timeline for a NEW domain (conservative ranges; sandbox effects reported
at 3–12 months in current industry discussion — NO VERIFICABLE case-by-case)

| Milestone | Honest estimate | Requires |
|---|---|---|
| Indexed | weeks | deploy + GSC |
| First impressions | 1–3 months | nothing more |
| First clicks | 2–5 months | long-tail guides start hitting |
| 100 visits/mo | 4–8 months | several pages on page 2→1 |
| 500 visits/mo | 8–14 months | flat-rate + job-pricing tools crack top 5 for mid-tail |
| 1,000 visits/mo | 10–18 months | consistent top-5 presence + some links |
| 5,000 visits/mo | 18–30 months, **uncertain** | authority transition + link acquisition |
| 10k–50k visits/mo | **NO VERIFICABLE** — possible but would require the site becoming THE niche reference; most sites never get here |

## 18. Domain decision

🟢 **SÍ, pero con condiciones.** The build is done and excellent; its carrying cost is a
~$10–15/yr domain + free Vercel hosting. The option value of having the finished asset
indexed and collecting real GSC data vastly exceeds the cost, and 6 months of real Search
Console data converts this entire audit from speculation into measurement. The conditions
are the abandonment criteria (§23) and the launch checklist (§24).

## 19. Workspace comparison

(Only what inspection supports; traffic/revenue of the others are **NO VERIFICABLE**.)

| Proyecto | Nicho | SEO dificultad | AdSense fit | CPC potencial | Escalabilidad | Valoración |
|---|---|---|---|---|---|---|
| **RateCraft** | contractor pricing tools (US, EN) | media-alta pero SERPs fragmentadas en clusters | alto (B2B adjacency) | medio-alto | media (40–70 páginas reales) | **mejor riesgo/recompensa del workspace** |
| CreditWise | credit (US, EN) | **altísima** (YMYL, big-finance SERPs) | alto | alto | alta | mayor techo, menor probabilidad |
| TechTools | herramientas genericas | alta (omnicalculator et al.) | medio | bajo-medio | alta | commodity trap |
| Hogar Resuelve | hogar DIY (ES) | media | bajo-medio (RPM ES ≪ US) | bajo | media | OK pero monetariamente inferior |
| Combustible Málaga | local combustible (ES local) | baja (local) | bajo (volumen minúsculo) | bajo | muy baja | no comparable como negocio ads |
| SoftCompara | comparador (ES) | alta (YMYL-adjacent, comparador SERPs) | medio | medio | alta | requiere datos/producto serio |

Conclusion: RateCraft is the best *probability-adjusted* AdSense bet in the workspace
because it pairs US traffic value with the weakest competitive SERPs (flat-rate cluster)
and a finished product. CreditWise has the higher ceiling but fights the hardest SERPs on
the internet with a brand-new domain.

---

# PART V — SCORES, RISKS, PLAN

## 20. Scores (0–100)

| Factor | Score | Weight |
|---|---|---|
| SEO técnico | 90 | — (doesn't win rankings by itself; low weight) |
| Contenido/calidad | 85 | 15% |
| Diferenciación | 75 | 15% |
| E-E-A-T estructural | 70 | 10% |
| UX/Diseño | 85 | 10% |
| Branding | 75 | 5% |
| Demanda/nicho | 55 | 15% |
| Competencia (favorabilidad) | 45 | 15% |
| AdSense fit | 80 | 10% |
| **Escalabilidad de contenido** | **50** | **5%** |
| **Viabilidad dominio nuevo (ranking odds)** | **40** | — (the weighted crux) |

Weighted global: **≈65/100** — quality is not the question; market odds are.

## 21. Risk matrix

| Riesgo | Prob. | Impacto | Prioridad | Mitigación |
|---|---|---|---|---|
| No conseguir tráfico en 12 meses | media-alta | alto | **CRÍTICA** | criterios de abandono (§23); coste base ~$15/yr limita daño |
| Tool SERPs inalcanzables (marcas) | alta | alto | ALTA | apuesta primaria en clusters débiles (flat-rate, service-call); tools como red, no como apuestas individuales |
| AI Overviews reducen CTR de guías | alta | medio | ALTA | peso estratégico en tools; guías con datos/ejemplos que AIO no replica |
| Volumen de nicho pequeño | media | medio | MEDIA | ampliar a Tier 2 solo con GSC data |
| RPM bajo | media | medio | MEDIA | premium network cuando el tráfico lo permita; afiliación como opción |
| Thin/mass-content risk futuro | baja (si se respetan reglas) | alto | MEDIA | reglas §22 |
| Sin backlinks | alta | alto | ALTA | assets enlazables: calculadoras embebibles, tablas citables |
| Dependencia de calculadoras | media | medio | MEDIA | mezclar formats (datos, tablas, guías) |
| E-E-A-T money-content | media | medio | MEDIA | metodología, ejemplos verificables, disclaimers (ya existen) |

## 22. Rules against content drift (binding for future phases)

CREATE: pages where (a) the input set or the decision differs materially from existing
pages, (b) a worked example can be verified, (c) a tool pairing exists.
NEVER CREATE: "X for [trade]" unless inputs differ; "X calculator" duplicates; city/local
pages; roundups without data; any page passing the find-replace test.

## 23. Abandonment criteria (objective)

At each checkpoint, using GSC on the production domain:
- **Month 6:** if impressions are flat/declining for 3 consecutive months AND zero pages
  have any page-1 impressions → stop investing; keep site parked (cost ≈ $0).
- **Month 12:** if total clicks < 50/month AND no more than 2–3 keywords with average
  position < 20 → declare the thesis failed; redirect effort to another workspace project.
- **Month 18:** if clicks < 250/month (insufficient for meaningful AdSense at any
  realistic RPM) → stop content production; monetize passively or repurpose.
These thresholds are conservative on purpose: they detect *absence of signal*, not
slowness. Any single page ranking top-5 for a meaningful keyword invalidates the
abandonment check at that date.

## 24. Pre-launch changes

**MUST FIX (before domain purchase):**
1. None blocking — the site is technically launch-ready. (The footer 8-tool fix and
   indexability guard were already applied in Phase 6.)

**SHOULD FIX (first 30 days post-launch):**
2. AdSense application only after ~10–15 pages are indexed and GSC shows impressions —
   applying from day one wastes the first review.
3. Add one link-attraction asset: the calculators as embeddable widgets (iframe/code
   snippet) — the only realistic backlink mechanism this niche offers.
4. GSC + an analytics choice from day 1 (we deliberately have none yet).

**NICE TO HAVE:** OG per-page images; guide schema enhancements; email capture (no — see
§25).

## 25. "NO HARÍA ESTO" (explicit)

- NO crear trade-pages (electrician-pricing etc.) sin diferenciación real de inputs.
- NO perseguir "roofing estimate / painting cost" (homeowner SERPs, ya rechazadas en
  Phase 1 con razón).
- NO crear 30 guías "how to calculate X" — AI Overviews están comiendo ese clic.
- NO añadir calculadoras fuera de la cadena pricing (p.ej. concrete/voltage-drop): serían
  commodity SERPs peores.
- NO signup/newsletter/email-gates en fase inicial (fricción sin audiencia).
- NO app móvil / PWA pesada / base de datos / cuentas de usuario — complejidad sin
  retorno AdSense.
- NO comprar backlinks ni intercambios masivos.
- NO publicar más de ~2–4 páginas/mes: el cuello de botella es autoridad, no contenido.

## 26. Realistic 6-month plan

- **Mes 1:** dominio + Vercel + GSC; indexar; verificar cobertura; AdSense readiness final
  (no aplicar aún); empezar a medir. Publicar 0 páginas nuevas.
- **Mes 2:** primer dato GSC real; arreglar lo que los datos digan; embeddable widgets
  (SHOULD FIX #3); 2 guías Tier-1 restantes (job profitability, bids).
- **Mes 3:** aplicar a AdSense con el sitio ya indexado y con impresiones; optimizar
  titles/CTR de las páginas con impresiones (GSC data); 1–2 páginas Tier-2 elegidas por
  queries reales.
- **Mes 4:** primer contenido guiado por GSC (double-down en lo que muestre posiciones
  5–15); evaluar premium ad network options si RPM data lo justifica.
- **Mes 5:** links outreach mínimo (citar fuentes citables: nuestras tablas verificadas);
  actualizar guías con datos nuevos.
- **Mes 6:** **checkpoint de abandono #1** (§23). Decisión basada en impresiones, no en
  esperanzas.

## 27. Final scoring recap

Potencial SEO 6/10 · Potencial AdSense 7/10 · Competencia 4.5/10 · Demanda 5.5/10 ·
Diferenciación 7.5/10 · Escalabilidad 5/10 · Riesgo 5/10 (riesgo financiero casi nulo,
riesgo temporal alto) · **Potencial global 6.5/10.**

---

# 28. CONCLUSIÓN EJECUTIVA

## ¿RateCraft tiene futuro como proyecto AdSense?

**Sí, condicionalmente.** Es el proyecto mejor ejecutado del workspace y el único cuyo
cuello de botella es el mercado y no el producto. El nicho es pequeño pero real, con
anunciantes que pagan por esta audiencia y varios clusters SERP genuinamente débiles
(flat-rate, service-call, job-pricing). En contra: SERPs de tools dominadas por marcas de
software, AI Overviews comprimiendo el CTR informativo, y un dominio nuevo sin autoridad.
A favor: coste de continuación ≈ $15/año, producto terminado de calidad superior a lo que
posiciona hoy, y 6–12 meses de datos GSC reales que convierten esta decisión especulativa
en medible.

El escenario esperado honesto: **un sitio de $50–500/mes en el mejor caso a 18–24 meses,
con probabilidad significativa (no cuantificable) de quedarse en $0–50/mes.** No es un
negocio que reemplace ingresos; es una apuesta de coste casi nulo con upside real.

# VEREDICTO

🟢 **LANZARÍA, PERO CON CAMBIOS** — los cambios no son de producto sino de proceso:
comprar dominio barato, desplegar, medir desde el día 1, aplicar a AdSense con el sitio ya
indexado (no antes), y someterse a los criterios de abandono objetivo de §23 sin
excepciones. Lo que NO haría es invertir un solo mes más de desarrollo *antes* de tener
datos de Search Console: la siguiente unidad de inversión más barata y más informativa es
el dominio, no más código.
