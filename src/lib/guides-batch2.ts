import type { Guide } from "./guides";

/**
 * Phase 5 editorial batch — five guides built on the existing Block/Guide system.
 * Every numeric example is hand-verified and cross-checked against the calculators;
 * see tests/math-verification.mjs (section 9) and docs/phase-5-editorial-seo-report.md.
 * Market ranges are attributed to their sources; all other numbers are illustrative
 * worked examples, not industry data.
 */
export const newGuides: Guide[] = [
  {
    slug: "how-to-calculate-labor-burden",
    title: "How to Calculate Labor Burden (And Why $25/hr Isn't $25/hr)",
    description:
      "Payroll taxes, workers' comp, benefits — and the billable-hours divisor most explanations skip. Build your true hourly labor cost step by step.",
    metaTitle: "How to Calculate Labor Burden — Formula, Worked Example & Billable Hours",
    metaDescription:
      "Labor burden is wage plus payroll taxes, workers' comp and benefits — divided by billable hours, not paid hours. See the full formula and a worked example.",
    updated: "2026-09-14",
    readingMinutes: 7,
    category: "costs",
    relatedTools: ["labor-burden-calculator", "hourly-rate-calculator", "job-pricing-calculator"],
    relatedGuides: ["how-to-price-a-job", "minimum-service-charge"],
    faqs: [
      {
        q: "What is a typical labor burden percentage?",
        a: "Commonly cited ranges put employer burden around 25–40% of wages, but the honest answer is that it varies enormously by trade and state: workers' comp class codes alone can swing the percentage by double digits. Build your own number from your actual payroll, insurance and benefits costs rather than adopting a rule of thumb — the calculator takes a couple of minutes.",
      },
      {
        q: "Is labor burden the same as overhead?",
        a: "No. Labor burden is the cost of employing a specific person: their wage plus payroll taxes, workers' comp, and benefits tied to that wage. Overhead is the cost of running the business — insurance, rent, vehicles, software — that exists regardless of any single employee. Burden rides on labor lines in your estimates; overhead is recovered through your markup or margin.",
      },
      {
        q: "Why divide by billable hours instead of paid hours?",
        a: "Because the employee costs you money for every paid hour but only generates revenue for hours on a job. PTO, holidays, quoting, training and windshield time are real costs with no bill attached. Dividing total cost by only the hours that actually earn keeps the rate honest — using paid hours understates the rate and quietly moves that shortfall into every job estimate.",
      },
    ],
    body: [
      {
        type: "p",
        text: "You pay a new technician $25 an hour. Quick math says that's $52,000 a year and maybe $32 an hour once you add a cushion for \"taxes and stuff.\" Real math says the number you should be using in estimates is closer to $36–40 — and if you're quoting with $32, the gap isn't coming out of your profit discussions, because it never shows up there. It's already baked into every labor line as invisible underpricing. Here's the build-up that finds it.",
      },
      { type: "h2", text: "What labor burden actually includes" },
      {
        type: "ul",
        items: [
          "Payroll taxes you pay as the employer: FICA (7.65% up to the wage base), plus federal and state unemployment (FUTA/SUTA). Combined, commonly 10–15% of wages.",
          "Workers' compensation insurance — set by class code and state, and wildly different by trade: an office worker's rate and a roofer's rate are not in the same universe.",
          "Benefits: health insurance, retirement match, phone, uniform, tool allowances. Anything you pay because they're on the crew.",
          "Fixed costs tied to the person: training, licensing, drug testing, company gear.",
        ],
      },
      {
        type: "callout",
        text: "Burden is not overhead. Burden dies when the employee leaves; overhead (rent, trucks, the accounting software) stays when nobody's employed. They get recovered differently: burden rides on labor lines, overhead on the margin.",
      },
      { type: "h2", text: "The formula" },
      {
        type: "p",
        text: "Two steps: total the annual cost, then divide by the hours that actually earn.",
      },
      {
        type: "ul",
        items: [
          "Total annual cost = (wage × paid hours) × (1 + taxes% + comp% + benefits%) + other annual costs",
          "Billable hours = (paid hours − PTO/holidays) × (1 − non-billable%)",
          "Burdened hourly cost = total annual cost ÷ billable hours",
        ],
      },
      {
        type: "p",
        text: "The most common version of this calculation stops after step one and reports \"wage + 30%\" as the rate. That number is usable for accounting — but it's the wrong one for pricing, because it assumes every paid hour lands on a job.",
      },
      { type: "h2", text: "Worked example: a $25/hr technician" },
      {
        type: "p",
        text: "Say a full-time tech (2,080 paid hours) at $25/hr with 12% payroll taxes, a 6% workers' comp class, 5% benefits, $1,200/yr of training and gear, 120 hours of PTO, and 10% of remaining time going to quoting, cleanup and windshield:",
      },
      {
        type: "table",
        caption: "Labor burden build-up — $25/hr technician, illustrative",
        headers: ["Line", "Calculation", "Amount"],
        rows: [
          ["Base wages", "$25 × 2,080", "$52,000"],
          ["Payroll taxes (12%)", "$52,000 × 0.12", "$6,240"],
          ["Workers' comp (6%)", "$52,000 × 0.06", "$3,120"],
          ["Benefits (5%)", "$52,000 × 0.05", "$2,600"],
          ["Other (training, tools)", "flat", "$1,200"],
          ["Total annual cost", "", "$65,160"],
          ["Billable hours", "(2,080 − 120) × 0.90", "1,764"],
          ["Burdened hourly cost", "$65,160 ÷ 1,764", "$36.94"],
        ],
      },
      {
        type: "p",
        text: "So the $25 employee costs $36.94 for every hour that can be sold — a 25% jump from the naive $32. If your estimates use $32 and the market supports $85/hr billing, you're fine. If they're tight, that $4.94/hr difference is the reason \"busy but broke\" doesn't show up in any single job: it's spread across all of them.",
      },
      {
        type: "ctaTool",
        slug: "labor-burden-calculator",
        label: "Run your own crew through the labor burden calculator",
      },
      { type: "h2", text: "The mistakes that skew the number" },
      {
        type: "ul",
        items: [
          "Using paid hours instead of billable hours — the single most common version of the error, and it always understates the rate.",
          "Forgetting that workers' comp is class-code specific. A shop employee at 2% and a field tech at 8% can't share one burden rate if you price their hours the same way.",
          "Feeding the burdened rate back through burden again — burden applies once, on top of wages. Your overhead allowance is separate and comes later in the price build-up.",
          "Treating owner hours as free. If you're on the tools, your hour costs what it must earn — see the hourly rate calculator for owner-operators.",
        ],
      },
      { type: "h2", text: "What to do with the number" },
      {
        type: "p",
        text: "The burdened rate is the labor input for every other pricing decision: job prices, flat rates, break-even counts. When a job's labor line says 16 hrs × $36.94 = $591, that's the number that lets the rest of the math be trusted. A wrong burden rate doesn't make one job unprofitable — it makes every estimate quietly optimistic.",
      },
      {
        type: "ctaTool",
        slug: "hourly-rate-calculator",
        label: "Solo operator instead? Set your own floor rate",
      },
    ],
  },
  {
    slug: "how-to-write-an-estimate",
    title: "How to Write an Estimate: What Every Line Is For",
    description:
      "An estimate isn't a form to fill in — it's the visible half of your costing math. What each section must contain, and the mistakes that lose jobs or lose money.",
    metaTitle: "How to Write an Estimate for a Job — Line-by-Line Structure & Example",
    metaDescription:
      "What a contractor estimate should include, line by line: scope, labor, materials, exclusions, payment terms — each tied to the costing decision behind it.",
    updated: "2026-09-14",
    readingMinutes: 8,
    category: "pricing",
    relatedTools: ["job-pricing-calculator", "flat-rate-calculator", "markup-calculator"],
    relatedGuides: ["how-to-price-a-job", "markup-vs-margin"],
    faqs: [
      {
        q: "What should a contractor's estimate include?",
        a: "At minimum: your business identity and contact info, the customer and property address, a date and an expiration date, an itemized scope of work in plain language, prices broken out by labor, materials and other costs, what's explicitly NOT included (exclusions), payment terms, and how long the price is valid. The scope and exclusions matter as much as the number — they're what the price is actually attached to.",
      },
      {
        q: "How detailed should an estimate be?",
        a: "Detailed enough that the customer can compare it to another bid without calling you, and specific enough that scope disputes have nowhere to live. But you don't have to expose your unit costs — quote sections or line results, not hours-times-rate.",
      },
      {
        q: "Should I show my markup on an estimate?",
        a: "No. Markup is your internal costing decision, not a line item. Customers are buying the outcome and the price, not auditing your cost structure. What you show is the price for a defined scope — the markup vs margin math stays in your calculator, not on the document.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Most estimate advice is about formatting: pick a template, add your logo, don't forget the date. That's the trivial half. An estimate is the customer-facing half of your costing math — every line either reflects a decision you actually made, or it's decoration that will decay into a dispute. Here's what each section is for and the costing question it answers.",
      },
      { type: "h2", text: "The header: identity, dates, validity" },
      {
        type: "ul",
        items: [
          "Your business name, license number where required, and contact info.",
          "Customer name and the job address — not just the billing address; the job address is where the work happens.",
          "Estimate date and an expiration date. Material prices move; an estimate without an expiry quietly becomes a price guarantee.",
          "A sequential estimate number, for your own records and any warranty or lien paperwork that follows.",
        ],
      },
      { type: "h2", text: "The scope of work: the part that prevents disputes" },
      {
        type: "p",
        text: "The scope says what the price buys, in specific, observable language. \"Paint bedroom\" is a hope. \"Prep, prime and paint one 12×14 bedroom, walls and ceiling, two coats, minor drywall patching up to 4 sq ft included, customer moves furniture.\" Same three words of effort, completely different legal and practical weight. The test: could a stranger tell whether the work was done?",
      },
      {
        type: "callout",
        text: "Scope and price are one package. If the scope changes and the price doesn't, you didn't update the estimate — you gave a discount without deciding to.",
      },
      { type: "h2", text: "The price section: lines that mirror your math" },
      {
        type: "p",
        text: "How much you break out depends on your market and the job size, but every line should trace back to your costing. A common structure for a small remodel:",
      },
      {
        type: "table",
        caption: "Estimate price section — bathroom refresh example (illustrative)",
        headers: ["Line", "Shown to customer", "Your costing behind it"],
        rows: [
          ["Labor", "$1,088", "32 hrs × $34 burdened — from your labor burden build-up"],
          ["Materials", "$780", "$710 supplier quote + 10% waste + delivery"],
          ["Plumbing fixture set (sub)", "$350", "sub's actual quote"],
          ["Permits & disposal", "$105", "real fees, not a fudge line"],
          ["Total", "$4,109", "$2,323 direct + 15% overhead, ÷ 0.65 for a 35% margin"],
        ],
      },
      {
        type: "p",
        text: "Notice what the customer doesn't see: hours, rates, overhead percentage, margin. Those are your inputs. What they see is sections they can compare against other bids — and when a competitor comes in at $3,400, the conversation is about scope and materials, not about your hourly rate.",
      },
      {
        type: "ctaTool",
        slug: "job-pricing-calculator",
        label: "Build the numbers behind the price section",
      },
      { type: "h2", text: "Exclusions: the quiet money-saver" },
      {
        type: "p",
        text: "An exclusions list is awkward to write and priceless to have: \"Does not include: relocation of plumbing lines, drywall repair beyond noted patching, painting behind accessible areas, permit fees for electrical work.\" Every later change-order starts here, priced from evidence instead of argument. Estimates without exclusions don't avoid scope disputes — they just lose them by default.",
      },
      { type: "h2", text: "Terms: payment, changes, validity" },
      {
        type: "ul",
        items: [
          "Payment schedule tied to milestones, not feelings — deposit where legal and normal for your trade, progress on completion of defined stages, balance at completion.",
          "Change-order clause: any work outside the written scope is priced and approved before it happens.",
          "How long the price holds (matching your estimate expiry) and what can move it — material price spikes on long-dated jobs especially.",
        ],
      },
      { type: "h2", text: "The mistakes that cost real money" },
      {
        type: "ul",
        items: [
          "Quoting from memory instead of a costing pass — the number feels right because it's shaped like the last job, not because it is the last job.",
          "No expiry date, then eating a 20% lumber move two months later.",
          "Vague scope (\"electrical work as needed\") that turns the job into an open-ended hourly commitment at a fixed price.",
          "Showing a single all-in number on big jobs, which forces the customer to compare the only thing they can — price — against itemized competitors.",
          "Copying the scope from the last job and missing the one thing that's different. (This is the estimate version of the markup/margin mix-up: the math is fine, the input is wrong.)",
        ],
      },
      {
        type: "p",
        text: "For small repeatable service work, you may skip most of this — a flat rate on a defined job IS the estimate, and the structure lives in your price book instead. The full document earns its keep on project work, where scope is negotiated and the price is too big to be wrong in one place.",
      },
      {
        type: "ctaTool",
        slug: "flat-rate-calculator",
        label: "Pricing service calls instead? Build the flat rate",
      },
    ],
  },
  {
    slug: "general-contractor-markup",
    title: "General Contractor Markup: What's Typical and What Yours Should Be",
    description:
      "Published GC markups range from under 10% to 50% — which tells you the number is a decision, not a fact. What the ranges actually reflect, and how to set yours.",
    metaTitle: "General Contractor Markup — Typical Ranges, Why They Differ & How to Set Yours",
    metaDescription:
      "Residential GC markups commonly run 10–40% depending on project type, overhead and risk. See the attributed ranges, the markup-to-margin conversion, and a method for setting your own.",
    updated: "2026-09-14",
    readingMinutes: 7,
    category: "pricing",
    relatedTools: ["markup-calculator", "margin-calculator", "overhead-calculator"],
    relatedGuides: ["markup-vs-margin", "how-to-price-a-job"],
    faqs: [
      {
        q: "What is a typical general contractor markup?",
        a: "Published sources put residential GC markups in a wide band: Angi cites roughly 15–20% as common, construction-industry publications range 10–40% depending on project type, and custom-home builders are often higher. The spread is the point — markup reflects your overhead structure, risk and service level, not an industry standard. Treat any single number as one data point, then build your own from your costs.",
      },
      {
        q: "Is 30% markup too much?",
        a: "A 30% markup on cost is a 23% margin — about $23 of gross profit per $100 of revenue. Whether that's too much depends on what your overhead consumes: if overhead runs 15% of revenue, a 23% margin leaves ~8% net before taxes, which is a healthy but not extravagant residential business. It's not greed; it's arithmetic that only works if your costs support it.",
      },
      {
        q: "Do GCs mark up subcontractor work?",
        a: "Usually yes — the GC carries coordination, scheduling, warranty and risk for subbed work, and the markup pays for that. Whatever you mark subs up to, be consistent and know your margin on that revenue; sub-heavy jobs live and die on the coordination costs first-time GCs forget to count.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Ask what markup general contractors charge and you'll get confident, contradictory answers: 15–20% (Angi), 20–33% (foreman.co), \"30–50%\" (Buildern), 10–20% (contractor-growth networks), and Reddit threads that span 9% to 100% by job size. Someone is wrong? No — they're answering different questions in different circumstances, and the numbers only look incompatible until you see what markup actually pays for.",
      },
      { type: "h2", text: "What markup has to cover" },
      {
        type: "p",
        text: "Markup isn't profit. It's the lid that has to cover two things, in order:",
      },
      {
        type: "ul",
        items: [
          "Overhead: insurance, vehicles, office, software, estimating time on lost bids, warranty callbacks on won ones. Typically the biggest share.",
          "Net profit: what's left for the owner and for absorbing the surprises a year contains.",
        ],
      },
      {
        type: "p",
        text: "This is why the published ranges differ so much. A GC working from a home office with one truck and steady subs can price fine at the low end of the band. A company carrying a showroom, a project manager and a warranty fund needs the top of it. Neither is gouging; their costs are different. The right question is never \"what do others charge\" but \"what does MY overhead + target profit require.\"",
      },
      { type: "h2", text: "Markup vs margin: the expensive mix-up" },
      {
        type: "p",
        text: "Say your business needs 25% of revenue for overhead and wants 8% net. That's a 33% margin — which requires a 50% markup on cost ($1.00 cost ÷ 0.67 = $1.49 price). Price with \"a 33% markup\" instead and you collect $1.33 per cost dollar — a 24.8% margin — and your overhead share quietly eats the entire \"profit.\" This single confusion is, in our experience reading contractor forums and the published guides alike, the most common arithmetic failure in residential pricing. The conversion table below is the antidote.",
      },
      {
        type: "table",
        caption: "Markup on cost vs the margin it actually produces",
        headers: ["Markup on cost", "Margin on price", "Gross profit per $100k of cost"],
        rows: [
          ["15%", "13.0%", "$15,000"],
          ["20%", "16.7%", "$20,000"],
          ["25%", "20.0%", "$25,000"],
          ["30%", "23.1%", "$30,000"],
          ["40%", "28.6%", "$40,000"],
          ["50%", "33.3%", "$50,000"],
        ],
      },
      {
        type: "ctaTool",
        slug: "markup-calculator",
        label: "Check your markup against the margin you actually need",
      },
      { type: "h2", text: "How to set your markup: work backwards, not sideways" },
      {
        type: "ul",
        items: [
          "Total your annual overhead and divide by expected revenue to get overhead as a percent of sales (the overhead calculator does this per hour and per dollar).",
          "Add your target net profit — for owner-operated residential work, pick the number your plans actually require, not a forum's.",
          "Add the two: that's your target margin. Convert to markup: markup = margin ÷ (100 − margin).",
          "Stress-test: take three past jobs and re-price them at your new rate. If a real past job would have lost the sale by a mile, the honest fixes are lower costs, narrower scope, or a different customer — not a silent margin cut.",
        ],
      },
      {
        type: "callout",
        text: "Markups also scale with job size and risk — the same GC might run 30% on a deck and 12% on a whole-house remodel, because overhead dollars and risk concentration differ. Percentages are a tool, not an identity.",
      },
      { type: "h2", text: "Where this leaves the published numbers" },
      {
        type: "p",
        text: "Use the ranges as a sanity check, not a target: if your required markup lands far below the published band for your project type, suspect you've under-counted overhead (estimating hours and warranty time are the usual escapees). Far above it, the honest questions are about cost structure and positioning — or whether that particular job should be yours at all. The number that matters is the one your own arithmetic produces.",
      },
      {
        type: "ctaTool",
        slug: "overhead-calculator",
        label: "Start from your real overhead, not someone else's range",
      },
    ],
  },
  {
    slug: "flat-rate-vs-hourly",
    title: "Flat Rate vs Hourly Pricing: Which Should You Use?",
    description:
      "The trade-offs everyone lists, plus the part software blogs skip: the same job priced both ways, so you can see exactly where each model wins and loses.",
    metaTitle: "Flat Rate vs Hourly Pricing for Contractors — Pros, Cons & a Worked Example",
    metaDescription:
      "Flat rate vs hourly pricing compared with real math: the same service job priced both ways, who bears each risk, and a method for choosing per job type.",
    updated: "2026-09-14",
    readingMinutes: 7,
    category: "pricing",
    relatedTools: ["flat-rate-calculator", "hourly-rate-calculator", "job-pricing-calculator"],
    relatedGuides: ["minimum-service-charge", "how-to-price-a-job"],
    faqs: [
      {
        q: "Is flat rate or hourly better for a service business?",
        a: "Neither wins universally — they allocate risk differently. Hourly shifts time risk to the customer and penalizes your efficiency; flat rate rewards efficiency but makes you own the estimate. Fast, repeatable, well-understood jobs favor flat rate; genuinely unpredictable scope favors hourly or time-and-materials with a cap. Many service businesses run both, chosen per job type.",
      },
      {
        q: "Why do customers often prefer flat rate?",
        a: "Because it answers their first question — \"what will this cost?\" — before the work starts, and removes the fear of a slow meter. For the contractor that certainty usually converts better, which is why flat-rate systems dominate residential HVAC, plumbing and electrical service work.",
      },
      {
        q: "Does flat rate mean charging more when the job runs long?",
        a: "No — and that's the model's whole bet. If you quoted from honest costs and the job runs long, the extra time comes out of your margin, and the next quote should reflect what you learned. If jobs routinely run long at flat rates, the estimate is wrong, not the customer.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Every comparison of flat rate vs hourly reads like the same pro/con list reshuffled: predictable for the customer, rewards efficiency, risk on the estimate, risk on the meter. All true and none decisive. What actually decides it is who's better at bearing each risk — and you can see that in the math of one job priced both ways.",
      },
      { type: "h2", text: "The same job, priced both ways" },
      {
        type: "p",
        text: "Take a service call with a real chance of running long: an HVAC no-cool call. Your burdened tech rate is $60/hr, overhead runs 15% of direct cost, the trip costs $40, the likely part is $45, and you target a 40% margin on the whole job.",
      },
      {
        type: "table",
        caption: "One diagnostic call, two pricing models (illustrative)",
        headers: ["Scenario", "Hourly (1 hr diag + T&M fix)", "Flat rate"],
        rows: [
          ["Fast repair (1 hr)", "$60 + $40 trip + $45 ≈ $278 total", "$280 quoted, done in 1 hr — $113 profit"],
          ["Slow repair (2.5 hrs)", "$150 + $40 + $45 ≈ $450 — customer pays for your slow day", "$280 quoted, done in 2.5 hrs — $10 profit"],
          ["Customer sees", "A meter that speeds up when the job goes bad", "One number before you start"],
        ],
      },
      {
        type: "p",
        text: "Read the middle row twice. Hourly billing transfers the cost of a hard job to the customer automatically — and also transfers the pain: the customer's worst day gets the biggest bill, which is exactly when price sensitivity and disputes peak. Flat rate freezes the number; the same hard day comes out of your margin instead. Neither is \"safer.\" They just aim the risk at different parties.",
      },
      { type: "h2", text: "What flat rate actually rewards" },
      {
        type: "ul",
        items: [
          "Efficiency: a tech who finishes the standard swap in 40 minutes earns the same as one who takes 90. Shops that train and tool well keep that difference.",
          "Honest estimating: flat rate forces the cost math up front — burdened labor, trip, parts, overhead, margin — which is the same math hourly shops skip and then wonder where the margin went.",
          "Upsell clarity: options are easier to present when each is a price, not an extrapolation of hours.",
        ],
      },
      { type: "h2", text: "What hourly actually rewards" },
      {
        type: "ul",
        items: [
          "Genuinely unknown scope: opening walls, diagnosing intermittent faults, anything where the honest answer is \"depends what we find.\"",
          "Covers-the-clock simplicity on jobs where the customer is also sophisticated (property managers, commercial clients) and the meter is expected.",
          "Protection against chronic underestimation: if your flat estimates are habitually optimistic, hourly at least gets the time paid — though it hides the estimating problem instead of fixing it.",
        ],
      },
      {
        type: "callout",
        text: "The hybrid most shops land on: flat rate for defined, repeatable work; hourly or T&M with a not-to-exceed cap for discovery work; a minimum service charge so the smallest job still carries its trip and overhead. The models aren't rivals — they're tools for different scopes.",
      },
      {
        type: "ctaTool",
        slug: "flat-rate-calculator",
        label: "Build the flat rate from real costs",
      },
      { type: "h2", text: "How to decide, per job type" },
      {
        type: "ul",
        items: [
          "Can you describe the finish line in one sentence before starting? → flat rate.",
          "Does the job have a real chance of doubling in scope once opened? → hourly/T&M with a cap, and say so up front.",
          "Is the job tiny relative to your costs (one trip, under an hour)? → whatever you choose, the minimum charge is the real decision — see the guide to minimum service charges.",
          "Do you have honest cost data for this job type yet? If not, flat-rate it anyway but track actuals: the first ten jobs buy the estimate accuracy the model needs.",
        ],
      },
      {
        type: "ctaTool",
        slug: "hourly-rate-calculator",
        label: "Set the hourly floor that makes T&M work",
      },
    ],
  },
  {
    slug: "minimum-service-charge",
    title: "Minimum Service Charge: How to Set the Floor Price for Showing Up",
    description:
      "A trip costs what it costs. Build your service-call floor from burdened labor, the truck, overhead and margin — instead of copying the shop across town.",
    metaTitle: "Minimum Service Charge & Trip Fees — How to Calculate Yours",
    metaDescription:
      "Set a minimum service charge from your own numbers: burdened first hour, trip cost, overhead share and target margin. Formula, worked example, and when to waive it.",
    updated: "2026-09-14",
    readingMinutes: 6,
    category: "pricing",
    relatedTools: ["flat-rate-calculator", "labor-burden-calculator", "overhead-calculator"],
    relatedGuides: ["flat-rate-vs-hourly", "how-to-calculate-labor-burden"],
    faqs: [
      {
        q: "How much should I charge for a service call?",
        a: "Industry surveys (SmartService, 2026) put most trip/diagnostic fees between $75 and $150, but the useful number is yours, not the survey's: your burdened first hour + trip cost + overhead share, priced at your target margin. For many solo operators that arithmetic lands near the survey range by coincidence, not because $100 is a standard.",
      },
      {
        q: "Should the service call fee be waived if the customer books the repair?",
        a: "Waiving it against approved work is a sales tactic, not a pricing decision — just make sure the repair's flat rate carries the trip and diagnostic time, because the costs don't waive themselves. Many shops quote slightly higher repair prices and advertise the \"free\" diagnostic; the math is identical either way.",
      },
      {
        q: "What's the difference between a trip charge and a minimum service charge?",
        a: "A trip charge recovers only the cost of coming out — fuel, vehicle wear, drive time. A minimum service charge is a full price floor: it also covers the first (diagnostic) hour, its burden, and overhead, priced at your margin. Charging only a bare trip charge guarantees every tiny job loses money once labor is counted.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Forum threads on minimum service charges go the same way every time: \"What do you guys charge to come out?\" followed by numbers and a few strong opinions. The numbers aren't transferable — a $35 trip across a small town in a paid-off van and a $35 trip in a financed truck at $25/hr shop labor in a metro are different businesses wearing the same fee. What transfers is the method.",
      },
      { type: "h2", text: "What the floor has to carry" },
      {
        type: "ul",
        items: [
          "The trip: fuel, vehicle wear, and the unbillable drive time at your burdened rate.",
          "The first hour on site — diagnostics count as work; someone pays for the tech's expertise even when the fix is \"you need a new unit.\"",
          "Overhead on all of the above: insurance, software, the phone that rang.",
          "Margin — because a floor that only breaks even turns your smallest jobs into unpaid advertising for your costs.",
        ],
      },
      { type: "h2", text: "The formula" },
      {
        type: "ul",
        items: [
          "Smallest-call cost = (first hour × burdened rate + trip) × (1 + overhead%)",
          "Minimum charge = smallest-call cost ÷ (1 − target margin), rounded to a quotable number",
        ],
      },
      {
        type: "p",
        text: "This is exactly the flat-rate math with materials at zero — which is why the flat rate calculator suggests a minimum automatically: it prices the same call without parts, and that's your floor.",
      },
      { type: "h2", text: "Worked example" },
      {
        type: "p",
        text: "Solo electrician, $55/hr burdened rate, $30 average trip, 15% overhead, 35% target margin:",
      },
      {
        type: "table",
        caption: "Minimum service charge build-up (illustrative)",
        headers: ["Line", "Calculation", "Amount"],
        rows: [
          ["First hour (burdened)", "$55 × 1", "$55.00"],
          ["Trip cost", "fuel + wear + drive time", "$30.00"],
          ["Overhead allowance", "$85 × 15%", "$12.75"],
          ["Smallest-call cost", "", "$97.75"],
          ["Minimum at 35% margin", "$97.75 ÷ 0.65 = $150.38 → quote $155 (rounded up)", "$155"],
        ],
      },
      {
        type: "p",
        text: "Notice the shape of the result: the floor is basically \"first hour plus trip, properly priced.\" That's why shops that charge \"just a $50 trip fee\" lose money on every declined quote — the fee doesn't carry the hour, let alone the overhead and margin.",
      },
      {
        type: "ctaTool",
        slug: "flat-rate-calculator",
        label: "Get your suggested minimum in the flat rate calculator",
      },
      { type: "h2", text: "Using it without losing the job" },
      {
        type: "ul",
        items: [
          "Say it before the truck rolls: \"The visit is $X, which covers diagnosis; that amount goes toward the repair if you approve it.\" Surprises, not numbers, are what customers punish.",
          "Waive-against-work freely once the flat rate carries the same costs — see the flat rate vs hourly comparison for why the two models share this math.",
          "Scale by distance if your service area is wide: a tiered floor (base + $Y per 10 miles past the line) is honest arithmetic, not a surcharge.",
          "Review the floor when your burdened rate or fuel moves. A minimum set two years ago is a museum piece.",
        ],
      },
      {
        type: "callout",
        text: "The honest floor never comes from a competitor's number. Theirs is built from their truck payment, their comp class and their margin — copying it is pricing your business as someone else's.",
      },
    ],
  },
];
