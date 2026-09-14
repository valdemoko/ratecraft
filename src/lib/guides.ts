import { newGuides } from "./guides-batch2";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "callout"; text: string }
  | { type: "ctaTool"; slug: string; label?: string };

export type Guide = {
  slug: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  updated: string; // ISO date
  readingMinutes: number;
  category: "pricing" | "costs";
  relatedTools: string[]; // tool slugs
  relatedGuides: string[]; // guide slugs
  faqs: { q: string; a: string }[];
  body: Block[];
};

export const guides: Guide[] = [
  ...newGuides,
  {
    slug: "markup-vs-margin",
    title: "Markup vs. Margin: The Pricing Difference That Costs Contractors Money",
    description:
      "The two words get used interchangeably on job sites, and the confusion is expensive. Here's the difference, the conversion, and the worked numbers.",
    metaTitle: "Markup vs. Margin for Contractors — Difference, Conversion Table & Examples",
    metaDescription:
      "Markup and margin are not the same: a 20% markup is a 16.7% margin. See the formulas, a full conversion table, and worked contractor examples.",
    updated: "2026-09-14",
    readingMinutes: 6,
    category: "pricing",
    relatedTools: ["markup-calculator", "margin-calculator"],
    relatedGuides: ["how-to-price-a-job", "general-contractor-markup"],
    faqs: [
      {
        q: "Is 30% markup the same as 30% margin?",
        a: "No. A 30% markup on $1,000 of cost gives a $1,300 price — $300 profit on $1,300 of revenue, which is a 23.1% margin. Pricing to a 30% margin on $1,000 of cost requires a price of $1,428.57, i.e. a 42.9% markup.",
      },
      {
        q: "Which should I use when pricing jobs?",
        a: "Whichever you use, be consistent. Margin is usually easier to reason about because your overhead and profit goals are naturally a share of revenue. If you price to a margin, use Price = Cost ÷ (1 − margin); multiplying cost by (1 + margin) understates the price.",
      },
      {
        q: "Why is markup always a bigger number than margin?",
        a: "Because markup is measured against cost (a smaller base) and margin against price (a bigger base). The same profit dollars produce a bigger percentage when divided by the smaller number.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Ask around a supply house and you'll hear both words used for the same thing. They aren't the same thing, and the gap between them is real money. Markup is the percentage you add to cost. Margin is the share of the final price that's left as gross profit. Same job, same profit dollars — different base for the percentage, and that changes everything.",
      },
      { type: "h2", text: "The two formulas" },
      {
        type: "p",
        text: "Markup says: profit measured against cost. Margin says: profit measured against price.",
      },
      {
        type: "ul",
        items: [
          "Markup % = (Price − Cost) ÷ Cost × 100",
          "Margin % = (Price − Cost) ÷ Price × 100",
          "Price from markup: Price = Cost × (1 + Markup)",
          "Price from margin: Price = Cost ÷ (1 − Margin)",
        ],
      },
      { type: "h2", text: "A worked example" },
      {
        type: "p",
        text: "A job costs you $8,000 all-in: $4,500 labor, $3,000 materials, $500 in subs and fees. You want $2,000 of gross profit out of it. That's a 25% markup ($2,000 ÷ $8,000) but only a 20% margin ($2,000 ÷ $10,000). If you told your accountant you run \"25% margins,\" your books will disagree with you by five points on every job.",
      },
      {
        type: "p",
        text: "Now the reverse — where the expensive mistake lives. Suppose you decide the business needs a 30% margin to cover overhead and profit. On that same $8,000 job, the right price is $8,000 ÷ 0.70 = $11,429. Price it \"30% markup\" instead and you get $10,400 — you've given away over $1,000, and on a 30-job year that habit costs more than $30,000.",
      },
      { type: "h2", text: "Conversion table" },
      {
        type: "p",
        text: "Margin = Markup ÷ (100 + Markup) × 100. The common values, so you never have to do it in your head:",
      },
      {
        type: "table",
        caption: "Markup on cost vs. equivalent margin on price",
        headers: ["Markup on cost", "Equivalent margin", "Profit on a $10,000-cost job"],
        rows: [
          ["10%", "9.1%", "$1,000"],
          ["15%", "13.0%", "$1,500"],
          ["20%", "16.7%", "$2,000"],
          ["25%", "20.0%", "$2,500"],
          ["30%", "23.1%", "$3,000"],
          ["40%", "28.6%", "$4,000"],
          ["50%", "33.3%", "$5,000"],
          ["75%", "42.9%", "$7,500"],
          ["100%", "50.0%", "$10,000"],
        ],
      },
      { type: "h2", text: "Why margin is usually the better target" },
      {
        type: "p",
        text: "Your overhead is a share of revenue: insurance, trucks and office costs scale (roughly) with sales, not with job costs. Your profit goal is a share of revenue too. When both of your planning numbers are shares of revenue, it's simplest to price in the same units — set a target margin and divide cost by (1 − margin). Markup is fine as long as everyone quoting knows which number they're using.",
      },
      { type: "h2", text: "The quick self-check" },
      {
        type: "ul",
        items: [
          "If your target number gets divided into 1 (÷ 0.70), you're pricing to a margin.",
          "If it gets multiplied as (1 + x), you're applying a markup.",
          "If a job's reported margin is always a few points below what you intended, you're mixing the two.",
        ],
      },
      {
        type: "callout",
        text: "Rule of conversion: margin = markup ÷ (100 + markup). A 50% markup is a 33.3% margin. A 33.3% markup is a 25% margin. There is no pair where the numbers match (except 0).",
      },
      {
        type: "ctaTool",
        slug: "markup-calculator",
        label: "Run your own numbers in the markup calculator — the conversion table updates live",
      },
    ],
  },
  {
    slug: "how-to-price-a-job",
    title: "How to Price a Job: A Complete Method for Contractors",
    description:
      "A repeatable five-step method for pricing any job: burdened labor, real material costs, overhead recovery, margin-correct pricing, and a sanity check before you hit send.",
    metaTitle: "How to Price a Job as a Contractor — Step-by-Step Method with Examples",
    metaDescription:
      "A five-step method for pricing jobs: burdened labor rates, material costs, overhead recovery, margin-based pricing, and the pre-flight check before you quote.",
    updated: "2026-09-14",
    readingMinutes: 8,
    category: "pricing",
    relatedTools: ["job-pricing-calculator", "labor-burden-calculator", "overhead-calculator", "flat-rate-calculator"],
    relatedGuides: ["markup-vs-margin", "how-to-write-an-estimate", "how-to-calculate-labor-burden"],
    faqs: [
      {
        q: "How do I price a job as a contractor?",
        a: "Add every direct cost (burdened labor hours × rate, materials, subs, travel, other), add an overhead allowance, then divide by (1 − target gross margin). For example: $2,000 of direct cost, 15% overhead ($300), and a 35% target margin gives $2,300 ÷ 0.65 = $3,538.",
      },
      {
        q: "Should I price hourly or by the job?",
        a: "Price by the job when scope is clear — it rewards you for working fast and clients prefer certainty. Use hourly or time-and-materials pricing when scope is genuinely unknown, and cap it with a not-to-exceed figure.",
      },
      {
        q: "What margin should I build into a job price?",
        a: "Start from your numbers: overhead as a percentage of revenue, plus your target net profit. If overhead runs 15% of revenue and you want 10% net, you need roughly a 25%+ gross margin — and more to absorb scope slips and rework.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Most underpriced jobs aren't lost on price — they're lost in the estimate. A missed cost here, an optimistic hour count there, and a job that \"sold well\" quietly becomes a donation. This is the method in five steps. It takes longer than guessing, and it pays for itself on the first job where the guess would have been wrong.",
      },
      { type: "h2", text: "Step 1: Cost labor at its true rate" },
      {
        type: "p",
        text: "Start with hours — scoped honestly, not optimistically, and include travel, pickup runs and cleanup. Then multiply by the right rate. If the work is done by employees, that's the fully burdened rate: wage plus payroll taxes, workers' comp and benefits, divided by billable hours. A $25/hour wage typically means $33–36/hour of true cost once burden is included. If you do the work yourself, use what an hour of your time must earn — not $0.",
      },
      {
        type: "ctaTool",
        slug: "labor-burden-calculator",
        label: "Find your true hourly cost with the labor burden calculator",
      },
      { type: "h2", text: "Step 2: Cost materials as they'll actually be" },
      {
        type: "ul",
        items: [
          "Use current supplier pricing, not last year's quote.",
          "Add waste: 10% for most materials, more for tile and diagonal layouts, and a full extra box or bundle where returns aren't practical.",
          "Include delivery fees and small stuff that adds up — fasteners, blades, sealant.",
          "If prices are volatile, note the quote's expiry on the estimate.",
        ],
      },
      { type: "h2", text: "Step 3: Add every other direct cost" },
      {
        type: "p",
        text: "Subcontractors (at what they'll actually invoice, plus your handling), permits and fees, disposal, equipment rental, and job-specific travel. Anything the job causes you to spend belongs here. If a cost happens whether or not you take the job, it's overhead — that's the next step.",
      },
      { type: "h2", text: "Step 4: Recover overhead — deliberately" },
      {
        type: "p",
        text: "Overhead is insurance, vehicles, tools, software, accounting: everything that runs whether or not any job exists. Two common ways to recover it per job: add it as a percentage of direct cost, or fold it into your target margin. What kills small businesses isn't choosing the wrong method — it's recovering overhead only when there's \"profit left over,\" which is never.",
      },
      {
        type: "ctaTool",
        slug: "overhead-calculator",
        label: "Total your monthly overhead and see it per billable hour",
      },
      { type: "h2", text: "Step 5: Price to a margin, then sanity-check" },
      {
        type: "p",
        text: "Divide total cost by (1 − target margin). On $2,300 of cost at a 35% target margin: $2,300 ÷ 0.65 = $3,538. Then sanity-check against reality: what does work like this sell for in your market? If your number is far above market, either your costs or your scope assumptions need a second look — don't just shave margin to win the job. If it's far below, raise the price or find out why your costs are so low.",
      },
      {
        type: "table",
        caption: "Example: pricing a bathroom refresh",
        headers: ["Line", "Amount"],
        rows: [
          ["Labor: 32 hrs × $34 burdened", "$1,088"],
          ["Materials incl. waste & delivery", "$780"],
          ["Subs (plumbing fixture set)", "$350"],
          ["Disposal & permits", "$105"],
          ["Direct cost", "$2,323"],
          ["Overhead allowance 15%", "$348"],
          ["Total cost", "$2,671"],
          ["Price at 35% margin ($2,671 ÷ 0.65)", "$4,109"],
        ],
      },
      {
        type: "callout",
        text: "The pre-flight check before sending any quote: every cost line is based on a number you'd defend under oath, overhead is in there on purpose, and the margin is stated as a margin — not a markup in disguise.",
      },
      {
        type: "ctaTool",
        slug: "job-pricing-calculator",
        label: "Price a full job with the job pricing calculator",
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
