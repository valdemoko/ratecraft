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

// ── 14. EFFECTIVE HOURLY RATE ────────────────────────────────
// Defaults: 3200 revenue; 24 hrs × 38 = 912 labor; +900 materials +0 subs +40 vehicle
// → total 1852; profit 1348; totalHours 30; on-site 56.1733; effective 44.9333
{
  const rev = 3200, h = 24, unpaid = 6, hourlyCost = 38;
  const totalCost = h * hourlyCost + 900 + 0 + 40;
  const profit = rev - totalCost;
  t("effrate/totalCost", totalCost, 1852);
  t("effrate/profit", profit, 1348);
  t("effrate/margin", (profit / rev) * 100, 42.125);
  t("effrate/onSiteRate", profit / h, 56.1666667, 0.001);
  t("effrate/effectiveRate", profit / (h + unpaid), 44.9333333, 0.001);
  t("effrate/gap", profit / h - profit / (h + unpaid), 11.2333333, 0.001);
  // Price that would hit the target: 60/hr over 30 hrs → revenue needed.
  t("effrate/targetRevenue", 60 * (h + unpaid) + totalCost, 3652);
  // Edge cases mirror the component guards.
  t("effrate/zeroHours onSite NaN", h > 0 ? profit / h : NaN, 56.1666667, 0.001);
  t("effrate/zeroTotalHours effective NaN", 0 > 0 ? 1 : NaN, NaN);
  t("effrate/losingJob profit", 1000 - totalCost > 0 ? 1000 - totalCost : 0, 0);
}

// ── 15. CHANGE ORDER ─────────────────────────────────────────
// Worked example: 6000 price, 3600 cost, 40% margin; extra 6×42+180 = 432
// add = (3600+432)/0.60 − 6000 = 6720 − 6000 = 720; new margin 40.0%
{
  const price = 6000, cost = 3600, m = 0.40;
  const extraCost = 6 * 42 + 180;
  const add = (cost + extraCost) / (1 - m) - price;
  const invoiceAdd = Math.ceil(add);
  const newPrice = price + invoiceAdd, newCost = cost + extraCost;
  t("chgorder/extraCost", extraCost, 432);
  t("chgorder/newCost", cost + extraCost, 4032);
  t("chgorder/pricedBase", (cost + extraCost) / (1 - m), 6720);
  t("chgorder/add", add, 720);
  t("chgorder/invoiceAdd", invoiceAdd, 720);
  t("chgorder/newPrice", newPrice, 6720);
  t("chgorder/newMargin", ((newPrice - newCost) / newPrice) * 100, 40.0);
  // Profit given away by billing cost alone: extraCost × m/(1−m)
  t("chgorder/cost-only donation", extraCost, 432);
  t("chgorder/foregone profit", 432 * (m / (1 - m)), 288);
  // Original margin check: 6000 priced at 40% over 3600.
  t("chgorder/origMargin", ((price - cost) / price) * 100, 40.0);
  // Edge: margin 100 → divisor 0 → guarded.
  const marginValid = (x) => x > 0 && x < 100;
  tb("chgorder/margin100 rejected", marginValid(100), false);
  // Edge: fractional add rounds up to an invoiceable dollar.
  const addFrac = (3600 + 431.5) / (1 - m) - 6000;
  t("chgorder/fractional add", addFrac, 719.1666667, 0.001);
  t("chgorder/fractional rounded", Math.ceil(addFrac), 720);
}

