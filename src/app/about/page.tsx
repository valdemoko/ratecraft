import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About & Methodology",
  description:
    "What RateCraft is, how the calculators are built, how formulas and ranges are chosen, and the limitations you should know about.",
  alternates: { canonical: `${site.url}/about` },
};

export default function AboutPage() {
  return (
    <div className="container page-pad">
      <div className="prose">
        <h1>About {site.name}</h1>

        <h2>Who created {site.name}</h2>
        <p>
          {site.name} was created by <strong>Miguel Iglesias Valenzuela</strong>. It exists
          because pricing tools for contractors almost always hide the math behind a result —
          or gate it behind a signup wall. This site takes the opposite approach: every
          formula is shown, every example can be checked by hand, and nothing you type leaves
          your browser.
        </p>
        {/* TODO(pre-deploy): paste the real LinkedIn profile URL below and uncomment.
            Must NOT be invented — only add when the exact URL is confirmed.
        <p>
          <a
            href="https://www.linkedin.com/in/REPLACE-WITH-REAL-SLUG"
            target="_blank"
            rel="noopener noreferrer"
          >
            Miguel Iglesias Valenzuela on LinkedIn →
          </a>
        </p>
        */}

        <h2>What {site.name} is for</h2>
        <p>
          Free tools that help contractors and service businesses understand the numbers
          behind a price: labor and labor burden, materials, subcontractors, travel, overhead,
          markup, margin, job pricing and flat-rate pricing. Each calculator owns one link in
          that chain and links to the next.
        </p>

        <h2>How the calculations work</h2>
        <p>
          Every calculator shows the formulas it uses, a worked example with real numbers, and
          a step-by-step breakdown of your own result — instead of hiding the logic behind the
          answer. The formulas are standard business accounting definitions of markup, gross
          margin, labor burden and break-even, not invented ones. A test suite verifies the
          math on every change.
        </p>

        <h2>Transparency</h2>
        <ul>
          <li>
            Results are <strong>planning tools</strong>, not accounting, tax, or legal advice.
          </li>
          <li>
            Real costs vary by trade, region, class code and business model — your own
            financials always beat any default or range shown here.
          </li>
          <li>
            Where typical ranges are cited (for example, labor burden of roughly 25–40% of
            wages), they are planning heuristics from industry writing, <em>not</em> invented
            benchmarks or verified statistics.
          </li>
          <li>
            Adapt every result to your market and situation before quoting — that judgment is
            yours; the arithmetic here just makes it honest.
          </li>
        </ul>

        <h2>Why the formulas are public</h2>
        <p>
          Pricing decisions cost real money, so every calculator states the formulas it uses,
          the assumptions behind its defaults, and what the results do and don&apos;t account for.
          If you disagree with an input or a formula, you can see exactly where — and{" "}
          <Link href="/contact">tell us</Link>.
        </p>

        <h2>What this is</h2>
        <p>
          {site.name} is a set of free calculators and guides for contractors and small service
          businesses in the US: markup, margin, job pricing, labor burden, overhead and
          break-even. The goal is narrow — help you answer, with your own numbers:{" "}
          <em>what should I charge for this job, and what will it actually leave me?</em>
        </p>

        <h2>How the calculators are developed</h2>
        <ul>
          <li>
            <strong>Standard formulas first.</strong> Tools are built on standard business
            accounting definitions of markup, gross margin, labor burden and break-even, not
            invented ones. Each formula is listed on its tool page.
          </li>
          <li>
            <strong>Trades-specific inputs.</strong> Inputs reflect how trades businesses
            actually incur costs: burdened labor, workers&apos; comp class codes, non-billable hours,
            overhead recovery per job.
          </li>
          <li>
            <strong>Everything runs in your browser.</strong> Calculations happen client-side.
            No account, no data sent to a server, nothing stored.
          </li>
        </ul>

        <h2>How ranges and examples are handled</h2>
        <p>
          Where explanations cite typical ranges (for example, labor burden of roughly 25–40% of
          wages for trades businesses), they are planning heuristics gathered from industry
          writing, not verified benchmarks — and they&apos;re labeled as such. Your own financials
          always beat any published range. We don&apos;t invent statistics, regulations, or tax
          figures; where a topic depends on your jurisdiction or tax situation, we say so and
          point you to a qualified professional.
        </p>

        <h2>Limitations</h2>
        <ul>
          <li>Results are estimates for planning, not accounting, tax, or legal advice.</li>
          <li>Defaults are illustrative starting points, not recommendations for your business.</li>
          <li>
            Tax treatment (payroll taxes, deductions) varies by state and situation — see our{" "}
            <Link href="/disclaimer">disclaimer</Link>.
          </li>
        </ul>

        <h2>Contact</h2>
        <p>
          Corrections, bug reports, and suggestions for tools are welcome — email{" "}
          <a href="mailto:contacto@ratecraft.site">contacto@ratecraft.site</a> or use the{" "}
          <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </div>
  );
}
