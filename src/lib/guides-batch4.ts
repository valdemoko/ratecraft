import type { Guide } from "./guides";

/**
 * Phase 9 editorial batch — five guides, each paired with one of the five new
 * calculators (effective hourly rate, change orders, target margin, materials
 * markup, price increases). Every numeric example is reproduced in
 * tests/math-verification.mjs (sections 14–18 and the guide checks below).
 */
export const phase9Guides: Guide[] = [
  {
    slug: "effective-hourly-rate",
    title: "Effective Hourly Rate: What Your Hour Actually Pays After the Unpaid Work",
    description:
      "The rate per on-site hour flatters every job. The effective hourly rate — profit divided by every hour the job takes, paid or not — is the one your year lives on.",
    metaTitle: "Effective Hourly Rate — The Real Rate After Unpaid Time",
    metaDescription:
      "Your effective hourly rate is job profit divided by all hours: on-site work plus quoting, travel, pickups and invoicing. See the formula and a full worked job.",
    updated: "2026-10-01",
    readingMinutes: 7,
    category: "costs",
    relatedTools: ["effective-hourly-rate-calculator", "hourly-rate-calculator", "labor-burden-calculator"],
    relatedGuides: ["billable-hours-and-income-goal", "how-to-calculate-labor-burden", "when-to-raise-prices"],
    faqs: [
      {
        q: "What is an effective hourly rate?",
        a: "Gross profit on a job divided by every hour the job takes from you — on-site work plus the quoting, material runs, travel, cleanup and invoicing it causes. It is the honest counterpart to the rate per billed hour, which divides by on-site time only and always flatters the job.",
      },
      {
        q: "How do I calculate my effective hourly rate?",
        a: "Take the job's revenue, subtract every cost (burdened labor, materials, subs, vehicle), then divide the profit by total hours: on-site hours plus unbillable hours. A $3,200 job that costs $1,852 and takes 24 on-site plus 6 unpaid hours earns $1,348 ÷ 30 = $44.93 per real hour — even though the on-site rate reads $56.17.",
      },
      {
        q: "What is a good effective hourly rate?",
        a: "One that clears the floor from your own arithmetic: income goal plus expenses divided by billable hours for the year. If that floor is $60, a job paying $45 effective is below the line no matter how good its margin looks — the fix is price, cost, or fewer unpaid hours, not more of those jobs.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Ask a contractor what a job paid and you'll usually get the on-site rate: profit divided by the hours on the tools. It's a natural way to think, and it's wrong in one specific direction — it always flatters the job. The quoting, the supply run, the drive, the photos, the invoice: all of it is work the job caused, none of it is on the invoice, and the rate that divides by on-site hours alone pretends it's free.",
      },
      { type: "h2", text: "The two rates, precisely" },
      {
        type: "ul",
        items: [
          "On-site rate = gross profit ÷ on-site hours. The flattering number.",
          "Effective hourly rate = gross profit ÷ (on-site hours + unbillable hours). The real one.",
        ],
      },
      {
        type: "p",
        text: "A worked day makes the gap concrete. A solo carpenter finishes a $3,200 deck repair: 24 hours on site at a $38 burdened cost, $900 of lumber and fixings, $40 of fuel. The quoting visit, two supply runs, travel and invoicing add up to another 6 hours nobody billed. Labor costs $912, so total cost is $912 + $900 + $40 = $1,852 and profit is $1,348 — a healthy 42.1% margin.",
      },
      {
        type: "table",
        caption: "The same job, measured two ways",
        headers: ["Measure", "Calculation", "Rate"],
        rows: [
          ["On-site rate", "$1,348 ÷ 24 hrs", "$56.17/hr"],
          ["Effective rate", "$1,348 ÷ 30 hrs", "$44.93/hr"],
        ],
      },
      {
        type: "p",
        text: "Six unpaid hours cut the rate by $11.24 — nearly 20% — and no invoice ever showed it. This is why jobs can feel busy and pay thin at the same time: the margin is fine, but the unpaid hours are eating the rate inside it.",
      },
      { type: "h2", text: "Where the unpaid hours hide" },
      {
        type: "ul",
        items: [
          "The estimate — including the quoting visits that don't turn into work at all.",
          "Pickup runs, especially the second and third trip a job causes.",
          "Travel between site, supplier and home.",
          "Cleanup beyond what you bill for.",
          "Photos, invoicing, and the follow-up call to get paid.",
          "Rework — always unpaid, occasionally enormous.",
        ],
      },
      {
        type: "p",
        text: "The honest way to size these is to log one job end to end. Most owners who do it once find 20–30% of a job's true hours were never on the timesheet, which is exactly the share of the rate that was quietly missing from their pricing conversations.",
      },
      { type: "h2", text: "What to do with the number" },
      {
        type: "p",
        text: "Compare the effective rate against your floor — the rate the Hourly Rate Calculator produces from your income goal, expenses and billable hours. Jobs above the floor deserve more of your year; jobs below it need one of four fixes: a higher price, lower direct costs, less unpaid time (batch pickups, charge for travel, quote faster), or denser scheduling so trip time collapses. Working more of those hours at the same rate changes nothing about the rate — it just buys you more of it.",
      },
      {
        type: "callout",
        text: "Margin and effective rate answer different questions. Margin says how much of the price survives costs. Effective rate says what each real hour paid. A fat margin on a small, trip-heavy job can pay less per hour than a thin margin on a dense day — judge repeat work by the rate, not the percentage.",
      },
      {
        type: "ctaTool",
        slug: "effective-hourly-rate-calculator",
        label: "Run a real job through the effective hourly rate calculator",
      },
    ],
  },
  {
    slug: "change-orders-and-margin",
    title: "Change Orders: Pricing Extra Work Without Giving the Margin Away",
    description:
      "The extra work costs $432. The change order is $720. The difference is the margin the job was priced to carry — and the most commonly donated money in contracting.",
    metaTitle: "Change Orders and Margin — How to Price Extra Work",
    metaDescription:
      "Price a change order so the whole job keeps its margin: the formula, a worked example, the cost-plus trap, and the paperwork that makes it stick.",
    updated: "2026-10-01",
    readingMinutes: 7,
    category: "pricing",
    relatedTools: ["change-order-calculator", "job-pricing-calculator", "job-profitability-calculator"],
    relatedGuides: ["job-costing", "how-to-write-an-estimate", "markup-vs-margin"],
    faqs: [
      {
        q: "How do I calculate a change order price?",
        a: "Add the extra work's true cost to the job's cost base, then reprice the whole base to the job's original margin: (original cost + extra cost) ÷ (1 − margin), minus the price already quoted. On a $6,000 job priced at 40% margin with $432 of extra cost: ($4,032 ÷ 0.60) − $6,000 = $720.",
      },
      {
        q: "Should a change order include profit?",
        a: "Yes. The extra work consumes overhead, crew capacity and carries the same risk as the original scope. Billing cost alone donates the margin on that work — on the example above, $288 on one change order.",
      },
      {
        q: "When should a change order be signed?",
        a: "Before the extra work starts. A signed change order is a contract term; an agreed-after-the-fact one is a negotiation with your leverage already spent. Scope description, price and schedule impact, in writing, before the tools touch the new work.",
      },
    ],
    body: [
      {
        type: "p",
        text: "A remodeler is halfway through a $6,000 kitchen job — estimated to cost $3,600, priced at a 40% margin — when the customer asks for two pantry shelving units on top. Six extra hours at a $42 burdened rate, $180 of materials. The extra work costs $432. The instinctive answers are \"just bill the hours\" or \"call it $450.\" Both are wrong, and by the same mechanism: they price the change as if margin were a luxury the original contract already paid for.",
      },
      { type: "h2", text: "The margin-correct method" },
      {
        type: "p",
        text: "The original price wasn't cost plus a tip — it was cost priced to a margin. The change order should be built the same way: add the extra cost to the job's cost base, reprice the whole base to the same margin, and the difference is the change order.",
      },
      {
        type: "table",
        caption: "Worked example: the $432 change that invoices $720",
        headers: ["Step", "Calculation", "Amount"],
        rows: [
          ["Extra cost", "6 hrs × $42 + $180 materials", "$432.00"],
          ["New total cost", "$3,600 + $432", "$4,032.00"],
          ["Priced to the same margin", "$4,032 ÷ (1 − 0.40)", "$6,720.00"],
          ["Change order", "$6,720 − $6,000", "$720.00"],
          ["Margin check", "($6,720 − $4,032) ÷ $6,720", "40.0%"],
        ],
      },
      {
        type: "p",
        text: "Billing the $432 of cost alone would have handed the customer $288 — the profit the extra work should have earned. Do that a few times a year and it's a van payment. The margin check on the last row is the point of the method: after a correct change order, the whole job still carries the margin it was priced at.",
      },
      { type: "h2", text: "Why \"hourly on changes\" also dilutes" },
      {
        type: "p",
        text: "Billing extra work at your hourly rate — even a good one — prices it to a markup, not a margin, and usually a thinner one than the contract carries. On the example above, 6 hours at $85 would invoice $510: better than cost, but still $210 short of margin-correct, and the job's overall margin slides from 40% toward 36% without anyone noticing until the job costing check. If you prefer time-and-materials on changes, that's a legitimate policy — set the rate high enough that it lands on the margin, and write it into the contract.",
      },
      { type: "h2", text: "Deductions work the same way, in reverse" },
      {
        type: "p",
        text: "When the customer deletes scope, the credit is not the original line's price. Remove the deleted work's cost from the cost base and reprice the whole job to the same margin — crediting the line price would give back more than the work was ever worth to you, plus its margin twice.",
      },
      {
        type: "callout",
        text: "The paperwork rule: scope description, price, schedule impact — signed before the work starts. A change order agreed after the work is done trades all of your leverage for a promise, and the customer's memory of the conversation will be cheaper than yours.",
      },
      {
        type: "ctaTool",
        slug: "change-order-calculator",
        label: "Price a change order with the change order calculator",
      },
    ],
  },
  {
    slug: "what-margin-should-i-target",
    title: "What Gross Margin Should I Target? Work It Out, Don't Guess It",
    description:
      "Forum numbers — '30% is standard' — can't know your overhead or your income goal. The right target margin falls out of your own arithmetic in about four lines.",
    metaTitle: "What Gross Margin Should a Contractor Target? The Real Answer",
    metaDescription:
      "Your target gross margin is overhead plus owner income plus profit, each as a share of revenue. Worked example, the revenue trap, and what to do with the number.",
    updated: "2026-10-01",
    readingMinutes: 6,
    category: "pricing",
    relatedTools: ["target-margin-calculator", "overhead-calculator", "job-pricing-calculator"],
    relatedGuides: ["general-contractor-markup", "markup-vs-margin", "how-to-price-a-job", "when-to-raise-prices"],
    faqs: [
      {
        q: "What gross margin should a contractor target?",
        a: "The one your own numbers produce: overhead as a percentage of revenue, plus your income and net profit goal as a percentage of the same revenue. If overhead runs 22.4% of revenue and income plus profit needs another 22.4%, your floor is about 44.7% — a forum's '30%' isn't a benchmark, it's someone else's arithmetic.",
      },
      {
        q: "Should my own salary be in overhead or in the margin?",
        a: "In exactly one of them. If you pay yourself a wage that sits in fixed costs, it's overhead. If it isn't, it belongs in the net goal the margin must fund. In both places double-counts it; in neither is the most common way owners end up working for the business for free.",
      },
      {
        q: "Why does my required margin change when revenue changes?",
        a: "Overhead is fixed and revenue scales. The same $8,500 is 28% of a $30,000 month but 17% of $50,000 — so the margin you need falls as honest revenue rises. Discounting to buy volume moves both numbers the wrong way at once: revenue needed rises and the margin you collect falls.",
      },
    ],
    body: [
      {
        type: "p",
        text: "\"What margin should I aim for?\" gets answered on forums with numbers — 30%, 35%, \"whatever the market takes.\" None of those answers can be right in general, because the correct margin isn't a property of the trade. It's a property of two numbers only you have: what the business costs to run, and what it has to pay you.",
      },
      { type: "h2", text: "The four-line derivation" },
      {
        type: "ul",
        items: [
          "Overhead % = monthly overhead ÷ monthly revenue",
          "Net % = (owner income + target net profit) ÷ monthly revenue",
          "Required gross margin = Overhead % + Net %",
        ],
      },
      {
        type: "p",
        text: "A two-truck operation runs $8,500 a month of overhead. The owner needs $6,000 of income and wants $2,500 of profit on top — a $8,500 net goal. On realistic revenue of $38,000 a month: overhead is 22.4% of revenue, the net goal is another 22.4%, and the required gross margin is 44.7%.",
      },
      {
        type: "p",
        text: "Now the uncomfortable part — the check. If that business's quotes currently carry 32%, the gap is 12.7 margin points. At $38,000 of revenue that's about $4,840 a month that exists in the plan but not in the accounts: roughly $605 per job across eight jobs. The pricing wasn't 'fine with a bit of profit' — it was structurally below the business's own arithmetic, every month.",
      },
      { type: "h2", text: "Closing the gap" },
      {
        type: "p",
        text: "On the same costs, the price increase that lifts a 32% margin to 44.7% is (1 − 0.32) ÷ (1 − 0.447) − 1 = 23.0%. That's a big correction, and whether the market pays it is the real question. If it won't, the honest alternatives are the only three that exist: cut overhead, raise revenue at the current margin, or accept a knowingly smaller profit goal. What isn't honest is carrying on at a margin the arithmetic has already voted down.",
      },
      {
        type: "table",
        caption: "The same overhead at different revenue — why growth lowers the bar",
        headers: ["Monthly revenue", "Overhead %", "Net goal %", "Required margin"],
        rows: [
          ["$30,000", "28.3%", "28.3%", "56.7%"],
          ["$38,000", "22.4%", "22.4%", "44.7%"],
          ["$50,000", "17.0%", "17.0%", "34.0%"],
        ],
      },
      { type: "h2", text: "Where the number goes" },
      {
        type: "p",
        text: "The required margin is the target margin for every price you build: the Job Pricing and Flat Rate calculators divide total cost by (1 − margin), which prices to this number correctly. Then audit real quotes against it with the Margin Calculator — a requirement that live quotes don't carry is a plan, not a practice.",
      },
      {
        type: "callout",
        text: "A margin target is a floor, not a strategy. Jobs can and should earn more than it where the market allows — the floor is what the worst job you take must still carry.",
      },
      {
        type: "ctaTool",
        slug: "target-margin-calculator",
        label: "Derive your required margin with the target margin calculator",
      },
    ],
  },
  {
    slug: "materials-markup",
    title: "Materials Markup: Claim the Discount, Price the Freight, Then Mark Up",
    description:
      "Most material lines are priced on the list price — which means the trade discount is never claimed and freight is eaten. The markup should sit on net cost.",
    metaTitle: "Materials Markup for Contractors — Net Cost, Not List Price",
    metaDescription:
      "Mark up net cost — list less your trade discount, plus freight — not the sticker price. See the formula, a worked tile order, and the double-counting trap.",
    updated: "2026-10-01",
    readingMinutes: 6,
    category: "pricing",
    relatedTools: ["materials-markup-calculator", "job-pricing-calculator", "markup-calculator"],
    relatedGuides: ["markup-vs-margin", "how-to-price-a-job", "what-margin-should-i-target"],
    faqs: [
      {
        q: "What should the markup base be for materials?",
        a: "Net cost: list price minus your trade or account discount, plus freight to site. A 35% markup on $1,035 of net cost produces $362 of profit; the same 35% on the $1,100 list price produces only $262 — the unclaimed discount, given away by the base you chose.",
      },
      {
        q: "How much should I mark up materials?",
        a: "Commonly 20–50% on net cost depending on trade and handling. The honest way to set it: total what materials actually cost you beyond the invoice — storage, handling, returns, warranty risk, the cash float while the customer pays — and make sure the markup covers it.",
      },
      {
        q: "Can I apply a materials markup and a job margin on top?",
        a: "Not to the same dollars. If materials carry a 35% markup and the whole job then carries a 35% margin including the marked-up price, the parts earn profit twice. Choose a structure: markup inside the material line with margin on the rest, or cost-only materials with one margin over the job.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Materials get priced worse than any other line, and it's rarely the markup's fault. The two failures happen before the markup is ever applied: the trade discount is never claimed, so the base is the sticker price; and freight gets eaten, so delivery is a donation. Both are silent — the price still looks like a price, and the money leaves through a door nobody watches.",
      },
      { type: "h2", text: "The base is net cost" },
      {
        type: "p",
        text: "A tiler buys a tile order with a $1,100 list price on a 10% trade account, with $45 of freight to site. The correct base is the cost of having the material on site: $1,100 − $110 + $45 = $1,035. A 35% markup on that base prices the material at $1,397.25 — $362.25 of profit, a 25.9% margin, and an effective 1.27× on list.",
      },
      {
        type: "table",
        caption: "Same markup, two bases",
        headers: ["Base", "Price at 35%", "Profit", "Margin"],
        rows: [
          ["Net cost $1,035 (discount claimed, freight in)", "$1,397.25", "$362.25", "25.9%"],
          ["List price $1,100 (discount ignored, freight eaten)", "$1,485.00", "$262.50 on markup — freight still unpaid", "lower"],
        ],
      },
      {
        type: "p",
        text: "The second row looks like a bigger number and delivers less money, because $45 of freight comes back out and the discount was never real to begin with. Marking up the net cost — freight included — is what makes the markup worth applying at all.",
      },
      { type: "h2", text: "What the markup is actually for" },
      {
        type: "p",
        text: "A materials markup isn't free money on the invoice; it's the price of services the customer doesn't see: storage until the job needs it, handling and waste, the returns run, standing behind a defective fixture, and the float while the customer pays you long after you paid the supplier. A markup that only covers the invoice loses money on every part you touch — quietly, at scale.",
      },
      { type: "h2", text: "The multiplier, decoded" },
      {
        type: "p",
        text: "Customers and competitor quotes talk in multipliers — \"parts at 2×.\" Your equivalent number is price ÷ list cost. A 100% markup on heavily discounted net cost can legitimately be 2.2× on list; a 35% markup on full-list net cost might be 1.3×. Knowing your own multiplier matters when a customer waves a rival quote: matching \"2× parts\" without checking your base either overprices you or underprices you — the base decides which.",
      },
      { type: "h2", text: "Don't count the profit twice" },
      {
        type: "p",
        text: "The classic double-count: mark materials up 35% inside the estimate, then apply a 35% target margin to the whole job — marked-up materials included. The parts earn profit twice and the price starts scaring people off. Pick one structure and hold it: markup inside the material line with margin on the rest, or cost-only materials with a single margin across the job. The Job Pricing Calculator uses the second; this calculator exists for the first.",
      },
      {
        type: "ctaTool",
        slug: "materials-markup-calculator",
        label: "Price a material line with the materials markup calculator",
      },
    ],
  },
  {
    slug: "when-to-raise-prices",
    title: "When to Raise Your Prices — and How Much You Can Afford to Lose",
    description:
      "A price increase is the only lever that adds profit with no extra work. The arithmetic of what it's worth, and the attrition headroom it buys.",
    metaTitle: "When to Raise Prices as a Contractor — The Arithmetic",
    metaDescription:
      "What a price increase is really worth per job, month and year — and how many customers you could lose and still earn the same. Worked example with the full math.",
    updated: "2026-10-01",
    readingMinutes: 7,
    category: "pricing",
    relatedTools: ["price-increase-calculator", "target-margin-calculator", "discount-impact-calculator"],
    relatedGuides: ["what-a-discount-costs", "what-margin-should-i-target", "billable-hours-and-income-goal"],
    faqs: [
      {
        q: "How much does an 8% price increase add in profit?",
        a: "The whole increase lands in profit, because no cost moves. Twelve jobs a month at a $1,200 average with $750 of cost: profit per job rises from $450 to $546, which is $1,152 a month and $13,824 a year — from the same work, same trips, same materials.",
      },
      {
        q: "How many customers can I lose and still break even on a raise?",
        a: "Jobs you can lose = jobs × (1 − old profit ÷ new profit). On the example above: 12 × (1 − 450 ÷ 546) = 2.1, so two of twelve customers could decline the new price and total profit would be unchanged — with 17.6% less work, fewer trips and less risk.",
      },
      {
        q: "When is the right time to raise prices?",
        a: "When the numbers say so, not when frustration does: an annual cost review showing overhead up, a required margin your quotes no longer carry, or job costing that shows systematic underestimating. Apply it to new quotes only — signed work keeps its price.",
      },
    ],
    body: [
      {
        type: "p",
        text: "Every other profit lever costs something. More jobs cost hours; cheaper materials cost sourcing time; a new van costs money. A price increase is the one lever that adds profit with nothing added at all — no hours, no materials, no overhead. The catch is customer attrition, and the good news is that attrition is a number, not a fear: it can be calculated before you decide.",
      },
      { type: "h2", text: "The worth of a point" },
      {
        type: "p",
        text: "A handyman running 12 jobs a month at a $1,200 average — $750 of variable cost each, $450 profit — is fully booked and still not getting ahead. An 8% increase moves the average price to $1,296; profit per job to $546. Twelve jobs a month: $1,152 more. A year: $13,824, for no additional work whatsoever.",
      },
      {
        type: "table",
        caption: "The same month, repriced",
        headers: ["Measure", "Before", "After +8%"],
        rows: [
          ["Average price", "$1,200.00", "$1,296.00"],
          ["Profit per job", "$450.00", "$546.00"],
          ["Margin", "37.5%", "42.1%"],
          ["Monthly profit (12 jobs)", "$5,400.00", "$6,552.00"],
          ["Annual profit", "$64,800.00", "$78,624.00"],
        ],
      },
      { type: "h2", text: "The attrition headroom" },
      {
        type: "p",
        text: "How many customers can walk before the raise loses money? Jobs you can afford to lose = jobs × (1 − old profit ÷ new profit) = 12 × (1 − 450 ÷ 546) = 2.1. Two of twelve customers could refuse the new price and total profit would be exactly what it was — across ten jobs instead of twelve, with two jobs' worth of trips, admin and risk deleted from the year.",
      },
      {
        type: "p",
        text: "In practice the loss is rarely that high: the customers who leave over a working-price correction are usually the price-shoppers the raise quietly fires. The ones who stay are paying more per unit of your scarcest asset — an hour of you. The raise also lifts the margin from 37.5% to 42.1% on the same cost base.",
      },
      { type: "h2", text: "The discount, run in reverse" },
      {
        type: "p",
        text: "The same arithmetic points the other way, and it's brutal by comparison. An 8% discount on that same job cuts profit from $450 to $354 — a fifth of the profit gone — and you'd need 27% more jobs to earn the same money. An increase buys you 17.6% of slack; a discount of the same size sells 21.3% of your profit and demands more work to compensate. This asymmetry is why \"meet the competitor's price\" and \"hold your price\" are not two roads to the same place.",
      },
      {
        type: "callout",
        text: "The mechanics: new quotes only — signed work keeps its price. Give recurring customers notice before the next quote cycle. Announce it plainly: 'Our rates are increasing on [date]' needs no apology and no essay.",
      },
      { type: "h2", text: "The trigger, formalized" },
      {
        type: "p",
        text: "The disciplined version of this decision runs yearly: derive the margin the business requires (overhead plus income goal plus profit, over expected revenue), check what live quotes actually carry, and if there's a gap, size the increase that closes it. That converts 'I should probably charge more' from a feeling into a correction with a number attached — and a number can be scheduled, announced and defended.",
      },
      {
        type: "ctaTool",
        slug: "price-increase-calculator",
        label: "Run your month through the price increase calculator",
      },
    ],
  },
];