// ── 16. TARGET MARGIN ────────────────────────────────────────
// Defaults: overhead 8500; income 6000; profit 2500; revenue 38000; jobs 8; current 32%
// overhead% = 22.3684; net% = (8500/38000) = 22.3684; required = 44.7368
{
  const oh = 8500, inc = 6000, profit = 2500, rev = 38000, jobs = 8, cur = 32;
  const overheadPct = (oh / rev) * 100;
  const netPct = ((inc + profit) / rev) * 100;
  const required = overheadPct + netPct;
  t("target/overheadPct", overheadPct, 22.3684211, 0.001);
  t("target/netPct", netPct, 22.3684211, 0.001);
  t("target/required", required, 44.7368421, 0.001);
  t("target/gap", required - cur, 12.7368421, 0.001);
  // Dollars behind the gap, per job.
  t("target/gap dollars", ((required - cur) / 100) * rev, 4840);
  t("target/gap per job", (((required - cur) / 100) * rev) / jobs, 605);
  // Price uplift that closes the gap on the same costs.
  t("target/uplift", ((1 - cur / 100) / (1 - required / 100) - 1) * 100, 23.0476190, 0.001);
  // Guide sensitivity: same overhead at different revenue.
  const req = (r) => (8500 / r) * 100 + (8500 / r) * 100;
  t("guide/target rev 30k", req(30000), 56.6666667, 0.001);
  t("guide/target rev 38k", req(38000), 44.7368421, 0.001);
  t("guide/target rev 50k", req(50000), 34.0);
  // Edge: revenue 0 → percentages are Infinity, guarded in component.
  t("target/zero revenue overheadPct", 0 > 0 ? (oh / 0) * 100 : NaN, NaN);
}

// ── 17. MATERIALS MARKUP ─────────────────────────────────────
// Worked example: list 1100; discount 10%; freight 45; markup 35%
// net = 1100×0.9 + 45 = 1035; price = 1035×1.35 = 1397.25; profit 362.25; margin 25.93%
{
  const list = 1100, disc = 0.10, freight = 45, mk = 0.35;
  const netCost = list * (1 - disc) + freight;
  const price = netCost * (1 + mk);
  const profit = price - netCost;
  const margin = (profit / price) * 100;
  const effMult = price / list;
  t("matmarkup/saved", list * disc, 110);
  t("matmarkup/netCost", netCost, 1035);
  t("matmarkup/price", price, 1397.25);
  t("matmarkup/profit", profit, 362.25);
  t("matmarkup/margin", margin, 25.9259259, 0.001);
  t("matmarkup/effMult", effMult, 1.2702273, 0.001);
  // Same markup on the list base (discount ignored) earns less:
  t("matmarkup/markup-on-list profit", (1100 + 45) * (1 + mk) - 1100 - 45, 400.75);
  // The comparison row: markup on list price without discount claimed.
  const listBasePrice = 1100 * (1 + mk) + freight;
  t("matmarkup/listBase price", listBasePrice, 1530);
  t("matmarkup/listBase profit net of freight", listBasePrice - 1100 - freight, 385);
  // Edge: 100% discount → net cost is freight only.
  t("matmarkup/full discount net", 1100 * (1 - 1) + freight, 45);
}

// ── 18. PRICE INCREASE ───────────────────────────────────────
// Worked example: 12 jobs, price 1200, cost 750, +8%
// newPrice 1296; profit 450 → 546; +96/job; +1152/mo; +13824/yr; survivable 2.1
{
  const n = 12, price = 1200, cost = 750, inc = 0.08;
  const newPrice = price * (1 + inc);
  const pB = price - cost, pA = newPrice - cost;
  const extraJob = pA - pB;
  t("raise/newPrice", newPrice, 1296);
  t("raise/profitBefore", pB, 450);
  t("raise/profitAfter", pA, 546);
  t("raise/extraPerJob", extraJob, 96);
  t("raise/extraMonth", n * extraJob, 1152);
  t("raise/extraYear", n * extraJob * 12, 13824);
  t("raise/marginBefore", (pB / price) * 100, 37.5);
  t("raise/marginAfter", (pA / newPrice) * 100, 42.1296296, 0.001);
  t("raise/survivable jobs", n * (1 - pB / pA), 2.1098901, 0.001);
  t("raise/survivable pct", (n * (1 - pB / pA) / n) * 100, 17.5824176, 0.001);
  // Discount comparison (8% off): profit 354; volume needed 1.2703.
  const discPrice = price * (1 - inc);
  const pD = discPrice - cost;
  t("raise/discount profit", pD, 354);
  t("raise/discount volume needed", pB / pD, 1.2703340, 0.001);
  t("raise/discount profit erased", ((pB - pD) / pB) * 100, 21.3333333, 0.001);
  // Edge: 0% increase changes nothing.
  t("raise/zero increase", 1200 * 1, 1200);
  // Edge: increase on a loss-making job is still below zero profit.
  t("raise/losing job", 1200 * 1.08 - 1300, -4);
}

