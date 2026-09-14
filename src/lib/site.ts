export const site = {
  name: "RateCraft",
  tagline: "Contractor pricing, estimating & profit tools",
  description:
    "Free calculators and guides that help contractors and service businesses price jobs, control costs and protect profit — with the math explained.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "en_US",
  founded: 2026,
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
      "Know what an hour of work truly costs before you quote it: fully burdened labor rates and overhead recovery.",
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
    metaTitle: "Contractor Markup Calculator — Price Jobs with the Right Markup",
    metaDescription:
      "Free contractor markup calculator. Enter labor, materials and overhead, set your markup, and see the selling price, profit and margin — plus a markup vs margin conversion table.",
    category: "pricing",
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
    related: ["margin-calculator", "job-pricing-calculator", "guides/markup-vs-margin"],
  },
  {
    slug: "margin-calculator",
    name: "Contractor Margin Calculator",
    keyword: "contractor margin calculator",
    metaTitle: "Contractor Margin Calculator — Check the Margin on Any Job Price",
    metaDescription:
      "Free margin calculator for contractors. Enter a job price and its costs to see gross margin, profit dollars, and the markup it corresponds to — before you commit to the quote.",
    category: "pricing",
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
    related: ["markup-calculator", "break-even-calculator", "guides/markup-vs-margin"],
  },
  {
    slug: "job-pricing-calculator",
    name: "Job Pricing Calculator",
    keyword: "job pricing calculator",
    metaTitle: "Job Pricing Calculator — Price a Job from Real Costs",
    metaDescription:
      "Free job pricing calculator for contractors. Add labor hours, materials, subcontractors, travel and overhead, then see a recommended price with a full cost breakdown.",
    category: "pricing",
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
    related: ["labor-burden-calculator", "overhead-calculator", "markup-calculator"],
  },
  {
    slug: "labor-burden-calculator",
    name: "Labor Burden Calculator",
    keyword: "labor burden calculator",
    metaTitle: "Labor Burden Calculator — True Hourly Cost of an Employee",
    metaDescription:
      "Free labor burden calculator for contractors. Add payroll taxes, insurance, benefits and PTO to a base wage and see the fully burdened hourly cost and burden rate.",
    category: "costs",
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
    related: ["hourly-rate-calculator", "job-pricing-calculator", "guides/how-to-price-a-job"],
  },
  {
    slug: "hourly-rate-calculator",
    name: "Contractor Hourly Rate Calculator",
    keyword: "contractor hourly rate calculator",
    metaTitle: "Contractor Hourly Rate Calculator — What Should You Charge Per Hour?",
    metaDescription:
      "Free hourly rate calculator for contractors and handymen. Enter salary goal, business expenses and billable hours to find the hourly rate that actually covers everything.",
    category: "costs",
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
    related: ["labor-burden-calculator", "break-even-calculator", "guides/how-to-price-a-job"],
  },
  {
    slug: "overhead-calculator",
    name: "Contractor Overhead Calculator",
    keyword: "contractor overhead calculator",
    metaTitle: "Contractor Overhead Calculator — Your Monthly Overhead Rate",
    metaDescription:
      "Free overhead calculator for contractors. Total your fixed monthly business costs and see the overhead percentage of revenue and the per-hour rate every job must carry.",
    category: "costs",
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
    related: ["job-pricing-calculator", "hourly-rate-calculator", "break-even-calculator"],
  },
  {
    slug: "flat-rate-calculator",
    name: "Flat Rate Pricing Calculator",
    keyword: "flat rate pricing calculator",
    metaTitle: "Flat Rate Pricing Calculator — Price Service Calls with Real Costs",
    metaDescription:
      "Free flat rate pricing calculator for plumbers, electricians and HVAC. Build a service call price from burdened labor, trip cost, materials, overhead and your target margin — with the math shown.",
    category: "pricing",
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
      "guides/markup-vs-margin",
    ],
  },
  {
    slug: "break-even-calculator",
    name: "Break-Even Calculator",
    keyword: "break even calculator small business",
    metaTitle: "Break-Even Calculator for Service Businesses — Jobs Needed to Break Even",
    metaDescription:
      "Free break-even calculator for contractors and service businesses. Enter fixed costs, average job price and variable cost per job to see jobs and revenue needed to break even.",
    category: "pricing",
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
    ],
    faqs: [
      {
        q: "How do I calculate my break-even point?",
        a: "Divide your fixed monthly costs by the gross profit an average job contributes (price minus variable costs). If fixed costs are $4,000 and each job contributes $400, you need 10 jobs a month to break even. Job number 11 is where profit starts.",
      },
      {
        q: "What are fixed vs. variable costs for a contractor?",
        a: "Fixed costs repeat whether or not you work: insurance, truck payment, rent, software. Variable costs scale with each job: materials, subcontractor payments, dump fees, job-specific fuel. Wages of field crews are usually treated as variable per job; your own salary as owner belongs in fixed costs.",
      },
    ],
    related: ["margin-calculator", "overhead-calculator", "job-pricing-calculator"],
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
};
