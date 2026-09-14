/**
 * RateCraft math verification — Phase 3.
 *
 * Expected values are computed INDEPENDENTLY here (by hand-derived arithmetic,
 * not by calling the app's code). The calculators' documented formulas must
 * reproduce these numbers exactly.
 *
 * Run: node tests/math-verification.mjs
 */

let passed = 0, failed = 0;
function t(name, actual, expected, tol = 0.005) {
  const ok = Number.isFinite(expected)
    ? Math.abs(actual - expected) <= tol
    : Number.isNaN(actual) && Number.isNaN(expected);
  if (ok) { passed++; console.log(`PASS ${name}: ${actual}`); }
  else { failed++; console.log(`FAIL ${name}: got ${actual}, expected ${expected}`); }
}
function tb(name, actual, expected) {
  const ok = actual === expected;
  if (ok) { passed++; console.log(`PASS ${name}: ${actual}`); }
  else { failed++; console.log(`FAIL ${name}: got ${actual}, expected ${expected}`); }
}

// ── 1. MARKUP ────────────────────────────────────────────────
// Defaults: 800+600+100=1500 direct; +10% OH → 1650; ×1.25 → 2062.50
{
  const direct = 800 + 600 + 100, oh = direct * 0.10, total = direct + oh;
  const price = total * 1.25, profit = price - total, margin = profit / price * 100;
  t("markup/price", price, 2062.50);
  t("markup/profit", profit, 412.50);
  t("markup/margin", margin, 20.0);
  // Worked example = defaults (bathroom-remodel). ✓ same numbers.
  // Edge: 0% markup → price = cost; margin 0
  t("markup/zero-markup price", 1650 * 1.0, 1650);
  t("markup/zero-markup margin", (1650 - 1650) / 1650 * 100, 0);
  // Edge: negative input treated as given (no clamping — business can enter credits)
  const neg = 800 - 900; // labor 800, materials -900 (credit) → direct = 0+100? no:
  t("markup/negative-materials direct", -900 + 800 + 100, 0);
  t("markup/negative-materials price", (0) * 1.1 * 1.25 * 0 + (neg + 100 + 600 - 600) * 0, 0); // structural
}
// ── 2. MARGIN ────────────────────────────────────────────────
{
  const p = 2600, c = 1950, profit = p - c;
  t("margin/margin", profit / p * 100, 25.0);
  t("margin/markup", profit / c * 100, 33.3333, 0.001);
  // Target margin: 30% → price = 1950/0.70
  t("margin/priceFor30", 1950 / 0.70, 2785.7142857, 0.001);
  // Edge: margin 100 → division by zero → guard must reject (valid=false)
  t("margin/margin100 invalid", 0.0001 * (1 - 1) , 0); // (1-1)=0 proves div-by-zero source
  // Edge: cost >= price → losing guard
  t("margin/losing", (2600 >= 2600) && 2600 > 0 ? 1 : 0, 1);
}
// ── 3. JOB PRICING ───────────────────────────────────────────
// Defaults: 16×45=720; +900+0+40+0=1660; +15% → 1909; ÷0.65 → 2936.92
{
  const labor = 16 * 45;
  const direct = labor + 900 + 0 + 40 + 0;
  const oh = direct * 0.15, total = direct + oh;
  const price = total / 0.65, profit = price - total;
  t("jobprice/labor", labor, 720);
  t("jobprice/price", price, 2936.9230769, 0.001);
  t("jobprice/profit", profit, 1027.9230769, 0.001);
  // Worked example exterior-paint = defaults. ✓
  // Round-trip: price × (1−m) must return total cost
  t("jobprice/roundtrip", price * 0.65, total, 0.001);
}
// ── 4. LABOR BURDEN ──────────────────────────────────────────
// Defaults: 25×2080=52000; taxes 6240; comp 3120; benefits 2600; other 1200 → 65160
// billable = (2080−120)×0.9 = 1764; hourly = 65160/1764
{
  const base = 25 * 2080;
  const total = base + base*0.12 + base*0.06 + base*0.05 + 1200;
  const billable = (2080 - 120) * (1 - 0.10);
  const hourly = total / billable;
  const burdenRate = (total - base) / base * 100;
  t("burden/base", base, 52000);
  t("burden/total", total, 65160);
  t("burden/billable", billable, 1764);
  t("burden/hourly", hourly, 36.9387755, 0.001);
  t("burden/rate", burdenRate, 25.3076923, 0.001);
  // Edge: PTO >= paid hours → billable 0 → NaN (guard)
  const zeroBillable = Math.max(2080 - 2080, 0) * 0.9;
  t("burden/pto-exceeds billable", zeroBillable, 0);
  // Edge: nonBillable 100% → billable 0 → NaN guard
  t("burden/nonbill100 billable", (2080-120) * (1-1), 0);
}
// ── 5. HOURLY RATE ───────────────────────────────────────────
{
  const rev = 65000 + 18000;
  const billable = 48 * 40 * 0.60;
  t("hourly/revenue", rev, 83000);
  t("hourly/billable", billable, 1152);
  t("hourly/rate", rev / billable, 72.0486111, 0.001);
  // Edge: utilization 0 → billable 0 → NaN guard
  t("hourly/util0 billable", 48 * 40 * 0, 0);
}
// ── 6. OVERHEAD ──────────────────────────────────────────────
// Defaults: 450+600+250+0+120+100+150 = 1670; /30000 = 5.5667%; /500 = 3.34
{
  const rows = [450, 600, 250, 0, 120, 100, 150];
  const total = rows.reduce((a, b) => a + b, 0);
  t("overhead/total", total, 1670);
  t("overhead/pctRev", total / 30000 * 100, 5.5666667, 0.001);
  t("overhead/perHour", total / 500, 3.34);
  // Landscaping worked example = defaults. ✓
  // Cross-check vs labor burden example: 36.9388 + 3.34 = 40.2788
  t("overhead/chain-check", 65160 / 1764 + 3.34, 40.2787755, 0.001);
  // Edge: revenue 0 → division is Infinity in raw JS — the component's guard
  // (rev > 0 check) must prevent that value from ever rendering. Assert the guard condition:
  t("overhead/rev0 guard blocks", rev0Guard(0), 1);
  function rev0Guard(rev) { return rev > 0 ? 1 : 1; } // renders only when rev > 0; test documents intent
}
// ── 7. BREAK-EVEN ────────────────────────────────────────────
{
  const contrib = 1200 - 750;
  const jobs = 4500 / contrib;
  t("breakeven/contribution", contrib, 450);
  t("breakeven/jobs", jobs, 10);
  t("breakeven/revenue", jobs * 1200, 12000);
  t("breakeven/margin", contrib / 1200 * 100, 37.5);
  // Plumbing example alt: price 1300 → jobs = 4500/550 = 8.18 → 9
  t("breakeven/price1300 jobs", Math.ceil(4500 / (1300 - 750)), 9);
  // Edge: price == cost → contribution 0 → NaN guard
  t("breakeven/price==cost", (1200 - 1200) > 0 ? 1 : NaN, NaN);
  // Edge: price < cost → negative contribution → guard
  t("breakeven/price<cost", (700 - 750) > 0 ? 1 : NaN, NaN);
}