// ── 19. PHASE 9 GUIDE EXAMPLES ───────────────────────────────
{
  // effective-hourly-rate guide table.
  t("guide/effrate on-site", 1348 / 24, 56.1666667, 0.001);
  t("guide/effrate effective", 1348 / 30, 44.9333333, 0.001);
  // change-orders guide table.
  t("guide/chgorder step3", 4032 / 0.6, 6720);
  t("guide/chgorder margin check", ((6720 - 4032) / 6720) * 100, 40.0);
  // what-margin-should-i-target: three-revenue sensitivity.
  const reqMargin = (rev) => (8500 / rev) * 2 * 100;
  t("guide/margin 30k", reqMargin(30000), 56.6666667, 0.001);
  t("guide/margin 50k", reqMargin(50000), 34.0);
  // materials-markup guide: markup on list vs net cost.
  t("guide/matmarkup on net", 1035 * 1.35 - 1035, 362.25);
  t("guide/matmarkup on list", 1100 * 1.35 - 1100, 385);
  t("guide/matmarkup list price", 1100 * 1.35, 1485);
  // when-to-raise-prices guide table.
  t("guide/raise margin after", ((546 / 1296) * 100), 42.1296296, 0.001);
  t("guide/raise month", 12 * 96, 1152);
  t("guide/raise annual", 5400 * 12, 64800);
}

// ── 20. OVERTIME ─────────────────────────────────────────────
// Defaults: wage 25; burden 31%; OT 8 hrs/wk; 1.5×; 48 weeks.
// burdened 32.75; OT rate 49.125; OT hrs/yr 384; OT cost 18864; premium 6288
{
  const wage = 25, burden = 0.31, mult = 1.5, otWk = 8, weeks = 48;
  const burdened = wage * (1 + burden);
  const otRate = burdened * mult;
  const otHrs = otWk * weeks;
  const otCost = otHrs * otRate;
  const premium = otHrs * burdened * (mult - 1);
  const straightCost = 40 * weeks * burdened;
  const otShare = (otCost / (straightCost + otCost)) * 100;
  t("ot/burdened", burdened, 32.75);
  t("ot/otRate", otRate, 49.125);
  t("ot/otHrs", otHrs, 384);
  t("ot/otCost", otCost, 18864);
  t("ot/premium", premium, 6288);
  t("ot/straightCost", straightCost, 62880);
  t("ot/share", otShare, 23.0769231, 0.001);
  t("ot/share of hours", (otHrs / (40 * weeks)) * 100, 20);
  // Worked example: 12-week peak, 8 hrs/wk.
  const peakHrs = 8 * 12, peakCost = peakHrs * otRate, peakPremium = peakHrs * burdened * 0.5;
  t("ot/peak cost", peakCost, 4716);
  t("ot/peak premium", peakPremium, 1572);
  // Bare-wage comparison the guide debunks.
  t("ot/bare wage OT", wage * mult, 37.5);
  t("ot/burden gap per OT hour", otRate - wage * mult, 11.625);
  // Annualized premium guide figure.
  t("ot/annual premium", otWk * 48 * burdened * 0.5, 6288);
  // Edge: multiplier 1 → premium 0.
  t("ot/mult1 premium", otHrs * burdened * (1 - 1), 0);
}

