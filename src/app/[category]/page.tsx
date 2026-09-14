import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory, tools, site } from "@/lib/site";
import Breadcrumbs from "@/components/Breadcrumbs";

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return {
    title: `${cat.name} Calculators for Contractors`,
    description: cat.description,
    alternates: { canonical: `${site.url}/${cat.slug}` },
  };
}

const HUB_COPY: Record<
  string,
  { intro: string[]; glossary: { term: string; text: string }[] }
> = {
  pricing: {
    intro: [
      "Every contractor faces the same question: what do I charge for this job? Answering it well means stacking several numbers on top of each other — what the work costs you directly, what the business costs you whether or not the job exists, and what you need to keep as profit. The calculators in this section each handle one of those layers.",
      "Job pricing starts with direct costs — labor, materials, subcontractors, travel — then adds an overhead allowance so the business itself gets paid, and finishes with your target margin applied to the total. The most common failure in contractor pricing is skipping a layer: a quote that covers materials and wages but never recovers insurance, trucks or software is a busy month moving backwards.",
      "The other classic trap is markup versus margin. They measure the same profit against different bases — cost for markup, price for margin — so the numbers never match: a 25% markup is a 20% margin. Which one you use matters less than knowing which one you're using, and the tools below show both on every result.",
    ],
    glossary: [
      {
        term: "Job pricing",
        text: "Building a price from the job's real parts: burdened labor, materials, subs, travel and other direct costs, plus overhead and your target margin.",
      },
      {
        term: "Markup",
        text: "Profit measured against cost: Price = Cost × (1 + Markup). Easy to apply, easy to confuse with margin.",
      },
      {
        term: "Margin",
        text: "Profit measured against price: Margin = Profit ÷ Price. The share of every quote that survives to cover overhead and net profit.",
      },
      {
        term: "Flat-rate pricing",
        text: "One fixed price for a defined job — a service call, a swap, an install — built from the same cost math, priced before you arrive.",
      },
    ],
  },
  costs: {
    intro: [
      "Before any price can be right, the costs underneath it have to be. The calculators in this section exist to answer one question precisely: what does an hour of work — and a month of business — actually cost you? Not the wage on the paycheck, and not the invoice from the supply house, but the full number.",
      "Direct labor is the visible part. Labor burden is the part that quietly breaks estimates: payroll taxes, workers' compensation at your class-code rate, benefits, and the paid hours that produce no revenue. Overhead is the third layer — insurance, vehicles, tools, software — that every billable hour has to carry.",
      "Once these numbers are honest, every pricing decision downstream gets easier: your hourly rate stops being a guess, your job prices carry a known overhead slice, and your break-even count stops being optimistic.",
    ],
    glossary: [
      {
        term: "Direct labor",
        text: "The wages for hours actually spent on a job — costed at the burdened rate, not the bare wage.",
      },
      {
        term: "Labor burden",
        text: "Everything an employee costs beyond the wage: payroll taxes, workers' comp, benefits, and non-billable paid time. Commonly 25–40% on top of base wages.",
      },
      {
        term: "Materials",
        text: "Job supplies at their real delivered cost, including waste, delivery fees and the small consumables that add up.",
      },
      {
        term: "Overhead",
        text: "Costs that exist whether or not any job is running: insurance, rent, vehicles, software, accounting. Recovered per job or per billable hour — on purpose.",
      },
      {
        term: "Total job cost",
        text: "Direct costs plus the overhead allowance — the number your margin applies to.",
      },
    ],
  },
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const catTools = tools.filter((t) => t.category === cat.slug);
  const copy = HUB_COPY[cat.slug];

  return (
    <div className="container page-pad">
      <Breadcrumbs items={[{ name: "Calculators", href: "/calculators" }, { name: cat.name }]} />
      <div className="prose">
        <span className="eyebrow">Category</span>
        <h1>{cat.name}</h1>
        {copy?.intro.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
      </div>

      <section aria-label={`Tools in ${cat.name}`} style={{ marginTop: "var(--space-6)" }}>
        <div style={{ display: "grid", gap: "var(--space-4)", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))" }}>
          {catTools.map((t) => (
            <Link
              key={t.slug}
              href={`/calculators/${t.slug}`}
              className="card"
              style={{ padding: "var(--space-5)", color: "inherit", textDecoration: "none", display: "block" }}
            >
              <h2 style={{ fontSize: "1.1rem" }}>{t.name}</h2>
              <p className="text-small text-muted" style={{ margin: 0 }}>
                {t.intro.split(":")[0].split("—")[0]}.
              </p>
            </Link>
          ))}
        </div>
      </section>

      {copy && (
        <section className="prose" style={{ marginTop: "var(--space-7)" }} aria-labelledby="terms-h">
          <h2 id="terms-h">The terms, in plain language</h2>
          {copy.glossary.map((g) => (
            <p key={g.term}>
              <strong>{g.term}:</strong> {g.text}
            </p>
          ))}
        </section>
      )}

      <section className="prose" style={{ marginTop: "var(--space-6)" }}>
        <h2>Related guides</h2>
        <ul>
          <li>
            <Link href="/guides/markup-vs-margin">Markup vs. margin: the difference that costs money</Link>
          </li>
          <li>
            <Link href="/guides/how-to-price-a-job">How to price a job — the full method</Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
