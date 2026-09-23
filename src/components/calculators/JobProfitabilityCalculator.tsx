"use client";

import { useState } from "react";
import Field from "@/components/calculator/Field";
import ResultRow from "@/components/calculator/ResultRow";
import LiveRegion from "@/components/calculator/LiveRegion";
import MathFlow from "@/components/calculator/MathFlow";
import YourCalculation from "@/components/calculator/YourCalculation";
import ResultActions from "@/components/calculator/ResultActions";
import { fmt, num } from "@/lib/format";

const DEFAULTS = { price: "4000", estCost: "2600", actCost: "3050" };

/**
 * Job profitability calculator — plan vs. actual. Math (verified in
 * tests/math-verification.mjs, section 10):
 *   estProfit = price − estCost ; actProfit = price − actCost
 *   estMargin = estProfit / price × 100 ; actMargin = actProfit / price × 100
 *   pointsLost = estMargin − actMargin
 *   variance = actProfit − estProfit  (= estCost − actCost; negative = worse)
 *   overrun = actCost − estCost ; overrunPct = overrun / estCost × 100
 *   actMarkup = actProfit / actCost × 100
 *   priceToHoldMargin = actCost / (1 − estMargin/100)   [requires 0 < estMargin < 100]
 * Every margin is measured on the contract price, so the gap between plan and
 * actual is expressed in margin points, not cost percentages.
 */
