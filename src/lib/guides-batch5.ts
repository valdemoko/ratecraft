import type { Guide } from "./guides";

/**
 * Phase 10 editorial batch — six guides paired with the six new calculators
 * (overtime, truck rolls, warranty rework, quote win rate, buy vs rent, payment
 * terms). Every numeric example is reproduced in tests/math-verification.mjs
 * (sections 20–25 and the guide checks).
 */
export const phase10Guides: Guide[] = [
  {
    slug: "overtime-cost",
    title: "The True Cost of Overtime: Why an OT Hour Isn't 1.5× the Wage",
    description:
      "The classic OT calculation forgets that payroll taxes and workers' comp ride on overtime pay too. Here's the burdened version, the annual premium, and the hire-or-overtime decision.",
    metaTitle: "The True Cost of Overtime — Burdened Rate & Annual Premium",
    metaDescription:
      "An overtime hour costs the burdened wage times the multiplier — not the bare wage times 1.5. Worked example, the annual premium formula, and when hiring beats OT.",
    updated: "2026-10-01",
    readingMinutes: 6,
    category: "costs",
    relatedTools: ["overtime-calculator", "labor-burden-calculator", "hire-vs-subcontract-calculator"],
    relatedGuides: ["how-to-calculate-labor-burden", "hire-or-subcontract", "effective-hourly-rate"],
    faqs: [
      {
        q: "How much does an overtime hour really cost?",
        a: "The burdened wage times the multiplier. A $25 wage with 31% burden is $32.75 burdened; at time-and-a-half that's $49.13 per OT hour — not the $37.50 the bare wage suggests. Payroll taxes and workers' comp apply to overtime wages exactly as to straight ones.",
      },
      {
        q: "What is the overtime premium beyond straight time?",
        a: "OT hours × burdened wage × (multiplier − 1). A tech running 8 OT hours a week for a 12-week peak at $32.75 burdened: 96 hours × $32.75 × 0.5 = $1,572 of premium — what the multiplier alone costs above paying those same hours at straight time.",
      },
      {
        q: "When should I hire instead of paying overtime?",
        a: "When the premium becomes permanent. Seasonal peaks are what overtime is for — it scales to zero when the work does. Run the premium annually: if a full year of OT premium approaches the cost of a hire's straight-time hours, the payroll is the cheaper way to buy those hours.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Every trade forum has the same exchange: overtime is expensive, someone says, 1.5 times the wage. And that number — $37.50 for a $25 tech — is repeated so confidently that it becomes the planning figure. It's wrong in the same direction every costing shortcut is wrong: it uses the bare wage as if payroll taxes, workers' comp and benefits stopped existing at hour 41.",
      },
      { type: "h2", text: "The burdened version" },
      {
        type: "ul",
        items: [
          "Burdened straight rate = wage × (1 + burden %)",
          "Burdened OT rate = burdened straight rate × multiplier",
        ],
      },
      {
        type: "p",
        text: "A $25 technician at a 31% burden costs $32.75 an hour straight time. At time-and-a-half, the OT hour is $32.75 × 1.5 = $49.13 — nearly $12 more than the forum number, on every OT hour, because FICA, unemployment and comp premiums are percentages of actual pay, and actual pay just went up 50%.",
      },
      { type: "h2", text: "A worked peak" },
      {
        type: "p",
        text: "An HVAC company runs that tech 8 hours of overtime a week through a 12-week summer rush. Ninety-six OT hours at $49.13 is $4,716 of labor. The same hours at straight time would have been $3,144. The premium — the multiplier's true cost — is $1,572 for the season.",
      },
      {
        type: "table",
        caption: "The 12-week peak, costed two ways",
        headers: ["Line", "Calculation", "Amount"],
        rows: [
          ["Burdened straight rate", "$25 × 1.31", "$32.75/hr"],
          ["Burdened OT rate", "$32.75 × 1.5", "$49.13/hr"],
          ["OT hours", "8 × 12 weeks", "96 hrs"],
          ["OT labor cost", "96 × $49.13", "$4,716.00"],
          ["Premium beyond straight time", "96 × $32.75 × 0.5", "$1,572.00"],
        ],
      },
      { type: "h2", text: "What the premium is worth" },
      {
        type: "p",
        text: "For a seasonal peak, $1,572 is cheap: it buys flexibility that scales to zero in October, and no hiring process does that. The same premium every week of the year is a different object — about $6,800 annually at this rate — and at that point the comparison isn't overtime versus nothing, it's overtime versus the straight-time hours of another person. Run the annual premium through the hire comparison before the peak becomes the schedule.",
      },
      { type: "h2", text: "Passing it on" },
      {
        type: "p",
        text: "Genuine rush work — the call that must happen tonight — should carry the burdened OT rate plus a premium for the disruption, and customers who create the urgency accept that. What it shouldn't do is absorb OT that exists only because an estimate slipped: billing the customer for your scheduling is the fastest way to lose a repeat client. And where OT is chronic and unpriced, the effective hourly rate on those jobs collapses silently — which is the job-costing conversation, not the payroll one.",
      },
      {
        type: "callout",
        text: "Two honesty checks: the burden percentage must be your own (the Labor Burden Calculator produces it), and salaried or sub crews without a legal multiplier still carry the fatigue cost — slower hours after hour 50, more rework, attrition. The calculator prices the cash; you price the tiredness.",
      },
      {
        type: "ctaTool",
        slug: "overtime-calculator",
        label: "Cost your overtime with the overtime calculator",
      },
    ],
  },
  {
    slug: "truck-roll-cost",
    title: "Truck Roll Cost: What a Service Visit Really Costs Before Anyone Touches a Tool",
    description:
      "The fuel receipt is the smallest part of a trip. The true truck roll cost includes the drive time nobody invoices — and it should set your call-out minimum.",
    metaTitle: "Truck Roll Cost — What One Service Visit Really Costs",
    metaDescription:
      "A truck roll costs the vehicle's share of the day plus unpaid drive time at your burdened rate. Worked example, why density matters, and how it sets your minimum charge.",
    updated: "2026-10-01",
    readingMinutes: 6,
    category: "costs",
    relatedTools: ["trip-cost-calculator", "flat-rate-calculator", "labor-burden-calculator"],
    relatedGuides: ["minimum-service-charge", "flat-rate-vs-hourly", "effective-hourly-rate"],
    faqs: [
      {
        q: "What is a truck roll?",
        a: "Field-service shorthand for one site visit: a tech and a vehicle dispatched to a customer. Its cost is the vehicle's share of the day plus the drive time the trip carries at your burdened labor rate — usually the larger half, and the one no fuel receipt shows.",
      },
      {
        q: "How do you calculate the cost of a truck roll?",
        a: "Split the day across its calls. With $28 of vehicle cost, 50 minutes of driving and 4 calls: each trip carries $7 of vehicle and about 12.5 minutes of $38 labor ($7.92) — a true cost of about $14.92 per roll. Density is what makes trips cheap: the same tech on 2 cross-town calls roughly doubles it.",
      },
      {
        q: "Should my minimum service charge be higher than my trip cost?",
        a: "Yes, comfortably. If a customer cancels after you've rolled, the trip is your only revenue opportunity on the visit — a minimum below the true trip cost means a canceled call loses money. Build the minimum from trip cost plus your smallest diagnostic block.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Ask what a service visit costs and the answer is usually a fuel number. It's the most visible cost and the smallest one. A trip spends two things: the vehicle's share of the working day, and the drive time of the person in it — time paid at a burdened rate and recovered by nothing, because no invoice line says 'windshield'.",
      },
      { type: "h2", text: "The split" },
      {
        type: "ul",
        items: [
          "Vehicle per call = daily vehicle cost ÷ calls per day",
          "Drive labor per call = (daily drive minutes ÷ 60) ÷ calls per day × burdened hourly cost",
          "Trip cost = vehicle per call + drive labor per call",
        ],
      },
      {
        type: "p",
        text: "A suburban service day: $28 of vehicle cost (fuel, wear, insurance share), 50 minutes of total driving, four calls, a $38 burdened rate. Each trip carries $7 of vehicle and 12.5 minutes of labor — $7.92. The true truck roll cost is $14.92. The fuel receipt said $7; it was half right.",
      },
      {
        type: "table",
        caption: "The same day, three densities",
        headers: ["Calls per day", "Vehicle/call", "Drive labor/call", "Trip cost"],
        rows: [
          ["6 (dense route)", "$4.67", "$5.28", "$9.95"],
          ["4 (typical)", "$7.00", "$7.92", "$14.92"],
          ["2 (cross-town)", "$14.00", "$15.83", "$29.83"],
        ],
      },
      {
        type: "p",
        text: "Density, not distance, is the variable that matters. Halving the driving on the same day — tighter routing, batching by area, fewer supplier runs mid-route — moves the trip cost nearly in half. At 900 trips a year, the difference between the middle and bottom rows is about $13,400 of annual cost that no price increase would ever recover as cleanly.",
      },
      { type: "h2", text: "Where the number goes" },
      {
        type: "ul",
        items: [
          "The trip line in the Flat Rate Calculator — replacing the guess with the true cost.",
          "The call-out minimum — it must exceed the trip cost, or a canceled call loses money.",
          "Zone pricing — far suburbs carry a higher trip cost, and the price can say so.",
          "The effective hourly rate — trips are unpaid hours, and this prices them.",
        ],
      },
      {
        type: "callout",
        text: "The trip cost exists whether or not you charge for it. The only choice is who pays: the customer through a stated fee or zoned rates, or the job's margin invisibly. The worst option is the one where nobody decided.",
      },
      {
        type: "ctaTool",
        slug: "trip-cost-calculator",
        label: "Cost your trips with the truck roll calculator",
      },
    ],
  },
  {
    slug: "rework-and-warranty-cost",
    title: "The Cost of Rework: A Job You Do Twice and Get Paid Once For",
    description:
      "Callbacks are the most expensive work you do: full cost, zero revenue. How to price the drag from your own callback rate — and what actually reduces it.",
    metaTitle: "The Cost of Rework & Callbacks — Margin Drag, Priced",
    metaDescription:
      "A callback costs the redo plus the return trip while earning nothing. See the annual cost formula, the margin drag it adds to every quote, and the fixes that work.",
    updated: "2026-10-01",
    readingMinutes: 7,
    category: "pricing",
    relatedTools: ["warranty-cost-calculator", "job-profitability-calculator", "target-margin-calculator"],
    relatedGuides: ["job-costing", "what-margin-should-i-target", "how-to-price-a-job"],
    faqs: [
      {
        q: "What does a callback really cost?",
        a: "The redo plus the return visit, against zero new revenue. On a $1,200 job, a 20%-of-price redo is $240 — more than half the job's $450 profit. At a 3% callback rate across 144 jobs a year, that's about $1,037 annually and 0.6 margin points dragged off everything quoted.",
      },
      {
        q: "How much margin should I add for warranty work?",
        a: "What your own rate produces: margin drag = redo cost × callback rate ÷ job price. A blanket cushion without the rate either overcharges (low rework) or under-recovers (high rework). The systematic fix — finding why jobs come back — beats any cushion.",
      },
      {
        q: "What reduces callback rates fastest?",
        a: "In order: find the systematic cause (the same detail failing on repeat jobs is a process problem), inspect before handover when fixes cost minutes instead of trips, document what was installed, and write the warranty term narrowly — covered parts, duration, what voids it.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Every trade business keeps two sets of books, and only one of them is on paper. The second records the jobs that came back: the door that wouldn't latch, the fitting that wept, the client who 'just had a quick question' that turned into an afternoon. That book is invisible on the invoice, and it's the most expensive work the business does — full cost, zero revenue.",
      },
      { type: "h2", text: "The arithmetic of a callback" },
      {
        type: "p",
        text: "Redoing a job rarely costs the whole job. Materials often survive; labor rarely does. A practical estimate is the redo as a share of job price — commonly 15–25% — plus the return trip's diagnostics. On a $1,200 job with $750 of variable cost and a $450 profit, a 20% redo is $240: a callback job earns $210 instead of $450. More than half the profit, gone to a free visit.",
      },
      {
        type: "table",
        caption: "Annual cost at 144 jobs a year",
        headers: ["Callback rate", "Callbacks/yr", "Annual cost", "Margin drag"],
        rows: [
          ["2%", "2.9", "$691", "0.4 pts"],
          ["3%", "4.3", "$1,037", "0.6 pts"],
          ["10%", "14.4", "$3,456", "2.0 pts"],
        ],
      },
      {
        type: "p",
        text: "The last column is the number to internalize: margin drag is the share of revenue callbacks consume, and every quote carries it whether or not that particular job comes back. At a healthy 2–3% it's less than a point — real but small. At 10%, it's two full margin points, the difference between a 30% margin shop and a 32% one, given away without a single discount being offered.",
      },
      { type: "h2", text: "The fixes, in order of leverage" },
      {
        type: "ul",
        items: [
          "Find the systematic cause. The same detail failing on repeat jobs is a process problem wearing a costume of bad luck.",
          "Inspect before handover. The same defect costs minutes in the final walkthrough and a truck roll two weeks later.",
          "Document the install. Photos and notes settle most warranty disputes before they become visits.",
          "Write the term narrowly. What's covered, for how long, and what voids it — an unbounded verbal 'we'll take care of it' is a blank check.",
        ],
      },
      {
        type: "p",
        text: "None of that shows up as a line item. The way it enters pricing is through the target: if the callback rate is structurally 10%, the margin the business requires is 2 points higher than a clean-shop arithmetic suggests — the Target Gross Margin Calculator can absorb the drag into the requirement itself, and the quotes will carry it honestly instead of the books absorbing it silently.",
      },
      {
        type: "callout",
        text: "Track callbacks for one quarter: date, job, cause, cost. Most owners find one or two causes produce most of the visits — which makes the fix a Tuesday afternoon, not a company-wide quality program.",
      },
      {
        type: "ctaTool",
        slug: "warranty-cost-calculator",
        label: "Price your callback rate with the rework cost calculator",
      },
    ],
  },
  {
    slug: "quote-win-rate",
    title: "Quote Win Rate: The Number That Tells You Whether to Fix Price or Pipeline",
    description:
      "A high win rate with thin revenue means prices are too low. A low one means wrong leads or slow follow-up. The win rate — and its value split — says which.",
    metaTitle: "Quote Win Rate for Contractors — What Yours Is Telling You",
    metaDescription:
      "How to calculate quote win rate, why the value split matters more than the count, and what estimating time per won job says about your sales cost.",
    updated: "2026-10-01",
    readingMinutes: 6,
    category: "pricing",
    relatedTools: ["quote-win-rate-calculator", "job-pricing-calculator", "effective-hourly-rate-calculator"],
    relatedGuides: ["how-to-write-an-estimate", "what-a-discount-costs", "effective-hourly-rate"],
    faqs: [
      {
        q: "What is a good quote win rate?",
        a: "There's no universal number — it's a diagnosis. Very high with thin revenue means prices are too low; very low with good prices means wrong leads, slow follow-up, or quotes that take weeks. The useful benchmark is your own trend, tracked monthly while the data is thin.",
      },
      {
        q: "Why track value won separately from jobs won?",
        a: "Because they disagree usefully: winning 6 of 10 quotes sounds healthy until the six were the small ones — a 60% count rate hiding a 25% value rate. The value split distinguishes a pricing problem (big jobs specifically are lost) from a lead or follow-up problem (everything is lost evenly).",
      },
      {
        q: "How do I raise my win rate without cutting prices?",
        a: "Qualify harder before writing (a deleted junk lead costs nothing; a quoted one costs your hourly rate times the hours), follow up within a day, include what competitors leave out — timeline, exclusions, warranty — so customers compare documents instead of totals, and quote fewer things better.",
      },
    ],
    body: [
      {
        type: "p",
        text: "The quote pipeline is the one part of a trade business that almost nobody measures and everybody worries about. Quotes go out; some come back as jobs; the rest vanish into a silence that gets attributed to 'the market'. Two numbers turn that silence into signal — and they point at different problems.",
      },
      { type: "h2", text: "The two rates" },
      {
        type: "ul",
        items: [
          "Count win rate = jobs won ÷ quotes sent",
          "Value win rate = value won ÷ value quoted",
        ],
      },
      {
        type: "p",
        text: "A remodeler sends 10 quotes a month at an average $1,200 and wins 3 — a 30% count rate, $3,600 of $12,000 quoted. The value rate is also 30% here because the wins and losses average out. Now suppose the three wins were $600 jobs and the losses were all $1,500+: the count rate still reads 30%, but the value rate collapses toward 15%. Same count, different disease — and only the value split shows it.",
      },
      {
        type: "table",
        caption: "What each pattern points at",
        headers: ["Pattern", "Likely cause", "Fix"],
        rows: [
          ["High count rate, thin revenue", "Prices too low", "Raise prices — the win rate is the proof there's headroom"],
          ["Low count rate, even losses", "Lead quality or slow follow-up", "Qualify harder; respond same-day"],
          ["Low value rate, decent count rate", "Losing specifically the big jobs", "Review how larger scopes are priced and presented"],
        ],
      },
      { type: "h2", text: "What estimating costs" },
      {
        type: "p",
        text: "Quotes are unpaid sales work with a measurable price. At 1.5 hours and a $45 burdened rate, each quote costs $67.50 to produce — which makes the remodeler's month: $675 of estimating labor, $225 per job won, and $5,670 a year spent on quotes that said no. That's a customer-acquisition cost hiding inside admin time, and it's the honest argument for qualifying before quoting: the cheapest quote is the one you correctly never wrote.",
      },
      { type: "h2", text: "The two cheap levers" },
      {
        type: "ul",
        items: [
          "Speed of response — being the first professional reply wins more jobs than being the cheapest bid, and costs nothing.",
          "Document quality — a quote that states timeline, exclusions and warranty terms gets compared as a document, not a total, which is where price-shoppers stop being price-shoppers.",
        ],
      },
      {
        type: "callout",
        text: "Measure one month honestly before changing anything: quotes out, wins, values, hours per quote. The pattern will tell you which conversation to have — pricing, pipeline, or process — instead of guessing at all three.",
      },
      {
        type: "ctaTool",
        slug: "quote-win-rate-calculator",
        label: "Run your pipeline through the quote win rate calculator",
      },
    ],
  },
  {
    slug: "buy-vs-rent",
    title: "Buy or Rent Equipment? The Break-Even Days of Use Decide It",
    description:
      "The purchase price is the misleading part of the decision. What matters is capital recovery per year, the per-day cost of owning, and the days you'll honestly use it.",
    metaTitle: "Buy vs. Rent Equipment — The Break-Even Days Formula",
    metaDescription:
      "When does buying equipment beat renting? The break-even days formula, what counts as the cost of owning a day, and the traps that make owning look artificially cheap.",
    updated: "2026-10-01",
    readingMinutes: 6,
    category: "costs",
    relatedTools: ["buy-vs-rent-calculator", "overhead-calculator", "break-even-calculator"],
    relatedGuides: ["general-contractor-markup", "overtime-cost", "truck-roll-cost"],
    faqs: [
      {
        q: "How do I calculate when buying beats renting?",
        a: "Break-even days = (price ÷ working life) ÷ (rental rate − daily ownership cost). A $3,200 tool with a 6-year life, $12/day of wear and $65/day rental: $533 ÷ $53 = about 11 days a year. Use it more than that and owning wins.",
      },
      {
        q: "What counts as the daily cost of owning?",
        a: "Costs that scale with days on the tools: fuel, wear, consumables, blades and bits. Storage, insurance and depreciation-while-sitting run year-round and belong in overhead — counting them per day here and again in overhead double-counts them and makes owning look artificially cheap.",
      },
      {
        q: "What does the calculation leave out?",
        a: "Capability and cash. Owning means the tool is there on the surprise Saturday job and financed through the quiet months; renting means flexibility and zero shelf. Resale value softens ownership's true cost, which the working-life input handles roughly.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Equipment decisions get made emotionally at exactly the moment they should be made arithmetically: a job needs a tool, the rental quote is annoying, and the showroom is seductive. The honest version of the decision needs three numbers — what the purchase costs per year of its real life, what a day of use costs, and how many days a year it will honestly work.",
      },
      { type: "h2", text: "The break-even" },
      {
        type: "ul",
        items: [
          "Capital per year = purchase price ÷ working life",
          "Break-even days = capital per year ÷ (rental rate − daily ownership cost)",
        ],
      },
      {
        type: "p",
        text: "A plumbing business eyes a $3,200 drain auger. Six years of realistic life puts capital recovery at $533 a year. A day of use costs about $12 in fuel, wear and consumables; the yard rents the same auger for $65. Break-even: $533 ÷ ($65 − $12) = 10.1 — about 11 days a year. Below that, renting wins; above it, buying does.",
      },
      {
        type: "table",
        caption: "The auger at three usage levels",
        headers: ["Days/year", "Annual owning", "Annual renting", "Winner"],
        rows: [
          ["5", "$593", "$325", "Renting by $268"],
          ["11 (break-even)", "$665", "$715", "≈ even"],
          ["30", "$893", "$1,950", "Buying by $1,057"],
        ],
      },
      {
        type: "p",
        text: "Note what owning's daily cost does at low usage: at 5 days a year, the auger costs $119 per day of actual work — more than renting, because capital recovery doesn't care whether you used it. The rental day is paying for the yard's overhead too, which is why it's dearer per day but safer at low volume.",
      },
      { type: "h2", text: "The two classic traps" },
      {
        type: "ul",
        items: [
          "Charging the whole purchase to year one, which makes renting look unbeatable and delays buying tools the calendar justifies.",
          "Counting year-round costs — storage, insurance — per day of use here and again in overhead, which makes owning look artificially cheap.",
        ],
      },
      {
        type: "callout",
        text: "The rule of thumb the math supports: buy what rides on the truck every day, rent what comes down twice a year, and let the break-even number decide the gray zone — not the showroom.",
      },
      {
        type: "ctaTool",
        slug: "buy-vs-rent-calculator",
        label: "Find your break-even with the buy vs rent calculator",
      },
    ],
  },
  {
    slug: "late-payment-cost",
    title: "The Cost of Slow Payment: Every Day Past Terms Is a Loan You Made",
    description:
      "An invoice paid 45 days late is credit you extended at your cost of money, not the customer's. How to price it, and the levers that actually shorten the float.",
    metaTitle: "The Cost of Late Payments — Financing the Float, Priced",
    metaDescription:
      "What slow payment really costs: invoice × your annual rate × days late ÷ 365. Worked example, the prompt-pay discount math, and the levers that shorten the float.",
    updated: "2026-10-01",
    readingMinutes: 6,
    category: "pricing",
    relatedTools: ["payment-terms-calculator", "target-margin-calculator", "discount-impact-calculator"],
    relatedGuides: ["what-margin-should-i-target", "what-a-discount-costs", "when-to-raise-prices"],
    faqs: [
      {
        q: "How much does a late payment really cost?",
        a: "Invoice × your annual cost of money × days late ÷ 365. A $2,500 invoice paid 45 days past net-30 at a 20% rate costs $61.64 — about 2.5% of the invoice, in pure margin, for zero work. Across a book of 60 such invoices, that's $3,698 a year.",
      },
      {
        q: "What rate should I use as my cost of money?",
        a: "Your actual marginal cost: the overdraft or credit-line rate if you run one, or what idle cash could reasonably earn if you're debt-free — plus the risk of the receivable itself. It is never zero: money in someone else's account is money not working in yours.",
      },
      {
        q: "Are early-payment discounts worth offering?",
        a: "Compute the implied rate first: 2/10 net 30 gives up 2% of the invoice to move cash 20 days earlier — an implied annual rate of (2 ÷ 98) × (365 ÷ 20) ≈ 37%. Taking such discounts from your own suppliers is usually sound; offering them is expensive unless your cost of money is genuinely brutal.",
      },
    ],
    body: [
      {
        type: "p",
        text: "The most patient lender a small business has is itself. Every invoice sitting past terms is credit extended to the customer — unsecured, at your cost of money, with no agreement that anyone signed. The books record it as 'receivable'; the reality is a loan the business never decided to make.",
      },
      { type: "h2", text: "Pricing the loan" },
      {
        type: "p",
        text: "Financing cost = invoice × annual rate × (days late ÷ 365). A $2,500 invoice on net-30 that pays at 75 days, with money costing 20% a year: $2,500 × 0.20 × (45 ÷ 365) = $61.64. That's 2.5% of the invoice — on a job priced at a 30% margin, better than a twelfth of its profit, gone to financing someone else's cash flow.",
      },
      {
        type: "table",
        caption: "The same delay, scaled across a year's book",
        headers: ["Line", "Calculation", "Amount"],
        rows: [
          ["Cost per invoice", "$2,500 × 0.20 × 45/365", "$61.64"],
          ["Annual drag, 60 invoices", "60 × $61.64", "$3,698.40"],
          ["Working capital tied up", "$2,500 × (75 ÷ 365) × 60", "$30,821.92"],
        ],
      },
      {
        type: "p",
        text: "The last row is the quieter problem: at any moment, thirty thousand dollars the business earned is sitting in customers' accounts, financing their operations. Every rate rise, fuel increase and insurance renewal is paid out of cash the business has already earned but not been paid.",
      },
      { type: "h2", text: "The levers, in order of power" },
      {
        type: "ul",
        items: [
          "Deposits on long jobs — 30–50% up front removes most of the float before it exists.",
          "Payment on completion instead of net terms, wherever the customer type allows it.",
          "Invoice the day of completion — an invoice sent end-of-month silently adds weeks.",
          "A stated late fee, actually applied. A fee that never gets applied is a suggestion, and suggestions don't collect.",
        ],
      },
      { type: "h2", text: "The discount, both directions" },
      {
        type: "p",
        text: "Prompt-pay math is asymmetric. Offering 2/10 net 30 to customers gives up 2% to accelerate cash 20 days — an implied 37% annual rate, expensive unless money is truly brutal. Taking the same discount from your own suppliers is the mirror image: paying early at an implied 37% return is better than almost anything the cash was doing. Take them when offered; offer them sparingly.",
      },
      {
        type: "callout",
        text: "The customers worth keeping don't need 90 days. The ones who do are financing their business with yours — and the conversation to have is terms, not a price rise that makes every customer pay for one account's habits.",
      },
      {
        type: "ctaTool",
        slug: "payment-terms-calculator",
        label: "Price your payment terms with the late payment calculator",
      },
    ],
  },
];
