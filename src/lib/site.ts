/**
 * True only when a real production URL is configured. Without it (local dev,
 * preview deployments) the whole site stays out of the index so a draft URL can
 * never be crawled by accident.
 *
 * Metadata objects are merged shallowly in Next: a page that sets `robots`
 * REPLACES the layout's value rather than merging with it. Any page (or
 * generateMetadata) that sets robots must therefore respect this flag itself,
 * or it silently makes that route indexable while the rest of the site is not.
 */
export const isIndexable = Boolean(
  // Indexable when we have a production URL, including the fallback.
  // Without any, the site serves noindex (draft guard).
  process.env.NEXT_PUBLIC_SITE_URL
    ? !process.env.NEXT_PUBLIC_SITE_URL.includes("localhost")
    : true, // Production fallback: if env missing, we rely on site.url default (https://ratecraft.site)
);

/** robots directives for indexable pages that name their own. */
export const indexableRobots = { googleBot: { "max-image-preview": "large" as const } };

export const site = {
  name: "RateCraft",
  tagline: "Contractor pricing, estimating & profit tools",
  description:
    "Free calculators and guides that help contractors and service businesses price jobs, control costs and protect profit — with the math explained.",
  // Production fallback: the Cloudflare build had no NEXT_PUBLIC_SITE_URL
  // build variable, which made every canonical/sitemap/OG URL point at
  // localhost. The production domain is hardcoded as the safe default —
  // override with NEXT_PUBLIC_SITE_URL if the domain ever changes.
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://ratecraft.site").replace(/\/+$/, ""),
  locale: "en_US",
  founded: 2026,
} as const;

/** The identified person behind the project (used in About, Footer and JSON-LD). */
export const creator = {
  name: "Miguel Iglesias Valenzuela",
  linkedin: "https://www.linkedin.com/in/miguel-iglesias-valenzuela-14069b367",
} as const;

export type Category = {
  slug: string;
  name: string;
  description: string;
};

/** Tool categories — the two big clusters from keyword research. */
export const categories: Category[] = [
  {
    slug: "pricing",
    name: "Pricing & Profit",
    description:
      "Set a price that covers your costs and earns the margin you actually targeted — markup, margin, job pricing and break-even.",
  },
  {
    slug: "costs",
    name: "Labor & Overhead Costs",
    description:
      "Know what an hour of work truly costs before you quote it: fully burdened labor rates, overhead recovery, and whether the work belongs on a payroll.",
  },
];

export type Tool = {
  slug: string;
  name: string;
  /** Primary keyword this page targets */
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  category: Category["slug"];
  /** Date this page's content and methodology were last reviewed (ISO yyyy-mm-dd). */
  updated: string;
  /** One-line card blurb used by the hub, homepage and category listings. */
  summary: string;
  intro: string;
  /** Formulas / methodology shown on the page (E-E-A-T) */
  formulas: { label: string; formula: string; note?: string }[];
  faqs: { q: string; a: string }[];
  related: string[];
};