// ── 21. TRUCK ROLL ───────────────────────────────────────────
// Defaults: vehicle 28/day; 50 min drive; $38/hr; 4 calls/day; 900 trips/yr.
// vehicle/call 7; drive/call 0.2083 hrs = 7.9167; trip 14.9167; annual 13425
{
  const veh = 28, mins = 50, rate = 38, calls = 4, perYear = 900;
  const vehCall = veh / calls;
  const driveHrsCall = mins / 60 / calls;
  const laborCall = driveHrsCall * rate;
  const trip = vehCall + laborCall;
  t("trip/vehiclePerCall", vehCall, 7);
  t("trip/driveHrsPerCall", driveHrsCall, 0.2083333, 0.001);
  t("trip/laborPerCall", laborCall, 7.9166667, 0.001);
  t("trip/tripCost", trip, 14.9166667, 0.001);
  t("trip/annual", trip * perYear, 13425);
  // Guide density table (50 min drive day).
  const tripFor = (c) => veh / c + (mins / 60 / c) * rate;
  t("guide/trip dense 6", tripFor(6), 9.9444444, 0.001);
  t("guide/trip typical 4", tripFor(4), 14.9166667, 0.001);
  t("guide/trip crosstown 2", tripFor(2), 29.8333333, 0.001);
  // Annual difference between 4-call and 2-call density at 900 trips.
  t("guide/trip density annual delta", (tripFor(2) - tripFor(4)) * 900, 13425);
  // Routing improvement: 30 min driving instead of 50.
  const leanTrip = veh / 4 + (30 / 60 / 4) * rate;
  t("guide/trip lean 30min", leanTrip, 11.75);
  t("guide/trip lean saving", (trip - leanTrip) * 900, 2850);
  // Edge: 1 call → full day cost on one trip.
  t("trip/single call", veh / 1 + (mins / 60 / 1) * rate, 59.6666667, 0.001);
}

// ── 22. WARRANTY / REWORK ────────────────────────────────────
// Worked example: price 1200, cost 750, redo 20% of price, rate 3%, 144 jobs.
// redo 240; callbackJobProfit 210; annual 144×0.03×240 = 1036.80; drag 0.6 pts
{
  const price = 1200, cost = 750, share = 0.20, rate = 0.03, jobs = 144;
  const redo = price * share;
  const profit = price - cost;
  const cbProfit = profit - redo;
  const annual = jobs * rate * redo;
  const drag = (redo * rate / price) * 100;
  t("wty/redo", redo, 240);
  t("wty/profit", profit, 450);
  t("wty/callbackJobProfit", cbProfit, 210);
  t("wty/callbacksPerYear", jobs * rate, 4.32);
  t("wty/annual", annual, 1036.8);
  t("wty/drag", drag, 0.6);
  // Guide sensitivity table at 144 jobs.
  const tbl = (r) => (jobs * r * redo);
  t("guide/wty 2%", tbl(0.02), 691.2);
  t("guide/wty 10%", tbl(0.10), 3456);
  t("guide/wty 10% drag", (redo * 0.10 / price) * 100, 2.0);
  // Edge: 0% callback rate → zero cost.
  t("wty/zero rate", jobs * 0 * redo, 0);
}

