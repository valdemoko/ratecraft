import Link from "next/link";
import Logo from "./Logo";
import { tools, site } from "@/lib/site";

const listItem: React.CSSProperties = { marginBottom: 8 };

export default function Footer() {
  const productLinks = [
    { href: "/calculators", name: "All calculators" },
    { href: "/guides", name: "Guides" },
    { href: "/about", name: "Methodology" },
  ];
  const companyLinks = [
    { href: "/about", name: "About" },
    { href: "/contact", name: "Contact" },
  ];
  const legalLinks = [
    { href: "/privacy", name: "Privacy Policy" },
    { href: "/terms", name: "Terms of Use" },
    { href: "/cookies", name: "Cookie Policy" },
    { href: "/disclaimer", name: "Disclaimer" },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo />
            <p style={{ marginTop: "var(--space-3)", maxWidth: 260, color: "rgba(255,255,255,0.75)" }}>
              {site.name} is a set of free pricing, estimating and profit tools for US
              contractors and service businesses. Every calculator shows the math behind
              its numbers.
            </p>
          </div>

          <nav aria-label="Product">
            <h3>Product</h3>
            <ul style={{ margin: 0, padding: 0 }}>
              {productLinks.map((l) => (
                <li key={l.href} style={listItem}>
                  <Link href={l.href}>{l.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Calculators">
            <h3>Calculators</h3>
            <ul style={{ margin: 0, padding: 0 }}>
              {tools.slice(0, 5).map((t) => (
                <li key={t.slug} style={listItem}>
                  <Link href={`/calculators/${t.slug}`}>{t.name.replace("Contractor ", "")}</Link>
                </li>
              ))}
              <li style={listItem}>
                <Link href="/calculators">All {tools.length} calculators</Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3>Company</h3>
            <ul style={{ margin: 0, padding: 0 }}>
              {companyLinks.map((l) => (
                <li key={l.href} style={listItem}>
                  <Link href={l.href}>{l.name}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3>Legal</h3>
            <ul style={{ margin: 0, padding: 0 }}>
              {legalLinks.map((l) => (
                <li key={l.href} style={listItem}>
                  <Link href={l.href}>{l.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {site.name}</span>
          <span>
            Estimates are for planning purposes only — see the{" "}
            <Link href="/disclaimer">disclaimer</Link>.
          </span>
        </div>
      </div>
    </footer>
  );
}