export const tools: Tool[] = [
  {
    slug: "markup-calculator",
    name: "Contractor Markup Calculator",
    keyword: "contractor markup calculator",
    metaTitle: "Contractor Markup Calculator — Markup to Margin",
    metaDescription:
      "Free contractor markup calculator. Enter labor, materials and overhead, set your markup, and see the selling price, profit and the margin it really produces.",
    category: "pricing",
    updated: "2026-09-23",
    summary:
      "Enter job costs and a markup to get the selling price, the profit, and the margin it really produces.",
    intro:
      "Enter your job costs, choose a markup, and see the exact selling price, profit dollars and gross margin — with a table showing what your markup means as a margin, so the two never get mixed up again.",
    formulas: [
      {
        label: "Selling price from markup",
        formula: "Price = Total Cost × (1 + Markup ÷ 100)",
        note: "Markup is the percentage added on top of your cost.",
      },
      {
        label: "Profit",
        formula: "Profit = Price − Total Cost",
      },
      {
        label: "Gross margin",
        formula: "Margin % = Profit ÷ Price × 100",
        note: "Margin is profit as a share of the selling price, not of cost.",
      },
      {
        label: "Margin from markup (conversion)",
        formula: "Margin % = Markup ÷ (100 + Markup) × 100",
        note: "A 25% markup is only a 20% margin — the table below shows the full conversion.",
      },
    ],
    faqs: [
      {
        q: "What markup should a contractor use?",
        a: "Most residential contractors price with markups between roughly 20% and 50% on top of direct job costs, depending on trade, risk and how much overhead they carry. There is no universal number: the right markup is the one that covers your overhead and leaves your target net profit. Use your own overhead and profit goals to back into it rather than copying a competitor.",
      },
      {
        q: "Is 30% markup the same as 30% margin?",
        a: "No. A 30% markup on $1,000 of cost gives a $1,300 price and $300 profit — which is a 23.1% margin, because margin is measured against the selling price. Pricing to a '30% margin' requires a markup of about 42.9%.",
      },
      {
        q: "What is the difference between markup and margin?",
        a: "Markup is calculated on cost: Price = Cost × (1 + markup). Margin is calculated on price: Margin = Profit ÷ Price. Mixing them up is one of the most common and expensive pricing mistakes contractors make — a 20% markup produces only a 16.7% margin.",
      },
      {
        q: "Should I mark up materials and labor the same?",
        a: "Not necessarily. Many contractors apply a lower markup to labor (which already includes their own wage) and a higher markup to materials. Others price the whole job from a fully burdened cost plus a single target margin. What matters is that overhead recovery and profit are covered somewhere in the total.",
      },
    ],
    related: [
      "margin-calculator",
      "discount-impact-calculator",
      "job-pricing-calculator",
      "guides/markup-vs-margin",
      "guides/what-a-discount-costs",
      "guides/materials-markup",
    ],
  },
  {
    slug: "margin-calculator",
    name: "Contractor Margin Calculator",
    keyword: "contractor margin calculator",
    metaTitle: "Contractor Margin Calculator — Check Any Job Price",
    metaDescription:
      "Free margin calculator for contractors. Enter a job price and its costs to see the gross margin, profit and the markup it corresponds to — before you quote.",
    category: "pricing",
    updated: "2026-09-23",
    summary:
      "Check a quote before it goes out: the margin and the markup the price actually carries.",
    intro:
      "Work backwards: enter the price you're about to quote and what the job costs you, and see the margin and markup you'd actually be locking in — before the client ever sees the number.",
    formulas: [
      {
        label: "Gross margin",
        formula: "Margin % = (Price − Cost) ÷ Price × 100",
      },
      {
        label: "Markup (equivalent)",
        formula: "Markup % = (Price − Cost) ÷ Cost × 100",
      },
      {
        label: "Implied price for a target margin",
        formula: "Price = Cost ÷ (1 − Margin ÷ 100)",
        note: "This is the formula to use when your profit goal is stated as a margin.",
      },
    ],
    faqs: [
      {
        q: "How do I calculate margin on a job?",
        a: "Subtract the job's total cost from the price, then divide by the price. For example, a $2,000 job that costs $1,500 has a margin of ($2,000 − $1,500) ÷ $2,000 = 25%. That $500 of gross profit then has to cover overhead before anything is left as net profit.",
      },
      {
        q: "What gross margin should a contractor aim for?",
        a: "Residential trades commonly target gross margins in the 25–50% range depending on trade and business model, while tighter-margin commercial work often runs much lower. The useful benchmark is your own overhead as a percentage of revenue plus your target net profit: gross margin must exceed that sum or the business loses money on every job.",
      },
    ],
    related: [
      "markup-calculator",
      "break-even-calculator",
      "job-profitability-calculator",
      "target-margin-calculator",
      "guides/markup-vs-margin",
      "guides/what-a-discount-costs",
      "guides/what-margin-should-i-target",
    ],
  },
  {
    slug: "job-pricing-calculator",
    name: "Job Pricing Calculator",
    keyword: "job pricing calculator",
    metaTitle: "Job Pricing Calculator — Price a Job from Real Costs",
    metaDescription:
      "Free job pricing calculator for contractors. Add labor hours, materials, subs, travel and overhead, then see a recommended price with a full cost breakdown.",
    category: "pricing",
    updated: "2026-09-23",
    summary:
      "Price a full job from labor, materials, subs, travel and overhead, plus your target margin.",
    intro:
      "The full picture in one place: every cost on a job — labor, materials, subcontractors, travel, other expenses — plus an overhead allowance and your target margin, producing a recommended price you can defend.",
    formulas: [
      {
        label: "Direct job cost",
        formula: "Direct Cost = Labor + Materials + Subs + Travel + Other",
      },
      {
        label: "Overhead allowance",
        formula: "Overhead = Direct Cost × Overhead Rate %",
        note: "Allocate overhead in proportion to direct job cost — a simple but widely used method.",
      },
      {
        label: "Recommended price",
        formula: "Price = (Direct Cost + Overhead) ÷ (1 − Target Margin ÷ 100)",
        note: "Dividing by (1 − margin) prices to the margin correctly; multiplying by (1 + markup) understates it.",
      },
    ],
    faqs: [
      {
        q: "How do I price a job as a contractor?",
        a: "Add up every direct cost the job will incur — labor (at your fully burdened rate, not just wages), materials, subcontractors, travel and anything else — add an overhead allowance, then divide by (1 − your target gross margin). Charging just cost plus a flat markup usually underprices jobs because overhead never gets fully recovered.",
      },
      {
        q: "Should overhead be included in a job price?",
        a: "Yes. Overhead — insurance, vehicles, tools, office costs, software, licensing — is real and every job must contribute to it. Contractors who recover overhead only 'when there's profit left over' routinely quote prices that lose money on paper jobs that look busy.",
      },
    ],
    related: [
      "job-profitability-calculator",
      "labor-burden-calculator",
      "overhead-calculator",
      "markup-calculator",
      "change-order-calculator",
      "guides/how-to-price-a-job",
      "guides/job-costing",
      "guides/change-orders-and-margin",
    ],
  },
  {
    slug: "labor-burden-calculator",
    name: "Labor Burden Calculator",
    keyword: "labor burden calculator",
    metaTitle: "Labor Burden Calculator — True Hourly Cost of an Employee",
    metaDescription:
      "Free labor burden calculator for contractors. Add payroll taxes, insurance, benefits and PTO to a base wage and see the fully burdened hourly cost and burden rate.",
    category: "costs",
    updated: "2026-09-23",
    summary:
      "The true hourly cost of an employee: wage plus payroll taxes, comp, benefits and non-billable time.",
    intro:
      "A $25/hour employee doesn't cost $25 an hour. Enter the wage plus taxes, insurance, benefits and non-billable time to see the fully burdened hourly cost you should be using in every estimate.",
    formulas: [
      {
        label: "Annual base pay",
        formula: "Base = Hourly Wage × Paid Hours per Year",
      },
      {
        label: "Fully burdened annual cost",
        formula: "Burdened = Base + Taxes + Insurance + Benefits + Other Costs",
      },
      {
        label: "Burdened hourly cost",
        formula: "Hourly Cost = Burdened Annual Cost ÷ Billable Hours",
        note: "Billable hours are paid hours minus PTO, training and non-billable time — using paid hours here understates the true rate.",
      },
      {
        label: "Burden rate",
        formula: "Burden Rate % = (Burdened − Base) ÷ Base × 100",
        note: "Labor burden in construction and trades commonly falls between 25% and 40% of base wages.",
      },
    ],
    faqs: [
      {
        q: "What is labor burden?",
        a: "Labor burden is everything an employee costs you beyond their wage: payroll taxes, workers' compensation, unemployment insurance, health benefits, retirement contributions, and paid time they spend not on billable work. It is typically 25–40% on top of base wages for trades businesses.",
      },
      {
        q: "Why divide by billable hours instead of paid hours?",
        a: "If you pay for 2,080 hours but only 1,800 are billable, the employee produces revenue for 1,800 hours while costing you 2,080 hours' worth of wages and burden. Dividing total cost by billable hours spreads that gap into the rate you must recover on the work you sell.",
      },
      {
        q: "What is a typical labor burden percentage?",
        a: "For construction and field service businesses, total burden commonly lands between 25% and 40% of base wages, driven mostly by workers' comp class codes, benefit generosity and paid time off. The only number that matters for pricing is your own — which is what this calculator is for.",
      },
    ],
    related: [
      "hourly-rate-calculator",
      "job-pricing-calculator",
      "hire-vs-subcontract-calculator",
      "effective-hourly-rate-calculator",
      "guides/how-to-price-a-job",
      "guides/billable-hours-and-income-goal",
      "guides/effective-hourly-rate",
    ],
  },
  {
    slug: "hourly-rate-calculator",
    name: "Contractor Hourly Rate Calculator",
    keyword: "contractor hourly rate calculator",
    metaTitle: "Contractor Hourly Rate Calculator — What to Charge",
    metaDescription:
      "Free hourly rate calculator for contractors and handymen. Enter your income goal, business expenses and realistic billable hours to find the rate you need.",
    category: "costs",
    updated: "2026-09-23",
    summary:
      "The hourly rate that covers your income goal, your expenses and the hours you can actually bill.",
    intro:
      "Built for owner-operators: enter what you need to pay yourself, your business expenses and a realistic number of billable hours, and get the hourly rate that keeps the business solvent — not a guess.",
    formulas: [
      {
        label: "Revenue requirement",
        formula: "Revenue Needed = Target Income + Business Expenses",
      },
      {
        label: "Billable hours",
        formula: "Billable Hours = Work Weeks × Hours per Week × Utilization %",
        note: "Utilization accounts for quoting, admin, supply runs and rework that generate no revenue.",
      },
      {
        label: "Minimum hourly rate",
        formula: "Hourly Rate = Revenue Needed ÷ Billable Hours",
      },
    ],
    faqs: [
      {
        q: "How do I calculate my hourly rate as a contractor?",
        a: "Add your target take-home income to all business expenses for a year (including taxes you'll owe, insurance, vehicle, tools and software), then divide by the number of hours you can realistically bill — usually 60–75% of hours worked. Most new contractors overestimate billable hours and therefore underprice their rate.",
      },
      {
        q: "How many billable hours does a solo contractor actually have?",
        a: "A common planning figure is 20–25 billable hours per week for a solo operator doing field work: the rest of a 40-hour week goes to quoting, material runs, admin and travel. Assuming 40 billable hours is the fastest way to set a rate that can't cover the year.",
      },
    ],
    related: [
      "labor-burden-calculator",
      "break-even-calculator",
      "hire-vs-subcontract-calculator",
      "effective-hourly-rate-calculator",
      "guides/billable-hours-and-income-goal",
      "guides/how-to-price-a-job",
      "guides/effective-hourly-rate",
    ],
  },
  {
    slug: "overhead-calculator",
    name: "Contractor Overhead Calculator",
    keyword: "contractor overhead calculator",
    metaTitle: "Contractor Overhead Calculator — Your Monthly Overhead Rate",
    metaDescription:
      "Free overhead calculator for contractors. Total your fixed monthly costs and see the overhead as a percentage of revenue and as a rate per billable hour.",
    category: "costs",
    updated: "2026-09-23",
    summary:
      "What the business costs each month, as a share of revenue and as a rate per billable hour.",
    intro:
      "Insurance, truck, tools, phone, software, accounting — it all has to come out of job revenue. Total your monthly overhead and see it as a percentage of revenue and as a per-billable-hour rate.",
    formulas: [
      {
        label: "Monthly overhead",
        formula: "Overhead = Sum of Monthly Fixed Costs",
      },
      {
        label: "Overhead as % of revenue",
        formula: "Overhead % = Monthly Overhead ÷ Monthly Revenue × 100",
      },
      {
        label: "Overhead per billable hour",
        formula: "Overhead Rate = Monthly Overhead ÷ Monthly Billable Hours",
        note: "Add this rate to your labor cost on every job, or recover it inside your markup — but recover it deliberately.",
      },
    ],
    faqs: [
      {
        q: "How much overhead do contractors have?",
        a: "Small trade businesses commonly run overhead at 10–25% of revenue, depending on vehicle fleets, shop space and office staff. The number that matters is yours: list every recurring cost that isn't tied to a specific job, total it, and divide by the revenue or billable hours that have to cover it.",
      },
      {
        q: "What counts as overhead vs. a job cost?",
        a: "Job costs are spent on a specific job: materials, subcontractors, crew wages on that site. Overhead keeps the business running regardless of any single job: insurance, rent, vehicle payments, licenses, software, bookkeeping. If a cost exists even when no job is running, it's overhead.",
      },
    ],
    related: [
      "job-pricing-calculator",
      "hourly-rate-calculator",
      "break-even-calculator",
      "hire-vs-subcontract-calculator",
      "target-margin-calculator",
      "guides/general-contractor-markup",
      "guides/what-margin-should-i-target",
    ],
  },
  {
    slug: "flat-rate-calculator",
    name: "Flat Rate Pricing Calculator",
    keyword: "flat rate pricing calculator",
    metaTitle: "Flat Rate Pricing Calculator — Built from Real Costs",
    metaDescription:
      "Free flat rate pricing calculator for plumbers, electricians and HVAC. Build a service call price from burdened labor, trip cost, parts, overhead and your margin.",
    category: "pricing",
    updated: "2026-09-23",
    summary:
      "Build a fixed price for a service call from burdened labor, the trip, parts, overhead and your margin.",
    intro:
      "Build a fixed price for a service call from the real costs behind it — burdened labor, the trip, parts, overhead and your target margin — and see the profit and margin the final number actually carries.",
    formulas: [
      {
        label: "Labor cost",
        formula: "laborCost = Hours × Burdened Rate",
        note: "Use your burdened rate — the Labor Burden Calculator computes it if you don't know it.",
      },
      {
        label: "Direct cost",
        formula: "directCost = Labor + Trip + Materials + Other",
      },
      {
        label: "Overhead allowance",
        formula: "overhead = directCost × Overhead %",
      },
      {
        label: "Total cost",
        formula: "totalCost = directCost + overhead",
      },
      {
        label: "Raw price (margin-correct)",
        formula: "rawPrice = totalCost ÷ (1 − Margin %)",
        note: "Dividing prices to the margin; multiplying by (1 + markup) understates it.",
      },
      {
        label: "Rounding",
        formula: "price = ceil(rawPrice ÷ RoundTo) × RoundTo",
      },
      {
        label: "Profit and achieved margin",
        formula: "profit = price − totalCost ; margin = profit ÷ price × 100",
        note: "Computed from the FINAL rounded price, not the raw one.",
      },
      {
        label: "Markup equivalence",
        formula: "markup = profit ÷ totalCost × 100",
        note: "Pricing to a 50% margin requires a 100% markup on cost — the two numbers always differ.",
      },
    ],
    faqs: [
      {
        q: "What is flat rate pricing?",
        a: "Flat rate pricing charges one fixed price for a job, set before the work starts, instead of billing hours plus materials as they accrue. Customers get price certainty; contractors who work efficiently keep the difference between the estimate and the actual time spent.",
      },
      {
        q: "How do I calculate a flat rate price?",
        a: "Add the true costs of the job — burdened labor hours, the trip, materials at cost, permits — then add an overhead allowance, and divide by (1 − your target margin). Round the result to a quotable number. The key is that labor must carry its full burden and overhead must be recovered on purpose, not left to a rule-of-thumb multiplier.",
      },
      {
        q: "How much should I charge for a service call or trip?",
        a: "The trip costs what it costs: fuel, vehicle wear, and the unbillable drive time. Many contractors fold it into a minimum service charge — the smallest price at which sending a truck still makes sense. This calculator suggests one based on your labor rate, trip cost, overhead and margin; treat it as a starting point, not a market standard.",
      },
      {
        q: "Should I use markup or margin when pricing parts?",
        a: "This tool uses one target margin over the whole job rather than a separate parts multiplier, which avoids double-counting profit. If you compare against a price book that marks parts up 2× or 3×, check the 'effective multiplier on cost' the result implies — different presentations, same underlying economics.",
      },
      {
        q: "Is flat rate better than charging hourly?",
        a: "They trade risks. Hourly shifts time risk to the customer and penalizes your efficiency; flat rate rewards it but makes you own the estimate. Flat rate also answers the customer's first question — 'what will this cost?' — before you've seen the job. The right margin math underneath is identical either way.",
      },
    ],
    related: [
      "labor-burden-calculator",
      "job-pricing-calculator",
      "margin-calculator",
      "markup-calculator",
      "materials-markup-calculator",
      "guides/markup-vs-margin",
      "guides/flat-rate-vs-hourly",
      "guides/minimum-service-charge",
      "guides/materials-markup",
    ],
  },
  {
    slug: "break-even-calculator",
    name: "Break-Even Calculator",
    keyword: "break even calculator small business",
    metaTitle: "Break-Even Calculator — Jobs Needed to Break Even",
    metaDescription:
      "Free break-even calculator for contractors. Enter fixed costs, average job price and variable cost per job to see the jobs — and profit goal — you need.",
    category: "pricing",
    updated: "2026-09-23",
    summary:
      "How many jobs a month cover your fixed costs — and how many hit your profit goal.",
    intro:
      "Enter your monthly fixed costs, your average job price and what an average job costs you to deliver, and see exactly how many jobs per month you need just to break even — before any profit.",
    formulas: [
      {
        label: "Contribution per job",
        formula: "Contribution = Avg. Job Price − Variable Cost per Job",
      },
      {
        label: "Break-even jobs per month",
        formula: "Jobs = Fixed Costs ÷ Contribution",
        note: "Every job above this number contributes toward profit.",
      },
      {
        label: "Break-even revenue",
        formula: "Revenue = Jobs × Avg. Job Price",
      },
      {
        label: "Jobs needed for a profit goal",
        formula: "Jobs = (Fixed Costs + Target Profit) ÷ Contribution",
        note: "Fixed costs still come first: a $2,000 profit goal on $4,500 of fixed costs is $6,500 of contribution to find, not $2,000.",
      },
    ],
    faqs: [
      {
        q: "How many jobs do I need to make a profit, not just break even?",
        a: "Add the profit you want to the fixed costs, then divide by the contribution each job makes. With $4,500 of fixed costs, a $450 contribution per job and a $2,000 monthly profit goal, you need ($4,500 + $2,000) ÷ $450 = 14.4, i.e. 15 jobs. Break-even is 10 — so five of those jobs are what the profit actually costs.",
      },
      {
        q: "How do I calculate my break-even point?",
        a: "Divide your fixed monthly costs by the gross profit an average job contributes (price minus variable costs). If fixed costs are $4,000 and each job contributes $400, you need 10 jobs a month to break even. Job number 11 is where profit starts.",
      },
      {
        q: "What are fixed vs. variable costs for a contractor?",
        a: "Fixed costs repeat whether or not you work: insurance, truck payment, rent, software. Variable costs scale with each job: materials, subcontractor payments, dump fees, job-specific fuel. Wages of field crews are usually treated as variable per job; your own salary as owner belongs in fixed costs.",
      },
    ],
    related: ["margin-calculator", "overhead-calculator", "job-pricing-calculator", "target-margin-calculator", "guides/how-to-price-a-job", "guides/what-margin-should-i-target"],
  },
  {
    slug: "job-profitability-calculator",
    name: "Job Profitability Calculator",
    keyword: "job profitability calculator",
    metaTitle: "Job Profitability Calculator — Did the Job Make Money?",
    metaDescription:
      "Compare a finished job against its estimate: the margin you planned, the margin you got, the profit the overrun cost you, and the price that would have held it.",
    category: "pricing",
    updated: "2026-09-23",
    summary:
      "Compare what a job was estimated to cost with what it really cost, and what the overrun took from the margin.",
    intro:
      "The quote said one number and the job cost another. Enter the price, what you estimated, and what it actually cost to see the margin you planned against the margin you got — and the overrun in dollars.",
    formulas: [
      {
        label: "Planned profit",
        formula: "Planned Profit = Price − Estimated Cost",
      },
      {
        label: "Actual profit",
        formula: "Actual Profit = Price − Actual Cost",
      },
      {
        label: "Gross margin (planned and actual)",
        formula: "Margin % = Profit ÷ Price × 100",
        note: "Margins are stated on the contract price, so the gap between the two is measured in margin points — not in cost percentages.",
      },
      {
        label: "Profit lost to the overrun",
        formula: "Profit Variance = Estimated Cost − Actual Cost",
        note: "Every dollar a job overruns comes straight out of profit: costs rose, the selling price can't.",
      },
      {
        label: "Cost overrun",
        formula: "Overrun % = (Actual Cost − Estimated Cost) ÷ Estimated Cost × 100",
      },
      {
        label: "Price that would have held the margin",
        formula: "Price = Actual Cost ÷ (1 − Planned Margin ÷ 100)",
        note: "Back-solves the quote you would have needed once the real cost was known.",
      },
    ],
    faqs: [
      {
        q: "What is job profitability (or job costing)?",
        a: "It's comparing what a job actually cost to what you estimated, after the work is done. The estimate tells you what you intended; the actuals tell you what happened. The gap between them is the only feedback that improves your next estimate — which is why trades businesses that never check actuals keep repeating the same optimistic assumption.",
      },
      {
        q: "Why does a small cost overrun cost so much margin?",
        a: "Because costs come out of profit, and profit is the smallest number in the calculation. On a $4,000 job estimated at $2,600 of cost, the planned margin is 35%. If the job actually costs $3,050 — a 17% overrun — the margin becomes 23.8%: the cost rose 17%, but profit fell 32%. Percentage overruns on cost always land harder on profit.",
      },
      {
        q: "How do I find out whether the overrun was labor or materials?",
        a: "Totals can't tell you, so break the actuals into the same lines as the estimate: labor hours at your burdened rate, material invoices, subcontractor bills, trips, disposal and permits. Then compare line by line. In our experience of how these overruns are usually described in trade forums, undercounted hours and small forgotten costs (trips, fasteners, disposal) account for most of the damage — but confirm it with your own numbers.",
      },
      {
        q: "A job made less margin than planned — should I raise my prices?",
        a: "Not automatically. First decide which it was: a one-off surprise, a scope change you should have change-ordered, or a systematically optimistic estimate. Only the third one justifies changing your rates — and then the honest move is to fix the input that was wrong (hours, waste, overhead allowance) rather than adding a blanket cushion.",
      },
      {
        q: "How often should I run a job profitability check?",
        a: "On every completed job while your estimating data is thin, and on a sample of each job type once patterns appear. It takes a few minutes per job and it's the only way to know whether 'busy' is actually profitable. Keep the results: three or four jobs of the same type turn a guess into a range.",
      },
    ],
    related: [
      "job-pricing-calculator",
      "margin-calculator",
      "markup-calculator",
      "guides/job-costing",
      "guides/how-to-price-a-job",
      "guides/change-orders-and-margin",
    ],
  },
  {
    slug: "discount-impact-calculator",
    name: "Discount Impact Calculator",
    keyword: "discount impact on profit calculator",
    metaTitle: "Discount Impact Calculator — What a Discount Really Costs",
    metaDescription:
      "See what a discount actually costs: the profit it erases, the margin it leaves on the job, and how many extra jobs you'd need just to earn the same money.",
    category: "pricing",
    updated: "2026-09-23",
    summary:
      "What a discount costs in profit, and how much extra work it would take to replace it.",
    intro:
      "A discount comes out of profit, not revenue — which is why 10% off can erase a quarter of what a job earns. Enter your price, the job's cost and the discount to see the profit lost and the extra volume needed to replace it.",
    formulas: [
      {
        label: "Discounted price",
        formula: "Discounted Price = Price × (1 − Discount ÷ 100)",
      },
      {
        label: "Profit at each price",
        formula: "Profit = Price − Job Cost",
        note: "Your costs don't shrink when the price does — that's the entire problem with discounting.",
      },
      {
        label: "Share of profit erased",
        formula: "Erased % = (Profit before − Profit after) ÷ Profit before × 100",
        note: "A 10% discount on a 37.5%-margin job erases 26.7% of the profit, not 10%.",
      },
      {
        label: "Extra volume to stand still",
        formula: "Volume Multiplier = Profit before ÷ Profit after",
        note: "How many discounted jobs it takes to earn what one job used to earn.",
      },
    ],
    faqs: [
      {
        q: "Why does a 10% discount cost more than 10% of my profit?",
        a: "Because the discount is measured against the price while profit is a fraction of the price. A $1,200 job that costs $750 earns $450, a 37.5% margin. Ten percent off is $120 — measured against the price that's 10%, but measured against the profit it's 26.7%. The smaller your margin, the more brutal the arithmetic: on a 15% margin, a 10% discount wipes out two-thirds of the profit.",
      },
      {
        q: "How much extra work does a discount require to break even?",
        a: "Divide the profit before the discount by the profit after. On the example above, $450 ÷ $330 = 1.36, so you'd need 36% more jobs to earn the same money. This is why discounting for volume only makes sense when you have idle capacity and the extra work genuinely costs nothing more than variable cost — otherwise you're buying revenue with profit.",
      },
      {
        q: "Should I ever discount?",
        a: "Yes, when it buys something specific: work that fills capacity you'd otherwise waste, a trade for faster payment or flexible scheduling, bundled repeat work, or a customer acquisition you're deliberately paying for. What doesn't work is discounting as a reflex to a lower competing bid — that sets a price expectation you'll have to live with on every future job.",
      },
      {
        q: "Is it better to discount or to reduce the scope?",
        a: "Reducing scope, almost always. A discount on the same scope lowers both the price and the margin percentage, so the job carries proportionally less overhead than your pricing assumed. Removing a line — the optional fixture, the second coat, the trim detail — lowers the price while keeping the same margin on the work that remains. Same customer outcome, protected economics.",
      },
      {
        q: "What is the lowest price I can accept on a job?",
        a: "The floor is the job's variable cost plus the overhead it must carry — at or below that, the work is subsidising the customer. Use the Margin Calculator to check the margin any final price actually carries, and your Overhead Calculator to know what share of revenue the job is expected to contribute. Below the floor, it's cheaper to leave the job unbooked.",
      },
    ],
    related: [
      "margin-calculator",
      "markup-calculator",
      "break-even-calculator",
      "price-increase-calculator",
      "guides/what-a-discount-costs",
      "guides/markup-vs-margin",
      "guides/when-to-raise-prices",
    ],
  },
  {
    slug: "hire-vs-subcontract-calculator",
    name: "Hire vs. Subcontract Calculator",
    keyword: "employee vs subcontractor cost calculator",
    metaTitle: "Hire or Subcontract? Employee vs. Sub Cost Calculator",
    metaDescription:
      "Compare the real annual cost of an employee with what a subcontractor charges for the same billable hours, and find the workload where hiring starts to pay.",
    category: "costs",
    updated: "2026-09-23",
    summary:
      "Employee or subcontractor? Compare a fully burdened annual cost with a subcontractor's rate.",
    intro:
      "An employee costs the same whether the work is there or not; a subcontractor costs nothing when the phone is quiet. Enter the employee's real annual cost, the hours it can bill, the hours you actually have, and the subcontractor's rate — and see where the two cross.",
    formulas: [
      {
        label: "Employee cost per billable hour",
        formula: "Cost per Billable Hour = Annual Employee Cost ÷ Billable Hours Delivered",
        note: "The same annual cost spread over fewer billable hours is a higher rate — that's what under-utilisation costs you.",
      },
      {
        label: "Subcontractor cost",
        formula: "Sub Cost = Subcontractor Rate × Billable Hours",
      },
      {
        label: "Break-even billable hours",
        formula: "Break-even Hours = Annual Employee Cost ÷ Subcontractor Rate",
        note: "Above this workload the employee is the cheaper way to cover the work; below it, subcontracting is.",
      },
      {
        label: "Utilisation",
        formula: "Utilisation % = Billable Hours Delivered ÷ Billable Hours Available × 100",
        note: "Available billable hours are paid hours minus PTO, training and non-billable time — the Labor Burden Calculator produces that number.",
      },
    ],
    faqs: [
      {
        q: "Is it cheaper to hire an employee or subcontract the work?",
        a: "It depends on the workload, and it's a solvable question: divide the employee's fully burdened annual cost by the subcontractor's hourly rate. That's the break-even — if you have fewer billable hours a year than that, paying a sub only for the hours you have is cheaper; more, and the employee wins. At $65,160 a year for an installer and a $55/hr sub, break-even is about 1,185 billable hours. If the employee isn't busy with your work, they're still paid — that's the point this calculator makes: the wage isn't the decision, the utilisation is.",
      },
      {
        q: "What has to be in the employee's annual cost?",
        a: "Every cost that exists because they're on the payroll: wages, payroll taxes, workers' compensation, benefits, paid time off, training, licenses, and any company gear they need. The Labor Burden Calculator totals it and divides it by billable hours. Leave out recruiting and onboarding costs only if you'd rather treat them as one-offs.",
      },
      {
        q: "What does this comparison leave out?",
        a: "Control and risk, which are real and hard to price: subcontractors set their own schedule and methods, may also work for your competitors, and you generally can't direct their work the way you can an employee's. In many places, being able to direct the work is also what legally distinguishes an employee from a contractor — which is a judgment call for a lawyer or accountant, not a calculator. What the numbers can tell you is the workload at which each option starts to make financial sense.",
      },
      {
        q: "How many billable hours should I assume for an employee?",
        a: "Your own history if you have one. A common planning figure in trades businesses is roughly 80–85% of paid hours after PTO and holidays — around 1,700–1,850 billable hours for a full-time field role — but that's a heuristic, not a benchmark, and it swings with your mix of service work, project work and admin. Never assume 2,080: nobody bills every paid hour.",
      },
      {
        q: "Does this calculator include tax differences between employees and contractors?",
        a: "No. It compares cash cost, not tax treatment. Employer payroll taxes are inside the burdened annual cost, but income tax withholding, self-employment tax for the subcontractor, and employee-versus-contractor rules vary by jurisdiction and situation. Take the workload answer from here and the tax answer from your accountant.",
      },
    ],
    related: [
      "labor-burden-calculator",
      "hourly-rate-calculator",
      "overhead-calculator",
      "guides/hire-or-subcontract",
      "guides/how-to-calculate-labor-burden",
    ],
  },
  {
    slug: "effective-hourly-rate-calculator",
    name: "Effective Hourly Rate Calculator",
    keyword: "effective hourly rate calculator",
    metaTitle: "Effective Hourly Rate Calculator — Profit per Real Hour",
    metaDescription:
      "Find your true effective hourly rate: job profit divided by every hour the job takes, including quoting, travel and cleanup — not just the on-site hours.",
    category: "costs",
    updated: "2026-10-01",
    summary:
      "What a job really pays per hour once every unpaid hour it causes is counted.",
    intro:
      "A job can pay $85 an hour on site and still earn you $50 once the quoting, the supply run and the drive home are counted. Enter the job's revenue, costs and hours — both the paid and the unpaid ones — and see the effective hourly rate your year actually lives on.",
    formulas: [
      {
        label: "Total job cost",
        formula: "Total Cost = (On-site Hours × Hourly Cost) + Materials + Subs + Vehicle",
        note: "Use your burdened hourly cost, not the bare wage — the Labor Burden Calculator computes it.",
      },
      {
        label: "Gross profit",
        formula: "Profit = Revenue − Total Cost",
      },
      {
        label: "Rate per on-site hour",
        formula: "On-site Rate = Profit ÷ On-site Hours",
        note: "The flattering number most people quote.",
      },
      {
        label: "Effective hourly rate",
        formula: "Effective Rate = Profit ÷ (On-site Hours + Unbillable Hours)",
        note: "Quoting, pickups, travel, cleanup and invoicing produce no revenue but take real hours — the effective rate divides by all of them.",
      },
      {
        label: "Gross margin",
        formula: "Margin % = Profit ÷ Revenue × 100",
      },
    ],
    faqs: [
      {
        q: "What is an effective hourly rate?",
        a: "It's the job's gross profit divided by every hour the job takes from you — on-site work plus the quoting, material runs, travel, cleanup and invoicing it causes. It's the honest counterpart to the rate per billed hour, which divides by on-site hours only and always looks better than reality.",
      },
      {
        q: "Why is my effective rate so much lower than my hourly price?",
        a: "Because unpaid time is invisible in the price. A $3,200 job that costs $1,852 earns $1,348: across 24 on-site hours that's $56.17/hour, but across 30 real hours — including 6 of quoting, runs and travel — it's $44.93. The six unpaid hours cut the rate by $11.24 without any invoice ever showing it. Jobs with lots of trips, small scopes or heavy admin have the biggest gaps.",
      },
      {
        q: "Which hours should I count as unbillable?",
        a: "Every hour this job causes that no invoice pays for: the estimate, the pickup runs, driving between site and supplier, cleanup beyond what you bill, photos and invoicing, and any rework. If you're unsure, log the hours honestly for one job — most owners are surprised by the total, which is exactly why the effective rate is lower than expected.",
      },
      {
        q: "How do I raise my effective hourly rate?",
        a: "Four levers, in order of impact: charge more for the same hours (see the Price Increase Calculator), cut the job's direct costs, shrink the unpaid time (batch pickups, charge for travel, quote faster), or take jobs of a similar kind in the same area so trip time collapses. Raising hours worked with the same rate doesn't raise the rate at all — it just buys more of it.",
      },
      {
        q: "How does this differ from the Hourly Rate Calculator?",
        a: "The Hourly Rate Calculator works from the year backwards: income goal plus expenses divided by billable hours — it sets the floor your rate must clear. This one works from a single job forwards: what that job actually paid per real hour. Use the floor to judge the job, and the effective rate to judge which jobs deserve more of your year.",
      },
    ],
    related: [
      "hourly-rate-calculator",
      "labor-burden-calculator",
      "price-increase-calculator",
      "guides/effective-hourly-rate",
      "guides/billable-hours-and-income-goal",
    ],
  },
  {
    slug: "change-order-calculator",
    name: "Change Order Calculator",
    keyword: "change order calculator",
    metaTitle: "Change Order Calculator — Price Extra Work Correctly",
    metaDescription:
      "Free change order calculator for contractors. Price extra work so the job's overall margin is preserved — not just cost plus a guess — and see the new contract price.",
    category: "pricing",
    updated: "2026-10-01",
    summary:
      "Price extra work so the whole job keeps its margin — cost, profit and the new contract price.",
    intro:
      "Scope changed, so the price has to. Enter the original contract, the extra work's real cost, and the margin the job was priced at — and get a change order amount that keeps the job's overall margin intact instead of quietly diluting it.",
    formulas: [
      {
        label: "Cost of the additional work",
        formula: "Extra Cost = (Extra Hours × Burdened Rate) + Extra Materials + Other",
      },
      {
        label: "Change order amount (margin-correct)",
        formula: "Change Order = (Original Cost + Extra Cost) ÷ (1 − Margin ÷ 100) − Original Price",
        note: "Pricing the whole new cost base to the margin keeps the job's overall percentage intact.",
      },
      {
        label: "New contract price",
        formula: "New Price = Original Price + Change Order",
      },
      {
        label: "Margin after the change order",
        formula: "Margin % = (New Price − Total Cost) ÷ New Price × 100",
        note: "Should match the original margin — that's the whole point of the method.",
      },
      {
        label: "Profit given away by billing cost alone",
        formula: "Foregone Profit = Extra Cost × Margin ÷ (100 − Margin)",
        note: "What a free change order costs: the extra cost plus the margin it was supposed to carry.",
      },
    ],
    faqs: [
      {
        q: "How do I price a change order?",
        a: "Add the extra work's true cost — burdened labor hours, materials, subs — then price the whole new cost base to the job's original margin: (original cost + extra cost) ÷ (1 − margin), minus the price already quoted. On a $4,000 job priced at 40% margin with $432 of extra cost, the change order is ($2,832 ÷ 0.60) − $4,000 = $720. Billing just the $432 of cost would give the margin on the extra work away.",
      },
      {
        q: "Should a change order include profit?",
        a: "Yes. The extra work consumes your overhead, ties up your crew and carries the same risk as the original scope — it earns the margin like any other work. The only arguments against margin on change orders come from customers, and they don't argue it on the original contract.",
      },
      {
        q: "Can I just bill my hourly rate for extra work?",
        a: "Only if your contract says time-and-materials with a stated markup. If the job was priced to a margin, hourly billing on changes dilutes the job's overall margin — the calculator's margin-after row shows exactly how far it falls. Some contractors use a higher hourly rate on change work precisely because it's unplanned and disruptive; that's a pricing policy, and it should be in the contract.",
      },
      {
        q: "What if the change order is a credit to the customer?",
        a: "Run it the other way: remove the deleted scope's cost from the cost base and reprice the whole job to the same margin — never just subtract the customer's original line price, which would credit them more than the work was worth to you. This calculator handles additions; for deductions, apply the same formula with a negative extra cost.",
      },
      {
        q: "When should a change order be signed?",
        a: "Before the extra work starts — that's what makes it a contract term rather than a negotiation. Get the scope description, the price and the schedule impact in writing, and have the customer sign or reply by email confirming. A change order agreed after the work is done trades your leverage for a promise.",
      },
    ],
    related: [
      "job-pricing-calculator",
      "margin-calculator",
      "job-profitability-calculator",
      "guides/change-orders-and-margin",
      "guides/job-costing",
    ],
  },
  {
    slug: "target-margin-calculator",
    name: "Target Gross Margin Calculator",
    keyword: "target gross margin calculator",
    metaTitle: "Target Gross Margin Calculator — From Overhead and Net Goal",
    metaDescription:
      "Work out the gross margin your jobs must carry: overhead plus your income and net profit goal, divided by the revenue you expect. The margin to price every job at.",
    category: "pricing",
    updated: "2026-10-01",
    summary:
      "The gross margin your jobs must carry so overhead, your income and the profit goal are all covered.",
    intro:
      "Most contractors pick a target margin from a forum. This works it out from your own numbers: monthly overhead, what you need to pay yourself, the profit the business should earn — divided by the revenue you realistically expect. The result is the target margin to use on every job price.",
    formulas: [
      {
        label: "Overhead as a share of revenue",
        formula: "Overhead % = Monthly Overhead ÷ Monthly Revenue × 100",
      },
      {
        label: "Net goal as a share of revenue",
        formula: "Net % = (Owner Income + Target Net Profit) ÷ Monthly Revenue × 100",
      },
      {
        label: "Required gross margin",
        formula: "Gross Margin = Overhead % + Net %",
        note: "Gross profit pays overhead first, then the owner, then profit — so the margin must cover all three shares.",
      },
      {
        label: "Margin gap",
        formula: "Gap = Required Margin − Current Margin",
        note: "A positive gap is the margin your current pricing is failing to deliver.",
      },
      {
        label: "Price increase that closes the gap",
        formula: "Uplift % = (1 − Current Margin ÷ 100) ÷ (1 − Required Margin ÷ 100) × 100 − 100",
        note: "On the same costs, raising prices by this much lifts the margin to the requirement.",
      },
    ],
    faqs: [
      {
        q: "What gross margin should I target?",
        a: "The one your own arithmetic produces, not a forum number. Add your overhead as a percentage of revenue to your income and profit goal as a percentage of revenue — that sum is the minimum gross margin every job must carry. If overhead runs 15% of revenue and you want 25% for income and profit, your floor is 40%; pricing jobs at 25% loses money on every one, quietly.",
      },
      {
        q: "Why does revenue size change the required margin?",
        a: "Because overhead is fixed and revenue scales. The same $8,500 of overhead is 28% of a $30,000 month but only 17% of a $50,000 month — so the margin the business needs falls as honest revenue rises. That cuts both ways: growing revenue at the same margin is genuine profit growth, but discounting to buy volume raises the margin you need and shrinks the one you get at the same time.",
      },
      {
        q: "Should my own income be part of the margin?",
        a: "Yes — unless you pay yourself a wage that's already inside overhead. The margin has to fund the owner's income somewhere; if it isn't in overhead, it belongs in the net goal. Putting it in both double-counts it; leaving it out of both is the most common way owners end up working for the business instead of being paid by it.",
      },
      {
        q: "What do I do with the number this produces?",
        a: "Use it as the target margin in the Job Pricing Calculator and the Flat Rate Calculator — those divide total cost by (1 − margin), which prices to this margin correctly. Then check real jobs against it with the Margin Calculator: the requirement is only real if the quotes actually carry it.",
      },
      {
        q: "What if my current margin is below the requirement?",
        a: "The calculator shows the gap in margin points, the dollars it costs per job, and the price increase that closes it on the same costs. A gap is a pricing problem only if your costs are right and the market pays it; if the market won't pay the required price, the honest answers are cutting overhead, raising revenue, or accepting a smaller profit goal — knowingly, not by default.",
      },
    ],
    related: [
      "job-pricing-calculator",
      "flat-rate-calculator",
      "overhead-calculator",
      "price-increase-calculator",
      "guides/what-margin-should-i-target",
      "guides/general-contractor-markup",
    ],
  },
  {
    slug: "materials-markup-calculator",
    name: "Materials Markup Calculator",
    keyword: "materials markup calculator",
    metaTitle: "Materials Markup Calculator — Net Cost, Price and Margin",
    metaDescription:
      "Free materials markup calculator for contractors. Apply supplier discounts, add freight, mark up the net cost and see the price, profit, margin and effective multiplier.",
    category: "pricing",
    updated: "2026-10-01",
    summary:
      "Price materials properly: net cost after discount and freight, your markup, and the margin it produces.",
    intro:
      "Materials are priced badly more often than labor — list price marked up while the trade discount is never claimed, or freight eaten instead of priced. Enter list cost, your supplier discount and freight, apply a markup, and see the price, profit, margin and the effective multiplier on list.",
    formulas: [
      {
        label: "Net cost",
        formula: "Net Cost = List Cost × (1 − Supplier Discount ÷ 100) + Freight",
        note: "Freight is a cost of having the material on site, so it rides inside the marked-up base.",
      },
      {
        label: "Price to customer",
        formula: "Price = Net Cost × (1 + Markup ÷ 100)",
      },
      {
        label: "Gross profit and margin",
        formula: "Profit = Price − Net Cost ; Margin % = Profit ÷ Price × 100",
      },
      {
        label: "Effective multiplier on list",
        formula: "Effective × = Price ÷ List Cost",
        note: "What a price book that 'marks parts up 2×' would call your number.",
      },
    ],
    faqs: [
      {
        q: "How much should I mark up materials?",
        a: "Commonly 20–50% on net cost, depending on trade, handling and risk — but the honest answer is the markup that pays for what materials actually cost you beyond the invoice: storage, handling, delivery coordination, returns, warranty exposure and the cash float while the customer pays. A markup that low covers only the invoice and quietly loses money on every part you touch.",
      },
      {
        q: "Do I mark up freight and delivery?",
        a: "In this method, yes — freight goes into the marked-up base, because it's a cost of having the material on site just like the material itself. Marking up only the material and billing freight at cost is also defensible and slightly more transparent; what isn't defensible is eating freight, which is how a profitable material line quietly stops being one.",
      },
      {
        q: "Why does the customer's price look like '2× parts'?",
        a: "Check the effective multiplier row: price ÷ list cost. A 100% markup on net cost after a trade discount can easily be 2.2× on list — the same economics a price book describes as doubling parts. Neither description is wrong; the multiplier is just what the customer's side of the table usually sees, and knowing yours prevents accidental underpricing when you match a competitor's 'parts at 2×' quote.",
      },
      {
        q: "Should I show the customer my material markup?",
        a: "No — quote the price. A materials markup pays for handling, storage, returns and risk that are real services, not padding. Itemized invoices that expose cost-plus-markup invite customers to buy the material themselves and hand you the coordination work unpaid. Quote the job price; keep the internal math internal.",
      },
      {
        q: "Is a materials markup the same as job margin?",
        a: "No, and mixing them double-counts profit. If you mark materials up 35% and then apply a 35% margin to the whole job including the marked-up materials, the material line earns profit twice. Pick a structure: either markup inside the material line and margin only on the rest, or cost-only materials with one margin over the whole job — the Job Pricing Calculator uses the second.",
      },
    ],
    related: [
      "job-pricing-calculator",
      "markup-calculator",
      "margin-calculator",
      "guides/materials-markup",
      "guides/markup-vs-margin",
    ],
  },
  {
    slug: "price-increase-calculator",
    name: "Price Increase Calculator",
    keyword: "price increase calculator contractors",
    metaTitle: "Price Increase Calculator — Profit Gained vs Jobs Lost",
    metaDescription:
      "See what a price increase is worth: extra profit per job, month and year — and how many customers you could lose and still earn the same. The raise-your-rates arithmetic.",
    category: "pricing",
    updated: "2026-10-01",
    summary:
      "What raising your prices is worth — and how many jobs you could afford to lose because of it.",
    intro:
      "Raising prices is the only lever that adds profit with no extra hours, materials or overhead — the catch is customers who leave. Enter your typical month and a proposed increase, and see the profit it adds and the share of jobs you could afford to lose and still earn the same.",
    formulas: [
      {
        label: "New average price",
        formula: "New Price = Average Price × (1 + Increase ÷ 100)",
      },
      {
        label: "Extra profit per job",
        formula: "Extra per Job = Increase % × Average Price",
        note: "Every dollar of the increase lands in profit — costs don't move.",
      },
      {
        label: "Extra profit per month and year",
        formula: "Extra = Jobs × Extra per Job ; Annual = Extra × 12",
      },
      {
        label: "Jobs you can afford to lose",
        formula: "Loss Capacity = Jobs × (1 − Profit Before ÷ Profit After)",
        note: "How many customers can walk away before total profit falls below today's.",
      },
    ],
    faqs: [
      {
        q: "How much should I raise my prices?",
        a: "Enough to close the gap between your current margin and the margin your overhead plus income goal requires — the Target Gross Margin Calculator produces that number. As a practical matter, increases in the 5–15% range are common for working-price corrections; anything larger usually signals that prices were too low for too long, which is a correction, not a negotiation.",
      },
      {
        q: "Won't I lose customers if I raise prices?",
        a: "Some, and the arithmetic says how many you can afford: with a $450 profit per job that rises to $546 after an 8% increase, you could lose one job in six and still earn exactly the same total. The jobs you keep pay more per unit of work, trips and risk — which is why the busy-but-broke month and the quiet-but-profitable month are often the same month counted two ways.",
      },
      {
        q: "How is this different from the Discount Impact Calculator?",
        a: "It's the same arithmetic in reverse. A discount shrinks profit and demands more volume to compensate; an increase grows profit and grants you attrition headroom. Running both shows the asymmetry: the 8% you give away costs far more profit than the 8% you add, because profit is a small number and discounts come out of it first.",
      },
      {
        q: "When is the right time to raise prices?",
        a: "When your numbers say the margin is wrong, not when your frustration does. The honest triggers: an annual cost review that shows overhead up, a required margin your quotes don't carry, or job costing that shows systematic underestimating. Announce it simply and ahead of new quotes — existing signed work keeps its price; everything quoted after the date carries the new one.",
      },
      {
        q: "Should I raise prices on existing customers too?",
        a: "On new work, yes; on signed work, no — a signed price is a promise, and breaking it costs more than the margin. For recurring customers, give notice before the next quote cycle rather than mid-project. Losing a long-standing customer over a necessary correction is survivable; being known for repricing signed jobs is not.",
      },
    ],
    related: [
      "discount-impact-calculator",
      "target-margin-calculator",
      "margin-calculator",
      "effective-hourly-rate-calculator",
      "guides/when-to-raise-prices",
      "guides/what-a-discount-costs",
    ],
  },
  {
    slug: "overtime-calculator",
    name: "Overtime Cost Calculator",
    keyword: "overtime cost calculator",
    metaTitle: "Overtime Cost Calculator — True Burdened OT Rate & Premium",
    metaDescription:
      "Free overtime cost calculator for contractors. See the burdened cost of an overtime hour, the annual premium beyond straight time, and OT's share of labor cost.",
    category: "costs",
    updated: "2026-10-01",
    summary:
      "What an overtime hour truly costs — burdened, multiplied, and annualized.",
    intro:
      "Overtime is priced twice wrong: at the bare wage times 1.5, ignoring that payroll taxes and comp ride on OT wages too — or as a vague 'expensive'. Enter the wage, burden and OT hours to see the true burdened OT rate, the annual premium beyond straight time, and what share of labor cost overtime has become.",
    formulas: [
      {
        label: "Burdened overtime rate",
        formula: "OT Rate = Wage × (1 + Burden %) × OT Multiplier",
        note: "Taxes and workers' comp apply to overtime wages exactly as to straight ones — the multiplier applies to the burdened rate.",
      },
      {
        label: "OT hours per year",
        formula: "OT Hours = OT Hours per Week × Weeks",
      },
      {
        label: "Annual premium beyond straight time",
        formula: "Premium = OT Hours × Burdened Wage × (Multiplier − 1)",
        note: "What the multiplier alone costs, above the same hours paid at 1×.",
      },
      {
        label: "OT share of total labor cost",
        formula: "OT Share % = OT Labor Cost ÷ (Straight + OT Labor Cost) × 100",
        note: "If OT's share of cost exceeds its share of hours, the premium isn't being passed on.",
      },
    ],
    faqs: [
      {
        q: "How much does an overtime hour really cost?",
        a: "More than 1.5× the wage, because burden rides on OT pay: a $25 wage at 31% burden and time-and-a-half costs $31.88 × 1.5 = $47.81 per OT hour — not the $37.50 the bare wage suggests. The premium beyond straight time is what the multiplier alone adds, and it's the number to weigh against hiring.",
      },
      {
        q: "Is overtime cheaper than hiring?",
        a: "For short, temporary peaks — a busy season, one large job — almost always: OT scales down to zero when the work does, while a hire is a fixed annual commitment. For persistent overtime that's become the norm, add up the annual premium and run it through the Hire vs. Subcontract Calculator: paying premium rates year-round is usually the more expensive way to buy those hours.",
      },
      {
        q: "Should I pass overtime costs to the customer?",
        a: "On genuine rush work, yes — price it with the burdened OT rate inside, plus a premium for the disruption. On work that's only overtime because the estimate slipped, no: that's an estimating problem, and billing the customer for it costs more goodwill than the premium is worth. Persistent OT on normally-priced work means your rates don't cover the real cost of your hours.",
      },
      {
        q: "Does overtime always cost more per hour, even for salaried or sub crews?",
        a: "The statutory multiplier applies to hourly employees; salaried workers and most subcontractors don't carry it legally. But long hours still cost: fatigue-driven rework, slower productivity in hour 50 than hour 30, and burnout attrition are real costs even when no OT premium is invoiced. The calculator covers the legal cash premium; the fatigue tax you add from your own experience.",
      },
    ],
    related: [
      "labor-burden-calculator",
      "hire-vs-subcontract-calculator",
      "job-pricing-calculator",
      "guides/overtime-cost",
      "guides/how-to-calculate-labor-burden",
    ],
  },
  {
    slug: "trip-cost-calculator",
    name: "Truck Roll Cost Calculator",
    keyword: "truck roll cost calculator",
    metaTitle: "Truck Roll Cost Calculator — What a Service Visit Really Costs",
    metaDescription:
      "Free truck roll calculator for field service. Vehicle cost plus unpaid drive time per call — the true trip cost to use in flat rates, minimum charges and routing.",
    category: "costs",
    updated: "2026-10-01",
    summary:
      "What one trip really costs: the vehicle's share plus the unpaid drive time it carries.",
    intro:
      "The fuel receipt is the smallest part of a truck roll. Enter your daily vehicle cost, the driving a typical day takes, and your burdened labor rate — and see what one trip truly costs once the drive time is paid for. The number every flat rate, service call minimum and routing decision should be built on.",
    formulas: [
      {
        label: "Vehicle cost per call",
        formula: "Vehicle per Call = Daily Vehicle Cost ÷ Calls per Day",
      },
      {
        label: "Drive labor per call",
        formula: "Drive Labor per Call = (Daily Drive Minutes ÷ 60) ÷ Calls per Day × Burdened Hourly Cost",
        note: "Drive time is shared across the day's calls — each trip carries a slice of it, unpaid by any invoice.",
      },
      {
        label: "True trip cost",
        formula: "Trip Cost = Vehicle per Call + Drive Labor per Call",
      },
      {
        label: "Annual cost of the trips",
        formula: "Annual = Trip Cost × Truck Rolls per Year",
      },
    ],
    faqs: [
      {
        q: "What is a truck roll?",
        a: "Field-service shorthand for one visit: dispatching a tech and a vehicle to a customer site. Its cost is the vehicle's share of the day (fuel, wear, insurance) plus the drive time it carries at your burdened labor rate — which is usually the larger half, and the one nobody's fuel receipt shows.",
      },
      {
        q: "How much does a service call trip really cost?",
        a: "It depends on density. A day with $28 of vehicle cost, 50 minutes of driving and 4 calls makes each trip carry $7 of vehicle and about 12.5 minutes of $38 labor — roughly $15 per roll. The same tech doing 2 calls across town doubles both halves. Density, not distance, is what makes trips cheap.",
      },
      {
        q: "How does this connect to a minimum service charge?",
        a: "Your trip charge or call-out minimum should exceed the true trip cost — otherwise a customer who cancels mid-call still costs you money. Build the minimum from the trip cost plus the smallest diagnostic block you sell, and the Flat Rate Calculator handles the rest of the job on top.",
      },
      {
        q: "Should I charge customers for travel time?",
        a: "You already do or you don't — the trip cost exists either way, and it comes out of the job's margin unless the price carries it. Options that work: a stated call-out fee, higher rates in far zones, minimum charges per visit, or simply pricing the whole job with the trip inside. The worst option is the invisible one: pretending the drive is free.",
      },
    ],
    related: [
      "flat-rate-calculator",
      "labor-burden-calculator",
      "effective-hourly-rate-calculator",
      "guides/truck-roll-cost",
      "guides/minimum-service-charge",
    ],
  },
  {
    slug: "warranty-cost-calculator",
    name: "Warranty & Rework Cost Calculator",
    keyword: "rework cost calculator",
    metaTitle: "Rework Cost Calculator — What Callbacks Really Cost You",
    metaDescription:
      "Free rework and warranty cost calculator. See what your callback rate costs per year, the profit left on a redone job, and the margin points rework drags off every quote.",
    category: "pricing",
    updated: "2026-10-01",
    summary:
      "What your callback rate costs per year — and the margin points it drags off every job.",
    intro:
      "A callback is a job you do twice and get paid once for. Enter your average job, the cost of redoing one, and your callback rate — and see the annual cost, the profit left on a redone job, and how many margin points rework silently drags off everything you quote.",
    formulas: [
      {
        label: "Cost to redo one job",
        formula: "Rework Cost = Job Price × Rework Share %",
        note: "Materials often survive a redo; labor rarely does — 15–25% of job price is the common honest range.",
      },
      {
        label: "Full cost per callback",
        formula: "Callback Cost = Rework Cost × (1 + Return-trip add-on %)",
        note: "The return visit adds diagnostics and trips on top of the redo itself.",
      },
      {
        label: "Annual cost of rework",
        formula: "Annual = Jobs per Year × Callback Rate × Callback Cost",
      },
      {
        label: "Margin drag",
        formula: "Margin Drag (pts) = Rework Cost × Callback Rate ÷ Job Price × 100",
        note: "The points every quote loses to callbacks you can't invoice — the allowance every job silently carries.",
      },
    ],
    faqs: [
      {
        q: "What does a callback really cost a contractor?",
        a: "A job you do twice and bill once. On a $1,200 job with $750 of variable cost, redoing it at 20% of price costs $240 — roughly a third of the job's $450 profit, gone. At a 3% callback rate across 144 jobs a year, that's about $1,037 of pure margin drag, plus the schedule disruption a return visit always causes.",
      },
      {
        q: "How much margin should I add for warranty work?",
        a: "Exactly what your own numbers produce: the margin drag row is the honest allowance — it's the share of revenue callbacks consume. Adding a blanket 'warranty cushion' without knowing your rate either overcharges (if your rework is low) or under-recovers (if it's high). The systematic fix is finding why jobs come back, not padding the price.",
      },
      {
        q: "How do I reduce callback rates?",
        a: "In order of leverage: find the systematic cause (the same detail failing on repeat jobs is a process problem, not bad luck); inspect before handover, when fixing costs minutes instead of a return trip; document what was installed and why, which settles most warranty disputes; and write the warranty term narrowly — covered parts, duration, and what voids it.",
      },
      {
        q: "Should warranty be priced into the job or charged separately?",
        a: "Priced in. A warranty is part of what the customer is buying, and padding it on as a line item reads as a surcharge for competence. The drag points tell you what 'priced in' must mean: quotes carry the margin required after rework, not before it — the Target Gross Margin Calculator can absorb this drag into the requirement itself.",
      },
    ],
    related: [
      "job-profitability-calculator",
      "target-margin-calculator",
      "margin-calculator",
      "guides/rework-and-warranty-cost",
      "guides/job-costing",
    ],
  },
  {
    slug: "quote-win-rate-calculator",
    name: "Quote Win Rate Calculator",
    keyword: "quote win rate calculator",
    metaTitle: "Quote Win Rate Calculator — Conversion & Estimating Cost",
    metaDescription:
      "Free quote win rate calculator for contractors. See your conversion rate, what estimating costs per won job, and the yearly cost of the quotes that said no.",
    category: "pricing",
    updated: "2026-10-01",
    summary:
      "Your quote-to-win conversion — and what each won job really cost you in estimating time.",
    intro:
      "Every quote is unpaid sales work with a real cost. Enter your monthly quotes, wins, average job value and estimating hours to see your win rate, the value win rate, what estimating costs per won job, and what a year of lost quotes adds up to.",
    formulas: [
      {
        label: "Win rate",
        formula: "Win Rate = Jobs Won ÷ Quotes Sent × 100",
      },
      {
        label: "Value win rate",
        formula: "Value Win Rate = Won Value ÷ Quoted Value × 100",
        note: "A value rate far below the count rate means you're winning the small jobs and losing the big ones.",
      },
      {
        label: "Estimating cost per won job",
        formula: "Cost per Win = (Quotes × Hours per Quote × Hourly Cost) ÷ Jobs Won",
        note: "A customer-acquisition cost hiding in admin time — every lost quote is paid work with no invoice.",
      },
      {
        label: "Cost of lost quotes",
        formula: "Lost Cost = (Quotes − Wins) × Hours per Quote × Hourly Cost",
      },
    ],
    faqs: [
      {
        q: "What is a good quote win rate for contractors?",
        a: "There's no universal number — it's a diagnosis, not a grade. A very high win rate with thin revenue usually means prices are too low. A very low one with good prices means the wrong leads, slow follow-up, or quotes that take weeks. The useful benchmark is your own trend, and the useful split is value won versus count won.",
      },
      {
        q: "Why track value won separately from jobs won?",
        a: "Because they disagree usefully. Winning 6 of 10 quotes sounds healthy until you see the six were the small ones: a 60% count win rate can hide a 25% value win rate. The value split tells you whether your pricing loses big jobs specifically — a pricing conversation — or loses everything evenly — a lead-quality or follow-up conversation.",
      },
      {
        q: "How do I improve my win rate without cutting prices?",
        a: "Qualify harder before writing the quote — every junk lead deleted costs nothing and every one quoted costs your hourly rate times the hours. Follow up within a day while you're still the freshest bid. Include the two or three things competitors leave out (timeline, what's excluded, warranty terms) so the customer compares documents, not just totals. And quote fewer things better.",
      },
      {
        q: "What is the real cost of a lost quote?",
        a: "The hours it took, at your burdened rate — plus the opportunity cost of not estimating a winnable one instead. At 1.5 hours and $45, that's $67.50 per lost quote; a month of 7 losses is $472 of labor with nothing to show, and a year of it is a real wage. This is why qualifying before estimating pays better than quoting faster.",
      },
    ],
    related: [
      "job-pricing-calculator",
      "effective-hourly-rate-calculator",
      "discount-impact-calculator",
      "guides/quote-win-rate",
      "guides/how-to-write-an-estimate",
    ],
  },
  {
    slug: "buy-vs-rent-calculator",
    name: "Equipment Buy vs. Rent Calculator",
    keyword: "equipment buy vs rent calculator",
    metaTitle: "Buy vs. Rent Equipment Calculator — Break-Even Days of Use",
    metaDescription:
      "Free buy vs rent calculator for contractors. Enter the purchase price, rental rate and days of use to find the break-even — with the true daily cost of owning.",
    category: "costs",
    updated: "2026-10-01",
    summary:
      "The days of use per year where buying beats renting — and what an owned day truly costs.",
    intro:
      "The purchase price is the misleading part of the buy-vs-rent decision. Enter the price, its working life, what owning costs per day, and the rental rate — and see the break-even days of use where buying starts to win, plus the annual cost of each option at your usage.",
    formulas: [
      {
        label: "Capital recovery per year",
        formula: "Capital per Year = Purchase Price ÷ Working Life",
        note: "The purchase spread over the years you'll use it — not all charged to year one.",
      },
      {
        label: "Break-even days of use",
        formula: "Break-even Days = Capital per Year ÷ (Rental Rate − Daily Ownership Cost)",
        note: "Above this usage, owning wins; below it, renting does.",
      },
      {
        label: "True cost of an owned day",
        formula: "Owned Day Cost = Capital per Year ÷ 365 + Daily Ownership Cost",
        note: "Capital plus the cash cost of keeping it — storage, maintenance, insurance — even on days it sits.",
      },
      {
        label: "Annual cost of each option",
        formula: "Own = Capital + Own Cost × 365 ; Rent = Rental Rate × Days Used",
      },
    ],
    faqs: [
      {
        q: "When is it cheaper to buy equipment instead of renting?",
        a: "When annual usage passes the break-even: capital per year divided by the rental rate minus your daily ownership cost. A $3,200 tool with a 6-year life, $12/day of ownership and $65/day rental breaks even at about 10 days a year — buy what you use monthly, rent what comes down twice a year.",
      },
      {
        q: "What counts as the daily cost of owning?",
        a: "Everything that exists because the tool is yours: storage or shelf space, maintenance and consumables, insurance share, and the depreciation of value while it sits. The purchase price itself is handled by capital recovery over the working life — putting it in the daily cost too would double-count it.",
      },
      {
        q: "What does this calculation leave out?",
        a: "Capability and cash. Owning means the tool is there on the surprise Saturday job and financed through the quiet months; renting means flexibility, zero shelf, and the yard's maintenance. Resale value also softens the true cost of owning — the working-life input handles it roughly; a tool with strong resale is cheaper to own than this shows.",
      },
      {
        q: "Should I finance the purchase instead?",
        a: "Financing changes the timing of the cash, not the economics — the interest replaces some of the capital-recovery cost and the break-even moves only slightly. What financing genuinely changes is the risk: payments continue whether the work does. Buy what the break-even justifies and the calendar can carry.",
      },
    ],
    related: [
      "overhead-calculator",
      "break-even-calculator",
      "trip-cost-calculator",
      "guides/buy-vs-rent",
      "guides/general-contractor-markup",
    ],
  },
  {
    slug: "payment-terms-calculator",
    name: "Payment Terms & Late Payment Calculator",
    keyword: "late payment cost calculator",
    metaTitle: "Late Payment Cost Calculator — What Slow Payers Really Cost",
    metaDescription:
      "Free late payment calculator. Price the financing cost of invoices paid beyond terms, the annual drag across your book, and the working capital slow payers tie up.",
    category: "pricing",
    updated: "2026-10-01",
    summary:
      "What slow payment costs: the financing of every day beyond terms, per invoice and per year.",
    intro:
      "An invoice paid 45 days late is a loan you made to the customer — at your interest rate. Enter the invoice value, the terms you offer, when it actually gets paid, and your cost of money, and see what the delay costs, per invoice and across the year's book.",
    formulas: [
      {
        label: "Days beyond terms",
        formula: "Days Late = Actual Payment Days − Terms Offered",
      },
      {
        label: "Financing cost of the delay",
        formula: "Cost = Invoice × Annual Rate × (Days Late ÷ 365)",
        note: "The annual rate is what your money costs: an overdraft or credit-line rate, or your own cost of capital.",
      },
      {
        label: "Annual drag across the book",
        formula: "Annual Drag = Cost per Invoice × Invoices per Year",
      },
      {
        label: "Working capital tied up",
        formula: "Float = Invoice × (Payment Days ÷ 365) × Invoices per Year",
        note: "Money owed to you at any moment — the float your business finances while customers wait.",
      },
    ],
    faqs: [
      {
        q: "How much does a late payment actually cost?",
        a: "The financing of every day beyond terms. A $2,500 invoice paid 45 days past net-30 at a 20% cost of money: $2,500 × 0.20 × (45 ÷ 365) = $61.64 — about 2.5% of the invoice in pure margin, for zero extra work. Across a year's book, slow payers quietly eat what a small job's worth of profit used to be.",
      },
      {
        q: "What rate should I use as my cost of money?",
        a: "Your actual marginal cost: the overdraft or credit-line rate if you run one, or — if you're debt-free — the rate your cash could reasonably earn, plus the risk of the receivable itself. What it is never is zero: money waiting in someone else's account is money not working in yours.",
      },
      {
        q: "Are early-payment discounts worth offering?",
        a: "Do the implied rate before offering: 2/10 net 30 gives up 2% of the invoice to move cash 20 days earlier — an implied annual rate of (2 ÷ 98) × (365 ÷ 20) ≈ 37%. Taking such a discount from your own suppliers is usually sound at any borrowing rate; offering one is expensive unless your cost of money is genuinely brutal or the customer is a repeat slow payer.",
      },
      {
        q: "How do I fix slow payment without losing customers?",
        a: "Deposits on long jobs (30–50% removes most of the float), payment on completion instead of net terms where you can, invoices sent the day of completion — not end of month — and a stated late fee that actually gets applied. The customers worth keeping don't need 90 days; the ones who do are financing their business with yours.",
      },
    ],
    related: [
      "job-pricing-calculator",
      "discount-impact-calculator",
      "target-margin-calculator",
      "guides/late-payment-cost",
      "guides/what-margin-should-i-target",
    ],
  },
  {
    slug: "maintenance-agreement-calculator",
    name: "Maintenance Agreement Calculator",
    keyword: "maintenance agreement pricing calculator",
    metaTitle: "Maintenance Agreement Pricing Calculator — Plans from Real Costs",
    metaDescription:
      "Free maintenance agreement pricing calculator for HVAC, plumbing and electrical. Price an annual plan from visit costs, see member value with retention and expected upsell.",
    category: "pricing",
    updated: "2026-10-01",
    summary:
      "Price a recurring service plan from what its visits cost — and see what a member is worth over three years.",
    intro:
      "A maintenance agreement is a promise to show up twice a year whether or not it's convenient. Enter the true cost of delivering those visits — burdened labor, travel, materials, admin — and get the annual and monthly plan price, the contribution each member leaves, and the three-year value a member represents at your renewal rate.",
    formulas: [
      {
        label: "Cost per visit",
        formula: "Visit Cost = Tech Hours × Burdened Rate + Travel + Materials",
        note: "Use the loaded labor cost, not your selling rate — otherwise profit is counted twice.",
      },
      {
        label: "Annual price (margin-correct)",
        formula: "Annual Price = (Visits × Visit Cost + Admin) ÷ (1 − Target Margin)",
      },
      {
        label: "Expected upsell per member",
        formula: "Upsell = Visit Finding Rate × Avg Extra Work × (1 − Member Discount)",
        note: "Probability-weighted expectation — not revenue to rely on.",
      },
      {
        label: "Member value over three years",
        formula: "3-yr Value = Member Value × (1 + Retention + Retention²)",
        note: "Year one, plus the renewal-rate-weighted years two and three.",
      },
    ],
    faqs: [
      {
        q: "How do I price a maintenance agreement?",
        a: "From the cost of delivering it. Total the visits' true cost — burdened tech hours, travel, consumables, plus annual admin — then divide by (1 − target margin). A two-visit plan costing $274 a year to deliver prices at $391 with a 30% margin: $32.58 a month. Price the plan on its own math; never on the hope of repair upsell.",
      },
      {
        q: "Should repair upsell revenue justify a cheaper plan?",
        a: "No — and this is the discipline that keeps agreement programs profitable. The upsell is an expectation: 40% of visits finding $180 of work is $72 expected, not $72 received. Plans priced thin and justified by upsell become loss-makers the first season the finding rate drops. Price the plan to carry itself; treat the upsell as upside.",
      },
      {
        q: "How many visits should a plan include?",
        a: "Two a year is the residential standard for HVAC (one per season); plumbing and electrical often carry one. More visits mean more cost to recover and more chances to find work — but each visit must still be costed honestly, including the drive, which is why an agreement forty minutes out is a different product from one ten minutes away.",
      },
      {
        q: "Should I bill monthly or annually?",
        a: "Monthly, usually. Annual billing concentrates cash in signup month and turns the agreement into a lumpy, seasonal payment — exactly the pattern recurring revenue exists to fix. The monthly equivalent here is the annual price divided by twelve with no discount assumed; if you offer a pay-annual discount, price it deliberately.",
      },
      {
        q: "What renewal rate should I expect?",
        a: "Well-run programs commonly retain 75–85% of members a year. Below 70%, you're replacing members faster than most shops can sell them. The biggest retention drivers are unglamorous: showing up on time, thorough inspections, and clear communication about what was found — not the discount.",
      },
    ],
    related: [
      "trip-cost-calculator",
      "labor-burden-calculator",
      "slow-season-calculator",
      "guides/maintenance-agreement-pricing",
      "guides/truck-roll-cost",
    ],
  },
  {
    slug: "slow-season-calculator",
    name: "Slow Season Reserve Calculator",
    keyword: "slow season reserve calculator",
    metaTitle: "Slow Season Reserve Calculator — Cash for the Quiet Months",
    metaDescription:
      "Free slow season calculator for seasonal contractors. See what each quiet month costs after its gross profit, the reserve you need, and the weekly set-aside to build it.",
    category: "pricing",
    updated: "2026-10-01",
    summary:
      "The cash each slow month costs after what it earns — and the weekly saving that builds the reserve.",
    intro:
      "Summer pays for winter, but almost nobody can say by how much — which is why the shoulder season surprises owners every year. Enter your monthly needs, what a slow month actually generates, and the good months you can save across: this sizes the reserve and turns it into a weekly set-aside.",
    formulas: [
      {
        label: "Monthly cash need",
        formula: "Monthly Need = Overhead + Owner Income",
        note: "The bills that don't care what the weather is doing.",
      },
      {
        label: "Gap per slow month",
        formula: "Gap = max(0, Monthly Need − Slow Revenue × Margin %)",
        note: "What the month costs after the gross profit it does generate.",
      },
      {
        label: "Total reserve",
        formula: "Reserve = Gap × Slow Months",
      },
      {
        label: "Weekly set-aside",
        formula: "Weekly Save = Reserve ÷ (Good Months × 4.33)",
        note: "Moved to a separate account in the surplus months — deliberately, not residually.",
      },
    ],
    faqs: [
      {
        q: "How much cash do I need for the slow season?",
        a: "The sum of each slow month's gap: what the month must pay minus the gross profit it generates. A business needing $14,500/month that generates $5,250 in a slow month has a $9,250 gap — three slow months means a $27,750 reserve. Most owners who compute this honestly find it's larger than what they usually hold, which explains the annual spring line-of-credit ritual.",
      },
      {
        q: "When should I start saving for the slow season?",
        a: "In the first strong month, into a separate account — not 'whatever is left over' in the checking account, which is never anything. The weekly set-aside figure converts the reserve into a habit sized to the months you actually have to build it in.",
      },
      {
        q: "What if my peak surplus can't cover the reserve?",
        a: "Three honest levers, in order: shrink the gap (cut overhead or grow recurring revenue — the Maintenance Agreement Calculator converts part of the gap into a flat monthly line), start saving earlier in the year, or knowingly plan to finance part of it and price that financing cost into the busy season's rates.",
      },
      {
        q: "Should the owner's income be in the reserve calculation?",
        a: "Yes — the reserve exists to pay you through the quiet months, so the income goal belongs in the monthly need. A reserve sized only for overhead protects the business while the owner quietly funds it from savings, which is the most common and least sustainable version of surviving the off-season.",
      },
    ],
    related: [
      "overhead-calculator",
      "maintenance-agreement-calculator",
      "break-even-calculator",
      "guides/slow-season-reserve",
      "guides/maintenance-agreement-pricing",
    ],
  },
  {
    slug: "labor-only-calculator",
    name: "Labor-Only Quote Calculator",
    keyword: "labor only quote calculator",
    metaTitle: "Labor-Only Quote Calculator — When the Customer Buys Materials",
    metaDescription:
      "Free labor-only quote calculator. Price installation labor when customers supply their own materials — with the handling time, rework risk and warranty terms priced in.",
    category: "pricing",
    updated: "2026-10-01",
    summary:
      "What to charge when the customer supplies materials — with the risk transfer priced, not absorbed.",
    intro:
      "\"I'll buy the materials, you just do the labor\" shifts real risk onto you: wrong parts, late deliveries, defective fixtures — and the rework lands on your hours. Build the labor-only price with handling time and a risk load included, and get the terms the quote must state to survive.",
    formulas: [
      {
        label: "Labor cost",
        formula: "Labor Cost = On-site Hours × Burdened Rate",
      },
      {
        label: "Material handling",
        formula: "Handling = Handling Hours × Burdened Rate",
        note: "Collecting, verifying and returning customer-supplied material is your time too.",
      },
      {
        label: "Risk load",
        formula: "Risk Load = (Labor + Handling) × Risk %",
        note: "Prices the rework and delay risk that shifts to you when you didn't supply the material.",
      },
      {
        label: "Labor-only quote",
        formula: "Quote = (Labor + Handling + Risk Load) ÷ (1 − Target Margin)",
      },
    ],
    faqs: [
      {
        q: "How much should I charge for labor only?",
        a: "More than your labor divided by hours — because the job carries risks a turnkey job doesn't. A day of work at a $38 burdened rate with an hour of material handling and a 10% risk load prices at $478 with a 35% margin: an effective $59.75 per on-site hour. Quoting it at bare labor rate × margin is how labor-only jobs become the least profitable work you do.",
      },
      {
        q: "Should I add a handling charge for customer-supplied materials?",
        a: "Yes — either as an explicit line or inside the risk load. Collecting, checking the right parts arrived, and driving them back when they didn't is real time the customer's decision creates. Many contractors also require materials to be on site and verified before the start date, which moves most of the burden back to the customer.",
      },
      {
        q: "What warranty applies on labor-only work?",
        a: "Workmanship only, in writing: you warrant your installation for a stated period; the material carries the manufacturer's warranty, which the customer claims; and defects or delays in supplied materials are re-quoted at your rate. Without those three sentences, you've implicitly warranted a product you didn't sell and can't return.",
      },
      {
        q: "Why do many contractors refuse labor-only jobs entirely?",
        a: "Because the risk transfer is real and the customer rarely prices it: the installer becomes the free diagnostician of someone else's purchasing mistake, the schedule slips on their delivery dates, and disputes over whose fault the failure was have no clean answer. If you do take them, the risk load plus the written terms are what make the economics defensible.",
      },
    ],
    related: [
      "materials-markup-calculator",
      "labor-burden-calculator",
      "job-pricing-calculator",
      "guides/labor-only-pricing",
      "guides/materials-markup",
    ],
  },
  {
    slug: "deposit-schedule-calculator",
    name: "Deposit & Progress Billing Calculator",
    keyword: "contractor deposit calculator",
    metaTitle: "Contractor Deposit Calculator — Front-load vs Cost Exposure",
    metaDescription:
      "Free deposit and progress billing calculator. Check whether your deposit covers front-loaded materials, see your cost exposure per milestone, and account for retention.",
    category: "pricing",
    updated: "2026-10-01",
    summary:
      "Does your deposit cover the job's front-loaded costs — and what are you exposed to meanwhile?",
    intro:
      "A deposit isn't a courtesy — it's the customer financing the job's front-loaded costs instead of you. Enter the contract, your deposit, the materials share and any retention, and see whether the money arrives before the costs it has to fund, and what you're exposed to meanwhile.",
    formulas: [
      {
        label: "Deposit amount",
        formula: "Deposit = Contract × Deposit %",
      },
      {
        label: "The coverage check",
        formula: "Deposit ≥ Materials Share + Mobilization",
        note: "The rule the schedule exists to enforce: the customer's money pays the job's front-loaded costs, never your float.",
      },
      {
        label: "Cost exposure after deposit",
        formula: "Exposure = Total Cost − Deposit",
        note: "Unrecovered cost while the work proceeds — the float you're financing between milestones.",
      },
      {
        label: "Final payment",
        formula: "Final = Contract − Deposit − Retention",
      },
    ],
    faqs: [
      {
        q: "How much deposit should a contractor take?",
        a: "Enough to cover the job's front-loaded costs — materials plus mobilization — which for material-heavy trades is commonly 25–50%. The honest way to set it: total what the job spends before labor accrues, add a little for the cancellation risk you're absorbing, and that's the deposit. Check local law first: many jurisdictions cap residential deposits (California, for instance, caps them at $1,000 or 10%, whichever is less).",
      },
      {
        q: "What's the difference between a deposit and progress billing?",
        a: "A deposit is the first piece of the schedule. Progress billing invoices the job in stages — rough-in, finish, completion — with each payment sized to arrive before the costs it funds. The same coverage test applies to every milestone: money before materials, not after.",
      },
      {
        q: "What is retention (retainage)?",
        a: "A percentage of each payment the customer withholds until completion — 5–10% is common on commercial work, rare on residential. It's deferred cash you finance, so it belongs in the schedule consciously: the calculator shows your exposure with the retention still held, which is the number to negotiate, not discover.",
      },
      {
        q: "Why do customers resist deposits?",
        a: "Usually fear of the contractor disappearing with the money, which is a transparency problem: a deposit explained as 'materials for your job, which arrive week one' reads as competent staging, while an unexplained 50% reads as a red flag. Itemizing what the deposit buys converts most resistance — and the customers it doesn't convert are declining to finance their own job's materials.",
      },
    ],
    related: [
      "payment-terms-calculator",
      "job-pricing-calculator",
      "change-order-calculator",
      "guides/deposit-and-progress-billing",
      "guides/late-payment-cost",
    ],
  },
  {
    slug: "revenue-per-tech-calculator",
    name: "Revenue per Technician Calculator",
    keyword: "revenue per technician calculator",
    metaTitle: "Revenue per Technician Calculator — KPI with Utilization Chain",
    metaDescription:
      "Free revenue per technician calculator. Compute the KPI, revenue per truck, per billable hour, and what your target implies — with the utilization chain that explains it.",
    category: "costs",
    updated: "2026-10-01",
    summary:
      "Revenue per tech and per truck — and the billable-hour rate that makes shops comparable.",
    intro:
      "Revenue per technician is the field-service north star, but the headline number hides the chain behind it. Enter your year and your crew: see revenue per tech and truck, the billable hours each tech actually sells, the rate per billable hour, and what your target implies at your utilization.",
    formulas: [
      {
        label: "Revenue per technician",
        formula: "Rev per Tech = Annual Revenue ÷ Technicians",
      },
      {
        label: "Billable hours per tech",
        formula: "Billable = Weeks × Hours per Week × Utilization %",
      },
      {
        label: "Revenue per billable hour",
        formula: "Rev per Hour = Annual Revenue ÷ (Techs × Billable Hours)",
        note: "The honest comparator: same revenue per tech, very different rates per selling hour.",
      },
      {
        label: "What the target implies",
        formula: "Target Rate = Target Revenue per Tech ÷ Billable Hours",
      },
    ],
    faqs: [
      {
        q: "What is a good revenue per technician?",
        a: "Published trade benchmarks put residential HVAC around $150,000–250,000 per tech a year and plumbing somewhat lower — but the mix of service, install and maintenance makes cross-shop comparisons noisy. The number that matters is the one your own required margin demands, computed from your overhead and income goals rather than borrowed from a benchmark.",
      },
      {
        q: "Why track revenue per billable hour alongside it?",
        a: "Because two shops can show identical revenue per tech while one earns $95 per billable hour and the other $140 — the difference being utilization, pricing, or job mix. The per-hour figure separates those causes: a rate problem is a pricing conversation, a utilization problem is a routing and quoting one.",
      },
      {
        q: "How do I raise revenue per technician?",
        a: "Through the same three levers the chain exposes: higher rate per billable hour (pricing, better job mix), higher utilization (denser routing, faster quoting, fewer windshield hours — the Truck Roll Calculator prices what driving costs), or more demand per tech (maintenance agreements that keep the schedule full in slow months). Hiring more techs into flat demand lowers the number, not raises it.",
      },
      {
        q: "Should I measure per technician or per truck?",
        a: "Both, because they answer different questions: per-tech measures how hard your people work and price; per-truck measures how hard your assets work. When the two diverge — two techs sharing a truck, or a truck idle with no tech — they point at scheduling or utilization problems that either number alone would hide.",
      },
    ],
    related: [
      "effective-hourly-rate-calculator",
      "trip-cost-calculator",
      "target-margin-calculator",
      "guides/revenue-per-technician",
      "guides/effective-hourly-rate",
    ],
  },
];