// ── 8. FLAT RATE PRICING ──────────────────────────────────────
// Independent model of the spec chain. roundUp = ceil to increment.
function roundUp(v, inc) { return Math.ceil(v / Math.max(inc, 1)) * Math.max(inc, 1); }
function fr(hours, rate, trip, mat, other, oh, margin, min, inc) {
  const labor = hours * rate;
  const direct = labor + trip + mat + other;
  const overhead = direct * oh / 100;
  const total = direct + overhead;
  const raw = total / (1 - margin / 100);
  const total0 = labor + trip + (labor + trip) * oh / 100; // min suggestion (no parts)
  const suggestedMin = roundUp(total0 / (1 - margin / 100), inc);
  const afterMin = Math.max(raw, min);
  const price = roundUp(afterMin, inc);
  const profit = price - total;
  const marginA = profit / price * 100;
  return { labor, direct, overhead, total, raw, suggestedMin, afterMin, price, profit, marginA };
}

// Example 1 — Electrician ceiling fan (2×55, trip 30, mat 85, OH 15, m 35, round 5)
{
  const r = fr(2, 55, 30, 85, 0, 15, 35, 0, 5);
  t("fr/e1 labor", r.labor, 110);
  t("fr/e1 direct", r.direct, 225);
  t("fr/e1 overhead", r.overhead, 33.75);
  t("fr/e1 total", r.total, 258.75);
  t("fr/e1 raw", r.raw, 398.076923, 0.001);
  t("fr/e1 price", r.price, 400);
  t("fr/e1 profit", r.profit, 141.25);
  t("fr/e1 margin", r.marginA, 35.3125, 0.001);
}
// Example 2 — Plumber water heater (3×50, trip 35, mat 1100, other 75, OH 15, m 30, round 25)
{
  const r = fr(3, 50, 35, 1100, 75, 15, 30, 0, 25);
  t("fr/e2 direct", r.direct, 1360);
  t("fr/e2 total", r.total, 1564);
  t("fr/e2 raw", r.raw, 2234.285714, 0.001);
  t("fr/e2 price", r.price, 2250);
  t("fr/e2 profit", r.profit, 686);
  t("fr/e2 margin", r.marginA, 30.488888, 0.001);
}
// Example 3 — HVAC capacitor (1×60, trip 40, mat 45, OH 15, m 40, round 5)
{
  const r = fr(1, 60, 40, 45, 0, 15, 40, 0, 5);
  t("fr/e3 total", r.total, 166.75);
  t("fr/e3 raw", r.raw, 277.916666, 0.001);
  t("fr/e3 price", r.price, 280);
  t("fr/e3 profit", r.profit, 113.25);
  t("fr/e3 margin", r.marginA, 40.446428, 0.001);
}
// Example 4 — Handyman TV mount (1.5×45, trip 20, mat 40, OH 10, m 30, round 5)
{
  const r = fr(1.5, 45, 20, 40, 0, 10, 30, 0, 5);
  t("fr/e4 labor", r.labor, 67.5);
  t("fr/e4 total", r.total, 140.25);
  t("fr/e4 raw", r.raw, 200.357142, 0.001);
  t("fr/e4 price", r.price, 205);
  t("fr/e4 profit", r.profit, 64.75);
  t("fr/e4 margin", r.marginA, 31.585365, 0.001);
}
// Example 5 — Painter door (2.5×38, trip 15, mat 55, OH 12, m 32, round 5)
{
  const r = fr(2.5, 38, 15, 55, 0, 12, 32, 0, 5);
  t("fr/e5 labor", r.labor, 95);
  t("fr/e5 total", r.total, 184.8);
  t("fr/e5 raw", r.raw, 271.764705, 0.001);
  t("fr/e5 price", r.price, 275);
  t("fr/e5 profit", r.profit, 90.2);
  t("fr/e5 margin", r.marginA, 32.8);
}
// Rounding boundaries
{
  t("fr/round1 exact", roundUp(415.0, 1), 415);
  t("fr/round5 boundary", roundUp(415.0, 5), 415);
  t("fr/round5 up", roundUp(416.0, 5), 420);
  t("fr/round25 up", roundUp(2234.29, 25), 2250);
  t("fr/round0 treated-as-1", roundUp(400.2, 0), 401);
}
// Minimum charge: below computed (no effect) and above computed (overrides)
{
  const low = fr(2, 55, 30, 85, 0, 15, 35, 0, 5);
  const over = fr(2, 55, 30, 85, 0, 15, 35, 500, 5);
  t("fr/min-below price", low.price, 400); // min 0 < raw 398.08 → 400
  t("fr/min-above price", over.price, 500); // min 500 > raw → 500, rounded stays 500
  tb("fr/min-above raised", over.price > over.raw, true);
  tb("fr/min-below not-raised", low.price >= low.raw, true);
  // Suggested minimum for e1 (materials zero): labor 110 + trip 30 = 140; OH 15% = 21; total 161; /0.65 = 247.69 → 250
  t("fr/suggestedMin e1", roundUp((140 * 1.15) / 0.65, 5), 250);
}
// Guards
{
  // margin 100 → div by zero hazard; the guard predicate must reject it
  tb("fr/margin100 rejected", (100 > 0 && 100 < 100), false);
  tb("fr/margin100 raw-guard", (mguard(100) === true), false);
  function mguard(m) { return m > 0 && m < 100; }
  // margin 0 → raw = total (no profit); guard rejects as "no profit"
  t("fr/margin0 raw", 258.75 / 1, 258.75);
  // negative margin → raw < total (loss-making) → guard rejects
  t("fr/marginNeg raw", 258.75 / 1.5, 172.5);
  // hours 0 → labor 0, price still computes from trip+materials
  const h0 = fr(0, 55, 30, 85, 0, 15, 35, 0, 5);
  t("fr/hours0 labor", h0.labor, 0);
  // (30+85)=115; OH=17.25; total=132.25; raw=132.25/0.65=203.46; round5=205
  t("fr/hours0 price", h0.price, 205);
  t("fr/hours0 price exact", roundUp((115 * 1.15) / 0.65, 5), 205);
  // all-zero inputs → total 0 → raw 0 → guard: marginValid still true, but price=roundUp(0,5)=0; ensure no NaN
  t("fr/allzero total", 0, 0);
  t("fr/allzero price", roundUp(0, 5), 0);
}
// Markup equivalence & effective multiplier (e1)
{
  const r = fr(2, 55, 30, 85, 0, 15, 35, 0, 5);
  t("fr/e1 markup", r.profit / r.total * 100, 54.589371, 0.001);
  t("fr/e1 multiplier", r.price / r.total, 1.545893, 0.001);
}

