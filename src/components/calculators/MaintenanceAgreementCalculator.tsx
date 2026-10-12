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
  visitsYear: "2", hoursVisit: "1.5", hourlyCost: "38", travelVisit: "15",
  materialsVisit: "10", adminYear: "50", margin: "30",
  discount: "10", upsellRate: "40", upsellValue: "180", retention: "80",
};

/**
 * Maintenance agreement calculator. Math (verified in tests/math-verification.mjs, section 26):
 *   visitCost      = hours × hourlyCost + travel + materials
 *   annualCost     = visits × visitCost + adminYear
 *   annualPrice    = annualCost ÷ (1 − margin/100)
 *   monthlyPrice   = annualPrice ÷ 12
 *   contribution   = annualPrice − annualCost
 *   upsellPerMember= upsellRate/100 × upsellValue × (1 − discount/100)
 *   memberValue    = annualPrice + upsellPerMember          (year-one value of a member)
 *   ltv3           = memberValue × (1 + retention/100 + (retention/100)²)
 *   revFloor       = monthlyPrice × members                 (recurring revenue floor, if entered)
 * The upsell is a probability-weighted expectation, not guaranteed revenue — the plan must
 * stand on its own price, exactly as Nexus's honest version argues. Discount row shows what
 * a members-only repair discount costs in expectation.
 */