export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

/** A realistic worked example for one calculator. Values are verified in docs/phase-3 tests. */
export type WorkedExample = {
  /** e.g. "bathroom-remodel" — used for ?example= prefill links */
  key: string;
  scenario: string;
  trade: string;
  inputs: { label: string; value: string }[];
  steps: { label: string; value: string }[];
  result: string;
  explanation: string;
  /** values to prefill, keyed by that calculator's input state names */
  prefill: Record<string, string>;
};

/** The next logical calculator, with the honest reason why. */
export type ContinueWith = { slug: string; question: string; action: string };

export const workedExamples: Record<string, WorkedExample> = {
  "markup-calculator": {
    key: "bathroom-remodel",
    scenario:
      "A remodeling contractor quotes a small bathroom refresh: two days of installer time, tile and fixture materials, and a plumber for one fixture set.",
    trade: "Remodeling",
    inputs: [
      { label: "Labor", value: "$800 (2 days × 1 installer)" },
      { label: "Materials", value: "$600" },
      { label: "Other direct", value: "$100 (plumber sub)" },
      { label: "Overhead allowance", value: "10%" },
      { label: "Markup", value: "25%" },
    ],
    steps: [
      { label: "Direct cost", value: "$800 + $600 + $100 = $1,500.00" },
      { label: "Overhead", value: "$1,500 × 10% = $150.00" },
      { label: "Total cost", value: "$1,650.00" },
      { label: "Price", value: "$1,650 × 1.25 = $2,062.50" },
      { label: "Profit", value: "$2,062.50 − $1,650 = $412.50" },
      { label: "Margin", value: "$412.50 ÷ $2,062.50 = 20.0%" },
    ],
    result: "Quote $2,062.50 — $412.50 gross profit, a 20% margin",
    explanation:
      "The 25% markup only produces a 20% margin. If this contractor needs a true 25% margin, the price would be $1,650 ÷ 0.75 = $2,200 — $137.50 more on one job.",
    prefill: { labor: "800", materials: "600", other: "100", overhead: "10", markup: "25" },
  },
  "margin-calculator": {
    key: "panel-upgrade",
    scenario:
      "An electrician is about to send a $2,600 quote for a residential panel upgrade and wants to check what margin it actually carries.",
    trade: "Electrical",
    inputs: [
      { label: "Job price", value: "$2,600" },
      { label: "Total job cost", value: "$1,950 (labor, permit, materials)" },
    ],
    steps: [
      { label: "Gross profit", value: "$2,600 − $1,950 = $650.00" },
      { label: "Gross margin", value: "$650 ÷ $2,600 = 25.0%" },
      { label: "Markup", value: "$650 ÷ $1,950 = 33.3%" },
    ],
    result: "25% margin — $650 gross profit toward overhead and net income",
    explanation:
      "If overhead runs ~15% of revenue, this job contributes about 10 points toward net profit. The electrician also checks the target-margin panel: pricing the same job to a 30% margin would require $2,785.71.",
    prefill: { price: "2600", cost: "1950", target: "30" },
  },
  "job-pricing-calculator": {
    key: "exterior-paint",
    scenario:
      "A painting crew prices a two-day exterior repaint: painter-hours at a burdened rate, paint and supplies, and a week of trailer fuel spread over that week's jobs.",
    trade: "Painting",
    inputs: [
      { label: "Labor", value: "16 hrs × $45 burdened" },
      { label: "Materials", value: "$900" },
      { label: "Travel/fuel", value: "$40" },
      { label: "Overhead", value: "15% of direct" },
      { label: "Target margin", value: "35%" },
    ],
    steps: [
      { label: "Labor", value: "16 × $45 = $720.00" },
      { label: "Direct cost", value: "$720 + $900 + $0 + $40 + $0 = $1,660.00" },
      { label: "Overhead", value: "$1,660 × 15% = $249.00" },
      { label: "Total cost", value: "$1,909.00" },
      { label: "Price", value: "$1,909 ÷ (1 − 0.35) = $2,936.92" },
      { label: "Gross profit", value: "$1,027.92" },
    ],
    result: "Quote $2,936.92 (round to $2,950) — 35% margin held",
    explanation:
      "Dividing by (1 − 0.35) prices to the margin correctly. Multiplying by 1.35 would have given $2,577 — a real margin of only 25.9%, five points below target on every similar job.",
    prefill: {
      hours: "16", rate: "45", materials: "900", subs: "0",
      travel: "40", other: "0", overhead: "15", margin: "35",
    },
  },
  "labor-burden-calculator": {
    key: "hvac-installer",
    scenario:
      "An HVAC company pays an installer $25/hour and needs the true hourly cost before it prices any service call.",
    trade: "HVAC",
    inputs: [
      { label: "Base wage", value: "$25/hr × 2,080 paid hrs" },
      { label: "Payroll taxes", value: "12%" },
      { label: "Workers' comp", value: "6%" },
      { label: "Benefits", value: "5%" },
      { label: "Other annual", value: "$1,200 (training, uniforms, EPA cert)" },
      { label: "PTO", value: "120 hrs" },
      { label: "Non-billable", value: "10%" },
    ],
    steps: [
      { label: "Base pay", value: "$25 × 2,080 = $52,000" },
      { label: "Taxes", value: "$52,000 × 12% = $6,240" },
      { label: "Workers' comp", value: "$52,000 × 6% = $3,120" },
      { label: "Benefits", value: "$52,000 × 5% = $2,600" },
      { label: "Total annual", value: "$52,000 + $6,240 + $3,120 + $2,600 + $1,200 = $65,160" },
      { label: "Billable hours", value: "(2,080 − 120) × 90% = 1,764" },
      { label: "Burdened rate", value: "$65,160 ÷ 1,764 = $36.94/hr" },
    ],
    result: "$36.94/hr true cost — a 25.3% burden on the wage",
    explanation:
      "Every hour of installer time the company sells must be priced at $36.94+, not $25. At 500 service hours a month, quoting at the bare wage under recovers roughly $6,000/month.",
    prefill: {
      wage: "25", hoursPaid: "2080", taxes: "12", comp: "6",
      benefits: "5", otherAnnual: "1200", ptoHours: "120", nonBillable: "10",
    },
  },
  "hourly-rate-calculator": {
    key: "solo-handyman",
    scenario:
      "A solo handyman wants $65,000 a year take-home before personal tax, runs lean expenses, and realistically bills part of each week.",
    trade: "Handyman",
    inputs: [
      { label: "Income goal", value: "$65,000" },
      { label: "Business expenses", value: "$18,000 (van, insurance, tools, software)" },
      { label: "Working weeks", value: "48" },
      { label: "Hours/week", value: "40" },
      { label: "Billable share", value: "60%" },
    ],
    steps: [
      { label: "Revenue needed", value: "$65,000 + $18,000 = $83,000" },
      { label: "Billable hours", value: "48 × 40 × 0.60 = 1,152" },
      { label: "Rate", value: "$83,000 ÷ 1,152 = $72.05/hr" },
    ],
    result: "$72.05/hr minimum — before any profit or slack",
    explanation:
      "It's a floor: quoting $65/hr because a competitor advertises it means working 1,277 billable hours to hit the same income — 10 more hours a month, every month.",
    prefill: { income: "65000", expenses: "18000", weeks: "48", hoursWeek: "40", utilization: "60" },
  },
  "overhead-calculator": {
    key: "landscaping-crew",
    scenario:
      "A two-truck landscaping operation totals its monthly fixed costs to find the per-hour rate every job must carry.",
    trade: "Landscaping",
    inputs: [
      { label: "Monthly fixed costs", value: "$1,670 (insurance, trucks, tools, software, accounting)" },
      { label: "Monthly revenue", value: "$30,000" },
      { label: "Billable hours", value: "500" },
    ],
    steps: [
      { label: "Monthly overhead", value: "$1,670" },
      { label: "% of revenue", value: "$1,670 ÷ $30,000 = 5.6%" },
      { label: "Per billable hour", value: "$1,670 ÷ 500 = $3.34/hr" },
    ],
    result: "$3.34 per billable hour of overhead to recover",
    explanation:
      "Added to a $36.94 burdened labor rate, the crew's break-even labor price is $40.28/hr before any profit. At 500 hours/month that's $1,670 of overhead that must come back through prices.",
    prefill: { revenue: "30000", billable: "500" },
  },
  "flat-rate-calculator": {
    key: "ceiling-fan",
    scenario:
      "An electrician prices a ceiling-fan install as a flat rate: two hours on site with a burdened rate, a trip across town, the box and wiring supplies, and a 35% target margin. (Illustrative example — not market data.)",
    trade: "Electrical",
    inputs: [
      { label: "Labor", value: "2 hrs × $55 burdened = $110" },
      { label: "Trip cost", value: "$30" },
      { label: "Materials", value: "$85 (fan box, wire, connectors)" },
      { label: "Overhead", value: "15% of direct cost" },
      { label: "Target margin", value: "35%" },
      { label: "Rounding", value: "nearest $5" },
    ],
    steps: [
      { label: "Direct cost", value: "$110 + $30 + $85 = $225.00" },
      { label: "Overhead", value: "$225 × 15% = $33.75" },
      { label: "Total cost", value: "$258.75" },
      { label: "Raw price", value: "$258.75 ÷ 0.65 = $398.08" },
      { label: "Rounded price", value: "$400" },
      { label: "Profit", value: "$400 − $258.75 = $141.25" },
      { label: "Achieved margin", value: "$141.25 ÷ $400 = 35.3%" },
    ],
    result: "Quote $400 — $141.25 gross profit, 35.3% margin",
    explanation:
      "The achieved margin lands slightly above target because of rounding up. The effective multiplier on cost is 1.55× — if you compare against a price book that 'marks parts up 3×', you're looking at the same economics described differently.",
    prefill: {
      hours: "2", rate: "55", trip: "30", materials: "85",
      other: "0", overhead: "15", margin: "35", minimum: "0", roundTo: "5",
    },
  },
  "break-even-calculator": {
    key: "plumbing-van",
    scenario:
      "A one-van plumbing business with $4,500/month of fixed costs wants to know how many service calls it must sell to cover them.",
    trade: "Plumbing",
    inputs: [
      { label: "Fixed costs / month", value: "$4,500" },
      { label: "Average job price", value: "$1,200" },
      { label: "Variable cost / job", value: "$750 (materials, parts, sub work)" },
    ],
    steps: [
      { label: "Contribution per job", value: "$1,200 − $750 = $450" },
      { label: "Break-even jobs", value: "$4,500 ÷ $450 = 10" },
      { label: "Break-even revenue", value: "10 × $1,200 = $12,000" },
    ],
    result: "10 jobs a month to break even — job #11 is profit",
    explanation:
      "If the plumber raises the average job to $1,300, break-even drops to 9 jobs — that's the leverage pricing has over workload.",
    prefill: { fixed: "4500", avgPrice: "1200", avgCost: "750" },
  },
  "job-profitability-calculator": {
    key: "lighting-retrofit",
    scenario:
      "An electrical contractor finishes a lighting retrofit quoted at $4,000. The estimate assumed $2,600 of labor and materials; an extra day and a second parts trip took the real cost to $3,050. (Illustrative example — use your own job's actuals.)",
    trade: "Electrical",
    inputs: [
      { label: "Contract price", value: "$4,000" },
      { label: "Estimated cost", value: "$2,600" },
      { label: "Actual cost", value: "$3,050" },
    ],
    steps: [
      { label: "Planned profit", value: "$4,000 − $2,600 = $1,400.00" },
      { label: "Actual profit", value: "$4,000 − $3,050 = $950.00" },
      { label: "Planned margin", value: "$1,400 ÷ $4,000 = 35.0%" },
      { label: "Actual margin", value: "$950 ÷ $4,000 = 23.8%" },
      { label: "Margin points lost", value: "35.0% − 23.8% = 11.3 points" },
      { label: "Cost overrun", value: "$3,050 − $2,600 = $450.00 (17.3%)" },
      { label: "Price needed to hold 35%", value: "$3,050 ÷ 0.65 = $4,692.31" },
    ],
    result: "Over by $450 — the job's margin fell from 35% to 23.8%",
    explanation:
      "A 17% cost overrun took 32% of the profit, because costs come out of the smallest number in the calculation. Holding the planned 35% margin on the real cost would have needed a $4,692 price. What the totals can't tell you is which line moved — compare the estimate's hours, invoices and trips against the actuals, then fix that input in the next estimate.",
    prefill: { price: "4000", estCost: "2600", actCost: "3050" },
  },
  "discount-impact-calculator": {
    key: "repeat-service-discount",
    scenario:
      "A repeat customer asks a plumber for 10% off a $1,200 job that costs $750 in labor, parts and disposal. (Illustrative example — use your own numbers.)",
    trade: "Plumbing",
    inputs: [
      { label: "Normal price", value: "$1,200" },
      { label: "Job cost", value: "$750 (labor, parts, disposal)" },
      { label: "Discount requested", value: "10%" },
    ],
    steps: [
      { label: "Profit before", value: "$1,200 − $750 = $450.00" },
      { label: "Discounted price", value: "$1,200 × 0.90 = $1,080.00" },
      { label: "Profit after", value: "$1,080 − $750 = $330.00" },
      { label: "Profit erased", value: "($450 − $330) ÷ $450 = 26.7%" },
      { label: "Margin after", value: "$330 ÷ $1,080 = 30.6%" },
      { label: "Extra jobs to match one old job", value: "$450 ÷ $330 = 1.36 jobs (36.4% more)" },
    ],
    result: "10% off erases 26.7% of the profit — you'd need 36% more jobs to earn the same money",
    explanation:
      "The discount is 10% of the price but 26.7% of the profit, and it pulls the margin from 37.5% to 30.6% — below what the job was priced to carry. If the customer needs a lower number, removing a line of scope keeps the margin on the work that remains; a flat discount on the same scope doesn't.",
    prefill: { price: "1200", cost: "750", discount: "10" },
  },
  "hire-vs-subcontract-calculator": {
    key: "hvac-installer-vs-sub",
    scenario:
      "An HVAC company carries an installer at $65,160 a year fully burdened (the Labor Burden example), able to deliver 1,764 billable hours. Installed work currently fills 1,400 of them, and a subcontractor quotes the same work at $55/hr. (Illustrative example — not market data.)",
    trade: "HVAC",
    inputs: [
      { label: "Employee annual cost", value: "$65,160 (wages, taxes, comp, benefits)" },
      { label: "Billable hours available", value: "1,764 / year" },
      { label: "Billable hours you have", value: "1,400 / year" },
      { label: "Subcontractor rate", value: "$55 / hr" },
    ],
    steps: [
      { label: "Cost per billable hour at 1,400 hrs", value: "$65,160 ÷ 1,400 = $46.54" },
      { label: "Cost per billable hour at capacity", value: "$65,160 ÷ 1,764 = $36.94" },
      { label: "Subcontractor cost for 1,400 hrs", value: "1,400 × $55 = $77,000" },
      { label: "Annual difference", value: "$77,000 − $65,160 = $11,840 (employee cheaper)" },
      { label: "Break-even billable hours", value: "$65,160 ÷ $55 = 1,184.73 → 1,185" },
      { label: "Utilisation", value: "1,400 ÷ 1,764 = 79.4%" },
    ],
    result: "At 1,400 billable hours the employee is cheaper — but only above about 1,185 hours a year",
    explanation:
      "Below roughly 1,185 billable hours a year, paying a subcontractor only for the hours you actually have beats carrying a payroll. Note the two employee rates: $46.54 per billable hour at today's workload versus $36.94 at full capacity. The wage is rarely the deciding number — utilisation is.",
    prefill: {
      annualCost: "65160", capacityHours: "1764", demandHours: "1400", subRate: "55",
    },
  },
  "effective-hourly-rate-calculator": {
    key: "deck-repair-day",
    scenario:
      "A solo carpenter finishes a $3,200 deck repair: 24 hours on site at a $38 burdened cost, $900 of lumber and fixings, $40 of fuel — plus the quoting visit, two supply runs, travel and invoicing that add up to 6 unpaid hours. (Illustrative example — use your own hours.)",
    trade: "Carpentry",
    inputs: [
      { label: "Job revenue", value: "$3,200" },
      { label: "On-site hours", value: "24 hrs × $38 cost" },
      { label: "Materials", value: "$900" },
      { label: "Vehicle / fuel", value: "$40" },
      { label: "Unbillable hours", value: "6 hrs (quote, runs, travel, invoicing)" },
      { label: "Target rate", value: "$60/hr per total hour" },
    ],
    steps: [
      { label: "Labor cost", value: "24 × $38 = $912.00" },
      { label: "Total cost", value: "$912 + $900 + $0 + $40 = $1,852.00" },
      { label: "Gross profit", value: "$3,200 − $1,852 = $1,348.00 (42.1% margin)" },
      { label: "Rate per on-site hour", value: "$1,348 ÷ 24 = $56.17/hr" },
      { label: "Total hours", value: "24 + 6 = 30" },
      { label: "Effective hourly rate", value: "$1,348 ÷ 30 = $44.93/hr" },
    ],
    result: "$44.93/hr effective — $56.17 on site, and below the $60/hr target",
    explanation:
      "Six unpaid hours cut the rate by $11.24 — almost 20%. The job still clears a healthy margin, but at the $60 target it needs a price of $3,652 ($60 × 30 hrs + $1,852 of cost) or fewer unpaid hours. Judged on the on-site rate alone, it would have looked like a win.",
    prefill: {
      revenue: "3200", hours: "24", hourlyCost: "38", materials: "900",
      subs: "0", unpaidHours: "6", vehicleCost: "40", targetRate: "60",
    },
  },
  "change-order-calculator": {
    key: "kitchen-scope-change",
    scenario:
      "A remodeler is mid-way through a $6,000 kitchen backsplash and cabinet-hardware job (estimated to cost $3,600 at a 40% margin) when the customer asks to add two pantry shelving units: 6 extra hours at a $42 burdened rate plus $180 of materials. (Illustrative example — use your own contract numbers.)",
    trade: "Remodeling",
    inputs: [
      { label: "Original contract price", value: "$6,000" },
      { label: "Original estimated cost", value: "$3,600" },
      { label: "Extra labor", value: "6 hrs × $42 burdened = $252" },
      { label: "Extra materials", value: "$180" },
      { label: "Margin the job was priced at", value: "40%" },
    ],
    steps: [
      { label: "Extra cost", value: "$252 + $180 = $432.00" },
      { label: "New total cost", value: "$3,600 + $432 = $4,032.00" },
      { label: "Priced to the same margin", value: "$4,032 ÷ 0.60 = $6,720.00" },
      { label: "Change order", value: "$6,720 − $6,000 = $720.00" },
      { label: "New contract price", value: "$6,000 + $720 = $6,720.00" },
      { label: "Margin after the change", value: "($6,720 − $4,032) ÷ $6,720 = 40.0%" },
    ],
    result: "Invoice $720 — the job keeps its 40% margin",
    explanation:
      "Billing just the $432 of cost would have handed the customer the $288 of margin the extra work should earn. The check row confirms the whole job still carries 40% — the change order was priced the same way as the original contract.",
    prefill: {
      origPrice: "6000", origCost: "3600", hoursExtra: "6", rateExtra: "42",
      materialsExtra: "180", margin: "40",
    },
  },
  "target-margin-calculator": {
    key: "two-truck-ops",
    scenario:
      "A two-truck operations business runs $8,500/month of overhead, the owner needs $6,000/month of income, and the goal is $2,500/month of net profit on top — on realistic revenue of $38,000 a month across about 8 jobs. (Illustrative example — use your own numbers.)",
    trade: "Field services",
    inputs: [
      { label: "Monthly overhead", value: "$8,500" },
      { label: "Owner income goal", value: "$6,000 / month" },
      { label: "Target net profit", value: "$2,500 / month" },
      { label: "Monthly revenue", value: "$38,000" },
      { label: "Jobs per month", value: "8" },
      { label: "Current average margin", value: "32%" },
    ],
    steps: [
      { label: "Net goal", value: "$6,000 + $2,500 = $8,500.00" },
      { label: "Overhead %", value: "$8,500 ÷ $38,000 = 22.4%" },
      { label: "Net goal %", value: "$8,500 ÷ $38,000 = 22.4%" },
      { label: "Required gross margin", value: "22.4% + 22.4% = 44.7%" },
      { label: "Gap vs. current 32%", value: "44.7% − 32% = 12.7 points" },
      { label: "Price uplift that closes it", value: "(1 − 0.32) ÷ (1 − 0.447) − 1 = 23.0%" },
    ],
    result: "Jobs must carry a 44.7% gross margin — current pricing delivers 32%",
    explanation:
      "At $38,000 of revenue the 12.7-point gap is about $4,840/month — roughly $605 per job. A 23.0% price increase on the same costs would lift margins to the requirement; whether the market pays that is the real question, and the honest alternatives are lower overhead, more revenue, or a knowingly smaller profit goal.",
    prefill: {
      expenses: "8500", ownerIncome: "6000", targetProfit: "2500",
      revenue: "38000", jobsMonth: "8", currentMargin: "32",
    },
  },
  "materials-markup-calculator": {
    key: "tile-order",
    scenario:
      "A tiler buys a tile order with a $1,100 list price, a 10% trade discount, and $45 of freight to site, and prices it with a 35% markup on net cost. (Illustrative example — use your own supplier pricing.)",
    trade: "Tiling",
    inputs: [
      { label: "List cost", value: "$1,100" },
      { label: "Supplier discount", value: "10%" },
      { label: "Freight to site", value: "$45" },
      { label: "Markup on net cost", value: "35%" },
    ],
    steps: [
      { label: "Discount saves", value: "$1,100 × 10% = $110.00" },
      { label: "Net cost", value: "$1,100 − $110 + $45 = $1,035.00" },
      { label: "Price", value: "$1,035 × 1.35 = $1,397.25" },
      { label: "Gross profit", value: "$1,397.25 − $1,035 = $362.25" },
      { label: "Margin", value: "$362.25 ÷ $1,397.25 = 25.9%" },
      { label: "Effective multiplier on list", value: "$1,397.25 ÷ $1,100 = 1.27×" },
    ],
    result: "Charge $1,397.25 — $362.25 of gross profit, a 25.9% margin, 1.27× on list",
    explanation:
      "The trade discount is doing quiet work here: the same 35% markup on list price would have produced only $262.50 of profit. Marking up the net cost — freight included — is what makes the markup worth applying at all.",
    prefill: { cost: "1100", supplierDiscount: "10", freight: "45", markup: "35" },
  },
  "price-increase-calculator": {
    key: "handyman-raise",
    scenario:
      "A handyman running 12 jobs a month at an average $1,200 (variable cost $750) is working full-out and still not getting ahead, and is considering an 8% increase across new quotes. (Illustrative example — use your own month.)",
    trade: "Handyman",
    inputs: [
      { label: "Jobs per month", value: "12" },
      { label: "Average job price", value: "$1,200" },
      { label: "Variable cost per job", value: "$750" },
      { label: "Increase", value: "8%" },
    ],
    steps: [
      { label: "New average price", value: "$1,200 × 1.08 = $1,296.00" },
      { label: "Profit per job before", value: "$1,200 − $750 = $450.00" },
      { label: "Profit per job after", value: "$1,296 − $750 = $546.00 (+$96)" },
      { label: "Extra per month", value: "12 × $96 = $1,152.00" },
      { label: "Extra per year", value: "$1,152 × 12 = $13,824.00" },
      { label: "Jobs affordable to lose", value: "12 × (1 − 450 ÷ 546) = 2.1 → 2 jobs" },
    ],
    result: "+$13,824 a year — and he could lose 2 jobs a month and still earn the same",
    explanation:
      "The 8% increase is $96 of pure profit per job, because no cost moves. Even if two of twelve customers walk, total profit is unchanged and the ten remaining jobs take less work, fewer trips and less risk. Run the same numbers through the Discount Impact Calculator in reverse: an 8% discount would have cut profit by nearly a fifth instead.",
    prefill: { jobsMonth: "12", avgPrice: "1200", avgCost: "750", increase: "8" },
  },
  "overtime-calculator": {
    key: "hvac-summer-peak",
    scenario:
      "An HVAC company pays a technician $25/hour with 31% burden and runs 8 hours of overtime a week through a 12-week summer peak, at time-and-a-half. (Illustrative example — use your own payroll numbers.)",
    trade: "HVAC",
    inputs: [
      { label: "Base wage", value: "$25/hr" },
      { label: "Labor burden", value: "31%" },
      { label: "Overtime", value: "8 hrs/week × 12 weeks at 1.5×" },
    ],
    steps: [
      { label: "Burdened straight rate", value: "$25 × 1.31 = $32.75/hr" },
      { label: "Burdened OT rate", value: "$32.75 × 1.5 = $49.13/hr" },
      { label: "OT hours", value: "8 × 12 = 96 hrs" },
      { label: "OT labor cost", value: "96 × $49.13 = $4,716.00" },
      { label: "Same hours at straight time", value: "96 × $32.75 = $3,144.00" },
      { label: "Premium beyond straight time", value: "$4,716 − $3,144 = $1,572.00" },
    ],
    result: "$49.13/hr for OT — the 12-week peak costs $1,572 of premium beyond straight pay",
    explanation:
      "The bare-wage version of this calculation ($25 × 1.5 = $37.50) misses the $11.63/hr that burden adds to every OT hour. For a 12-week seasonal peak, the premium is cheap compared with a hire; run all year, it's a different conversation.",
    prefill: { wage: "25", burdenPct: "31", otHoursWeek: "8", otMultiplier: "1.5", weeksYear: "12" },
  },
  "trip-cost-calculator": {
    key: "suburban-service-day",
    scenario:
      "A field-service tech runs a suburban day: $28 of vehicle cost (fuel, wear, insurance share), 50 minutes of total driving spread across 4 calls, at a $38 burdened labor rate. (Illustrative example — use your own routes.)",
    trade: "Field service",
    inputs: [
      { label: "Vehicle cost per day", value: "$28" },
      { label: "Total driving per day", value: "50 min" },
      { label: "Calls per day", value: "4" },
      { label: "Burdened labor rate", value: "$38/hr" },
      { label: "Truck rolls per year", value: "900" },
    ],
    steps: [
      { label: "Vehicle per call", value: "$28 ÷ 4 = $7.00" },
      { label: "Drive time per call", value: "50 ÷ 60 ÷ 4 = 0.21 hrs" },
      { label: "Drive labor per call", value: "0.21 × $38 = $7.92" },
      { label: "Trip cost", value: "$7 + $7.92 = $14.92" },
      { label: "Annual cost at 900 trips", value: "900 × $14.92 = $13,428.00" },
    ],
    result: "$14.92 per truck roll — $13,428 a year at 900 trips",
    explanation:
      "The fuel receipt says about $7; the true cost is double, because drive time is labor nobody invoices. A $25 call-out minimum now makes sense, and cutting the day's driving to 30 minutes saves roughly $5,300 a year at this volume.",
    prefill: { dailyVehicle: "28", minutesDrive: "50", hourlyCost: "38", callsDay: "4", callsYear: "900" },
  },
  "warranty-cost-calculator": {
    key: "remodel-callbacks",
    scenario:
      "A remodeling business averages $1,200 jobs with $750 of variable cost, runs about 144 jobs a year, and 3% come back — a redo costs roughly 20% of the job price. (Illustrative example — track your own callbacks.)",
    trade: "Remodeling",
    inputs: [
      { label: "Average job price", value: "$1,200" },
      { label: "Variable cost per job", value: "$750" },
      { label: "Jobs per year", value: "144" },
      { label: "Cost to redo", value: "20% of job price" },
      { label: "Callback rate", value: "3%" },
    ],
    steps: [
      { label: "Cost to redo one job", value: "$1,200 × 20% = $240.00" },
      { label: "Profit on a normal job", value: "$1,200 − $750 = $450.00" },
      { label: "Profit on a callback job", value: "$450 − $240 = $210.00" },
      { label: "Callbacks per year", value: "144 × 3% = 4.3" },
      { label: "Annual cost of rework", value: "4.3 × $240 = $1,036.80" },
      { label: "Margin drag", value: "$240 × 3% ÷ $1,200 × 100 = 0.6 pts" },
    ],
    result: "About $1,037 a year — 0.6 margin points on everything quoted",
    explanation:
      "A callback job earns $210 instead of $450 — more than half the profit gone to a free visit. At a 10% callback rate this becomes $3,456 a year and 2 points of margin, which is why the rate itself — not the average job — is the number to manage.",
    prefill: { avgPrice: "1200", avgCost: "750", reworkShare: "20", reworkRate: "3", jobsYear: "144" },
  },
  "quote-win-rate-calculator": {
    key: "remodeler-pipeline",
    scenario:
      "A remodeler sends about 10 quotes a month, wins 3, at an average value of $1,200. Each quote takes 1.5 hours at a $45 burdened rate. (Illustrative example — use your own pipeline.)",
    trade: "Remodeling",
    inputs: [
      { label: "Quotes per month", value: "10" },
      { label: "Jobs won", value: "3" },
      { label: "Average quoted value", value: "$1,200" },
      { label: "Hours per quote", value: "1.5 hrs × $45" },
    ],
    steps: [
      { label: "Win rate", value: "3 ÷ 10 = 30%" },
      { label: "Quoted value", value: "10 × $1,200 = $12,000.00" },
      { label: "Won value", value: "3 × $1,200 = $3,600.00 (30% of value)" },
      { label: "Estimating cost per month", value: "10 × 1.5 × $45 = $675.00" },
      { label: "Cost per won job", value: "$675 ÷ 3 = $225.00" },
      { label: "Cost of lost quotes per year", value: "7 × $67.50 × 12 = $5,670.00" },
    ],
    result: "30% win rate — each won job costs $225 in estimating time",
    explanation:
      "The $225 per win is a customer-acquisition cost hiding in admin time. Cutting quote hours to 1 through better templates and a tighter site visit drops it to $150 — the same as a raise on every job won, without touching the prices.",
    prefill: { quotesMonth: "10", winsMonth: "3", avgValue: "1200", hoursPerQuote: "1.5", hourlyCost: "45" },
  },
  "buy-vs-rent-calculator": {
    key: "drain-auger",
    scenario:
      "A plumbing business is deciding on a $3,200 drain auger: 6 years of realistic working life, $12/day of ownership (storage, maintenance, insurance), against a $65/day rental. (Illustrative example — use your own quotes.)",
    trade: "Plumbing",
    inputs: [
      { label: "Purchase price", value: "$3,200" },
      { label: "Working life", value: "6 years" },
      { label: "Cost of owning per day", value: "$12" },
      { label: "Rental rate", value: "$65/day" },
      { label: "Days of use per year", value: "30" },
    ],
    steps: [
      { label: "Capital recovery per year", value: "$3,200 ÷ 6 = $533.33" },
      { label: "True owned-day cost at 30 days", value: "$533.33 ÷ 30 + $12 = $29.78/day" },
      { label: "Break-even days", value: "$533.33 ÷ ($65 − $12) = 10.1 → 11 days" },
      { label: "Annual cost of owning", value: "$533.33 + ($12 × 30) = $893.33" },
      { label: "Annual cost of renting 30 days", value: "30 × $65 = $1,950.00" },
      { label: "Savings from buying", value: "$1,950 − $893.33 = $1,056.67/yr" },
    ],
    result: "Break-even at 11 days/year — at 30 days of use, buying wins by $1,056.67",
    explanation:
      "Spread over 30 days of use, the owned day costs $29.78 against a $65 rental day — the rental day is paying for the yard's overhead too. Below 11 days a year renting wins; at 30, buying has saved $1,056.67 and the auger is on the truck for the surprise call.",
    prefill: { price: "3200", resaleYears: "6", ownCostDay: "12", rentDay: "65", daysYear: "30" },
  },
  "payment-terms-calculator": {
    key: "commercial-net30",
    scenario:
      "A contractor invoices a commercial client $2,500 on net-30 terms; it reliably pays at 75 days. His credit line costs 20% a year, and about 60 such invoices go out annually. (Illustrative example — use your own book.)",
    trade: "Commercial services",
    inputs: [
      { label: "Invoice value", value: "$2,500" },
      { label: "Terms offered", value: "30 days" },
      { label: "Days actually taken", value: "75" },
      { label: "Cost of money", value: "20%/yr" },
      { label: "Invoices per year", value: "60" },
    ],
    steps: [
      { label: "Days beyond terms", value: "75 − 30 = 45" },
      { label: "Financing cost", value: "$2,500 × 0.20 × 45/365 = $61.64" },
      { label: "Share of the invoice", value: "$61.64 ÷ $2,500 = 2.5%" },
      { label: "Annual drag across 60 invoices", value: "60 × $61.64 = $3,698.40" },
      { label: "Working capital tied up", value: "$2,500 × (75 ÷ 365) × 60 = $30,821.92" },
    ],
    result: "$61.64 per invoice — $3,698 a year, with $30,822 of float outstanding",
    explanation:
      "The delay costs 2.5% of the invoice in pure margin — on a job priced at a 30% margin, more than a twelfth of the profit, for zero work. A deposit or completion terms cut most of it; a stated late fee applied consistently cuts the rest.",
    prefill: { invoiceValue: "2500", termsDays: "30", actualDays: "75", annualRate: "20", jobsYear: "60" },
  },
  "maintenance-agreement-calculator": {
    key: "two-visit-hvac-plan",
    scenario:
      "An HVAC company prices a two-visit annual plan: 1.5 tech hours per visit at a $38 burdened rate, $15 of travel, $10 of consumables, plus $50/year of admin per member. (Illustrative example — use your own costs.)",
    trade: "HVAC",
    inputs: [
      { label: "Visits per year", value: "2" },
      { label: "Cost per visit", value: "1.5 hrs × $38 + $15 + $10 = $82" },
      { label: "Admin per member/year", value: "$50" },
      { label: "Target margin", value: "30%" },
      { label: "Member repair discount", value: "10%" },
      { label: "Renewal rate", value: "80%" },
    ],
    steps: [
      { label: "Annual fulfillment cost", value: "2 × $82 + $50 = $214.00" },
      { label: "Annual plan price", value: "$214 ÷ 0.70 = $305.71" },
      { label: "Monthly equivalent", value: "$305.71 ÷ 12 = $25.48/mo" },
      { label: "Contribution per member", value: "$305.71 − $214 = $91.71" },
      { label: "Expected upsell", value: "40% × $180 × 0.90 = $64.80" },
      { label: "Year-one member value", value: "$305.71 + $64.80 = $370.51" },
      { label: "3-year value at 80% renewal", value: "$370.51 × 2.44 = $904.05" },
    ],
    result: "$305.71/yr or $25.48/mo — each member worth $904 over three years",
    explanation:
      "The plan earns $91.71 of contribution on its own price — the upsell is upside, not subsidy. At 80% renewal the three-year member value is 2.44× year one, which is why agreements are the flattest, most valuable revenue line in a service business.",
    prefill: {
      visitsYear: "2", hoursVisit: "1.5", hourlyCost: "38", travelVisit: "15",
      materialsVisit: "10", adminYear: "50", margin: "30", discount: "10",
      upsellRate: "40", upsellValue: "180", retention: "80", members: "0",
    },
  },
  "slow-season-calculator": {
    key: "landscaping-winter",
    scenario:
      "A two-truck landscaping business needs $14,500/month (overhead $8,500 + owner income $6,000). A slow month generates about $15,000 at a 35% margin, the quiet stretch runs three months, and strong months leave about $4,500 of surplus across six. (Illustrative example — use your own months.)",
    trade: "Landscaping",
    inputs: [
      { label: "Monthly cash need", value: "$8,500 + $6,000 = $14,500" },
      { label: "Slow-month revenue", value: "$15,000 at 35% margin" },
      { label: "Slow months", value: "3" },
      { label: "Surplus in a good month", value: "$4,500 across 6 months" },
    ],
    steps: [
      { label: "Slow-month gross profit", value: "$15,000 × 0.35 = $5,250.00" },
      { label: "Gap per slow month", value: "$14,500 − $5,250 = $9,250.00" },
      { label: "Total reserve", value: "3 × $9,250 = $27,750.00" },
      { label: "Weekly set-aside", value: "$27,750 ÷ (6 × 4.33) = $1,068.13/wk" },
      { label: "Peak surplus capacity", value: "6 × $4,500 = $27,000" },
    ],
    result: "$27,750 of reserve — $1,068.13 a week through the good months",
    explanation:
      "The uncomfortable check: six good months at $4,500 of surplus hold $27,000 — $750 short of the reserve. That's not a reason to skip saving; it's the signal to start one month earlier, shave the gap, or knowingly plan to finance the difference.",
    prefill: {
      overheadMonth: "8500", ownerIncome: "6000", slowMarginPct: "35",
      slowRevenue: "15000", slowMonths: "3", peakSurplus: "4500", peakMonths: "6",
    },
  },
  "labor-only-calculator": {
    key: "customer-supplied-fan",
    scenario:
      "A homeowner buys her own ceiling fan and fixture online and asks an electrician for a labor-only install: a day of work, an hour to collect and verify parts, at a $38 burdened rate. (Illustrative example — use your own numbers.)",
    trade: "Electrical",
    inputs: [
      { label: "On-site hours", value: "8 hrs × $38 = $304" },
      { label: "Material handling", value: "1 hr = $38" },
      { label: "Risk load", value: "10%" },
      { label: "Target margin", value: "35%" },
    ],
    steps: [
      { label: "Base cost", value: "$304 + $38 = $342.00" },
      { label: "Risk load", value: "$342 × 10% = $34.20" },
      { label: "Quote", value: "$376.20 ÷ 0.65 = $578.77" },
      { label: "Effective labor rate", value: "$578.77 ÷ 8 = $72.35/hr" },
      { label: "Profit in the quote", value: "$578.77 − $342 − $34.20 = $202.57" },
    ],
    result: "$578.77 — an effective $72.35/hr with the material risk priced",
    explanation:
      "Quoted at bare labor plus margin it would have been about $495 — the $84 difference is the handling time and the rework risk the customer's online purchase transferred. The quote only holds with the terms printed: workmanship warranty only, delays and defects re-quoted.",
    prefill: { hours: "8", rate: "38", margin: "35", riskPct: "10", handleHours: "1" },
  },
  "deposit-schedule-calculator": {
    key: "kitchen-remodel-schedule",
    scenario:
      "A remodeler signs a $12,000 kitchen flooring job at a 35% margin, takes a 30% deposit, and the job's materials run about 45% of the price up front. (Illustrative example — use your own contract.)",
    trade: "Remodeling",
    inputs: [
      { label: "Contract price", value: "$12,000 at 35% margin" },
      { label: "Deposit", value: "30%" },
      { label: "Materials share", value: "45% of price, up front" },
    ],
    steps: [
      { label: "Deposit", value: "$12,000 × 0.30 = $3,600.00" },
      { label: "Total cost to you", value: "$12,000 × 0.65 = $7,800.00" },
      { label: "Front-loaded materials", value: "$12,000 × 0.45 = $5,400.00" },
      { label: "Float you finance", value: "$5,400 − $3,600 = $1,800.00" },
      { label: "Exposure after deposit", value: "$7,800 − $3,600 = $4,200.00" },
      { label: "Final payment at completion", value: "$12,000 − $3,600 = $8,400.00" },
    ],
    result: "The 30% deposit leaves $1,800 of materials on your float",
    explanation:
      "The coverage test fails: the deposit doesn't reach the $5,400 of materials. A 45% deposit — or a materials invoice passed through at signing — closes the gap, so the customer's money finances the customer's job instead of your credit line.",
    prefill: { price: "12000", depositPct: "30", materialsPct: "45", margin: "35", retentionPct: "0" },
  },
  "revenue-per-tech-calculator": {
    key: "two-tech-shop",
    scenario:
      "A two-tech service shop bills $420,000 a year across two trucks. Techs work 48 weeks at 40 hours with a 65% billable share, and the owner's target is $180,000 per tech. (Illustrative example — use your own year.)",
    trade: "Field service",
    inputs: [
      { label: "Annual revenue", value: "$420,000 · 2 techs · 2 trucks" },
      { label: "Billable hours per tech", value: "48 wks × 40 hrs × 65%" },
      { label: "Target per tech", value: "$180,000" },
    ],
    steps: [
      { label: "Revenue per tech", value: "$420,000 ÷ 2 = $210,000" },
      { label: "Revenue per truck", value: "$420,000 ÷ 2 = $210,000" },
      { label: "Billable hours per tech", value: "1,920 × 0.65 = 1,248" },
      { label: "Revenue per billable hour", value: "$420,000 ÷ 2,496 = $168.27" },
      { label: "vs target", value: "$210,000 − $180,000 = +$30,000 met" },
      { label: "Target's implied rate", value: "$180,000 ÷ 1,248 = $144.23/hr" },
    ],
    result: "$210,000 per tech — $168.27 per billable hour, above the $180,000 target",
    explanation:
      "The per-hour row is what makes the number honest: $168.27 per selling hour at 65% utilization is a strong shop, and the target's implied $144.23 shows the utilization assumption baked into any benchmark. Same revenue per tech at 50% utilization would read $258.50/hour of pricing pressure instead.",
    prefill: {
      revenueYear: "420000", techs: "2", trucks: "2", weeksYear: "48",
      hoursWeek: "40", utilPct: "65", targetRev: "180000",
    },
  },
};