export default function JobProfitabilityCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [price, setPrice] = useState(prefill?.price ?? DEFAULTS.price);
  const [estCost, setEstCost] = useState(prefill?.estCost ?? DEFAULTS.estCost);
  const [actCost, setActCost] = useState(prefill?.actCost ?? DEFAULTS.actCost);

  const p = num(price);
  const est = num(estCost);
  const act = num(actCost);

  const estProfit = p - est;
  const actProfit = p - act;
  const estMargin = p > 0 ? (estProfit / p) * 100 : NaN;
  const actMargin = p > 0 ? (actProfit / p) * 100 : NaN;
  const pointsLost = Number.isFinite(estMargin) && Number.isFinite(actMargin) ? estMargin - actMargin : NaN;
  // Profit variance is signed the conventional way: actual − planned, so a
  // negative number reads as "earned less than the estimate promised".
  const variance = actProfit - estProfit;
  const overrun = act - est;
  const overrunPct = est > 0 ? (overrun / est) * 100 : NaN;
  const actMarkup = act > 0 ? (actProfit / act) * 100 : NaN;

  const marginHoldable = Number.isFinite(estMargin) && estMargin > 0 && estMargin < 100;
  const priceToHoldMargin = marginHoldable ? act / (1 - estMargin / 100) : NaN;

  const lostMoney = p > 0 && actProfit <= 0;
  const beatPlan = Number.isFinite(pointsLost) && pointsLost < 0;

  const reset = () => {
    setPrice(DEFAULTS.price); setEstCost(DEFAULTS.estCost); setActCost(DEFAULTS.actCost);
  };

  const copyText = [
    "RateCraft — Job Profitability (estimate vs. actual)",
    `Contract price: ${fmt.money(p)}`,
    `Estimated cost: ${fmt.money(est)} → planned profit ${fmt.money(estProfit)} (${fmt.pct(estMargin)} margin)`,
    `Actual cost: ${fmt.money(act)} → actual profit ${fmt.money(actProfit)} (${fmt.pct(actMargin)} margin)`,
    `Margin points lost: ${fmt.pct(pointsLost)}`,
    `Profit variance (actual − planned): ${fmt.money(variance)}`,
    `Cost overrun: ${fmt.money(overrun)} (${fmt.pct(overrunPct)})`,
    `Actual markup on cost: ${fmt.pct(actMarkup)}`,
    `Price that would have held the planned margin: ${fmt.money(priceToHoldMargin)}`,
  ].join("\n");

  return (
    <section aria-label="Job profitability calculator">
      <LiveRegion
        message={
          Number.isFinite(actMargin)
            ? `Actual gross margin ${fmt.pct(actMargin)} against a planned ${fmt.pct(estMargin)}. Profit variance ${fmt.money(variance)}.`
            : "Enter the contract price to compare the estimate with the actual cost."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>The job as sold</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="jp2-price" label="Contract price" value={price} onChange={setPrice} unit="$" hint="What the customer agreed to pay" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>What it was meant to cost</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field
              id="jp2-est"
              label="Estimated cost"
              value={estCost}
              onChange={setEstCost}
              unit="$"
              hint="Every direct cost in the quote, plus the overhead allowance you built in"
            />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>What it actually cost</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field
              id="jp2-act"
              label="Actual cost"
              value={actCost}
              onChange={setActCost}
              unit="$"
              hint="Labor at the burdened rate, real invoices, subs, trips, disposal, permits"
            />
          </div>
          {Number.isFinite(actMargin) && actMargin <= 0 && (
            <p role="alert" className="callout callout-warning text-small" style={{ marginBottom: 0 }}>
              This job consumed its whole price in costs — there is nothing left for overhead.
              Check the actuals line by line before you price the next one.
            </p>
          )}
          {Number.isFinite(overrunPct) && overrunPct <= -1 && (
            <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
              The job came in {fmt.pct(Math.abs(overrunPct))} under the estimated cost. Before
              treating that as pure profit, check that the extra labor hours aren&apos;t still sitting
              unpaid in someone&apos;s timesheet.
            </p>
          )}

          <div style={{ marginTop: "var(--space-4)", display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Actual gross margin</div>
          <div
            className="result-primary"
            style={{ color: lostMoney ? "var(--color-danger)" : "var(--color-brand)" }}
          >
            {Number.isFinite(actMargin) ? fmt.pct(actMargin) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Price", value: fmt.money(p) },
              { label: "Actual cost", value: `− ${fmt.money(act)}` },
              { label: "Actual profit", value: fmt.money(actProfit) },
              { label: "Margin", value: Number.isFinite(actMargin) ? fmt.pct(actMargin) : "—", highlight: true },
            ]}
          />

          <YourCalculation
            formula="Actual margin = (Price − Actual cost) ÷ Price"
            substitution={
              p > 0
                ? `(${fmt.money(p)} − ${fmt.money(act)}) ÷ ${fmt.money(p)} = ${fmt.pct(actMargin)}`
                : "Enter the contract price"
            }
            note="Margins are always measured on the selling price — planned and actual alike, so the gap is comparable."
          />

          {Number.isFinite(pointsLost) && (
            <p
              role="status"
              className="text-small"
              style={{
                margin: "var(--space-3) 0 0",
                color: beatPlan ? "var(--color-success)" : lostMoney ? "var(--color-danger)" : "var(--color-warning)",
                fontWeight: 600,
              }}
            >
              {beatPlan
                ? `Ahead of plan by ${fmt.pct(Math.abs(pointsLost))} of margin — ${fmt.money(Math.abs(variance))} more profit than estimated.`
                : `Behind plan by ${fmt.pct(pointsLost)} of margin — ${fmt.money(variance)} of profit gone. That's ${fmt.pct(overrunPct)} on cost, landing on a much smaller number.`}
            </p>
          )}

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Planned profit" value={fmt.money(estProfit)} hint={`${fmt.money(p)} − ${fmt.money(est)}`} />
            <ResultRow label="Actual profit" value={fmt.money(actProfit)} hint={`${fmt.money(p)} − ${fmt.money(act)}`} />
            <ResultRow label="Planned margin" value={fmt.pct(estMargin)} />
            <ResultRow label="Actual margin" value={fmt.pct(actMargin)} strong tone={actProfit > 0 ? "success" : "warning"} />
            <ResultRow label="Profit variance" value={fmt.money(variance)} hint="Actual profit − planned profit: negative means it earned less than promised" />
            <ResultRow label="Cost overrun" value={`${fmt.money(overrun)} (${fmt.pct(overrunPct)})`} />
            <ResultRow label="Actual markup on cost" value={fmt.pct(actMarkup)} hint="Profit ÷ what the job actually cost" />
            <ResultRow
              label={`Price needed to hold ${fmt.pct(estMargin)}`}
              value={Number.isFinite(priceToHoldMargin) ? fmt.money(priceToHoldMargin) : "—"}
              hint="Actual cost ÷ (1 − planned margin) — the quote the real cost required"
            />
          </div>

          <ResultActions text={copyText} label="Job profitability calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            Totals show that the estimate was wrong; they don&apos;t show where. Break the actuals into
            the same lines as the estimate — hours, materials, subs, trips — and the line that
            moved is usually the one worth fixing.
          </p>
        </div>
      </div>
    </section>
  );
}
