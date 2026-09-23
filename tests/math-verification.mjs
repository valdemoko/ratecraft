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
  // Edge: a materials credit can bring the direct cost to zero. Price follows the
  // formula exactly (0), and the component's margin guard (price > 0) holds it at 0.
  const creditDirect = 800 + -900 + 100;
  t("markup/credit-materials direct", creditDirect, 0);
  t("markup/credit-materials price", creditDirect * 1.1 * 1.25, 0);
  t("markup/credit-materials margin guard", creditDirect * 1.1 * 1.25 > 0 ? 1 : 0, 0);
}
// ── 2. MARGIN ────────────────────────────────────────────────
{
  const p = 2600, c = 1950, profit = p - c;
  t("margin/margin", profit / p * 100, 25.0);
  t("margin/markup", profit / c * 100, 33.3333, 0.001);
  // Target margin: 30% → price = 1950/0.70
  t("margin/priceFor30", 1950 / 0.70, 2785.7142857, 0.001);
  // Edge: margin 100 → divisor is 0, so the component's validity guard
  // (0 < margin < 100) must reject before dividing. Mirror the guard here.
  const marginValid = (m) => m > 0 && m < 100;
  tb("margin/margin100 rejected", marginValid(100), false);
  tb("margin/margin0 rejected", marginValid(0), false);
  tb("margin/margin30 accepted", marginValid(30), true);
  tb("margin/margin100 raw division is Infinity", 1950 / (1 - 1) === Infinity, true);
  // Edge: cost >= price → losing guard (no gross profit at all)
  const losing = (p2, c2) => c2 >= p2 && c2 > 0;
  tb("margin/losing at equal", losing(2600, 2600), true);
  tb("margin/losing above", losing(2600, 2700), true);
  tb("margin/healthy", losing(2600, 1950), false);
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
  // Edge: revenue 0 → raw division is Infinity. The component computes the
  // percentage only when rev > 0; replicate that guarded expression here.
  const pctRevenueFor = (rev) => (rev > 0 ? (total / rev) * 100 : NaN);
  t("overhead/rev0 pct is NaN", pctRevenueFor(0), NaN);
  tb("overhead/rev0 raw is Infinity", total / 0 === Infinity, true);
  t("overhead/rev-normal", pctRevenueFor(30000), 5.5666667, 0.001);
  // Edge: billable hours 0 → same guard shape for the per-hour rate.
  const perHourFor = (h) => (h > 0 ? total / h : NaN);
  t("overhead/billable0 perHour NaN", perHourFor(0), NaN);
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
  // Edge: price <= cost → contribution <= 0 → the component's guard yields NaN
  // instead of a negative or infinite job count.
  const jobsFor = (fixed, price, cost) => {
    const contribution = price - cost;
    return contribution > 0 ? fixed / contribution : NaN;
  };
  t("breakeven/price==cost", jobsFor(4500, 1200, 1200), NaN);
  t("breakeven/price<cost", jobsFor(4500, 700, 750), NaN);
  t("breakeven/healthy", jobsFor(4500, 1200, 750), 10);
  // Target-profit extension: fixed costs are covered first, so the goal is added
  // to the fixed costs — not divided on its own. Defaults: (4500 + 2000) / 450.
  const targetJobs = (4500 + 2000) / 450;
  t("breakeven/target-profit jobs", targetJobs, 14.4444444, 0.001);
  t("breakeven/target-profit ceil", Math.ceil(targetJobs), 15);
  t("breakeven/target-profit extra jobs", targetJobs - jobsFor(4500, 1200, 750), 4.4444444, 0.001);
  t("breakeven/target-profit revenue", targetJobs * 1200, 17333.33333, 0.01);
  t("breakeven/zero-target equals break-even", (4500 + 0) / 450, jobsFor(4500, 1200, 750));
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
  const total = 25 * 2080 * 1.23 + 1200; // 52,000 × 1.23 + 1,200
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

// ── 10. JOB PROFITABILITY (estimate vs. actual) ───────────────
// Defaults / lighting-retrofit example: price 4,000; estimated 2,600; actual 3,050
{
  function jp(price, est, act) {
    const estProfit = price - est, actProfit = price - act;
    const estMargin = price > 0 ? (estProfit / price) * 100 : NaN;
    const actMargin = price > 0 ? (actProfit / price) * 100 : NaN;
    return {
      estProfit, actProfit, estMargin, actMargin,
      pointsLost: estMargin - actMargin,
      variance: actProfit - estProfit, // actual − planned
      overrun: act - est,
      overrunPct: est > 0 ? ((act - est) / est) * 100 : NaN,
      actMarkup: act > 0 ? (actProfit / act) * 100 : NaN,
      priceToHold: estMargin > 0 && estMargin < 100 ? act / (1 - estMargin / 100) : NaN,
    };
  }
  const r = jp(4000, 2600, 3050);
  t("jprofit/estProfit", r.estProfit, 1400);
  t("jprofit/actProfit", r.actProfit, 950);
  t("jprofit/estMargin", r.estMargin, 35);
  t("jprofit/actMargin", r.actMargin, 23.75);
  t("jprofit/pointsLost", r.pointsLost, 11.25);
  t("jprofit/variance", r.variance, -450);
  t("jprofit/overrun", r.overrun, 450);
  t("jprofit/overrunPct", r.overrunPct, 17.3076923, 0.001);
  t("jprofit/actMarkup", r.actMarkup, 31.1475410, 0.001);
  t("jprofit/priceToHold", r.priceToHold, 4692.3076923, 0.001);
  // The claims made in the page and the guide: profit fell further than cost rose.
  t("jprofit/profit drop pct", (Math.abs(r.variance) / r.estProfit) * 100, 32.1428571, 0.001);
  tb("jprofit/profit drop exceeds cost rise", (Math.abs(r.variance) / r.estProfit) * 100 > r.overrunPct, true);
  // On plan: actual equals estimated → nothing lost, nothing gained.
  const onPlan = jp(4000, 2600, 2600);
  t("jprofit/on-plan pointsLost", onPlan.pointsLost, 0);
  t("jprofit/on-plan variance", onPlan.variance, 0);
  // Under budget: variance is positive and the margin improves.
  const under = jp(4000, 2600, 2400);
  t("jprofit/under variance", under.variance, 200);
  t("jprofit/under actMargin", under.actMargin, 40);
  // Over budget beyond the whole price: negative profit, negative margin.
  const bust = jp(4000, 2600, 4300);
  t("jprofit/bust actProfit", bust.actProfit, -300);
  t("jprofit/bust actMargin", bust.actMargin, -7.5);
  // Guards: no price → no margin; zero estimated cost → a 100% planned margin,
  // which the priceToHold guard (0 < margin < 100) must reject.
  t("jprofit/no-price margin NaN", jp(0, 2600, 3050).actMargin, NaN);
  t("jprofit/zero-est margin is 100", jp(4000, 0, 3050).estMargin, 100);
  t("jprofit/zero-est priceToHold NaN", jp(4000, 0, 3050).priceToHold, NaN);
}

// ── 11. DISCOUNT IMPACT ──────────────────────────────────────
// Defaults / repeat-service example: price 1,200; cost 750; 10% off
{
  function disc(price, cost, d) {
    const normalProfit = price - cost;
    const valid = d >= 0 && d < 100;
    const discPrice = valid ? price * (1 - d / 100) : NaN;
    const discProfit = valid ? discPrice - cost : NaN;
    return {
      normalProfit, discPrice, discProfit,
      normalMargin: price > 0 ? (normalProfit / price) * 100 : NaN,
      discMargin: discPrice > 0 ? (discProfit / discPrice) * 100 : NaN,
      erased: normalProfit > 0 ? ((normalProfit - discProfit) / normalProfit) * 100 : NaN,
      mult: discProfit > 0 ? normalProfit / discProfit : NaN,
    };
  }
  const r = disc(1200, 750, 10);
  t("discount/price", r.discPrice, 1080);
  t("discount/profit", r.discProfit, 330);
  t("discount/normalMargin", r.normalMargin, 37.5);
  t("discount/discMargin", r.discMargin, 30.5555556, 0.001);
  t("discount/erased", r.erased, 26.6666667, 0.001);
  t("discount/multiplier", r.mult, 1.3636364, 0.001);
  t("discount/extra volume pct", (r.mult - 1) * 100, 36.3636364, 0.001);
  // The live table on the page: 20% and 30% off the same job.
  const d20 = disc(1200, 750, 20);
  t("discount/20 price", d20.discPrice, 960);
  t("discount/20 profit", d20.discProfit, 210);
  t("discount/20 margin", d20.discMargin, 21.875);
  t("discount/20 erased", d20.erased, 53.3333333, 0.001);
  t("discount/20 mult", d20.mult, 2.1428571, 0.001);
  const d30 = disc(1200, 750, 30);
  t("discount/30 price", d30.discPrice, 840);
  t("discount/30 profit", d30.discProfit, 90);
  t("discount/30 erased", d30.erased, 80);
  t("discount/30 mult", d30.mult, 5);
  // Guide table: the same 10% discount at three different starting margins.
  const m20 = disc(1250, 1000, 10), m30 = disc(1000, 700, 10), m40 = disc(1500, 900, 10);
  t("guide/discount 20pct margin before", m20.normalMargin, 20);
  t("guide/discount 20pct margin after", m20.discMargin, 11.1111111, 0.001);
  t("guide/discount 20pct erased", m20.erased, 50);
  t("guide/discount 30pct margin after", m30.discMargin, 22.2222222, 0.001);
  t("guide/discount 30pct erased", m30.erased, 33.3333333, 0.001);
  t("guide/discount 40pct margin after", m40.discMargin, 33.3333333, 0.001);
  t("guide/discount 40pct erased", m40.erased, 25);
  // Linearity: the erased share is exactly proportional to the discount size, which
  // is why the page can state a cost "per 1% off" instead of a rule of thumb.
  t("discount/5pct erased", disc(1200, 750, 5).erased, 13.3333333, 0.001);
  t("discount/per point", r.erased / 10, 2.6666667, 0.001);
  // Edge: no discount → nothing erased, multiplier of 1.
  const none = disc(1200, 750, 0);
  t("discount/zero erased", none.erased, 0);
  t("discount/zero mult", none.mult, 1);
  // Edge: 100% off is rejected by the guard (valid = d >= 0 && d < 100).
  tb("discount/100 rejected", 100 >= 0 && 100 < 100, false);
  t("discount/100 price NaN", disc(1200, 750, 100).discPrice, NaN);
  // Edge: a job with no margin — "profit erased" has no base, so it must be NaN.
  const noMargin = disc(1200, 1200, 10);
  t("discount/no-margin erased guard", noMargin.erased, NaN);
  t("discount/no-margin mult guard", noMargin.mult, NaN);
  t("discount/no-margin profit", noMargin.discProfit, -120);
}

// ── 12. HIRE VS. SUBCONTRACT ─────────────────────────────────
// Defaults / hvac-installer-vs-sub example: 65,160 a year; 1,764 capacity;
// 1,400 hours of work; $55/hr sub.
{
  function hs(annual, capacity, demand, rate) {
    const subCost = rate * demand;
    return {
      perHourAtDemand: demand > 0 ? annual / demand : NaN,
      perHourAtCapacity: capacity > 0 ? annual / capacity : NaN,
      subCost,
      breakEven: rate > 0 ? annual / rate : NaN,
      utilisation: capacity > 0 ? (demand / capacity) * 100 : NaN,
      gap: Math.abs(annual - subCost),
      employeeCheaper: demand > 0 && rate > 0 ? annual < subCost : null,
      overCapacity: capacity > 0 && demand > capacity,
    };
  }
  const r = hs(65160, 1764, 1400, 55);
  t("hiresub/perHourAtDemand", r.perHourAtDemand, 46.5428571, 0.001);
  t("hiresub/perHourAtCapacity", r.perHourAtCapacity, 36.9387755, 0.001);
  t("hiresub/subCost", r.subCost, 77000);
  t("hiresub/breakEven", r.breakEven, 1184.7272727, 0.001);
  t("hiresub/breakEven ceil", Math.ceil(r.breakEven), 1185);
  t("hiresub/utilisation", r.utilisation, 79.3650794, 0.001);
  t("hiresub/gap", r.gap, 11840);
  tb("hiresub/employee cheaper at 1,400 hrs", r.employeeCheaper, true);
  tb("hiresub/within capacity", r.overCapacity, false);
  // Guide sensitivity table: the same employee at different workloads.
  t("guide/hiresub 1,000 hrs", hs(65160, 1764, 1000, 55).perHourAtDemand, 65.16);
  t("guide/hiresub 1,200 hrs", hs(65160, 1764, 1200, 55).perHourAtDemand, 54.30);
  t("guide/hiresub 1,600 hrs", hs(65160, 1764, 1600, 55).perHourAtDemand, 40.725, 0.001);
  t("guide/hiresub util 1,000", hs(65160, 1764, 1000, 55).utilisation, 56.6893424, 0.001);
  t("guide/hiresub util 1,200", hs(65160, 1764, 1200, 55).utilisation, 68.0272109, 0.001);
  t("guide/hiresub util 1,600", hs(65160, 1764, 1600, 55).utilisation, 90.7029478, 0.001);
  t("guide/hiresub util at capacity", hs(65160, 1764, 1764, 55).utilisation, 100);
  t("guide/hiresub capacity sub cost", 1764 * 55, 97020);
  // Below the break-even workload the subcontractor wins.
  const quiet = hs(65160, 1764, 1000, 55);
  tb("hiresub/sub cheaper at 1,000 hrs", quiet.employeeCheaper, false);
  t("hiresub/quiet gap", quiet.gap, 10160);
  // At the break-even workload exactly, both options cost the same.
  t("hiresub/break-even equality", 55 * (65160 / 55), 65160);
  // Guards
  t("hiresub/zero demand perHour NaN", hs(65160, 1764, 0, 55).perHourAtDemand, NaN);
  t("hiresub/zero rate breakEven NaN", hs(65160, 1764, 1400, 0).breakEven, NaN);
  t("hiresub/zero capacity utilisation NaN", hs(65160, 0, 1400, 55).utilisation, NaN);
  tb("hiresub/over capacity flagged", hs(65160, 1000, 1400, 55).overCapacity, true);
}

// ── 13. PHASE 8 GUIDE EXAMPLES ───────────────────────────────
// Numbers published in the four new guides, reproduced independently.
{
  // billable-hours-and-income-goal: 48 weeks × 40 hrs = 1,920 worked; 60% billable.
  const worked = 48 * 40;
  t("guide/billable worked hours", worked, 1920);
  t("guide/billable hours", worked * 0.6, 1152);
  t("guide/billable per week", (worked * 0.6) / 48, 24);
  t("guide/billable ratio", worked / (worked * 0.6), 1.6666667, 0.001);
  // Gross-up from the FAQ: 60,000 take-home at a 25% effective rate.
  t("guide/gross-up", 60000 / (1 - 0.25), 80000);
  // Hourly floor from the same guide: (65,000 + 18,000) ÷ 1,152.
  t("guide/hourly floor", (65000 + 18000) / 1152, 72.0486111, 0.001);
  // job-costing table (see also section 10).
  t("guide/jobcosting profit drop", (450 / 1400) * 100, 32.1428571, 0.001);
  t("guide/jobcosting margin after", (950 / 4000) * 100, 23.75);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