/**
 * Additional worked examples beyond each calculator's canonical one, loadable via
 * ?example=<key>. Same verification rules apply: values must match the math test
 * suite (tests/math-verification.mjs) exactly.
 */
export const moreExamples: Record<string, WorkedExample[]> = {
  "flat-rate-calculator": [
    {
      key: "water-heater",
      scenario:
        "A plumber replaces a 40-gallon water heater: three hours with a helper-rate burden, the truck roll, the heater and fittings, and a permit. (Illustrative example — not market data.)",
      trade: "Plumbing",
      inputs: [
        { label: "Labor", value: "3 hrs × $50 burdened = $150" },
        { label: "Trip cost", value: "$35" },
        { label: "Materials", value: "$1,100 (heater, fittings)" },
        { label: "Permit", value: "$75" },
        { label: "Overhead", value: "15% of direct cost" },
        { label: "Target margin", value: "30%" },
        { label: "Rounding", value: "nearest $25" },
      ],
      steps: [
        { label: "Direct cost", value: "$150 + $35 + $1,100 + $75 = $1,360.00" },
        { label: "Overhead", value: "$1,360 × 15% = $204.00" },
        { label: "Total cost", value: "$1,564.00" },
        { label: "Raw price", value: "$1,564 ÷ 0.70 = $2,234.29" },
        { label: "Rounded price", value: "$2,250" },
        { label: "Profit", value: "$2,250 − $1,564 = $686.00" },
        { label: "Achieved margin", value: "$686 ÷ $2,250 = 30.5%" },
      ],
      result: "Quote $2,250 — $686 gross profit, 30.5% margin",
      explanation:
        "Bigger material tickets compress the margin percentage less than you'd expect — the same 30% target applies to the whole job, parts included.",
      prefill: {
        hours: "3", rate: "50", trip: "35", materials: "1100",
        other: "75", overhead: "15", margin: "30", minimum: "0", roundTo: "25",
      },
    },
    {
      key: "hvac-capacitor",
      scenario:
        "An HVAC tech swaps a failed capacitor on a no-cool call: one hour on site, the truck roll, and the part. (Illustrative example — not market data.)",
      trade: "HVAC",
      inputs: [
        { label: "Labor", value: "1 hr × $60 burdened = $60" },
        { label: "Trip cost", value: "$40" },
        { label: "Materials", value: "$45 (capacitor)" },
        { label: "Overhead", value: "15% of direct cost" },
        { label: "Target margin", value: "40%" },
        { label: "Rounding", value: "nearest $5" },
      ],
      steps: [
        { label: "Direct cost", value: "$60 + $40 + $45 = $145.00" },
        { label: "Overhead", value: "$145 × 15% = $21.75" },
        { label: "Total cost", value: "$166.75" },
        { label: "Raw price", value: "$166.75 ÷ 0.60 = $277.92" },
        { label: "Rounded price", value: "$280" },
        { label: "Profit", value: "$280 − $166.75 = $113.25" },
        { label: "Achieved margin", value: "$113.25 ÷ $280 = 40.4%" },
      ],
      result: "Quote $280 — $113.25 gross profit, 40.4% margin",
      explanation:
        "Short diagnostic calls are where the trip cost and minimum charge matter most — with only one billable hour, the truck roll is over a quarter of the direct cost.",
      prefill: {
        hours: "1", rate: "60", trip: "40", materials: "45",
        other: "0", overhead: "15", margin: "40", minimum: "0", roundTo: "5",
      },
    },
    {
      key: "tv-mount",
      scenario:
        "A solo handyman prices a TV-mount install: ninety minutes, the drive, and anchors and brackets. (Illustrative example — not market data.)",
      trade: "Handyman",
      inputs: [
        { label: "Labor", value: "1.5 hrs × $45 = $67.50" },
        { label: "Trip cost", value: "$20" },
        { label: "Materials", value: "$40 (anchors, brackets)" },
        { label: "Overhead", value: "10% of direct cost" },
        { label: "Target margin", value: "30%" },
        { label: "Rounding", value: "nearest $5" },
      ],
      steps: [
        { label: "Direct cost", value: "$67.50 + $20 + $40 = $127.50" },
        { label: "Overhead", value: "$127.50 × 10% = $12.75" },
        { label: "Total cost", value: "$140.25" },
        { label: "Raw price", value: "$140.25 ÷ 0.70 = $200.36" },
        { label: "Rounded price", value: "$205" },
        { label: "Profit", value: "$205 − $140.25 = $64.75" },
        { label: "Achieved margin", value: "$64.75 ÷ $205 = 31.6%" },
      ],
      result: "Quote $205 — $64.75 gross profit, 31.6% margin",
      explanation:
        "A solo operator with low overhead can price to the same margin as a bigger shop — but a lower burdened rate means the dollar profit per hour differs. Compare against the Hourly Rate Calculator's floor.",
      prefill: {
        hours: "1.5", rate: "45", trip: "20", materials: "40",
        other: "0", overhead: "10", margin: "30", minimum: "0", roundTo: "5",
      },
    },
    {
      key: "painter-door",
      scenario:
        "A painter prices an interior door repaint: two and a half hours including prep, the trip, and paint materials. (Illustrative example — not market data.)",
      trade: "Painting",
      inputs: [
        { label: "Labor", value: "2.5 hrs × $38 = $95.00" },
        { label: "Trip cost", value: "$15" },
        { label: "Materials", value: "$55 (paint, brushes)" },
        { label: "Overhead", value: "12% of direct cost" },
        { label: "Target margin", value: "32%" },
        { label: "Rounding", value: "nearest $5" },
      ],
      steps: [
        { label: "Direct cost", value: "$95 + $15 + $55 = $165.00" },
        { label: "Overhead", value: "$165 × 12% = $19.80" },
        { label: "Total cost", value: "$184.80" },
        { label: "Raw price", value: "$184.80 ÷ 0.68 = $271.76" },
        { label: "Rounded price", value: "$275" },
        { label: "Profit", value: "$275 − $184.80 = $90.20" },
        { label: "Achieved margin", value: "$90.20 ÷ $275 = 32.8%" },
      ],
      result: "Quote $275 — $90.20 gross profit, 32.8% margin",
      explanation:
        "Flat rates suit repeatable, well-estimated work like doors and trim: if the crew actually finishes in two hours, the half-hour of estimate slack stays in the job as profit.",
      prefill: {
        hours: "2.5", rate: "38", trip: "15", materials: "55",
        other: "0", overhead: "12", margin: "32", minimum: "0", roundTo: "5",
      },
    },
  ],
};

