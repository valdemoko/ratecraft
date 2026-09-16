import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What data RateCraft collects (almost none), and how analytics and advertising, if enabled, would work.",
  alternates: { canonical: `${site.url}/privacy` },
  // Utility page: indexable content is elsewhere — save crawl budget.
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="container page-pad">
      <div className="prose">
        <h1>Privacy Policy</h1>
        <p className="text-small text-muted">Last updated: September 14, 2026</p>

        <p>
          This policy describes what {site.name} does — and does not — do with data. It is
          written to match how the site actually works, not copied from a template.
        </p>

        <h2>Data the site does not collect</h2>
        <ul>
          <li>
            <strong>No accounts.</strong> The site has no login or registration.
          </li>
          <li>
            <strong>No form submissions.</strong> There is no contact form database; contact is
            by email, and email you send us is handled like any personal email.
          </li>
          <li>
            <strong>Calculator inputs.</strong> Everything you type into a calculator is
            processed in your browser and never sent to our servers. When you close the page,
            it&apos;s gone.
          </li>
        </ul>

        <h2>Server logs</h2>
        <p>
          Like virtually all websites, our hosting provider (Vercel) automatically records basic
          request logs (IP address, requested URL, timestamp) for security and operational
          purposes. We do not use these logs to profile visitors.
        </p>

        <h2>Analytics</h2>
        <p>
          If we enable analytics (Google Analytics 4) in the future, it will be disclosed here
          with the specific data collected before it goes live. It is currently{" "}
          <strong>not enabled</strong>.
        </p>

        <h2>Advertising and cookies</h2>
        <p>
          The site currently shows <strong>no advertising and sets no advertising cookies</strong>.
          If we later join Google AdSense, Google and its partners may use cookies to serve ads
          based on your visits to this and other sites. At that point this policy and our{" "}
          <Link href="/cookies">Cookie Policy</Link> will be updated, and where required by law,
          consent will be collected before non-essential cookies are set. See Google&apos;s own
          privacy notice for how Google uses data from its ad services.
        </p>

        <h2>Children</h2>
        <p>This site is intended for business users and is not directed at children under 13.</p>

        <h2>Your rights</h2>
        <p>
          If you have privacy questions or believe we hold personal data about you (for example,
          an email you sent), contact us and we will address it, including access and deletion
          requests for email correspondence.
        </p>

        <h2>Changes</h2>
        <p>
          If this policy changes materially, we will update the date above and, for significant
          changes like enabling ads, describe the change on this page.
        </p>

        <h2>Contact</h2>
        <p>Questions about this policy: see our <Link href="/contact">contact page</Link>.</p>
      </div>
    </div>
  );
}
