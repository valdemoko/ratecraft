import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms that apply to using RateCraft calculators and guides.",
  alternates: { canonical: `${site.url}/terms` },
};

export default function TermsPage() {
  return (
    <div className="container page-pad">
      <div className="prose">
        <h1>Terms of Use</h1>
        <p className="text-small text-muted">Last updated: September 14, 2026</p>

        <h2>Acceptance</h2>
        <p>
          By using {site.name} you agree to these terms. If you don&apos;t agree, please don&apos;t use
          the site.
        </p>

        <h2>What the site provides</h2>
        <p>
          Free, ad-supported-able calculators and educational guides for contractor pricing and
          estimating. Content is provided for general informational and planning purposes only
          and does not constitute accounting, tax, legal, insurance, or financial advice — see
          the <Link href="/disclaimer">disclaimer</Link>.
        </p>

        <h2>Acceptable use</h2>
        <ul>
          <li>You may use the tools and read the content for your own business purposes.</li>
          <li>
            You may not scrape, republish, or resell substantial parts of the site&apos;s content, or
            use it to train competing commercial products, without permission.
          </li>
          <li>You may not attempt to disrupt or overload the site.</li>
        </ul>

        <h2>No warranties</h2>
        <p>
          The site and its content are provided &quot;as is&quot; without warranties of any kind. While we
          work hard to keep formulas and explanations correct, we do not warrant that results
          are error-free or fit for your specific situation. Verify anything consequential
          before acting on it.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, {site.name} is not liable for any losses
          arising from use of the site, including business decisions made based on calculator
          output.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms as the site evolves; the date above reflects the current
          version.
        </p>
      </div>
    </div>
  );
}
