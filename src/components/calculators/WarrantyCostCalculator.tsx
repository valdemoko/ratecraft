"use client";

import { useState } from "react";
import Field from "@/components/calculator/Field";
import ResultRow from "@/components/calculator/ResultRow";
import LiveRegion from "@/components/calculator/LiveRegion";
import MathFlow from "@/components/calculator/MathFlow";
import YourCalculation from "@/components/calculator/YourCalculation";
import ResultActions from "@/components/calculator/ResultActions";
import { fmt, num } from "@/lib/format";

const DEFAULTS = {
  avgPrice: "1200", avgCost: "750", reworkShare: "20", reworkRate: "3",
};

/**
 * Warranty & rework cost calculator. Math (verified in tests/math-verification.mjs, section 22):
 *   profit          = avgPrice − avgCost
 *   reworkCost      = avgPrice × (reworkShare/100)      (delivering a redone job costs roughly its variable share)
 *   costPerCallback = reworkCost × reworkRate/100 + reworkCost
 *   ... i.e. totalCostPerCallback = reworkCost × (1 + reworkRate/100)
 *   annualCost      = jobsYear × costPerCallback
 *   marginDragPts   = (reworkCost ÷ avgPrice) × 100 × reworkRate/100   (points of margin the callback rate costs)
 *   priceRiseNeeded = callback cost ÷ (1 − targetMargin) spread per job → the honest figure is
 *                     perJobAllowance = costPerCallback (what every job must silently carry)
 * A callback is a job you do twice and get paid once for — the math prices that.
 */