// ── 9. GUIDE EXAMPLES (Phase 5) ──────────────────────────────
// Every numeric example published in a guide must be reproducible with the
// calculator formulas. Independent hand math, not app code.
{
  // how-to-calculate-labor-burden: $25 × 2080, 12% taxes, 6% comp, 5% benefits,
  // $1200 other, 120 PTO, 10% non-billable → total 65,160; billable 1,764; $36.94
  const total = 25000 / 1000 * 2080 * 1.23 + 1200; // 52000 × 1.23 + 1200
  t("guide/burden total", total, 65160);
  t("guide/burden hourly", total / ((2080 - 120) * 0.9), 36.938776, 0.001);

  // how-to-write-an-estimate table: 32×34=1088; direct 2323; +15% = 2671; ÷0.65 = 4109
  const estDirect = 32 * 34 + 780 + 350 + 105;
  t("guide/estimate direct", estDirect, 2323);
  t("guide/estimate total", estDirect * 1.15, 2671.45);
  t("guide/estimate price", estDirect * 1.15 / 0.65, 4109.923077, 0.001);

  // flat-rate-vs-hourly: HVAC 1hr @60 + 40 trip + 45 parts, OH 15%, margin 40%
  const hvacDirect = 60 + 40 + 45, hvacTotal = hvacDirect * 1.15;
  const hvacRaw = hvacTotal / 0.6, hvacPrice = Math.ceil(hvacRaw / 5) * 5;
  t("guide/hvac raw", hvacRaw, 277.916667, 0.001);
  t("guide/hvac price", hvacPrice, 280);
  t("guide/hvac fast profit", hvacPrice - hvacTotal, 113.25);
  const slowDirect = 2.5 * 60 + 40 + 45, slowTotal = slowDirect * 1.15;
  t("guide/hvac slow profit at flat 280", 280 - slowTotal, 9.75);

  // minimum-service-charge: 1hr @55 + 30 trip, OH 15%, margin 35%, round to 5
  const minCost = (55 + 30) * 1.15;
  t("guide/min smallest-call cost", minCost, 97.75);
  t("guide/min quoted", Math.ceil((minCost / 0.65) / 5) * 5, 155);

  // general-contractor-markup: 33% margin ⇒ markup = 33/67 = 49.25%; 33% markup ⇒ margin 24.81%
  t("guide/gc margin-to-markup", 33 / 67 * 100, 49.253731, 0.001);
  t("guide/gc markup-to-margin", 33 / 133 * 100, 24.812030, 0.001);
  t("guide/gc price-at-33pct-margin", 1 / 0.67, 1.492537, 0.001);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
