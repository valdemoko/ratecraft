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
  invoiceValue: "2500", termsDays: "30", actualDays: "75", annualRate: "20", jobsYear: "60",
};

/**
 * Payment terms / late payment cost calculator. Math (verified in tests/math-verification.mjs, section 25):
 *   extraDays    = actualDays − termsDays
 *   financingCost = invoiceValue × (annualRate/100) × (extraDays ÷ 365)
 *   annualDrag   = jobsYear × financingCost                    (cost of the late-paying book)
 *   The annual rate is what your money costs you: an overdraft/line-of-credit rate, or your
 *   own cost of capital. Slow payment is a loan you give customers at your rate, not theirs.
 * Prompt-pay discount check (in the notes): a 2/10 net 30 discount costs 2% of the invoice
 * to move cash 20 days earlier — an implied annual rate of (2/98) × (365/20) ≈ 37%, far
 * above typical borrowing rates, so taking it is usually sound — offering it is expensive.
 */
export default function PaymentTermsCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [invoiceValue, setInvoiceValue] = useState(prefill?.invoiceValue ?? DEFAULTS.invoiceValue);
  const [termsDays, setTermsDays] = useState(prefill?.termsDays ?? DEFAULTS.termsDays);
  const [actualDays, setActualDays] = useState(prefill?.actualDays ?? DEFAULTS.actualDays);
  const [annualRate, setAnnualRate] = useState(prefill?.annualRate ?? DEFAULTS.annualRate);
  const [jobsYear, setJobsYear] = useState(prefill?.jobsYear ?? DEFAULTS.jobsYear);

  const inv = num(invoiceValue);
  const terms = num(termsDays);
  const actual = num(actualDays);
  const rate = num(annualRate);
  const jy = num(jobsYear);

  const valid = inv > 0 && terms >= 0 && actual >= 0 && rate >= 0;
  const extraDays = actual - terms;
  const isLate = extraDays > 0;
  const financingCost = isLate && valid ? inv * (rate / 100) * (extraDays / 365) : 0;
  const annualDrag = jy > 0 && isLate ? financingCost * jy : NaN;
  const marginEquiv = valid && inv > 0 ? (financingCost / inv) * 100 : NaN;
  const daysCapital = valid ? actual : 0;
  const workingCapital = valid && jy > 0 ? inv * (daysCapital / 365) * jy : NaN;

  const reset = () => {
    setInvoiceValue(DEFAULTS.invoiceValue); setTermsDays(DEFAULTS.termsDays); setActualDays(DEFAULTS.actualDays);
    setAnnualRate(DEFAULTS.annualRate); setJobsYear(DEFAULTS.jobsYear);
  };

  const copyText = [
    "RateCraft — Payment Terms Cost",
    `Invoice: ${fmt.money(inv)} · Terms ${fmt.num(terms)} days · Paid at ${fmt.num(actual)} days (${isLate ? fmt.num(extraDays) + " days late" : "on time"})`,
    isLate
      ? `Financing cost of the delay: ${fmt.money(financingCost)} (${fmt.pct(marginEquiv)} of the invoice)`
      : "Paid within terms — no financing cost.",
    isLate && jy > 0 ? `Across ${fmt.num(jy)} jobs/year: ${fmt.money(annualDrag)} of annual drag` : "",
    isLate && jy > 0 ? `Working capital tied up: about ${fmt.money(workingCapital)}` : "",
    `Assumed cost of money: ${fmt.pct(rate)}/yr (your overdraft, credit line, or own cost of capital)`,
  ].filter(Boolean).join("\n");

  return (
    <section aria-label="Payment terms and late payment cost calculator">
      <LiveRegion
        message={
          valid
            ? isLate
              ? `A payment ${fmt.num(extraDays)} days late costs ${fmt.money(financingCost)} on this invoice — about ${fmt.pct(marginEquiv)} of its value.`
              : "Paid within terms — no financing cost."
            : "Enter the invoice value and payment timing to price the delay."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>The invoice</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="pt-inv" label="Average invoice value" value={invoiceValue} onChange={setInvoiceValue} unit="$" />
            <Field id="pt-jobs" label="Invoices per year" value={jobsYear} onChange={setJobsYear} />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The timing</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="pt-terms" label="Payment terms offered" value={termsDays} onChange={setTermsDays} unit="days" hint="7, 14 or 30 — whatever your invoices state" />
            <Field id="pt-actual" label="Days actually taken to pay" value={actualDays} onChange={setActualDays} unit="days" hint="Your average late payer, or the book's average — be honest" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Your cost of money</h2>
          <div style={{ display: "grid", gap: "var(--space-2)" }}>
            <Field id="pt-rate" label="Annual rate on your money" value={annualRate} onChange={setAnnualRate} unit="%" hint="Overdraft or credit-line rate; your own cost of capital if you're debt-free" />
          </div>

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Cost of this delay</div>
          <div
            className="result-primary"
            style={{ color: isLate && financingCost > 0 ? "var(--color-danger)" : "var(--color-success)" }}
          >
            {valid ? fmt.money(financingCost) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Invoice", value: fmt.money(inv) },
              { label: "Days late", value: isLate ? fmt.num(extraDays) : "0" },
              { label: `× ${fmt.pct(rate)}/yr`, value: fmt.money(financingCost), highlight: isLate },
              { label: "× invoices/yr", value: isLate && jy > 0 ? fmt.money(annualDrag) : "—" },
            ]}
          />

          <YourCalculation
            formula="Financing cost = Invoice × Annual rate × (Days late ÷ 365)"
            substitution={
              valid && isLate
                ? `${fmt.money(inv)} × ${(rate / 100).toFixed(2)} × ${fmt.num(extraDays)}/365 = ${fmt.money(financingCost)}`
                : "The invoice is being paid within terms"
            }
            note="Slow payment is a loan you make to the customer — at your interest rate, not theirs. The margin equivalent shows how much of the job's profit the wait eats."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Days beyond terms" value={valid ? (isLate ? `+${fmt.num(extraDays)} days` : "on time") : "—"} hint={`${fmt.num(terms)} offered → ${fmt.num(actual)} taken`} tone={isLate ? "warning" : "success"} />
            <ResultRow label="Financing cost of the delay" value={valid ? fmt.money(financingCost) : "—"} strong tone={isLate ? "warning" : "success"} />
            <ResultRow label="As a share of the invoice" value={valid ? fmt.pct(marginEquiv) : "—"} hint="Profit gone without a single extra hour of work" />
            <ResultRow label="Annual drag across the book" value={Number.isFinite(annualDrag) ? fmt.money(annualDrag) : "—"} hint={`${fmt.num(jy)} invoices/year at this timing`} strong />
            <ResultRow label="Working capital tied up" value={Number.isFinite(workingCapital) ? fmt.money(workingCapital) : "—"} hint="Money owed to you at any moment — the float you finance" />
          </div>

          <ResultActions text={copyText} label="Payment terms calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            The levers: deposits on long jobs (30–50% kills most of the float), payment on
            completion over net terms where you can, and a stated late fee that gets applied.
            On offering early-pay discounts: 2/10 net 30 implies a ~37% annual rate to move cash
            20 days — cheap if you borrow at {fmt.pct(rate)}, expensive if you don&apos;t.
          </p>
        </div>
      </div>
    </section>
  );
}
