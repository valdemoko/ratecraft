import Link from "next/link";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";

const links = [
  { href: "/calculators", name: "Calculators" },
  { href: "/guides", name: "Guides" },
  { href: "/about", name: "Methodology" },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" aria-label="RateCraft home">
          <Logo />
        </Link>

        <nav aria-label="Main" className="main-nav">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.name}
            </Link>
          ))}
          <Link href="/calculators" className="btn btn-primary nav-cta">
            Open a calculator
          </Link>
        </nav>

        <MobileMenu links={[...links, { href: "/contact", name: "Contact" }]} cta={{ href: "/calculators", name: "Open a calculator" }} />
      </div>
    </header>
  );
}
