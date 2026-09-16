import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "RateCraft calculators are planning estimates, not accounting, tax, or legal advice.",
  alternates: { canonical: `${site.url}/disclaimer` },
  // Utility page: indexable content is elsewhere — save crawl budget.
  robots: { index: false, follow: true },
};

export default function DisclaimerPage() {
  return (
    <div className="container page-pad">
      <div className="prose">
        <h1>Disclaimer</h1>
        <p className="text-small text-muted">Last updated: September 14, 2026</p>

        <h2>Estimates, not advice</h2>
        <p>
          {site.name} provides calculators and educational content for planning purposes. The
          results are estimates based on the numbers you enter and the assumptions stated on
          each page. They are <strong>not</strong> accounting, tax, legal, insurance, or
          financial advice, and they are not a substitute for a qualified professional who knows
          your business.
        </p>

        <h2>You enter the numbers</h2>
        <p>
          Output quality depends entirely on input quality. A burdened labor rate, overhead
          percentage, or markup that doesn&apos;t reflect your real financials will produce a
          confidently wrong answer. Check anything consequential against your books before
          quoting or making business decisions.
        </p>

        <h2>Ranges and examples</h2>
        <p>
          Typical ranges cited in explanations (for example, labor burden of roughly 25–40% of
          base wages) are planning heuristics from industry writing, not verified benchmarks or
          guarantees. Worked examples are illustrative.
        </p>

        <h2>Taxes and regulations</h2>
        <p>
          Payroll taxes, workers&apos; compensation, licensing and contracting law vary by state and
          change over time. Nothing on this site addresses your specific jurisdiction. Consult
          your accountant, insurer, or attorney for those matters.
        </p>
      </div>
    </div>
  );
}