export default function MaintenanceAgreementCalculator({ prefill }: { prefill?: Record<string, string> }) {
  const [visitsYear, setVisitsYear] = useState(prefill?.visitsYear ?? DEFAULTS.visitsYear);
  const [hoursVisit, setHoursVisit] = useState(prefill?.hoursVisit ?? DEFAULTS.hoursVisit);
  const [hourlyCost, setHourlyCost] = useState(prefill?.hourlyCost ?? DEFAULTS.hourlyCost);
  const [travelVisit, setTravelVisit] = useState(prefill?.travelVisit ?? DEFAULTS.travelVisit);
  const [materialsVisit, setMaterialsVisit] = useState(prefill?.materialsVisit ?? DEFAULTS.materialsVisit);
  const [adminYear, setAdminYear] = useState(prefill?.adminYear ?? DEFAULTS.adminYear);
  const [margin, setMargin] = useState(prefill?.margin ?? DEFAULTS.margin);
  const [discount, setDiscount] = useState(prefill?.discount ?? DEFAULTS.discount);
  const [upsellRate, setUpsellRate] = useState(prefill?.upsellRate ?? DEFAULTS.upsellRate);
  const [upsellValue, setUpsellValue] = useState(prefill?.upsellValue ?? DEFAULTS.upsellValue);
  const [retention, setRetention] = useState(prefill?.retention ?? DEFAULTS.retention);
  const [members, setMembers] = useState(prefill?.members ?? "0");

  const visits = num(visitsYear);
  const hrs = num(hoursVisit);
  const hcost = num(hourlyCost);
  const trav = num(travelVisit);
  const mats = num(materialsVisit);
  const admin = num(adminYear);
  const m = num(margin);
  const disc = num(discount);
  const uRate = num(upsellRate);
  const uVal = num(upsellValue);
  const ret = num(retention);
  const mem = num(members);

  const valid = visits > 0 && hrs >= 0 && hcost > 0 && m > 0 && m < 100 && ret >= 0 && ret < 100;
  const visitCost = hrs * hcost + trav + mats;
  const annualCost = visits * visitCost + admin;
  const annualPrice = valid ? annualCost / (1 - m / 100) : NaN;
  const monthlyPrice = annualPrice / 12;
  const contribution = annualPrice - annualCost;
  const upsellPerMember = valid ? (uRate / 100) * uVal * (1 - disc / 100) : NaN;
  const memberValue = annualPrice + upsellPerMember;
  const r = ret / 100;
  const ltv3 = memberValue * (1 + r + r * r);
  const revFloor = mem > 0 ? monthlyPrice * mem : NaN;

  const reset = () => {
    setVisitsYear(DEFAULTS.visitsYear); setHoursVisit(DEFAULTS.hoursVisit); setHourlyCost(DEFAULTS.hourlyCost);
    setTravelVisit(DEFAULTS.travelVisit); setMaterialsVisit(DEFAULTS.materialsVisit); setAdminYear(DEFAULTS.adminYear);
    setMargin(DEFAULTS.margin); setDiscount(DEFAULTS.discount); setUpsellRate(DEFAULTS.upsellRate);
    setUpsellValue(DEFAULTS.upsellValue); setRetention(DEFAULTS.retention); setMembers("0");
  };

  const copyText = [
    "RateCraft — Maintenance Agreement Pricing",
    `Visit cost: ${fmt.money(visitCost)} (${fmt.num(hrs)} hrs × ${fmt.money(hcost)} + ${fmt.money(trav)} travel + ${fmt.money(mats)} materials)`,
    `Annual fulfillment cost: ${fmt.money(annualCost)} (${fmt.num(visits)} visits + ${fmt.money(admin)} admin)`,
    `Annual plan price at ${fmt.pct(m)} margin: ${fmt.money(annualPrice)}`,
    `Monthly equivalent: ${fmt.money(monthlyPrice)}/mo`,
    `Contribution per member per year: ${fmt.money(contribution)}`,
    `Expected upsell per member: ${fmt.money(upsellPerMember)} (probability-weighted)`,
    `Year-one member value: ${fmt.money(memberValue)}`,
    `3-year value per member at ${fmt.pct(ret)} retention: ${fmt.money(ltv3)}`,
    mem > 0 ? `Revenue floor at ${fmt.num(mem)} members: ${fmt.money(revFloor)}/mo` : "",
  ].filter(Boolean).join("\n");

  return (
    <section aria-label="Maintenance agreement pricing calculator">
      <LiveRegion
        message={
          valid
            ? `Plan priced at ${fmt.money(annualPrice)} a year — ${fmt.money(monthlyPrice)} a month — with ${fmt.money(contribution)} of annual contribution per member.`
            : "Enter the visit costs and a margin between 0 and 100 to price the plan."
        }
      />

      <div className="grid-2">
        <form className="card card-pad" onSubmit={(e) => e.preventDefault()}>
          <h2 style={{ fontSize: "var(--text-h3)" }}>What a visit costs you</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="ma-visits" label="Visits included per year" value={visitsYear} onChange={setVisitsYear} />
            <Field id="ma-hours" label="Tech hours per visit" value={hoursVisit} onChange={setHoursVisit} unit="hrs" />
            <Field id="ma-rate" label="Burdened labor cost per hour" value={hourlyCost} onChange={setHourlyCost} unit="$" hint="Loaded cost — not your selling rate, or profit gets counted twice" />
            <Field id="ma-travel" label="Travel cost per visit" value={travelVisit} onChange={setTravelVisit} unit="$" hint="The Truck Roll Calculator produces this" />
            <Field id="ma-materials" label="Materials / consumables per visit" value={materialsVisit} onChange={setMaterialsVisit} unit="$" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>The plan</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="ma-admin" label="Admin cost per member per year" value={adminYear} onChange={setAdminYear} unit="$" hint="Billing, scheduling, renewals" />
            <Field id="ma-margin" label="Target contribution margin" value={margin} onChange={setMargin} unit="%" hint="Between 0 and 100 — must also cover overhead not entered here" />
            <Field id="ma-discount" label="Repair discount for members" value={discount} onChange={setDiscount} unit="%" hint="Common retention perk — priced in expectation below" />
          </div>

          <h2 style={{ fontSize: "var(--text-h3)", marginTop: "var(--space-5)" }}>What a member is worth</h2>
          <div style={{ display: "grid", gap: "var(--space-3)" }}>
            <Field id="ma-upsellrate" label="Share of visits that find extra work" value={upsellRate} onChange={setUpsellRate} unit="%" hint="Probability-weighted — not a promise" />
            <Field id="ma-upsellvalue" label="Average extra work per finding" value={upsellValue} onChange={setUpsellValue} unit="$" />
            <Field id="ma-retention" label="Renewal rate" value={retention} onChange={setRetention} unit="%" hint="Well-run programs retain 75–85%" />
            <Field id="ma-members" label="Current members (optional)" value={members} onChange={setMembers} hint="To see the recurring revenue floor" />
          </div>

          <div style={{ marginTop: "var(--space-4)" }}>
            <button type="button" onClick={reset} className="btn btn-secondary">Reset to example values</button>
          </div>
        </form>

        <div className="result-panel">
          <div className="result-label">Plan price per year</div>
          <div className="result-primary" style={{ color: "var(--color-brand)" }}>
            {valid ? fmt.money(annualPrice) : "—"}
          </div>

          <MathFlow
            steps={[
              { label: "Visit cost", value: fmt.money(visitCost) },
              { label: `× ${fmt.num(visits)} visits`, value: fmt.money(annualCost) },
              { label: `÷ ${(1 - m / 100).toFixed(2)}`, value: fmt.money(annualPrice), highlight: true },
              { label: "Monthly", value: `${fmt.money(monthlyPrice)}/mo` },
            ]}
          />

          <YourCalculation
            formula="Annual price = (Visits × Cost per visit + Admin) ÷ (1 − Target margin)"
            substitution={
              valid
                ? `(${fmt.num(visits)} × ${fmt.money(visitCost)} + ${fmt.money(admin)}) ÷ ${(1 - m / 100).toFixed(2)} = ${fmt.money(annualPrice)}`
                : "Enter visit costs and a margin between 0 and 100"
            }
            note="Dividing prices to the margin, as everywhere on RateCraft. The contribution covers whatever overhead you didn't enter — it is not automatically net profit."
          />

          <div style={{ marginTop: "var(--space-4)" }}>
            <ResultRow label="Cost per visit" value={valid ? fmt.money(visitCost) : "—"} hint={`${fmt.num(hrs)} hrs labor + ${fmt.money(trav)} travel + ${fmt.money(mats)} materials`} />
            <ResultRow label="Annual fulfillment cost per member" value={valid ? fmt.money(annualCost) : "—"} strong />
            <ResultRow label="Annual plan price" value={valid ? fmt.money(annualPrice) : "—"} strong />
            <ResultRow label="Monthly equivalent" value={valid ? `${fmt.money(monthlyPrice)}/mo` : "—"} hint="Annual ÷ 12 — no annual-payment discount assumed" />
            <ResultRow label="Contribution per member per year" value={valid ? fmt.money(contribution) : "—"} hint="Covers overhead and net — the plan must earn this on its own" tone="success" />
            <ResultRow label="Expected upsell per member" value={valid ? fmt.money(upsellPerMember) : "—"} hint={`${fmt.pct(uRate)} of visits × ${fmt.money(uVal)} × (1 − ${fmt.pct(disc)} member discount)`} />
            <ResultRow label="Year-one member value" value={valid ? fmt.money(memberValue) : "—"} hint="Plan + expected extra work" strong />
            <ResultRow label="3-year value per member" value={valid ? fmt.money(ltv3) : "—"} hint={`At ${fmt.pct(ret)} renewal: year 1 + ${fmt.pct(ret)} + ${fmt.pct(ret * ret)} of value`} strong />
          </div>

          {mem > 0 && (
            <ResultRow
              label={`Revenue floor at ${fmt.num(mem)} members`}
              value={`${fmt.money(revFloor)}/mo`}
              hint="Recurring revenue that arrives whether the phone rings or not"
              tone="success"
              strong
            />
          )}

          <ResultActions text={copyText} label="Maintenance agreement calculation" />

          <p className="text-small text-muted" style={{ marginTop: "var(--space-3)", marginBottom: 0 }}>
            The honest rule this tool enforces: a plan must be profitable on its own price —
            upsell revenue is an expectation, not a subsidy for underpricing. Bill monthly to
            flatten the cash curve, schedule visits in your slow season, and reprice annually:
            a plan set three years ago is priced for a business that no longer exists.
          </p>
        </div>
      </div>
    </section>
  );
}
