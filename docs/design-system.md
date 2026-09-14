# Design System — RateCraft ("Job-sheet precision")

> Updated: Phase 1. Implemented in `src/styles/globals.css`; fonts via `next/font`
> (Libre Franklin + Source Serif 4, self-hosted).

## Concept

Contractor paperwork as product language: estimate sheets, spec tables, job binders.
Warm paper background, ink-dark blue-carbon text, one action blue, hairline rules,
small radii, tabular numerals everywhere numbers matter.

## Competitive patterns rejected

Gradients/glassmorphism · purple SaaS · pill buttons · emoji icons · Inter/Roboto ·
dashboard layouts · everything-in-a-card.

## Palette (tokens in `:root`)

| Role | Token | Value |
|---|---|---|
| Page background | `--color-bg` | `#f6f5f1` warm paper |
| Surface (cards/header/footer) | `--color-surface` | `#ffffff` |
| Alt surface (table heads, code) | `--color-surface-alt` | `#efede7` |
| Sunken surface | `--color-surface-sunken` | `#e9e7e0` |
| Body text | `--color-ink` | `#1c2530` blue-carbon |
| Secondary text | `--color-ink-soft` | `#4a5764` |
| Helper text | `--color-ink-faint` | `#7d8a96` |
| Hairlines | `--color-border` | `#dcd8cd` |
| Strong borders | `--color-border-strong` | `#b9b3a4` |
| Primary / brand / action | `--color-accent` | `#164a8c` |
| Primary hover | `--color-accent-hover` | `#0f3a70` |
| Result wash | `--color-accent-soft` | `#e7eef8` (+ `--color-accent-border`) |
| Success | `--color-success` | `#1c6b45` |
| Warning | `--color-warning` | `#8a5a12` |
| Danger | `--color-danger` | `#a33127` |

Blue is reserved for actions, brand and result emphasis — never large surfaces.

## Typography

- **Libre Franklin** (`--font-franklin` via next/font) — UI, headings, calculator panels.
- **Source Serif 4** (`--font-source-serif`) — guide body text only (`.guide-body`).
- Scale: display `clamp(2.1–3rem)` / h1 `1.75–2.35` / h2 `1.3–1.6` / h3 `1.12` / body `1rem`
  / small `0.875` / label `0.8`.
- `font-variant-numeric: tabular-nums` on: results, tables (`td.num`), inputs, math flow.

## Spacing / shape

4px scale (`--space-1..9`). Radii 4/6px only. Shadows: one card shadow + one focus ring.

## Components (implemented)

| Class | Use |
|---|---|
| `.btn` + `-primary/-secondary/-ghost` | actions; press feedback, 120ms transitions |
| `.site-header` / `.main-nav` / `.mobile-details` | sticky header; ≥768px inline nav; <768px `<details>` menu (no JS) |
| `.card`, `.card-pad`, `.card-link` | white bordered panels; link cards tint border on hover |
| `.result-panel`, `.result-label`, `.result-primary` | the calculator "star": accent wash, big tabular headline |
| `.field`, `.input-affix` | labeled inputs with `$ / % / hrs` affixes, hints, focus ring |
| `.math-flow`, `.math-step` | "show the math" chain: Cost → Overhead → Markup → Price → Profit |
| `table` + `.num`, `.total-row` | worksheet tables; right-aligned tabular numbers; bold totals row |
| `.callout`, `.callout-warning` | formula/rules notes; no-profit alerts |
| `.badge`, `.eyebrow` | section labels and metadata |
| `.tool-card`, `.tool-icon` | homepage/hub cards with consistent line icons |
| `.hero` (paper grid lines), `.chain-section` | homepage identity bands |
| `.guide-body`, `.guide-meta` | serif reading experience with ruled H2s |
| `.site-footer`, `.footer-grid` | 5-column product footer; 3-col <900px; 2-col <560px |

## Homepage-specific components (Phase 2)

| Class | Use |
|---|---|
| `.hero-grid` / `.hero-sub` | hero split (copy + estimate card), stacks <900px |
| `.estimate-card` (+ `-head/-row/-strong/-foot`) | the estimate worksheet visual — hero and worked example |
| `.split-2col` / `.check-list` | problem section columns |
| `.why-item` | differentiation cards with accent top rule |
| `.trade-chips` | audience badges |
| `.final-cta` | closing conversion band |
| `.section` | consistent vertical rhythm between homepage sections |

## Calculator system patterns (Phase 3)

| Component/Class | Use |
|---|---|
| `YourCalculation` | formula in symbols + the user's live numbers substituted and solved |
| `ResultActions` | Copy result (Clipboard API + fallback, live confirmation) + Print |
| `Field` error state | `.field-error` (red, `role="alert"`), `aria-invalid` red border |
| `LiveRegion` | `aria-live` result announcement on every calculator |
| `.result-actions` | action row inside the result panel |
| Print CSS | header/footer/actions hidden; `.print-only` date+disclaimer header; worksheet-clean output |

## Iconography

`src/components/icons.tsx`: single-style 1.6px stroke line icons (blueprint feel) drawn for
this project — markup bars, percent, worksheet, hard hat, clock, layers, scale, compass,
arrow. No emoji, no icon libraries.

## Logo

Original "quote ladder" mark (rising bars + price tick on a baseline rule, rounded square).
Works without wordmark; same SVG is the favicon (`src/app/icon.svg`).

## Responsive

- ≥768px: desktop nav, 2-col calculator layout (`grid-2`), multi-col cards.
- <768px: single column, Menu button, stacked math-flow (wraps).
- Footer: 5 → 3 → 2 columns at 900px/560px.
- Verified at 375/768/1024/1440.

## Accessibility

Skip link → `#main` landmark · every input labeled, hints via `aria-describedby` ·
`aria-live` result announcements · `role="alert"` on no-profit condition · visible
`:focus-visible` rings · `prefers-reduced-motion` kills transitions · math chain exposed as
`role="img"` with text summary.
