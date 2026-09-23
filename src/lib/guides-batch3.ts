import type { Guide } from "./guides";

/**
 * Phase 8 editorial batch — four guides built on the existing Block/Guide system.
 *
 * Each one closes a gap the toolset created rather than restating a topic we
 * already cover:
 *   - billable-hours-and-income-goal  → the two inputs behind every hourly rate
 *   - job-costing                     → the feedback loop after a job is priced
 *   - what-a-discount-costs           → the price decision we had no content for
 *   - hire-or-subcontract             → the fixed-vs-variable cost decision
 *
 * Every numeric example is hand-verified and reproduced in
 * tests/math-verification.mjs (sections 10-13). Ranges are labelled as planning
 * heuristics; no industry statistics, rates or benchmarks are invented here.
 */
export const phase8Guides: Guide[] = [
  {
    slug: "billable-hours-and-income-goal",
    title: "Billable Hours and Your Income Goal: The Two Numbers Behind Your Rate",
    description:
      "Rate advice usually starts with the rate. Yours has to start with how many hours you can sell, and what the year must earn before tax takes its share.",
    metaTitle: "How Many Billable Hours Do You Really Have?",
    metaDescription:
      "Work out a realistic billable-hours figure, an income goal that survives tax, and the hourly floor the two produce — with a full worked year.",
    updated: "2026-09-23",
    readingMinutes: 8,
    category: "costs",
    relatedTools: ["hourly-rate-calculator", "overhead-calculator", "labor-burden-calculator"],
    relatedGuides: ["how-to-price-a-job", "hire-or-subcontract"],
    faqs: [
      {
        q: "How many billable hours does a solo contractor really have?",
        a: "Fewer than the calendar suggests. Start from the hours you actually work, subtract holidays and time off, then subtract everything that isn't billable work: quoting, material runs, travel between jobs, invoicing, chasing payments, bookkeeping, marketing and rework. What's left is your billable capacity. A solo operator who works 40-hour weeks for 48 weeks and bills 60% of that time has about 1,150 billable hours in the year — roughly 24 billable hours a week, not 40.",
      },
      {
        q: "What share of my time should be billable?",
        a: "There is no universal figure, and anyone quoting one is guessing about your business. It depends on your trade, how far you drive, and how much admin you do yourself. A solo operator doing their own quoting, ordering and bookkeeping will sit well below a crew-based business with an office handling those tasks. The number that matters is yours, and the way to get it is to log your hours honestly for two weeks: tag each half-hour block billable or not, then divide.",
      },
      {
        q: "Should my income goal be before or after tax?",
        a: "The hourly-rate calculator asks for a pre-tax figure, because that's what the business has to pay you to leave you with the rest. If you think in take-home terms, gross it up with your own effective tax rate: pre-tax goal = take-home goal ÷ (1 − effective rate). At a 25% effective rate, a $60,000 take-home goal needs about $80,000 before tax. Use your accountant's effective-rate estimate, not a number from a website — including this one.",
      },
      {
        q: "How often should I recalculate my hourly floor?",
        a: "At least once a year, and immediately after anything that moves a big input: a fuel or insurance increase, a hire, a rate rise, a change in how much driving the work involves, or a new recurring cost. A floor calculated two years ago is a floor for a business that no longer exists.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Most advice on what to charge starts with the rate, which is the last number in the chain. The rate is just a division: what the year must earn, divided by the hours you can sell. Get those two inputs right and the rate is arithmetic. Get them wrong and no amount of pricing technique will save the year — the tool at the end of this page will produce a confident, wrong number.",
      },
      { type: "h2", text: "The hours you can actually sell" },
      {
        type: "p",
        text: "Three different hour counts get confused constantly: hours you're open, hours you work, and hours you can bill. Only the last one pays. Everything between them is real work with no invoice attached to it, and it has to be paid for out of the hours that do have one.",
      },
      {
        type: "ul",
        items: [
          "Estimating and quoting — including the quotes that never turn into work, which is the honest reason a healthy quote-to-win ratio is never 100%.",
          "Material and supply runs, including the time spent waiting at a counter.",
          "Driving between jobs, and the first and last drive of the day.",
          "Invoicing, chasing payments, bookkeeping, and the annual conversation with an accountant.",
          "Marketing: the website, the truck lettering, the calls you answer while you're on a ladder.",
          "Rework and callbacks — always unpaid, sometimes the single biggest block.",
          "Holidays, sick days and the occasional day that goes nowhere.",
        ],
      },
      {
        type: "p",
        text: "A worked year makes the size of the gap concrete. Assume 48 working weeks at 40 hours, then apply an honest non-billable share:",
      },
      {
        type: "table",
        caption: "Billable capacity for a solo operator (illustrative)",
        headers: ["Line", "Calculation", "Hours"],
        rows: [
          ["Weeks worked", "52 − 4 weeks of holidays and time off", "48"],
          ["Hours worked", "48 × 40", "1,920"],
          ["Billable share", "60% — the rest is quoting, driving, admin, rework", "× 0.60"],
          ["Billable hours in the year", "", "1,152"],
          ["Billable hours per week", "1,152 ÷ 48", "24"],
        ],
      },
      {
        type: "p",
        text: "Twenty-four billable hours a week. If your pricing assumes forty, every rate you've calculated is about 40% too low — 1,920 ÷ 1,152 = 1.67 — and no job will ever show you why, because the missing hours never appear on a job cost at all. They sit in the gap between the hours you work and the hours you bill.",
      },
      {
        type: "callout",
        text: "The most common error in contractor pricing isn't a wrong formula. It's dividing the year's costs by hours that don't exist.",
      },
      { type: "h2", text: "What the year has to earn" },
      {
        type: "p",
        text: "The second number is what the business must bring in: the income you need plus the expenses the business carries before you're paid anything. Two clarifications matter, because both are routinely glossed over.",
      },
      {
        type: "ul",
        items: [
          "Expenses here are the business's costs, not the job's. Materials and sub payments come out of job revenue and are already priced into the work; what belongs in this figure is insurance, vehicle costs, tools, software, accounting, licensing — the costs that exist whether or not you're busy.",
          "Income is stated before your personal tax, because the business pays you a gross amount and the tax comes out afterwards. If you plan in take-home terms, gross it up: pre-tax goal = take-home ÷ (1 − effective tax rate).",
        ],
      },
      {
        type: "p",
        text: "On the gross-up: your effective rate is the total personal tax you pay divided by your total income — not your marginal bracket. Someone in a 22% bracket often has an effective rate closer to 15%, because brackets apply in layers and deductions come off the top. This is exactly the kind of number to get from your accountant once and use for the year, rather than re-deriving from a website.",
      },
      {
        type: "callout",
        text: "We deliberately publish no tax rates. They change by year, jurisdiction and situation, and a stale rate in a pricing tool is worse than no rate at all. Use your own effective rate, and if you don't have one, that's a fifteen-minute call worth making before you set next year's rates.",
      },
      { type: "h2", text: "The floor, and what to do when the market won't pay it" },
      {
        type: "p",
        text: "Divide what the year must earn by the hours you can bill and you have your floor: the rate below which the business loses money on your time. On the worked year above, with a $65,000 pre-tax income goal and $18,000 of business expenses, that's $83,000 ÷ 1,152 = $72.05 an hour. It is a floor, not a target — it contains no growth, no slack for a slow quarter, and no profit beyond your own pay.",
      },
      {
        type: "p",
        text: "The useful moment is the one after you calculate it, when you compare it with what your market actually pays. If the floor is above the going rate, you have four honest options, and none of them is charging below the floor and hoping: bill more of your hours (cut the admin, batch the supply runs, quote faster), cut business expenses, raise prices and risk losing the price-sensitive work, or change the mix toward work that pays more per hour. The tool exists to tell you which of those is necessary.",
      },
      {
        type: "ctaTool",
        slug: "hourly-rate-calculator",
        label: "Set your hourly floor from your own income goal and billable hours",
      },
      { type: "h2", text: "The three numbers to revisit every year" },
      {
        type: "ul",
        items: [
          "Billable hours — from your own logged time, not from a 40-hour assumption.",
          "Overhead per billable hour — your fixed costs divided by the hours that have to carry them; the overhead calculator does it in a couple of minutes.",
          "Burdened labor cost — for anyone on a payroll, the wage plus taxes, comp, benefits and non-billable time. It changes whenever comp rates or benefits do.",
        ],
      },
      {
        type: "p",
        text: "Those three numbers feed every price you set — job quotes, flat rates, and the break-even count that tells you how many jobs the month needs. They're worth an hour a year, which is less time than a single underpriced job takes to earn back.",
      },
      {
        type: "ctaTool",
        slug: "overhead-calculator",
        label: "Turn your fixed costs into an overhead rate per billable hour",
      },
    ],
  },
  {
    slug: "job-costing",
    title: "Job Costing: Did the Job Actually Make Money?",
    description:
      "Estimates say what you intended; actuals say what happened. How to compare the two, why small overruns cost so much margin, and what to change afterwards.",
    metaTitle: "Job Costing — Estimate vs. Actual, With Numbers",
    metaDescription:
      "Compare a finished job with its estimate: the margin points lost, the profit variance, and the line-by-line check that shows which estimate input was wrong.",
    updated: "2026-09-23",
    readingMinutes: 7,
    category: "pricing",
    relatedTools: [
      "job-profitability-calculator",
      "margin-calculator",
      "job-pricing-calculator",
      "labor-burden-calculator",
    ],
    relatedGuides: ["how-to-price-a-job", "how-to-write-an-estimate"],
    faqs: [
      {
        q: "What is job costing?",
        a: "Job costing is recording what each job actually cost and comparing it with what you estimated. On a finished job that means four lines: labor at the burdened rate for the hours actually spent, materials at invoice including waste and delivery, subcontractor and other direct costs, and whether the job's gross profit covered its share of overhead. The comparison is the point — a cost number on its own tells you nothing about whether your estimate was right.",
      },
      {
        q: "Why did a 17% cost overrun cost me a third of my profit?",
        a: "Because costs come out of profit, and profit is the smallest number in the job. On a $4,000 job estimated at $2,600 of cost, the planned margin is 35%. If it actually costs $3,050, the margin falls to 23.75%: costs rose 17.3%, but profit fell 32.1%. The smaller your margin, the harder the same overrun lands — on a 15% margin job, that overrun would wipe out most of the profit entirely.",
      },
      {
        q: "How do I make this a habit instead of a one-off?",
        a: "Attach it to something you already do. A workable version: when you invoice a job, copy four numbers onto one line of a spreadsheet — price, estimated cost, actual cost and actual hours. The comparison happens for you, and after ten jobs of a type you have a range for that work instead of a single optimistic guess. Businesses that try to do full line-item job costing on every job usually stop within a month; the four-number version survives because it takes about two minutes.",
      },
      {
        q: "My job came in under the estimate — is that just extra profit?",
        a: "Check first whether the work is finished and paid for. Two things fake a good result: unpaid hours (yours or a crew member's, never entered) and costs that appear later — a warranty callback, a material invoice that arrives next month, a punch list you haven't returned for. If those are clean, genuinely coming in under budget is a real result worth understanding, because it may mean your estimates are systematically padded.",
      },
    ],
    body: [
      {
        type: "p",
        text: "A quote is a prediction, and predictions are worth checking. Most trades businesses only ever see the bank balance, which mixes every job's outcome into one number: a great job can hide two bad ones, and a busy quarter can hide a year that made no money. Job costing is the habit of separating them — per job, four lines, one comparison.",
      },
      { type: "h2", text: "Why a small overrun is a big deal" },
      {
        type: "p",
        text: "Here's the arithmetic that surprises people the first time they run it. A job is quoted at $4,000 with an estimated cost of $2,600, so it's priced to a 35% margin. It actually costs $3,050 — an extra day and a second parts trip.",
      },
      {
        type: "table",
        caption: "One job, planned versus actual (illustrative)",
        headers: ["Line", "Planned", "Actual"],
        rows: [
          ["Contract price", "$4,000.00", "$4,000.00"],
          ["Job cost", "$2,600.00", "$3,050.00"],
          ["Gross profit", "$1,400.00", "$950.00"],
          ["Gross margin", "35.0%", "23.75%"],
          ["Cost variance", "", "+$450.00 (+17.3%)"],
          ["Profit variance", "", "−$450.00 (−32.1%)"],
        ],
      },
      {
        type: "p",
        text: "The cost rose 17.3% and the profit fell 32.1%, because the overrun is measured against a much bigger base than the profit is. That's the whole reason to check: on paper this job 'went a bit over'. In the accounts it handed back a third of its profit. Holding the planned 35% margin on the real cost would have needed a price of $4,692.31.",
      },
      { type: "h2", text: "The four lines to compare" },
      {
        type: "ul",
        items: [
          "Labor: hours actually spent (including travel, pickup runs and cleanup) at the burdened rate you used in the estimate. An hour of unbilled overtime is still a cost.",
          "Materials: supplier invoices, not the numbers from the quote — including waste, delivery fees and the small consumables nobody writes down.",
          "Subcontractors and other direct costs: what the sub actually invoiced, plus disposal, permits and equipment rental.",
          "Overhead: did the job's gross profit cover its share of the business's fixed costs, or did it only look profitable because overhead lives somewhere else?",
        ],
      },
      {
        type: "callout",
        text: "Compare totals to see whether the estimate was wrong. Compare lines to see which input was wrong — and that's the only version of this exercise that changes your next quote.",
      },
      { type: "h2", text: "Where to look when a job overruns" },
      {
        type: "p",
        text: "Work through the estimate line by line and ask what you assumed. This is a checklist of the inputs worth testing against your own numbers — not a finding about your business:",
      },
      {
        type: "ul",
        items: [
          "The hour count. Estimates built from a best-case day are optimistic by construction; if the crew took 22 hours where you wrote 16, the estimate didn't have a cost problem, it had an hours problem.",
          "Waste and consumables. Under-counting waste on tile, siding, paint or wire is a quiet percentage loss on the material line.",
          "Trips. Extra journeys for forgotten parts rarely appear in any line — they hide inside labor.",
          "Rework. Any return visit for free work erases the margin on the original job, and it belongs in its own column so you can see how much you're doing.",
          "Scope that grew verbally. If the customer asked for extra work mid-job and it wasn't written up, the estimate wasn't wrong — the process was.",
          "Price held while costs moved. Long-dated jobs quoted without an expiry date absorb material price increases as a margin cut.",
        ],
      },
      { type: "h2", text: "One-offs versus a pattern" },
      {
        type: "p",
        text: "A single miss can be luck: a hidden rotten frame, a supplier shortage, a week of rain. Three similar jobs all missing by the same kind of amount is not luck, it's an input that's wrong in your standard estimate — and it will keep costing you on every job until the input changes. That distinction is why the results are worth keeping rather than just reading once. Track the same job type until you can see a range instead of a guess.",
      },
      {
        type: "p",
        text: "What you change afterwards should match the diagnosis. If the hours were undercounted, adjust the hours for that job type. If waste was undercounted, adjust the waste percentage. If trips were the culprit, add a trip line. Adding a blanket cushion to every quote is the least informative option, because it hides which input was wrong and prices your good estimates out of the market.",
      },
      {
        type: "ctaTool",
        slug: "job-profitability-calculator",
        label: "Compare a finished job with its estimate in the job profitability calculator",
      },
      { type: "h2", text: "Time-and-materials jobs need the same check" },
      {
        type: "p",
        text: "On time-and-materials work the overrun lands on the customer, so the immediate cost is theirs rather than yours — which is exactly why the estimating lesson gets skipped. Keep comparing anyway: if you know that a job type takes 22 hours on average, your flat quotes for it stop being guesses, and clients get a number instead of an open meter. That's the bridge between hourly and flat-rate pricing, and it's built out of job costing records.",
      },
    ],
  },
  {
    slug: "what-a-discount-costs",
    title: "What a Discount Really Costs (And What to Offer Instead)",
    description:
      "Ten percent off is ten percent of the price and often a quarter of the profit. The arithmetic, the volume you'd need to replace it, and better things to trade.",
    metaTitle: "What a Discount Costs Your Profit (And Better Options)",
    metaDescription:
      "Discounts come out of profit, not revenue. See the arithmetic on a real job, the volume needed to replace it, and scope or terms worth trading instead.",
    updated: "2026-09-23",
    readingMinutes: 7,
    category: "pricing",
    relatedTools: [
      "discount-impact-calculator",
      "margin-calculator",
      "job-pricing-calculator",
      "flat-rate-calculator",
    ],
    relatedGuides: ["markup-vs-margin", "how-to-price-a-job"],
    faqs: [
      {
        q: "Why is a 10% discount more than 10% of my profit?",
        a: "Because the two percentages are measured against different bases. The discount is 10% of the price; profit is only a fraction of the price, so the same dollars are a much bigger share of it. On a $1,200 job that costs $750, profit is $450. Ten percent off is $120 — 10% of the price and 26.7% of the profit. The thinner your margin, the worse the ratio: on a 20% margin, a 10% discount erases half the profit.",
      },
      {
        q: "How much extra volume do I need to make a discount worth it?",
        a: "Divide the profit before the discount by the profit after it. In the example above, $450 ÷ $330 = 1.36 — you'd need 36% more jobs to earn what one full-price job earned. That's the honest test of 'we'll make it up on volume': 36% more work, travel, risk and admin for identical profit, and only if the work exists at all.",
      },
      {
        q: "Should I discount to win a job against a lower bid?",
        a: "Not as a reflex, and never below the job's variable cost plus a share of overhead. If you discount on price alone, you've told the customer your number is negotiable, and the negotiation starts earlier on every future quote. If the competing price is genuinely lower, the honest conversation is about scope: what is in their number that isn't in yours, what's excluded, and what the customer is trading away for that price.",
      },
      {
        q: "Is it better to reduce the scope or to discount?",
        a: "Reducing scope, in almost every case. A discount on unchanged scope lowers the price and the margin percentage at once, so the job also carries less overhead than your pricing assumed. Removing a line lowers the price while keeping the same margin on the work that remains — the customer still gets a lower number, and your economics stay intact.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Price objections are part of the job; the reflex answer to them is the expensive part. 'Can you do a bit better on price?' is a question about the total, and a discount answers it by cutting the only part of the job that was ever yours to keep. The arithmetic below is the reason a small-sounding concession can do real damage.",
      },
      { type: "h2", text: "The arithmetic on one job" },
      {
        type: "p",
        text: "A repeat customer asks a plumber for 10% off a $1,200 job that costs $750 in labor, parts and disposal.",
      },
      {
        type: "table",
        caption: "A 10% discount on a 37.5%-margin job (illustrative)",
        headers: ["Line", "Full price", "After 10% off"],
        rows: [
          ["Price", "$1,200.00", "$1,080.00"],
          ["Job cost", "$750.00", "$750.00"],
          ["Gross profit", "$450.00", "$330.00"],
          ["Gross margin", "37.5%", "30.6%"],
          ["Profit erased", "", "26.7%"],
          ["Jobs needed to earn the same", "1 job", "1.36 jobs"],
        ],
      },
      {
        type: "p",
        text: "Two things worth noticing. The margin drops below what the job was priced to carry, so less of the fixed cost gets recovered than the pricing assumed — the loss compounds past the $120. And the volume answer is 36% more work for the same money: 36% more travel, more scheduling, more risk, more invoicing, and only if there's that much extra work available.",
      },
      { type: "h2", text: "Your margin decides how bad it is" },
      {
        type: "p",
        text: "The same 10% discount behaves very differently depending on how much margin was in the job to begin with. This is the table most price-cutting arguments are missing:",
      },
      {
        type: "table",
        caption: "A 10% discount at three different starting margins",
        headers: ["Price / cost", "Margin before", "Margin after", "Profit erased"],
        rows: [
          ["$1,250 / $1,000", "20.0%", "11.1%", "50.0%"],
          ["$1,000 / $700", "30.0%", "22.2%", "33.3%"],
          ["$1,500 / $900", "40.0%", "33.3%", "25.0%"],
        ],
      },
      {
        type: "p",
        text: "On thin-margin work a 10% discount is close to suicide: half the profit gone, and the remaining 11 percentage points of margin almost certainly can't carry the business's overhead. On fat-margin work it's survivable, which is why businesses with healthy margins can afford to be flexible and businesses without them can't — the same gesture means something completely different in each.",
      },
      {
        type: "callout",
        text: "Never discount the same scope. If the price has to come down, take something out — a line, a finish level, a timeframe, the extras. The customer gets a lower number; you keep the margin on the work that remains.",
      },
      { type: "h2", text: "What to trade instead of price" },
      {
        type: "ul",
        items: [
          "Scope, priced honestly. Quote the work as scoped, then show what removing a specific line saves. It keeps the margin percentage intact and teaches the customer what the work costs.",
          "Faster money. A deposit, payment on completion, net-7 terms or a card on file are worth real money to a small business; trading a few percent for a shorter collection cycle can be rational when you've priced the cost of waiting.",
          "Schedule flexibility. Filling a slow week or a rainy-day slot with the job has genuine value if the alternative is idle capacity — that's the one case where a lower price really can buy something.",
          "Committed volume, in writing. A maintenance agreement or a defined scope of repeat work is a different product from a one-off discount, and it should be priced as one.",
          "A clear no, with a reason. 'I can do that price on a smaller scope; I can't do it on this one' respects the customer and defends the number.",
        ],
      },
      { type: "h2", text: "When a discount is the right call" },
      {
        type: "p",
        text: "It isn't never. A discount is defensible when it buys something you can name: work that fills capacity you would otherwise waste, a payment-terms trade, a maintenance contract you've priced as a package, or a customer whose long-term value justifies treating the difference as acquisition cost. What doesn't work is discounting to avoid an awkward conversation — that sets a precedent, and the next quote starts from the discounted number.",
      },
      {
        type: "p",
        text: "The floor never moves: the job has to cover its variable costs plus the overhead it was expected to carry. Below that line, a busy schedule and a shrinking bank account are the same thing.",
      },
      {
        type: "ctaTool",
        slug: "discount-impact-calculator",
        label: "See what a discount costs your profit before you agree to it",
      },
      {
        type: "ctaTool",
        slug: "margin-calculator",
        label: "Check the margin any final price actually carries",
      },
    ],
  },
  {
    slug: "hire-or-subcontract",
    title: "Hire or Subcontract Out? Finding the Break-Even Workload",
    description:
      "The decision isn't the wage against the invoice — it's a fixed annual cost against hours that actually exist. How to find the workload where hiring starts to pay.",
    metaTitle: "Hire or Subcontract? Find the Break-Even Workload",
    metaDescription:
      "Compare an employee's fully burdened annual cost with a subcontractor's rate: the break-even billable hours, utilisation risk, and what's left out.",
    updated: "2026-09-23",
    readingMinutes: 7,
    category: "costs",
    relatedTools: [
      "hire-vs-subcontract-calculator",
      "labor-burden-calculator",
      "overhead-calculator",
      "hourly-rate-calculator",
    ],
    relatedGuides: ["how-to-calculate-labor-burden", "billable-hours-and-income-goal"],
    faqs: [
      {
        q: "Is it cheaper to hire an employee or subcontract the work?",
        a: "It depends entirely on the workload, and it's a solvable calculation. Divide the employee's fully burdened annual cost by the subcontractor's hourly rate: that's the break-even. If you have fewer billable hours a year than the break-even, subcontracting is cheaper; more, and the employee wins. At $65,160 a year and a $55/hr sub, break-even is about 1,185 billable hours — and if the work actually available is 1,400 hours, the employee is cheaper by roughly $11,840 a year.",
      },
      {
        q: "What counts in the employee's annual cost?",
        a: "Everything the employment relationship costs: wages, payroll taxes, workers' compensation, benefits, paid time off, training, licensing and the gear they need. The Labor Burden Calculator totals it and divides it by billable hours, which is the number this comparison needs. If you compare the bare wage with the subcontractor's invoice, you're comparing a number that doesn't exist against one that does.",
      },
      {
        q: "What utilisation should I assume for a new hire?",
        a: "Plan it, don't hope for it. A useful planning heuristic in trades businesses is 80–85% of paid hours after holidays and PTO — roughly 1,700–1,850 billable hours for a full-time field role — but that's a rule of thumb, not a benchmark, and it moves with your mix of service, project and admin work. What matters more than the exact figure is that you know the workload you're hiring against, because unused capacity raises the effective cost of every hour the employee does sell.",
      },
      {
        q: "Does this replace advice on employee versus contractor classification?",
        a: "No, and it isn't trying to. This is a cash-cost comparison. Whether a given arrangement is legally employment or contracting depends on control, direction, tools and other tests that vary by jurisdiction, and getting it wrong has consequences well beyond cost. Use this page for the workload answer and your accountant or attorney for the classification one.",
      },
    ],
    body: [
      {
        type: "p",
        text: "The tempting comparison is the employee's wage against the subcontractor's hourly invoice, and it's the wrong one. It compares a number that doesn't exist — nobody costs you their bare wage — with a number that only applies when the work is there. The two options have different shapes of cost, and the shape is what decides.",
      },
      { type: "h2", text: "Fixed cost against variable cost" },
      {
        type: "ul",
        items: [
          "An employee's cost is a commitment. Wages, payroll taxes, workers' comp and benefits are paid for the year, whether the work exists or not. Spread that annual number across the hours actually sold and you get the real cost per billable hour — which rises whenever the work gets quiet.",
          "A subcontractor's cost is an option. You buy hours when hours exist, at a higher rate and with no commitment. When the phone stops ringing, the cost stops too.",
        ],
      },
      {
        type: "p",
        text: "Neither is better in the abstract. Which one wins depends on one input: how many billable hours you can point at the role over the next year.",
      },
      { type: "h2", text: "The break-even workload" },
      {
        type: "p",
        text: "Divide the employee's fully burdened annual cost by the subcontractor's hourly rate. Above that many billable hours a year, the employee is cheaper; below it, subcontracting is. A worked example, using the burdened cost from the labor burden guide:",
      },
      {
        type: "table",
        caption: "Installer versus subcontractor (illustrative)",
        headers: ["Line", "Calculation", "Result"],
        rows: [
          ["Employee annual cost", "wages + taxes + comp + benefits", "$65,160"],
          ["Billable hours the role can deliver", "1,764 a year", "1,764"],
          ["Billable hours you actually have", "the work available this year", "1,400"],
          ["Subcontractor rate", "as invoiced to you", "$55/hr"],
          ["Employee cost per billable hour", "$65,160 ÷ 1,400", "$46.54"],
          ["Employee cost at full capacity", "$65,160 ÷ 1,764", "$36.94"],
          ["Subcontractor cost for the same hours", "1,400 × $55", "$77,000"],
          ["Break-even billable hours", "$65,160 ÷ $55", "1,185"],
        ],
      },
      {
        type: "p",
        text: "At 1,400 billable hours of demand, the employee is cheaper — by about $11,840 a year. Drop the workload and the answer flips: at 1,000 billable hours the same employee costs $65.16 per billable hour, and a subcontractor at $55 would be cheaper by more than $10,000. Nothing about the wage changed. Only the work did.",
      },
      { type: "h2", text: "Utilisation is the whole argument" },
      {
        type: "p",
        text: "The same $65,160 employee produces a completely different hourly cost depending on how busy they are. That's the calculation most hiring decisions skip:",
      },
      {
        type: "table",
        caption: "The same employee at different workloads",
        headers: ["Billable hours a year", "Cost per billable hour", "Utilisation of 1,764 hrs"],
        rows: [
          ["1,000", "$65.16", "56.7%"],
          ["1,200", "$54.30", "68.0%"],
          ["1,400", "$46.54", "79.4%"],
          ["1,600", "$40.73", "90.7%"],
          ["1,764", "$36.94", "100%"],
        ],
      },
      {
        type: "p",
        text: "Read the top row again. A quiet year doesn't lower your costs — it raises the cost of every hour you do sell, and it raises it on all the other work too, because overhead per hour climbs when fewer hours carry it. Under-utilised labor is one of the ways a business with a full schedule can still lose money.",
      },
      {
        type: "callout",
        text: "A hire is a bet on demand. A subcontractor is the option to buy capacity only when demand shows up. Size the bet against the workload you can see, not the busy month you're in.",
      },
      { type: "h2", text: "What the arithmetic leaves out" },
      {
        type: "ul",
        items: [
          "Control and consistency. You can train, direct and schedule an employee. A subcontractor sets their own methods and hours, and their quality standard is their own.",
          "Where the customer relationship sits. Subcontracted work often builds the sub's relationship with your customer, not yours.",
          "Availability and loyalty. A good subcontractor may also work for competitors, and their rate rises with their reputation — you're renting capacity, not owning it.",
          "Classification rules. Whether the arrangement is employment or contracting depends on how much control you exercise, and getting it wrong is expensive. That's a question for your accountant or attorney, not a calculator.",
          "Overhead knock-ons. An extra employee usually adds insurance, vehicle, phone or software costs that the burdened rate doesn't include if you built it for one person.",
        ],
      },
      { type: "h2", text: "How to decide, practically" },
      {
        type: "ul",
        items: [
          "Compute the break-even hours with the employee's real burdened cost — not the wage.",
          "Compare it with the workload you can commit to for the next twelve months, discounting the current peak. Peaks pass; payroll doesn't.",
          "Below the line, subcontract — and revisit the calculation quarterly, because a sub's rate and your workload both move.",
          "Above the line, hire — and write down the utilisation you're hiring against, so a quiet quarter is a known risk rather than a surprise.",
          "For lumpy demand, consider both: one employee for the core volume, subcontractors for peaks. The hybrid usually beats optimising either extreme.",
        ],
      },
      {
        type: "ctaTool",
        slug: "hire-vs-subcontract-calculator",
        label: "Find your break-even workload in the hire vs. subcontract calculator",
      },
      {
        type: "ctaTool",
        slug: "labor-burden-calculator",
        label: "Build the employee's true annual cost first",
      },
    ],
  },
];