export default function WarrantyCostCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [avgPrice, setAvgPrice] = useState(prefill?.avgPrice ?? DEFAULTS.avgPrice);
  const [avgCost, setAvgCost] = useState(prefill?.avgCost ?? DEFAULTS.avgCost);
  const [reworkShare, setReworkShare] = useState(prefill?.reworkShare ?? DEFAULTS.reworkShare);
  const [reworkRate, setReworkRate] = useState(prefill?.reworkRate ?? DEFAULTS.reworkRate);
  const [jobsYear, setJobsYear] = useState(prefill?.jobsYear ?? "144");

  const price = num(avgPrice);
  const cost = num(avgCost);
  const share = num(reworkShare);
  const rate = num(reworkRate);
  const jy = num(jobsYear);

  const valid = price > 0 && cost >= 0 && share > 0 && share < 100 && rate >= 0;
  const profit = price - cost;
  const reworkCost = price * (share / 100);
  const totalPerCallback = reworkCost * (1 + rate / 100);
  const annualCost = jy > 0 ? (rate / 100) * jy * totalPerCallback : NaN;
  const marginDragPts = price > 0 ? ((reworkCost * (rate / 100)) / price) * 100 : NaN;
  const callbackProfit = profit - totalPerCallback;
  const weeks = jy > 0 ? rate / 100 * jy / 4.33 : NaN; // ~callbacks per month at 4.33 wks
  const callbacksMonth = Number.isFinite(weeks) ? weeks : NaN;

  const reset = () => {
    setAvgPrice(DEFAULTS.avgPrice); setAvgCost(DEFAULTS.avgCost);
    setReworkShare(DEFAULTS.reworkShare); setReworkRate(DEFAULTS.reworkRate);
    setJobsYear("144");
  };

  const copyText = [
    "RateCraft — Warranty & Rework Cost",
    `Average job: ${fmt.money(price)} price / ${fmt.money(cost)} cost → ${fmt.money(profit)} profit`,
    `Rework share of a job: ${fmt.pct(share)} → ${fmt.money(reworkCost)} to redo one`,
    `Callback rate: ${fmt.pct(rate)} of jobs`,
    `Cost per callback (parts of job + diagnostics): ${fmt.money(totalPerCallback)}`,
    `Cost per year at ${fmt.num(jy)} jobs: ${fmt.money(annualCost)}`,
    `Margin drag: ${fmt.pct(marginDragPts)} points on every job priced`,
  ].join("\n");

  return (
    <section aria-label="Warranty and rework cost calculator">
      <LiveRegion
        message={
          valid && rate > 0
            ? `At a ${fmt.pct(rate)} callback rate, rework costs ${fmt.money(annualCost)} a year across ${fmt.num(jy)} jobs — ${fmt.pct(marginDragPts)} points of margin on every job.`
            : "Enter your average job and callback rate to price what rework really costs."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>Your average job</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="wr-price" label="Average job price" value={avgPrice} onChange={setAvgPrice} unit="$" />
            <Field id="wr-cost" label="Variable cost per job" value={avgCost} onChange={setAvgCost} unit="$" hint="Labor, materials, subs — what a normal job costs to deliver" />
            <Field id="wr-jobs" label="Jobs per year" value={jobsYear} onChange={setJobsYear} />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The rework</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="wr-share" label="Cost of redoing a job" value={reworkShare} onChange={setReworkShare} unit="%" hint="As a share of job price — 15–25% is typical when materials survive but labor repeats" />
            <Field id="wr-rate" label="Callback rate" value={reworkRate} onChange={setReworkRate} unit="%" hint="Share of jobs that come back — your own history if you have it" />
          </div>
          {share >= 100 && (
            <span className="field-error" role="alert" style={{ marginTop: "var(--space-2)", display: "block" }}>
              A redo that costs 100% of the job price means starting from zero — enter a value below 100.
            </span>
          )}

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Annual cost of callbacks</div>
          <div className="result-primary" style={{ color: Number.isFinite(annualCost) && annualCost > 0 ? "var(--color-danger)" : "var(--color-success)" }}>
            {valid && rate > 0 ? fmt.money(annualCost) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Redo cost", value: fmt.money(reworkCost) },
              { label: `× rate ${fmt.pct(rate)}`, value: fmt.money(reworkCost * (rate / 100)) },
              { label: `× ${fmt.num(jy)} jobs`, value: valid && rate > 0 ? fmt.money(annualCost) : "—", highlight: true },
              { label: "Margin drag", value: `${fmt.pct(marginDragPts)} pts` },
            ]}
          />

          <YourCalculation
            formula="Annual rework cost = Jobs × Callback rate × (Job price × Rework share)"
            substitution={
              valid && rate > 0
                ? `${fmt.num(jy)} × ${fmt.pct(rate)} × ${fmt.money(reworkCost)} = ${fmt.money(annualCost)}`
                : "Enter a redo share and a callback rate"
            }
            note="Every job you sell silently carries a slice of the callbacks you haven't had yet — this is the size of the slice."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Cost to redo one job" value={valid ? fmt.money(reworkCost) : "—"} hint={`${fmt.pct(share)} of a ${fmt.money(price)} job`} />
            <ResultRow label="Full cost per callback" value={valid ? fmt.money(totalPerCallback) : "—"} hint="Redo plus the diagnostics and trips the return visit adds" />
            <ResultRow label="Callbacks per month" value={valid && rate > 0 ? fmt.num(callbacksMonth) : "—"} hint={`At ${fmt.pct(rate)} of ${fmt.num(jy)} jobs/year`} />
            <ResultRow label="Annual cost of rework" value={valid && rate > 0 ? fmt.money(annualCost) : "—"} strong tone="warning" />
            <ResultRow
              label="Profit left on a callback job"
              value={valid ? fmt.money(callbackProfit) : "—"}
              hint={`Was ${fmt.money(profit)} — a callback job earns a fraction of it`}
              tone={callbackProfit <= 0 ? "warning" : "default"}
            />
            <ResultRow label="Margin drag on every job" value={valid ? `${fmt.pct(marginDragPts)} pts` : "—"} hint="The points your margin loses to callbacks you can't invoice" strong />
          </div>

          <ResultActions text={copyText} label="Warranty cost calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            The fixes, in order of leverage: find the systematic cause (the same detail failing
            on repeat jobs), price warranty-prone work with its drag included, and write the
            warranty term narrowly — what&apos;s covered, for how long, and what voids it. An
            unbounded verbal &quot;we&apos;ll take care of it&quot; is a blank check drawn on this number.
          </p>
        </div>
      </div>
    </section>
  );
}
