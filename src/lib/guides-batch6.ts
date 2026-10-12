import type { Guide } from "./guides";

/**
 * Phase 11 editorial batch — five guides paired with the phase-11 calculators
 * (maintenance agreements, slow-season reserve, labor-only pricing, deposits
 * and progress billing, revenue per technician). Every numeric example is
 * reproduced in tests/math-verification.mjs (sections 26–30 and the guide checks).
 */
export const phase11Guides: Guide[] = [
  {
    slug: "maintenance-agreement-pricing",
    title: "How to Price a Maintenance Agreement (So It's Profitable on Its Own)",
    description:
      "The plan must earn its keep on the price, not on the hope of upsell. Build the price from visit costs, see what a member is worth across three years, and bill monthly.",
    metaTitle: "Maintenance Agreement Pricing — Plans Built from Real Costs",
    metaDescription:
      "Price a maintenance plan from burdened visit costs plus margin — annual and monthly — with member value, renewal curve and the upsell discipline that keeps plans profitable.",
    updated: "2026-10-01",
    readingMinutes: 7,
    category: "pricing",
    relatedTools: ["maintenance-agreement-calculator", "trip-cost-calculator", "labor-burden-calculator"],
    relatedGuides: ["truck-roll-cost", "slow-season-reserve", "effective-hourly-rate"],
    faqs: [
      {
        q: "How do I price a maintenance agreement?",
        a: "Total the cost of delivering it — visits × (burdened tech hours + travel + materials) plus annual admin — then divide by (1 − target margin). A two-visit plan costing $214 a year prices at $305.71 with a 30% margin, or $25.48 a month.",
      },
      {
        q: "Should upsell revenue justify a cheaper plan price?",
        a: "No. The upsell is an expectation — 40% of visits finding $180 of work is $64.80 expected, not received. Plans priced thin and justified by upsell collapse the first season the finding rate drops. Price the plan to carry itself; treat upsell as upside.",
      },
      {
        q: "What renewal rate should a maintenance program target?",
        a: "Well-run programs commonly retain 75–85% of members a year. The three-year value of a member scales steeply with it: at 80% renewal, a member is worth 2.44× their first year — which is why showing up on time beats discounting.",
      },
    ],
    body: [
      {
        type: "p",
        text: "A maintenance agreement is the only flat line in a seasonal business — and the only product you sell that's priced once and delivered all year. That combination is why plans get priced badly in both directions: cheap enough to sign nobody questions them, and expensive enough to deliver nobody profits from them.",
      },
      { type: "h2", text: "Price from delivery cost, not from the market" },
      {
        type: "p",
        text: "The cost side is unforgiving arithmetic: a two-visit plan with 1.5 tech hours per visit at a $38 burdened rate, $15 of travel and $10 of consumables costs $82 a visit — $214 a year with $50 of admin. Dividing by (1 − 0.30) prices the plan at $305.71 a year, $25.48 a month, leaving $91.71 of contribution per member.",
      },
      {
        type: "table",
        caption: "The two-visit plan, built bottom-up",
        headers: ["Line", "Calculation", "Amount"],
        rows: [
          ["Cost per visit", "1.5 × $38 + $15 + $10", "$82.00"],
          ["Annual fulfillment", "2 × $82 + $50 admin", "$214.00"],
          ["Annual price at 30%", "$214 ÷ 0.70", "$305.71"],
          ["Monthly equivalent", "$305.71 ÷ 12", "$25.48"],
          ["Contribution per member", "$305.71 − $214", "$91.71"],
        ],
      },
      { type: "h2", text: "The upsell discipline" },
      {
        type: "p",
        text: "The repair work found during visits is real money — but it's a probability, not a promise. At a 40% finding rate and $180 of average work with a members' discount, the expected upsell is $64.80 per member per year. That's meaningful, and it must not be in the price. Plans justified by upsell become loss-makers the first season techs don't sell, and the customer can feel a plan that's cheap because it's designed to sell repairs.",
      },
      { type: "h2", text: "What a member is worth over three years" },
      {
        type: "p",
        text: "Year-one value is the plan plus expected upsell: $370.51. The renewal rate compounds it — at 80%, the member is worth 80% again in year two and 64% in year three: $370.51 × 2.44 = $904 over three years. That multiplier is why retention levers (punctuality, thorough inspections, clear findings) beat discount levers every time.",
      },
      {
        type: "ul",
        items: [
          "Bill monthly — annual billing recreates the seasonal cash lump the plan exists to flatten.",
          "Schedule visits in your slow months — the plan is a utilization tool as much as a revenue one.",
          "Reprice annually — a plan set three years ago is priced for a business that no longer exists.",
        ],
      },
      {
        type: "callout",
        text: "The travel trap: an agreement forty minutes out is a different product from one ten minutes away. Cost every visit's drive honestly — the Truck Roll Calculator produces the number — and either zone the plan price or densify the routes.",
      },
      {
        type: "ctaTool",
        slug: "maintenance-agreement-calculator",
        label: "Price your plan with the maintenance agreement calculator",
      },
    ],
  },
  {
    slug: "slow-season-reserve",
    title: "The Slow Season Reserve: What the Quiet Months Actually Cost",
    description:
      "Summer pays for winter, but nobody can say by how much — which is why February surprises owners every year. Size the gap, then build the reserve weekly while the money is there.",
    metaTitle: "Slow Season Reserve — What Your Quiet Months Really Cost",
    metaDescription:
      "Calculate each slow month's gap after its gross profit, the total reserve you need, and the weekly set-aside that builds it during the good months — deliberately, not residually.",
    updated: "2026-10-01",
    readingMinutes: 6,
    category: "pricing",
    relatedTools: ["slow-season-calculator", "overhead-calculator", "maintenance-agreement-calculator"],
    relatedGuides: ["maintenance-agreement-pricing", "billable-hours-and-income-goal", "what-margin-should-i-target"],
    faqs: [
      {
        q: "How much cash do I need for the slow season?",
        a: "The sum of each slow month's gap: what the month must pay minus the gross profit it generates. Needing $14,500 a month while a slow month generates $5,250 leaves a $9,250 gap — three months means $27,750 of reserve.",
      },
      {
        q: "When should I start building the reserve?",
        a: "In the first strong month, as a fixed weekly amount moved to a separate account. 'Whatever is left over' in the checking account is nothing; the discipline is the fixed amount, sized to the good months you actually have.",
      },
      {
        q: "What if my good months can't fund the whole reserve?",
        a: "Three honest options: shrink the gap (cut overhead, or grow recurring revenue through maintenance agreements), start saving earlier in the year, or knowingly plan to finance the shortfall and price that cost into the busy season.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Every seasonal business owner knows the rhythm, and almost none can put a number on it. The books average twelve months into one calm line, hiding two months of frantic surplus and three of deficit. The deficit isn't a mystery — it's just never been priced while the money was still coming in.",
      },
      { type: "h2", text: "Pricing the gap" },
      {
        type: "p",
        text: "Each slow month must produce the same cash as any other: overhead plus what you pay yourself. A two-truck landscaping business needing $14,500 a month that still generates $15,000 of revenue at a 35% margin has produced $5,250 — the month's gap is $9,250. Three slow months make the reserve $27,750.",
      },
      {
        type: "table",
        caption: "The reserve, built from the gap",
        headers: ["Line", "Calculation", "Amount"],
        rows: [
          ["Monthly cash need", "$8,500 overhead + $6,000 income", "$14,500.00"],
          ["Slow-month gross profit", "$15,000 × 35%", "$5,250.00"],
          ["Gap per slow month", "$14,500 − $5,250", "$9,250.00"],
          ["Reserve for 3 months", "3 × $9,250", "$27,750.00"],
          ["Weekly set-aside over 6 months", "$27,750 ÷ 26 weeks", "$1,068.13"],
        ],
      },
      { type: "h2", text: "The check that hurts" },
      {
        type: "p",
        text: "Six good months at $4,500 of surplus hold $27,000 — $750 short of the reserve. That's not a reason to skip saving; it's the signal to start one month earlier, shave the gap, or consciously plan to finance the difference. What the number kills is the default strategy: hoping February behaves.",
      },
      { type: "h2", text: "Two levers that shrink the gap itself" },
      {
        type: "ul",
        items: [
          "Maintenance agreements convert part of the gap into a flat monthly line — revenue that doesn't care what the weather is doing.",
          "Off-season work priced deliberately — winterizations, indoor work, remodels — chosen for margin, not just for staying busy.",
        ],
      },
      {
        type: "callout",
        text: "The reserve goes into a separate account. Money sitting in the checking account absorbs 'temporary' draws from strong months and is never there in the weak ones — the separate account is the discipline, not just the storage.",
      },
      {
        type: "ctaTool",
        slug: "slow-season-calculator",
        label: "Size your reserve with the slow season calculator",
      },
    ],
  },
  {
    slug: "labor-only-pricing",
    title: "Labor-Only Pricing: When the Customer Buys the Materials",
    description:
      "\"I'll buy the parts, you just install them\" transfers real risk to you — wrong parts, late deliveries, defective fixtures, and rework you can't bill anyone for. Price it, and write the terms.",
    metaTitle: "Labor-Only Pricing — When Customers Supply Their Own Materials",
    metaDescription:
      "How to price labor-only work with material handling and rework risk included — plus the three contract terms that make labor-only quotes survivable.",
    updated: "2026-10-01",
    readingMinutes: 6,
    category: "pricing",
    relatedTools: ["labor-only-calculator", "materials-markup-calculator", "labor-burden-calculator"],
    relatedGuides: ["materials-markup", "how-to-price-a-job", "change-orders-and-margin"],
    faqs: [
      {
        q: "How much should I charge for labor-only work?",
        a: "More than bare labor × margin. A day at a $38 burdened rate with an hour of material handling and a 10% risk load prices at $578.77 with a 35% margin — an effective $72.35 per on-site hour. The risk load is what the customer's online purchase transferred to you.",
      },
      {
        q: "What warranty applies on labor-only jobs?",
        a: "Workmanship only, in writing: your installation is warranted for a stated period; the material carries the manufacturer's warranty, claimed by the customer; and defects or delays in supplied materials are re-quoted at your rate. Without those three sentences, you've implicitly warranted a product you didn't sell.",
      },
      {
        q: "Why do many contractors refuse labor-only work?",
        a: "Because the risk transfer is real and rarely priced: the installer becomes the free diagnostician of someone else's purchasing mistake, the schedule slips on their delivery dates, and blame for failures has no clean answer. With a risk load plus written terms the economics are defensible; without them, it's the least profitable work in the business.",
      },
    ],
    body: [
      {
        type: "p",
        text: "It starts reasonably: the customer has found the fixture online cheaper than your supplier, and asks for labor only. The material markup you'd have earned disappears — fine. What disappears with it, quietly, is everything the markup paid for: the correct-part guarantee, the delivery timing control, and the returns run when the box contains the wrong size.",
      },
      { type: "h2", text: "What actually transfers to you" },
      {
        type: "ul",
        items: [
          "Wrong or missing parts — discovered on your clock, fixed on your truck run.",
          "Defective material — the manufacturer's warranty, claimed by the customer, but the removal and reinstall is your unpaid labor.",
          "Delivery slips — your crew arrives to a job that can't start.",
          "Compatibility blame — 'you installed it' reads as 'you own it' when the customer has no one else to call.",
        ],
      },
      {
        type: "p",
        text: "The pricing answer is a risk load: an explicit percentage of the labor base that prices the rework and delay exposure. A day of work at $38 burdened plus an hour of handling costs $342; a 10% risk load adds $34.20; the quote at a 35% margin is $578.77 — an effective $72.35 per on-site hour.",
      },
      {
        type: "table",
        caption: "The labor-only quote, built up",
        headers: ["Line", "Calculation", "Amount"],
        rows: [
          ["Labor", "8 hrs × $38", "$304.00"],
          ["Handling", "1 hr × $38", "$38.00"],
          ["Risk load 10%", "$342 × 0.10", "$34.20"],
          ["Quote at 35% margin", "$376.20 ÷ 0.65", "$578.77"],
          ["Effective on-site rate", "$578.77 ÷ 8", "$72.35/hr"],
        ],
      },
      { type: "h2", text: "The three sentences that make it survivable" },
      {
        type: "ul",
        items: [
          "Warranty covers workmanship only — the material carries the manufacturer's warranty, claimed by the customer.",
          "Materials must be on site and verified before the scheduled start; delays re-schedule at the next opening.",
          "Defects, wrong parts or failures of supplied material are remedied at the quoted hourly rate, materials at the customer's cost.",
        ],
      },
      {
        type: "p",
        text: "Labor-only with those terms is a defensible product: the customer saves the markup, you're paid for the risk you genuinely carry. Labor-only without them is a turnkey job's risk at a labor-only price — which is exactly why so many experienced contractors simply decline, and why 'we don't install customer-supplied materials' is a policy, not a phobia.",
      },
      {
        type: "callout",
        text: "If the customer pushes back on the risk load, show the arithmetic: the handling hours and the rework allowance are what their online price saved them from. Some will accept it; the ones who won't were always going to call you back for free.",
      },
      {
        type: "ctaTool",
        slug: "labor-only-calculator",
        label: "Build a labor-only quote with the labor-only calculator",
      },
    ],
  },
  {
    slug: "deposit-and-progress-billing",
    title: "Deposits and Progress Billing: Make the Customer's Money Pay for the Job",
    description:
      "A deposit isn't a courtesy — it's who finances the job's front-loaded costs. The coverage test, milestone design, and what retention quietly does to your cash.",
    metaTitle: "Contractor Deposits & Progress Billing — The Coverage Test",
    metaDescription:
      "How big should a contractor deposit be? Size it from the job's front-loaded costs, structure milestones so money arrives before spend, and price retention consciously.",
    updated: "2026-10-01",
    readingMinutes: 6,
    category: "pricing",
    relatedTools: ["deposit-schedule-calculator", "payment-terms-calculator", "change-order-calculator"],
    relatedGuides: ["late-payment-cost", "how-to-price-a-job", "change-orders-and-margin"],
    faqs: [
      {
        q: "How much deposit should a contractor take?",
        a: "Enough to cover the job's front-loaded costs — materials plus mobilization — commonly 25–50% for material-heavy trades. Check local law first: many jurisdictions cap residential deposits by statute (California caps them at $1,000 or 10%, whichever is less).",
      },
      {
        q: "What's the difference between a deposit and progress billing?",
        a: "A deposit is the first piece of the schedule. Progress billing invoices the job in stages — rough-in, finish, completion — with each payment sized to arrive before the costs it funds. The same coverage test applies at every milestone.",
      },
      {
        q: "What is retention and how should I treat it?",
        a: "A percentage of each payment withheld until completion — 5–10% on commercial work, rare residentially. It's deferred cash you finance, so price it consciously: know your exposure with the retention still held, and negotiate the release schedule, not just the percentage.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Every job has a moment when the money is flowing out faster than it's flowing in: the materials order, the dump trailer, the crew mobilized before the first dollar arrives. Who finances that moment is not a detail — it's the difference between a job that pays you and a job you lent money to.",
      },
      { type: "h2", text: "The coverage test" },
      {
        type: "p",
        text: "A $12,000 flooring job at a 35% margin costs $7,800 to deliver, and its materials — 45% of the price — are spent up front. A 30% deposit is $3,600: it does not reach the $5,400 of materials. The $1,800 shortfall is your float, financed by your credit line, for the customer's job, for free.",
      },
      {
        type: "table",
        caption: "The schedule, tested",
        headers: ["Line", "Calculation", "Amount"],
        rows: [
          ["Deposit at signing", "$12,000 × 30%", "$3,600.00"],
          ["Front-loaded materials", "$12,000 × 45%", "$5,400.00"],
          ["Float you finance", "$5,400 − $3,600", "$1,800.00"],
          ["Exposure after deposit", "$7,800 − $3,600", "$4,200.00"],
          ["Final payment", "$12,000 − $3,600", "$8,400.00"],
        ],
      },
      {
        type: "p",
        text: "A 45% deposit closes the gap — or a materials invoice passed through at signing does. The principle survives either mechanism: the customer's money pays the customer's job's front-loaded costs, never your working capital.",
      },
      { type: "h2", text: "Designing the milestones" },
      {
        type: "ul",
        items: [
          "Each payment arrives before the costs it funds — money before materials, not after.",
          "Milestones attach to completed, visible stages: mobilization, rough-in, finish, completion.",
          "The final payment is big enough to matter but never the only profit in the job.",
          "Retention, if the contract has it, is scheduled with a release date, not left as 'when the customer is happy'.",
        ],
      },
      { type: "h2", text: "The customer's side of the table" },
      {
        type: "p",
        text: "Deposit resistance is usually a story about contractors who vanished — which makes transparency the answer. A deposit explained as 'materials for your job, ordered the day you sign' reads as competent staging. An unexplained 50% reads as a red flag, and in fairness, it is one when there's no explanation. Itemize what the deposit buys and most resistance dissolves; the customers it doesn't dissolve it for are declining to finance their own job, which is useful to know early.",
      },
      {
        type: "callout",
        text: "Know your jurisdiction before setting the percentage: several states and provinces cap residential deposits by statute, and exceeding the cap doesn't just void the deposit — it hands the customer a story about you that the job can't survive.",
      },
      {
        type: "ctaTool",
        slug: "deposit-schedule-calculator",
        label: "Test your schedule with the deposit calculator",
      },
    ],
  },
  {
    slug: "revenue-per-technician",
    title: "Revenue per Technician: The KPI That's Meaningless Without Its Chain",
    description:
      "The field-service north star hides a chain — billable hours times rate per billable hour. Read the chain and the number tells you whether to fix pricing, routing or headcount.",
    metaTitle: "Revenue per Technician — The KPI and the Chain Behind It",
    metaDescription:
      "How to calculate revenue per technician, why per-billable-hour makes shops comparable, and how to read whether a low number is a pricing, utilization or demand problem.",
    updated: "2026-10-01",
    readingMinutes: 6,
    category: "costs",
    relatedTools: ["revenue-per-tech-calculator", "effective-hourly-rate-calculator", "trip-cost-calculator"],
    relatedGuides: ["effective-hourly-rate", "truck-roll-cost", "what-margin-should-i-target"],
    faqs: [
      {
        q: "What is a good revenue per technician?",
        a: "Published benchmarks put residential HVAC around $150,000–250,000 per tech a year and plumbing somewhat lower — but business mix makes cross-shop comparison noisy. The number that matters is the one your own required margin demands, computed from your overhead and income goals.",
      },
      {
        q: "Why track revenue per billable hour alongside it?",
        a: "Two shops can show identical revenue per tech while one earns $95 per billable hour and the other $140. The per-hour figure separates the causes: a low rate is a pricing conversation, low utilization is a routing and quoting conversation.",
      },
      {
        q: "How do I raise revenue per technician?",
        a: "Through the chain: higher rate per billable hour (pricing and job mix), higher utilization (denser routing, faster quoting), or more demand per tech (maintenance agreements filling slow months). Hiring more techs into flat demand lowers the number before it raises it.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Revenue per technician is the most quoted number in field service and the most misread. Quoted alone, it invites one answer — sell more — when the number is actually the product of two very different levers that get fixed in completely different ways.",
      },
      { type: "h2", text: "The chain" },
      {
        type: "ul",
        items: [
          "Revenue per tech = annual revenue ÷ technicians",
          "Billable hours per tech = weeks × hours/week × utilization",
          "Revenue per billable hour = annual revenue ÷ (techs × billable hours)",
          "Revenue per tech = billable hours × revenue per billable hour",
        ],
      },
      {
        type: "p",
        text: "A two-tech shop billing $420,000 shows $210,000 per tech. Behind it: 1,248 billable hours each (48 weeks × 40 hours × 65% utilization) and $168.27 per billable hour. The decomposition is the diagnosis — the same $210,000 at 50% utilization would mean $258.50 per hour, and the conversation shifts from 'sell more' to 'why is a third of the paid week not selling'.",
      },
      {
        type: "table",
        caption: "Same revenue per tech, two very different shops",
        headers: ["", "Shop A", "Shop B"],
        rows: [
          ["Revenue per tech", "$210,000", "$210,000"],
          ["Utilization", "65%", "50%"],
          ["Billable hours", "1,248", "960"],
          ["Revenue per billable hour", "$168.27", "$218.75"],
          ["The conversation", "Routing and quoting efficiency", "Pricing headroom is already there"],
        ],
      },
      { type: "h2", text: "Per tech or per truck?" },
      {
        type: "p",
        text: "Track both, because they diverge usefully. Per-tech measures how hard your people work and price; per-truck measures how hard your assets work. Two techs sharing a van, or a truck idle with no tech, makes the two numbers disagree — and the disagreement points at scheduling problems either number alone would bury.",
      },
      { type: "h2", text: "The hiring trap" },
      {
        type: "p",
        text: "The KPI falls before it rises when you hire: a new tech's first months carry training, slower pacing and a partially filled schedule, all divided into the average. Hiring into flat demand makes the number worse for two quarters and possibly forever. The demand that justifies the hire should be visible first — a maintenance agreement program is the cleanest way to make it visible.",
      },
      {
        type: "callout",
        text: "The benchmark to beat is your own: the revenue per tech your required margin demands, computed from overhead and income goals. Published trade figures are context for the conversation — not targets for your business.",
      },
      {
        type: "ctaTool",
        slug: "revenue-per-tech-calculator",
        label: "Run the chain with the revenue per technician calculator",
      },
    ],
  },
];