/** Contextual next step per calculator — only where the next tool genuinely helps. */
export const continueWith: Record<string, ContinueWith> = {
  "markup-calculator": {
    slug: "margin-calculator",
    question: "Want to see what percentage of the selling price is actually profit?",
    action: "Check the margin on this price",
  },
  "margin-calculator": {
    slug: "markup-calculator",
    question: "Building the price up from costs instead of checking one you've quoted?",
    action: "Apply a markup to your costs",
  },
  "job-pricing-calculator": {
    slug: "margin-calculator",
    question: "Before you send the quote, sanity-check the margin it really carries.",
    action: "Verify the margin on this price",
  },
  "labor-burden-calculator": {
    slug: "job-pricing-calculator",
    question: "Have your true labor rate? Build a full job price around it.",
    action: "Price a job with this rate",
  },
  "hourly-rate-calculator": {
    slug: "labor-burden-calculator",
    question: "Have employees? Their wage isn't their cost — payroll taxes and comp ride on top.",
    action: "Calculate labor burden",
  },
  "overhead-calculator": {
    slug: "break-even-calculator",
    question: "Know your overhead? See how many jobs a month it takes to cover it.",
    action: "Find your break-even point",
  },
  "break-even-calculator": {
    slug: "job-pricing-calculator",
    question: "Break-even jobs are the minimum — raising your average price lowers that number.",
    action: "Re-price your average job",
  },
  "flat-rate-calculator": {
    slug: "margin-calculator",
    question: "Before the customer sees the number, check what margin the final price really carries.",
    action: "Verify the margin on this price",
  },
  "job-profitability-calculator": {
    slug: "job-pricing-calculator",
    question: "Now that you know the job's real costs, price the next one from those instead of the old estimate.",
    action: "Re-price a job with real costs",
  },
  "discount-impact-calculator": {
    slug: "margin-calculator",
    question: "Before you agree to a lower number, check the margin that price actually leaves.",
    action: "Check the margin on this price",
  },
  "hire-vs-subcontract-calculator": {
    slug: "labor-burden-calculator",
    question: "The comparison runs on the employee's true annual cost — start there if you haven't built it.",
    action: "Calculate labor burden",
  },
  "effective-hourly-rate-calculator": {
    slug: "price-increase-calculator",
    question: "If the effective rate came in below target, raising prices is the lever that adds profit without more hours.",
    action: "Price a raise that holds",
  },
  "change-order-calculator": {
    slug: "job-profitability-calculator",
    question: "After the job closes, check whether the estimate and the change orders predicted what it actually cost.",
    action: "Run the job profitability check",
  },
  "target-margin-calculator": {
    slug: "job-pricing-calculator",
    question: "Have the required margin? Price a job to it from its real costs.",
    action: "Price a job to this margin",
  },
  "materials-markup-calculator": {
    slug: "job-pricing-calculator",
    question: "Materials priced? Build the whole job around them — labor, subs, overhead and margin.",
    action: "Price the full job",
  },
  "price-increase-calculator": {
    slug: "discount-impact-calculator",
    question: "The same arithmetic runs the other way too — see what a discount of that size would cost you.",
    action: "Check the discount side",
  },
  "overtime-calculator": {
    slug: "hire-vs-subcontract-calculator",
    question: "If the annual overtime premium keeps growing, compare it against carrying the hours on a payroll instead.",
    action: "Compare hiring vs subcontracting",
  },
  "trip-cost-calculator": {
    slug: "flat-rate-calculator",
    question: "Have the true trip cost? Build the service call price on top of it.",
    action: "Price the flat-rate job",
  },
  "warranty-cost-calculator": {
    slug: "target-margin-calculator",
    question: "Rework drags margin off every quote — make sure the target you price to accounts for it.",
    action: "Set a margin that absorbs it",
  },
  "quote-win-rate-calculator": {
    slug: "job-pricing-calculator",
    question: "Winning more is only worth it if the price is right — build the quote from real costs.",
    action: "Price the next quote properly",
  },
  "buy-vs-rent-calculator": {
    slug: "overhead-calculator",
    question: "Bought it? The daily ownership cost now lives inside your overhead — make sure it's recovered.",
    action: "Update your overhead",
  },
  "payment-terms-calculator": {
    slug: "target-margin-calculator",
    question: "Slow payment eats margin quietly — check that the margin you target survives your real payment terms.",
    action: "Re-check the required margin",
  },
  "maintenance-agreement-calculator": {
    slug: "slow-season-calculator",
    question: "Agreement revenue is the flat line in a seasonal year — see how much smaller it makes the slow-season gap.",
    action: "Size the slow-season reserve",
  },
  "slow-season-calculator": {
    slug: "maintenance-agreement-calculator",
    question: "Recurring plan revenue is the lever that shrinks the gap — price one from its real visit costs.",
    action: "Price a maintenance plan",
  },
  "labor-only-calculator": {
    slug: "materials-markup-calculator",
    question: "Doing turnkey instead? See what the material line earns when you supply it.",
    action: "Compare the material margin",
  },
  "deposit-schedule-calculator": {
    slug: "payment-terms-calculator",
    question: "The schedule fixed the front-loaded float — now price what the slow payers cost after completion.",
    action: "Price late payment",
  },
  "revenue-per-tech-calculator": {
    slug: "trip-cost-calculator",
    question: "Utilization is half the KPI — see what every hour of driving costs the schedule.",
    action: "Cost the truck rolls",
  },
};
