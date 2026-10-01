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
  price: "3200", resaleYears: "6", ownCostDay: "12", rentDay: "65", daysYear: "30",
};

/**
 * Equipment buy vs rent calculator. Math (verified in tests/math-verification.mjs, section 24):
 *   capitalPerYear = price ÷ workingLife
 *   annualOwn      = capitalPerYear + ownCostDay × daysUsed
 *   annualRent     = rentDay × daysUsed
 *   breakEvenDays  = capitalPerYear ÷ (rentDay − ownCostDay)
 *   ownedDayCost   = capitalPerYear ÷ daysUsed + ownCostDay
 * Conventions: the purchase is spread over the tool's working life (capital recovery), and
 * the daily ownership cost — fuel, wear, consumables — applies to days of use. Storage and
 * insurance that run year-round belong in the Overhead Calculator, not here; double-counting
 * them per day is the classic error that makes owning look artificially cheap.
 */
export default function BuyVsRentCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [price, setPrice] = useState(prefill?.price ?? DEFAULTS.price);
  const [resaleYears, setResaleYears] = useState(prefill?.resaleYears ?? DEFAULTS.resaleYears);
  const [ownCostDay, setOwnCostDay] = useState(prefill?.ownCostDay ?? DEFAULTS.ownCostDay);
  const [rentDay, setRentDay] = useState(prefill?.rentDay ?? DEFAULTS.rentDay);
  const [daysYear, setDaysYear] = useState(prefill?.daysYear ?? DEFAULTS.daysYear);

  const p = num(price);
  const years = num(resaleYears);
  const ownDay = num(ownCostDay);
  const rent = num(rentDay);
  const days = num(daysYear);

  const valid = p > 0 && years > 0 && rent > 0 && ownDay >= 0 && days >= 0;
  const capitalPerYear = p / years;
  const breakEvenDays = rent > ownDay ? capitalPerYear / (rent - ownDay) : NaN;
  const annualOwn = valid ? capitalPerYear + ownDay * days : NaN;
  const annualRent = valid ? rent * days : NaN;
  const saving = valid && days > 0 ? annualRent - annualOwn : NaN;
  const buyWins = Number.isFinite(saving) ? saving > 0 : false;
  const ownedDayCost = days > 0 ? capitalPerYear / days + ownDay : NaN;

  const reset = () => {
    setPrice(DEFAULTS.price); setResaleYears(DEFAULTS.resaleYears); setOwnCostDay(DEFAULTS.ownCostDay);
    setRentDay(DEFAULTS.rentDay); setDaysYear(DEFAULTS.daysYear);
  };

  const copyText = [
    "RateCraft — Buy vs Rent",
    `Equipment: ${fmt.money(p)} over ${fmt.num(years)} yrs → ${fmt.money(capitalPerYear)}/yr capital recovery`,
    `Owned day cost at ${fmt.num(days)} days/yr: ${fmt.money(ownedDayCost)} (capital + wear per use day)`,
    `Rental: ${fmt.money(rent)}/day × ${fmt.num(days)} days = ${fmt.money(annualRent)}/yr`,
    `Ownership: ${fmt.money(capitalPerYear)} + (${fmt.money(ownDay)} × ${fmt.num(days)}) = ${fmt.money(annualOwn)}/yr`,
    days > 0
      ? `At ${fmt.num(days)} days/year: ${buyWins ? `buying saves ${fmt.money(saving)}/yr` : `renting saves ${fmt.money(-saving)}/yr`}`
      : "",
    `Break-even: about ${Number.isFinite(breakEvenDays) ? Math.ceil(breakEvenDays) : "—"} days of use per year`,
  ].filter(Boolean).join("\n");

  return (
    <section aria-label="Buy vs rent equipment calculator">
      <LiveRegion
        message={
          valid && days > 0
            ? `At ${fmt.num(days)} days a year, ${buyWins ? "buying" : "renting"} is cheaper — saving ${fmt.money(Math.abs(saving))} a year. Break-even is about ${Number.isFinite(breakEvenDays) ? Math.ceil(breakEvenDays) : "—"} days.`
            : "Enter the purchase price, rental rate and expected days of use to find the break-even."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>Owning it</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="br-price" label="Purchase price" value={price} onChange={setPrice} unit="$" />
            <Field id="br-years" label="Working life" value={resaleYears} onChange={setResaleYears} unit="yrs" hint="Years you'll actually use it, not how long it could last" />
            <Field id="br-own" label="Cost of owning per day of use" value={ownCostDay} onChange={setOwnCostDay} unit="$" hint="Fuel, wear, consumables — the costs that scale with days on the tools" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Renting it</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="br-rent" label="Rental rate per day" value={rentDay} onChange={setRentDay} unit="$" hint="Delivery, fuel and the yard's maintenance are the renter's problem" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>Your usage</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="br-days" label="Days of use per year" value={daysYear} onChange={setDaysYear} hint="Honest days on the tools — not days you might need it" />
          </div>
          {valid && rent <= ownDay && (
            <p role="alert" className="callout callout-warning text-small" style={{ marginBottom: 0, marginTop: "var(--space-3)" }}>
              The daily rental rate is at or below your per-day cost of owning — at that rate,
              renting wins at any usage level.
            </p>
          )}

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Break-even days of use per year</div>
          <div className="result-primary" style={{ color: "var(--color-brand)" }}>
            {valid ? `${Number.isFinite(breakEvenDays) ? Math.ceil(breakEvenDays) : "—"} days` : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Capital/yr", value: fmt.money(capitalPerYear) },
              { label: "÷ (rent − own)", value: valid ? `${fmt.money(rent)} − ${fmt.money(ownDay)}` : "—" },
              { label: "Break-even", value: valid ? `${Number.isFinite(breakEvenDays) ? Math.ceil(breakEvenDays) : "—"} days/yr` : "—", highlight: true },
            ]}
          />

          <YourCalculation
            formula="Break-even days = (Price ÷ Working life) ÷ (Rental rate − Daily ownership cost)"
            substitution={
              valid
                ? `${fmt.money(capitalPerYear)} ÷ (${fmt.money(rent)} − ${fmt.money(ownDay)}) = ${Number.isFinite(breakEvenDays) ? Math.ceil(breakEvenDays) : "—"} days`
                : "Enter a price, a working life and a rental rate"
            }
            note="Above this many days a year, owning is cheaper; below it, renting wins. The purchase is spread over the tool's working life — not all charged to year one."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="True cost of an owned day" value={valid && days > 0 ? `${fmt.money(ownedDayCost)}/day` : "—"} hint={`${fmt.money(days > 0 ? capitalPerYear / days : NaN)} capital + ${fmt.money(ownDay)} wear, at ${fmt.num(days)} days/yr`} />
            <ResultRow label="Annual cost of owning" value={valid ? fmt.money(annualOwn) : "—"} hint={`${fmt.money(capitalPerYear)} capital + ${fmt.money(ownDay)} × ${fmt.num(days)} days`} />
            <ResultRow label="Annual cost of renting" value={valid ? fmt.money(annualRent) : "—"} hint={`${fmt.money(rent)}/day × ${fmt.num(days)} days`} />
            {days > 0 && (
              <ResultRow
                label={buyWins ? "Buying saves per year" : "Renting saves per year"}
                value={fmt.money(Math.abs(saving))}
                hint={`At ${fmt.num(days)} days of use`}
                tone={buyWins ? "success" : "warning"}
                strong
              />
            )}
          </div>

          <ResultActions text={copyText} label="Buy vs rent calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            The math covers cash, not capability: owning means the tool is there on the
            surprise Saturday job; renting means flexibility and zero shelf. A fair rule: buy
            what the break-even justifies with margin to spare, rent what comes down once or
            twice a year — and let the number, not the excitement of new kit, decide the gray zone.
          </p>
        </div>
      </div>
    </section>
  );
}
