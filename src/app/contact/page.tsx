import type { Metadata } from "next";
import Link from "next/link";
import { site, creator } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Report an error in a calculator, suggest a tool, or ask a question about RateCraft — and see what to include so a correction can be made quickly.",
  alternates: { canonical: `${site.url}/contact` },
};

export default function ContactPage() {
  return (
    <div className="container page-pad">
      <div className="prose">
        <h1>Contact</h1>
        <p>
          Spotted an error in a calculator or a guide? Have an idea for a tool that would help
          your business? Corrections get priority — pricing math needs to be right, and a wrong
          formula on this site can cost someone real money.
        </p>
        <p>
          Email:{" "}
          <a href="mailto:contacto@ratecraft.site">contacto@ratecraft.site</a>
        </p>

        <h2>What to include</h2>
        <ul>
          <li>Which calculator or guide, and what looks wrong.</li>
          <li>The numbers you entered and the result you expected.</li>
          <li>Screenshots help, but aren&apos;t required.</li>
        </ul>
        <p>
          If the error is arithmetic, that level of detail is usually enough to reproduce and fix
          it. Every formula on the site is also checked by a test suite, so a correction here
          tends to harden the whole tool rather than just the one example.
        </p>

        <h2>How corrections are handled</h2>
        <ul>
          <li>
            <strong>Errors are fixed on the page where they appear</strong>, and the review date at
            the top of that calculator or guide is updated — not buried in a changelog.
          </li>
          <li>
            <strong>Corrections come before new pages.</strong> The site grows more slowly on
            purpose: nothing gets added until it can be explained and verified.
          </li>
          <li>
            <strong>Tool suggestions are judged on the problem, not the keyword.</strong> A tool
            only gets built when the decision it supports is a real one people make with money on
            the line. Tell us the decision, not the search term.
          </li>
        </ul>

        <h2>What we can&apos;t help with</h2>
        <p>
          We can&apos;t give business, tax, legal, insurance or accounting advice, and we can&apos;t
          check your numbers for you: the calculators work on your inputs, and the judgment about
          your market, customers and contracts is yours. Questions about payroll taxes, workers&apos;
          compensation class codes, contractor licensing or employee-versus-contractor rules
          belong with your accountant, insurer or attorney — those depend on your jurisdiction and
          situation, and a website can&apos;t answer them responsibly.
        </p>

        <h2>Before you write</h2>
        <p>
          Some questions are already answered on the site. The{" "}
          <Link href="/about">methodology page</Link> explains how the calculators are built, how
          ranges are handled, and what the results do and don&apos;t account for; the{" "}
          <Link href="/disclaimer">disclaimer</Link> covers the limits of planning estimates. If
          your question is about the method or the assumptions, those two pages are the fastest
          place to look.
        </p>
        <p className="text-small text-muted">
          {site.name} is maintained by {creator.name}. Replies aren&apos;t instant — this is a
          small independent site, not a support desk — but anything that involves an incorrect
          number is read first.
        </p>
      </div>
    </div>
  );
}
