import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "RateCraft sets no cookies today. What would change if analytics or ads are enabled later.",
  alternates: { canonical: `${site.url}/cookies` },
  // Utility page: indexable content is elsewhere — save crawl budget.
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <div className="container page-pad">
      <div className="prose">
        <h1>Cookie Policy</h1>
        <p className="text-small text-muted">Last updated: September 14, 2026</p>

        <h2>Current state: no cookies</h2>
        <p>
          {site.name} currently sets <strong>no cookies and no tracking technologies</strong>.
          Calculators run entirely in your browser and their inputs are not stored — locally or
          remotely.
        </p>

        <h2>If advertising is enabled later</h2>
        <p>
          If the site joins Google AdSense, Google may set cookies (such as the <code>IDE</code>{" "}
          cookie) to serve and measure ads, including personalized ads where permitted. Before
          that happens, this page will list the specific cookies, and where required by law a
          consent mechanism will be offered for non-essential cookies. The site will remain
          fully usable without accepting advertising cookies.
        </p>

        <h2>If analytics are enabled later</h2>
        <p>
          The same applies to analytics (Google Analytics 4): currently not used; if enabled, it
          would be disclosed here first, with its specific cookies.
        </p>

        <h2>Managing cookies</h2>
        <p>
          You can block or delete cookies in your browser settings at any time. Since the site
          sets none today, nothing changes for you either way.
        </p>
      </div>
    </div>
  );
}
