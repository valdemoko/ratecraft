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
  quotesMonth: "10", winsMonth: "3", avgValue: "1200", hoursPerQuote: "1.5", hourlyCost: "45",
};

/**
 * Quote win rate & pipeline calculator. Math (verified in tests/math-verification.mjs, section 23):
 *   winRate        = wins ÷ quotes × 100
 *   valueWinRate   = won value ÷ quoted value × 100
 *   quotesNeeded   = targetWins ÷ (winRate/100)          ← for a win goal
 *   revenueNeeded  = targetRevenue ÷ (avgValue × winRate/100) … expressed in quotes:
 *                    quotesForRevenue = targetRevenue ÷ avgValue ÷ (winRate/100)
 *   estCostMonth   = quotes × hours × hourlyCost         (the real cost of estimating)
 *   estCostPerWin  = estCostMonth ÷ wins                 (a customer-acquisition cost hiding in admin)
 *   lossCostYear   = (quotes − wins) × hours × hourlyCost × 12   (the price of the quotes that said no)
 * Quotes you send aren't free — they're unpaid sales work with a measurable cost per win.
 */
export default function QuoteWinRateCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [quotesMonth, setQuotesMonth] = useState(prefill?.quotesMonth ?? DEFAULTS.quotesMonth);
  const [winsMonth, setWinsMonth] = useState(prefill?.winsMonth ?? DEFAULTS.winsMonth);
  const [avgValue, setAvgValue] = useState(prefill?.avgValue ?? DEFAULTS.avgValue);
  const [hoursPerQuote, setHoursPerQuote] = useState(prefill?.hoursPerQuote ?? DEFAULTS.hoursPerQuote);
  const [hourlyCost, setHourlyCost] = useState(prefill?.hourlyCost ?? DEFAULTS.hourlyCost);

  const q = num(quotesMonth);
  const w = num(winsMonth);
  const val = num(avgValue);
  const hq = num(hoursPerQuote);
  const hcost = num(hourlyCost);

  const valid = q > 0 && w >= 0 && val >= 0 && hq >= 0 && hcost >= 0 && w <= q;
  const winRate = q > 0 ? (w / q) * 100 : NaN;
  const quotedValue = q * val;
  const wonValue = w * val;
  const valueWinRate = quotedValue > 0 ? (wonValue / quotedValue) * 100 : NaN;
  const estCostMonth = q * hq * hcost;
  const estCostPerWin = w > 0 ? estCostMonth / w : NaN;
  const lostCostMonth = (q - w) * hq * hcost;
  const lostCostYear = lostCostMonth * 12;
  const revenueMonth = wonValue;

  const reset = () => {
    setQuotesMonth(DEFAULTS.quotesMonth); setWinsMonth(DEFAULTS.winsMonth); setAvgValue(DEFAULTS.avgValue);
    setHoursPerQuote(DEFAULTS.hoursPerQuote); setHourlyCost(DEFAULTS.hourlyCost);
  };

  const copyText = [
    "RateCraft — Quote Win Rate & Pipeline",
    `Quotes/month: ${fmt.num(q)} · Won: ${fmt.num(w)} → win rate ${fmt.pct(winRate)}`,
    `Quoted value: ${fmt.money(quotedValue)}/mo · Won value: ${fmt.money(wonValue)}/mo (${fmt.pct(valueWinRate)} of value)`,
    `Estimating time: ${fmt.num(q)} × ${fmt.num(hq)} hrs × ${fmt.money(hcost)} = ${fmt.money(estCostMonth)}/mo`,
    `Estimating cost per won job: ${fmt.money(estCostPerWin)}`,
    `Cost of the quotes that said no: ${fmt.money(lostCostMonth)}/mo · ${fmt.money(lostCostYear)}/yr`,
  ].join("\n");

  return (
    <section aria-label="Quote win rate and pipeline calculator">
      <LiveRegion
        message={
          valid && w > 0
            ? `Win rate ${fmt.pct(winRate)}. Estimating costs ${fmt.money(estCostMonth)} a month — ${fmt.money(estCostPerWin)} per won job.`
            : "Enter your monthly quotes and wins to see your conversion and what estimating really costs."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>Your last month (or quarter)</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="qr-quotes" label="Quotes sent" value={quotesMonth} onChange={setQuotesMonth} />
            <Field id="qr-wins" label="Jobs won" value={winsMonth} onChange={setWinsMonth} />
            {w > q && q > 0 && (
              <span className="field-error" role="alert">
                More wins than quotes isn&apos;t possible — check the counts for the same period.
              </span>
            )}
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The job and the estimating</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="qr-value" label="Average quoted job value" value={avgValue} onChange={setAvgValue} unit="$" />
            <Field id="qr-hours" label="Hours to produce one quote" value={hoursPerQuote} onChange={setHoursPerQuote} unit="hrs" hint="Site visit, takeoff, writing it, following up — all of it" />
            <Field id="qr-cost" label="Your burdened hourly cost" value={hourlyCost} onChange={setHourlyCost} unit="$" />
          </div>

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Quote win rate</div>
          <div className="result-primary" style={{ color: "var(--color-brand)" }}>
            {valid && q > 0 ? fmt.pct(winRate) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Quotes", value: fmt.num(q) },
              { label: "Won", value: fmt.num(w) },
              { label: "Win rate", value: valid && q > 0 ? fmt.pct(winRate) : "—", highlight: true },
              { label: "Cost/win", value: valid && w > 0 ? fmt.money(estCostPerWin) : "—" },
            ]}
          />

          <YourCalculation
            formula="Win rate = Jobs won ÷ Quotes sent × 100"
            substitution={
              valid && q > 0
                ? `${fmt.num(w)} ÷ ${fmt.num(q)} × 100 = ${fmt.pct(winRate)}`
                : "Enter the quotes and wins for the same period"
            }
            note="The estimating cost per win is the acquisition cost hiding in your admin time — every lost quote is paid work with no invoice at the end of it."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Win rate" value={valid && q > 0 ? fmt.pct(winRate) : "—"} strong />
            <ResultRow label="Value win rate" value={valid && quotedValue > 0 ? fmt.pct(valueWinRate) : "—"} hint={`${fmt.money(wonValue)} won of ${fmt.money(quotedValue)} quoted — a lower value rate means you're winning the small ones`} />
            <ResultRow label="Revenue per month" value={fmt.money(revenueMonth)} hint={`${fmt.num(w)} jobs × ${fmt.money(val)}`} />
            <ResultRow label="Estimating cost per month" value={fmt.money(estCostMonth)} hint={`${fmt.num(q)} quotes × ${fmt.num(hq)} hrs × ${fmt.money(hcost)}`} />
            <ResultRow label="Estimating cost per won job" value={valid && w > 0 ? fmt.money(estCostPerWin) : "—"} hint="A customer-acquisition cost most businesses never total" tone="warning" strong />
            <ResultRow label="Cost of lost quotes per year" value={fmt.money(lostCostYear)} hint={`${fmt.num(q - w)} quotes a month went nowhere`} strong />
          </div>

          <ResultActions text={copyText} label="Quote win rate calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            What the numbers suggest: a very high win rate with thin revenue usually means
            prices are too low; a very low one with good prices means the wrong leads or slow
            follow-up. The fastest lever is qualifying harder before writing the quote —
            every junk lead deleted costs nothing, every one quoted costs {fmt.money(hq * hcost)}.
          </p>
        </div>
      </div>
    </section>
  );
}
