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
  price: "12000", depositPct: "30", materialsPct: "45", margin: "35", retentionPct: "0",
};

/**
 * Deposit & progress billing calculator. Math (verified in tests/math-verification.mjs, section 29):
 *   deposit$      = price × depositPct/100
 *   materials$    = price × materialsPct/100
 *   laborPct      = 100 − materialsPct (remaining work share of price)
 *   Your exposure after the deposit = total cost − deposit$, and the schedule question is
 *   whether each payment arrives before the costs it has to fund.
 *   totalCost     = price × (1 − margin/100)
 *   funding gap   = totalCost − deposit$ − retention$
 *   retention$    = price × retentionPct/100 (withheld until completion, if the contract has it)
 * The core check: deposit ≥ materials + mobilization, so the customer's money — not your
 * float — pays for the job's front-loaded costs.
 */
export default function DepositScheduleCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [price, setPrice] = useState(prefill?.price ?? DEFAULTS.price);
  const [depositPct, setDepositPct] = useState(prefill?.depositPct ?? DEFAULTS.depositPct);
  const [materialsPct, setMaterialsPct] = useState(prefill?.materialsPct ?? DEFAULTS.materialsPct);
  const [margin, setMargin] = useState(prefill?.margin ?? DEFAULTS.margin);
  const [retentionPct, setRetentionPct] = useState(prefill?.retentionPct ?? DEFAULTS.retentionPct);

  const p = num(price);
  const dep = num(depositPct);
  const mat = num(materialsPct);
  const m = num(margin);
  const ret = num(retentionPct);

  const valid = p > 0 && dep >= 0 && dep <= 100 && mat >= 0 && mat <= 100 && m > 0 && m < 100 && ret >= 0 && ret < 50;
  const depositAmt = p * (dep / 100);
  const materialsAmt = p * (mat / 100);
  const totalCost = p * (1 - m / 100);
  const retentionAmt = p * (ret / 100);
  const exposure = totalCost - depositAmt;
  const finalPayment = p - depositAmt - retentionAmt;
  const materialsCovered = depositAmt >= materialsAmt;
  const floatFinanced = materialsAmt - depositAmt > 0 ? materialsAmt - depositAmt : 0;
  const finalExposure = exposure - retentionAmt;
  const marginDollars = p - totalCost;

  const reset = () => {
    setPrice(DEFAULTS.price); setDepositPct(DEFAULTS.depositPct); setMaterialsPct(DEFAULTS.materialsPct);
    setMargin(DEFAULTS.margin); setRetentionPct(DEFAULTS.retentionPct);
  };

  const copyText = [
    "RateCraft — Deposit & Progress Billing",
    `Contract: ${fmt.money(p)} at ${fmt.pct(m)} margin → total cost ${fmt.money(totalCost)}`,
    `Deposit ${fmt.pct(dep)}: ${fmt.money(depositAmt)}`,
    `Front-loaded materials ${fmt.pct(mat)}: ${fmt.money(materialsAmt)} — ${materialsCovered ? "covered by the deposit" : `NOT covered; your float finances ${fmt.money(floatFinanced)}`}`,
    `Final payment due at completion: ${fmt.money(finalPayment)}${ret > 0 ? ` (after ${fmt.money(retentionAmt)} retention)` : ""}`,
    `Your exposure after deposit: ${fmt.money(exposure)} of cost`,
    ret > 0 ? `Exposure after deposit, before releasing retention: ${fmt.money(finalExposure)}` : "",
  ].filter(Boolean).join("\n");

  return (
    <section aria-label="Deposit and progress billing calculator">
      <LiveRegion
        message={
          valid
            ? `A ${fmt.pct(dep)} deposit is ${fmt.money(depositAmt)} — ${materialsCovered ? "it covers" : "it does not cover"} the ${fmt.money(materialsAmt)} of front-loaded materials.`
            : "Enter the contract price, deposit and material share to check the funding schedule."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>The contract</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="ds-price" label="Contract price" value={price} onChange={setPrice} unit="$" />
            <Field id="ds-margin" label="Gross margin priced in" value={margin} onChange={setMargin} unit="%" hint="Between 0 and 100 — the Margin Calculator checks it" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The schedule</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="ds-dep" label="Deposit at signing" value={depositPct} onChange={setDepositPct} unit="%" hint="25–50% is the common range where law allows" />
            <Field id="ds-mat" label="Materials as a share of price" value={materialsPct} onChange={setMaterialsPct} unit="%" hint="What the job spends up front before labor accrues" />
            <Field id="ds-ret" label="Retention withheld by customer" value={retentionPct} onChange={setRetentionPct} unit="%" hint="0 for residential work; commercial contracts often hold 5–10%" />
          </div>

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Deposit collected at signing</div>
          <div className="result-primary" style={{ color: "var(--color-brand)" }}>
            {valid ? fmt.money(depositAmt) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Contract", value: fmt.money(p) },
              { label: `× ${fmt.pct(dep)} deposit`, value: fmt.money(depositAmt), highlight: true },
              { label: "Materials", value: fmt.money(materialsAmt) },
              { label: materialsCovered ? "Covered" : "Float needed", value: materialsCovered ? "yes" : fmt.money(floatFinanced) },
            ]}
          />

          <YourCalculation
            formula="Deposit $ = Contract × Deposit % — must cover materials + mobilization"
            substitution={
              valid
                ? `${fmt.money(p)} × ${(dep / 100).toFixed(2)} = ${fmt.money(depositAmt)} vs ${fmt.money(materialsAmt)} of front-loaded materials`
                : "Enter the contract price and schedule percentages"
            }
            note="The rule the schedule exists to enforce: the customer's money pays the job's front-loaded costs, never your float."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Total cost to you" value={valid ? fmt.money(totalCost) : "—"} hint={`${fmt.money(marginDollars)} of margin in the contract`} />
            <ResultRow label="Deposit at signing" value={valid ? fmt.money(depositAmt) : "—"} strong />
            <ResultRow
              label="Front-loaded materials"
              value={fmt.money(materialsAmt)}
              hint={materialsCovered ? "Covered by the deposit" : `Your float finances ${fmt.money(floatFinanced)} until the next payment`}
              tone={materialsCovered ? "success" : "warning"}
              strong
            />
            <ResultRow label="Your cost exposure after deposit" value={valid ? fmt.money(exposure) : "—"} hint="Unrecovered cost while the work proceeds" tone={exposure > p * 0.5 ? "warning" : "default"} />
            {ret > 0 && (
              <ResultRow label="Retention held until completion" value={fmt.money(retentionAmt)} hint={`Your exposure before releasing it: ${fmt.money(finalExposure)}`} tone="warning" />
            )}
            <ResultRow label="Final payment at completion" value={valid ? fmt.money(finalPayment) : "—"} strong />
          </div>

          <ResultActions text={copyText} label="Deposit schedule calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            Structure the milestones the same way: each payment should arrive before the costs
            it funds — mobilization, rough-in, finish, completion. Two limits to respect: many
            jurisdictions cap residential deposits by law (California, for example, caps them
            at $1,000 or 10% whichever is less — check yours), and a schedule that front-loads
            payments beyond work performed reads as a red flag to customers and lawyers alike.
          </p>
        </div>
      </div>
    </section>
  );
}
