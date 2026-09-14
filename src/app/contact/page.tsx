import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Report an error, suggest a calculator, or ask a question about RateCraft.",
  alternates: { canonical: `${site.url}/contact` },
};

export default function ContactPage() {
  return (
    <div className="container page-pad">
      <div className="prose">
        <h1>Contact</h1>
        <p>
          Spotted an error in a calculator or a guide? Have an idea for a tool that would help
          your business? Corrections get priority — pricing math needs to be right.
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
        <p className="text-small text-muted">
          We can&apos;t offer business, tax, or legal advice — see the <Link href="/disclaimer">disclaimer</Link>.
        </p>
      </div>
    </div>
  );
}
