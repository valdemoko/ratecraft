import type { Metadata } from "next";
import { Libre_Franklin, Source_Serif_4 } from "next/font/google";
import "../styles/globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Self-hosted via next/font (no external font requests at runtime).
// --font-franklin / --font-source-serif are consumed by globals.css tokens.
const franklin = Libre_Franklin({
  subsets: ["latin"],
  variable: "--font-franklin",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL((process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")),
  // Draft guard: in production (NEXT_PUBLIC_SITE_URL unset or localhost) keep
  // crawlers out so a preview deployment never gets indexed by mistake.
  ...(process.env.NEXT_PUBLIC_SITE_URL &&
  !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")
    ? {}
    : { robots: { index: false, follow: false } }),
  title: {
    default: "RateCraft — Contractor Pricing, Estimating & Profit Tools",
    template: "%s | RateCraft",
  },
  description:
    "Free calculators and guides that help contractors and service businesses price jobs, control costs and protect profit — with the math explained.",
  openGraph: {
    type: "website",
    siteName: "RateCraft",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "RateCraft — contractor pricing tools" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RateCraft — Contractor Pricing, Estimating & Profit Tools",
    description:
      "Free calculators that help contractors price jobs, control costs and protect profit — with the math explained.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${franklin.variable} ${sourceSerif.variable}`}>
      <body>
        <a href="#main" className="visually-hidden">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