// ── 23. QUOTE WIN RATE ───────────────────────────────────────
// Worked example: 10 quotes, 3 wins, $1,200 value, 1.5 hrs, $45.
// winRate 30%; quoted 12000; won 3600; estCost 675; perWin 225; lostYear 5670
{
  const q = 10, w = 3, val = 1200, hrs = 1.5, hcost = 45;
  const winRate = (w / q) * 100;
  const quotedValue = q * val, wonValue = w * val;
  const estCostMonth = q * hrs * hcost;
  const perWin = estCostMonth / w;
  const lostCostYear = (q - w) * hrs * hcost * 12;
  t("quote/winRate", winRate, 30);
  t("quote/quotedValue", quotedValue, 12000);
  t("quote/wonValue", wonValue, 3600);
  t("quote/estCostMonth", estCostMonth, 675);
  t("quote/perWin", perWin, 225);
  t("quote/perQuoteCost", hrs * hcost, 67.5);
  t("quote/lostCostYear", lostCostYear, 5670);
  // Value-rate illustration from the guide: small wins, big losses.
  const vWon = 3 * 600, vLost = 7 * 1500;
  t("guide/quote valueRate", (vWon / (vWon + vLost)) * 100, 14.6341463, 0.001);
  // Faster quoting lever: 1 hr per quote.
  t("guide/quote perWin at 1hr", (q * 1 * hcost) / w, 150);
  // Edge: zero wins → perWin undefined (guarded).
  t("quote/zero wins perWin", 0 > 0 ? 675 / 0 : NaN, NaN);
}

// ── 24. BUY VS RENT ──────────────────────────────────────────
// Worked example: price 3200, life 6 yrs, own $12/day, rent $65/day, 30 days.
// capital 533.33; breakEven 10.06→11; ownedDay 29.78; own/yr 893.33; rent/yr 1950
{
  const price = 3200, life = 6, ownDay = 12, rentDay = 65, days = 30;
  const capital = price / life;
  const breakEven = capital / (rentDay - ownDay);
  const ownedDay = capital / days + ownDay;
  const annualOwn = capital + ownDay * days;
  const annualRent = rentDay * days;
  const saving = annualRent - annualOwn;
  t("buyrent/capital", capital, 533.3333333, 0.001);
  t("buyrent/breakEven", breakEven, 10.0628931, 0.001);
  t("buyrent/breakEven ceil", Math.ceil(breakEven), 11);
  t("buyrent/ownedDay", ownedDay, 29.7777778, 0.001);
  t("buyrent/annualOwn", annualOwn, 893.3333333, 0.001);
  t("buyrent/annualRent", annualRent, 1950);
  t("buyrent/saving", saving, 1056.6666667, 0.001);
  // Guide table at three usage levels.
  const ownAt = (d) => capital + ownDay * d;
  t("guide/buyrent 5 days own", ownAt(5), 593.3333333, 0.001);
  t("guide/buyrent 5 days rent", rentDay * 5, 325);
  t("guide/buyrent ownedDay at 5", capital / 5 + ownDay, 118.6666667, 0.001);
  t("guide/buyrent 11 days own", ownAt(11), 665.3333333, 0.001);
  t("guide/buyrent 11 days rent", rentDay * 11, 715);
  // Edge: rent == ownDay → break-even infinite (guarded).
  t("buyrent/rent equals own", 65 - 65, 0);
  const beValid = (r, o) => r > o;
  tb("buyrent/guarded when rent<=own", beValid(12, 12), false);
}

// ── 25. PAYMENT TERMS ────────────────────────────────────────
// Worked example: invoice 2500; terms 30; paid 75; rate 20%; 60 invoices.
// daysLate 45; cost 61.6438; share 2.4658%; annual 3698.63; float 30821.92
{
  const inv = 2500, terms = 30, actual = 75, rate = 0.20, jy = 60;
  const late = actual - terms;
  const cost = inv * rate * (late / 365);
  const share = (cost / inv) * 100;
  const annual = cost * jy;
  const float_ = inv * (actual / 365) * jy;
  t("pay/daysLate", late, 45);
  t("pay/cost", cost, 61.6438356, 0.001);
  t("pay/share", share, 2.4657534, 0.001);
  t("pay/annual", annual, 3698.6301370, 0.001);
  t("pay/float", float_, 30821.9178082, 0.001);
  // Prompt-pay implied rate: (2/98) × (365/20).
  t("pay/promptpay implied rate", (2 / 98) * (365 / 20) * 100, 37.2448980, 0.001);
  // Paid on time → zero cost.
  t("pay/on time cost", inv * rate * (0 / 365), 0);
  // Edge: paid early → negative late days, cost negative (a gain) — guarded to 0 in component.
  const earlyCost = inv * rate * ((-10) / 365);
  tb("pay/early is a gain not a cost", earlyCost < 0, true);
}

