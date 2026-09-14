# Product Differentiation — RateCraft

## The chosen differentiator

**"Show the math" pricing chain.** Every competitor's calculator gives you a number without
the reasoning. RateCraft's identity is:

1. **Formulas on the page** — every result names the formula and assumption behind it.
2. **The markup↔margin conversion built into the flagship tool** — the most expensive common
   mistake in contractor pricing, resolved inside the calculator, not in a separate blog post.
3. **A connected tool chain** — labor burden → job cost → price → margin mirrors how the
   decisions actually cascade. Tools cross-link at the point of decision.
4. **Trades-native inputs** — burdened rates, workers' comp, non-billable hours, subs, dump
   fees — not generic "revenue" and "COGS".

## Features evaluated and decisions

| Idea | Decision | Why |
|---|---|---|
| Formula transparency on every tool | ✅ Built (Phase 1) | Core identity; cheap to maintain; builds trust |
| Markup↔margin conversion table | ✅ Built | Directly differentiating; nobody embeds it in the tool |
| Billable-hours adjustment in labor burden | ✅ Built | Rare among competitors; materially changes the answer |
| Recommended price priced to margin (÷ method) | ✅ Built | Most tools multiply by (1+markup) and underprice — we show the correct division |
| Target-margin "what if" inside margin calc | ✅ Built | Answers the actual question ("what should I charge?") |
| Add/remove cost rows (overhead calc) | ✅ Built | Real businesses have odd cost lines |
| Plain-language explanation of each result | ✅ Built | Differentiates from bare number outputs |
| Export/print results | ⏸ Deferred | Adds JS surface; revisit when users ask (no data yet) |
| Local history of calculations | ⏸ Deferred | Privacy-clean now; localStorage adds consent/complexity — wait for signal |
| AI-style "explanation generator" | ❌ Rejected | Gimmick risk, content quality risk, no reliability |
| Account saving / projects | ❌ Rejected | Requires backend; against Phase 1 simplicity |
| Comparison of pricing models (T&M vs flat vs fixed) | 📋 Phase 3–4 | Good content/tool hybrid, needs research first |

## What we deliberately do NOT do

- No signup walls, no email gates, no demo funnels.
- No dark patterns, no fake urgency, no invented statistics.
- No mass-generated calculator pages for keywords that don't deserve a tool.