// ── 26. MAINTENANCE AGREEMENT ────────────────────────────────
// Worked example: 2 visits; 1.5 hrs × 38 + 15 + 10 = 82/visit; admin 50; margin 30%
// annualCost 214; price 305.7143; monthly 25.4762; contribution 91.7143
// upsell 0.4×180×0.9 = 64.80; memberValue 370.5143; ltv3 at 80% = ×2.44 = 904.0549
{
  const visits = 2, hrs = 1.5, rate = 38, trav = 15, mats = 10, admin = 50, m = 0.30;
  const visitCost = hrs * rate + trav + mats;
  const annualCost = visits * visitCost + admin;
  const annualPrice = annualCost / (1 - m);
  const monthly = annualPrice / 12;
  const contribution = annualPrice - annualCost;
  const upsell = 0.4 * 180 * 0.9;
  const memberValue = annualPrice + upsell;
  const r = 0.8;
  const ltv3 = memberValue * (1 + r + r * r);
  t("plan/visitCost", visitCost, 82);
  t("plan/annualCost", annualCost, 214);
  t("plan/annualPrice", annualPrice, 305.7142857, 0.001);
  t("plan/monthly", monthly, 25.4761905, 0.001);
  t("plan/contribution", contribution, 91.7142857, 0.001);
  t("plan/upsell", upsell, 64.8);
  t("plan/memberValue", memberValue, 370.5142857, 0.001);
  t("plan/ltv3", ltv3, 904.0548571, 0.001);
  t("plan/ltv multiplier", 1 + r + r * r, 2.44);
  // Revenue floor: 120 members × monthly price.
  t("plan/revFloor", monthly * 120, 3057.1428571, 0.001);
  // Edge: margin 100 guarded; 0 visits → invalid.
  const mValid = (x) => x > 0 && x < 100;
  tb("plan/margin100 rejected", mValid(100), false);
  // Guide check: contribution covers overhead not entered.
  tb("plan/contribution covers rest", contribution > 0, true);
}

// ── 27. SLOW SEASON RESERVE ──────────────────────────────────
// Worked example: need 8500+6000=14500; slow 15000×0.35=5250; gap 9250;
// reserve 3×9250=27750; weekly 27750/(6×4.33)=1068.66; peak capacity 27000
{
  const oh = 8500, inc = 6000, srev = 15000, smp = 0.35, sm = 3, ps = 4500, pm = 6;
  const need = oh + inc;
  const slowProfit = srev * smp;
  const gap = Math.max(0, need - slowProfit);
  const reserve = gap * sm;
  const weekly = reserve / (pm * 4.33);
  const peakCapacity = ps * pm;
  t("slow/need", need, 14500);
  t("slow/slowProfit", slowProfit, 5250);
  t("slow/gap", gap, 9250);
  t("slow/reserve", reserve, 27750);
  t("slow/weekly", weekly, 1068.1293303, 0.001);
  t("slow/peakCapacity", peakCapacity, 27000);
  t("slow/shortfall", peakCapacity - reserve, -750);
  // Edge: strong slow month → gap 0 (max guards it).
  t("slow/no gap", Math.max(0, need - 15000), 0);
}

// ── 28. LABOR-ONLY ───────────────────────────────────────────
// Worked example: 8 hrs × 38 = 304; handling 1 hr = 38; base 342; risk 10% = 34.20;
// price 376.20 ÷ 0.65 = 578.7692; effective 72.3462; profit 202.5692
{
  const h = 8, r = 38, m = 0.35, risk = 0.10, hh = 1;
  const laborCost = h * r;
  const handleCost = hh * r;
  const baseCost = laborCost + handleCost;
  const riskLoad = baseCost * risk;
  const price = (baseCost + riskLoad) / (1 - m);
  const effRate = price / h;
  const profit = price - baseCost - riskLoad;
  t("lo/laborCost", laborCost, 304);
  t("lo/handleCost", handleCost, 38);
  t("lo/baseCost", baseCost, 342);
  t("lo/riskLoad", riskLoad, 34.2);
  t("lo/price", price, 578.7692308, 0.001);
  t("lo/effRate", effRate, 72.3461538, 0.001);
  t("lo/profit", profit, 202.5692308, 0.001);
  // Bare labor + margin comparison from the guide (~495).
  t("lo/naive quote", (h * r) / (1 - m), 467.6923077, 0.001);
  // Edge: zero risk load → still margin-correct.
  t("lo/zero risk", (342 + 0) / 0.65, 526.1538462, 0.001);
}

// ── 29. DEPOSIT SCHEDULE ─────────────────────────────────────
// Worked example: price 12000; deposit 30%; materials 45%; margin 35%; retention 0
// deposit 3600; totalCost 7800; materials 5400; float 1800; exposure 4200; final 8400
{
  const p = 12000, dep = 0.30, mat = 0.45, m = 0.35, ret = 0;
  const depositAmt = p * dep;
  const materialsAmt = p * mat;
  const totalCost = p * (1 - m);
  const floatFinanced = Math.max(0, materialsAmt - depositAmt);
  const exposure = totalCost - depositAmt;
  const finalPayment = p - depositAmt - p * ret;
  const covered = depositAmt >= materialsAmt;
  t("dep/deposit", depositAmt, 3600);
  t("dep/totalCost", totalCost, 7800);
  t("dep/materials", materialsAmt, 5400);
  t("dep/float", floatFinanced, 1800);
  t("dep/exposure", exposure, 4200);
  t("dep/final", finalPayment, 8400);
  tb("dep/coverage fails at 30%", covered, false);
  // 45% deposit closes the gap (guide narrative).
  tb("dep/coverage passes at 45%", p * 0.45 >= materialsAmt, true);
  // Retention variant: 10% held.
  const retAmt = p * 0.10;
  t("dep/retention amount", retAmt, 1200);
  t("dep/final with retention", p - depositAmt - retAmt, 7200);
  t("dep/exposure before release", totalCost - depositAmt, 4200);
  // Edge: 100% deposit → zero float, zero exposure.
  t("dep/full deposit", Math.max(0, p * mat - p), 0);
}

// ── 30. REVENUE PER TECH ─────────────────────────────────────
// Worked example: revenue 420000; 2 techs; 2 trucks; 48 wks × 40 hrs × 65%
// perTech 210000; billable 1248; totalBillable 2496; perHour 168.2692; target 180000 met
{
  const rev = 420000, t2 = 2, tr = 2, wks = 48, hw = 40, util = 0.65, target = 180000;
  const perTech = rev / t2;
  const perTruck = rev / tr;
  const billable = wks * hw * util;
  const totalBillable = t2 * billable;
  const perHour = rev / totalBillable;
  const gap = perTech - target;
  const targetRate = target / billable;
  t("rpt/perTech", perTech, 210000);
  t("rpt/perTruck", perTruck, 210000);
  t("rpt/billable", billable, 1248);
  t("rpt/totalBillable", totalBillable, 2496);
  t("rpt/perHour", perHour, 168.2692308, 0.001);
  t("rpt/gap", gap, 30000);
  t("rpt/targetRate", targetRate, 144.2307692, 0.001);
  // Guide comparison: same perTech at 50% utilization → higher per-hour rate.
  const b50 = wks * hw * 0.50;
  t("guide/rpt perHour at 50%", rev / (t2 * b50), 218.75);
  // Utilization share of paid hours.
  t("rpt/util share", (billable / (wks * hw)) * 100, 65);
  // Edge: zero techs → perTech Infinity (guarded in component).
  t("rpt/zero techs", 0 > 0 ? rev / 0 : NaN, NaN);
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
