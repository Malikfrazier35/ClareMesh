"use client";
import { Suspense } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const H2 = { fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, lineHeight: 1.3, color: "var(--cm-text-panel-h)", marginTop: 40, marginBottom: 16 };
const P = { fontSize: 16, lineHeight: 1.8, color: "var(--cm-text-panel-h)", marginBottom: 20 };
const INLINE_CODE = { fontFamily: F.m, fontSize: 14, padding: "1px 6px", background: "var(--cm-terminal)", border: "0.5px solid var(--cm-border-light)", color: "var(--cm-text-panel-h)" };
const LINK = { color: "var(--cm-slate)", textDecoration: "underline", textUnderlineOffset: "3px" };
const UL = { fontSize: 16, lineHeight: 1.8, color: "var(--cm-text-panel-h)", marginBottom: 20, paddingLeft: 24 };

function MonthEndPost() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", borderBottom: "0.5px solid var(--cm-border-light)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 15, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
        <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
          <a href="/docs" style={{ color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Docs</a>
          <a href="/playground" style={{ color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Playground</a>
          <a href="/blog" style={{ color: "var(--cm-text-panel-h)", textDecoration: "none", fontWeight: 500 }}>Blog</a>
          <a href="/signup" style={{ color: "var(--cm-slate)", textDecoration: "none", fontWeight: 500 }}>Sign up</a>
        </div>
      </nav>

      <article style={{ maxWidth: 680, margin: "0 auto", padding: "48px 32px 96px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24, fontSize: 12 }}>
          <a href="/blog" style={{ color: "var(--cm-text-dim)", textDecoration: "none" }}>Blog</a>
          <span style={{ color: "var(--cm-text-dim)" }}>/</span>
          <span style={{ color: "var(--cm-text-panel-h)" }}>Finance Operations</span>
        </div>

        <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2.5, color: "var(--cm-copper)", marginBottom: 12 }}>FINANCE OPERATIONS</p>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 42, letterSpacing: -1.2, lineHeight: 1.1, color: "var(--cm-text-panel-h)", marginBottom: 16 }}>
          Why month-end close still takes 5 days in 2026
        </h1>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "var(--cm-text-dim)", marginBottom: 48, paddingBottom: 32, borderBottom: "0.5px solid var(--cm-border-light)" }}>
          <span style={{ fontFamily: F.m }}>April 23, 2026</span>
          <span>·</span>
          <span style={{ fontFamily: F.m }}>ClareMesh Engineering</span>
          <span>·</span>
          <span style={{ fontFamily: F.m }}>14 min read</span>
        </div>

        <p style={P}>
          It is Monday morning of close week. Somewhere in a company you know, a controller is staring at 17 open browser tabs: bank portal, credit card portal, expense tool, payroll system, AP ledger, AR aging report, the ERP, the consolidation spreadsheet, three different Slack threads with department heads who still owe her their accrual estimates, the CFO's email about last month's variance she never finished explaining, and — inexplicably — a PDF of a utility bill someone forwarded her at 11pm Friday.
        </p>
        <p style={P}>She has five business days to close the books.</p>
        <p style={P}>
          If you run finance in 2026, this scene is familiar. If you're a developer who has never been on the receiving end of month-end close, you probably wonder why it takes five days. How hard can it be to add up a month's worth of transactions?
        </p>
        <p style={P}>
          This post explains where the time actually goes. We'll walk through a realistic close calendar, identify the bottlenecks, and look at why most of them persist despite a decade of "automation" in finance software. At the end we'll explain what would actually need to be true for a one-day close to be feasible — and why the foundation has to be a unified data model, not another workflow tool.
        </p>

        <h2 style={H2}>The 5-day close, by the hour</h2>
        <p style={P}>
          A typical mid-market close (companies between $50M and $500M in revenue) runs 96 to 120 hours of calendar time across 5 business days. Here's where that time actually goes. These numbers come from a survey of 42 finance leaders we've talked to over the past year.
        </p>

        <div style={{ border: "0.5px solid var(--cm-border-light)", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "12px 16px", background: "var(--cm-terminal)", borderBottom: "0.5px solid var(--cm-border-light)" }}>
            <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-text-dim)" }}>PHASE</span>
            <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-text-dim)" }}>TIME</span>
            <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-text-dim)", textAlign: "right" }}>% OF TOTAL</span>
          </div>
          {[
            ["Data collection", "16-24 hours", "~20%"],
            ["Reconciliation", "24-32 hours", "~28%"],
            ["Accruals and adjusting entries", "12-18 hours", "~15%"],
            ["Intercompany eliminations", "8-12 hours", "~10%"],
            ["Review cycles", "16-20 hours", "~17%"],
            ["Reporting and variance analysis", "10-14 hours", "~10%"],
          ].map(([phase, time, pct], i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", padding: "10px 16px", borderBottom: i < 5 ? "0.5px solid var(--cm-border-light)" : "none", alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--cm-text-panel-h)" }}>{phase}</span>
              <span style={{ fontFamily: F.m, fontSize: 12, color: "var(--cm-text-panel-b)" }}>{time}</span>
              <span style={{ fontFamily: F.m, fontSize: 12, color: "var(--cm-copper)", textAlign: "right" }}>{pct}</span>
            </div>
          ))}
        </div>

        <p style={P}>
          Notice what's <em>not</em> a bottleneck: the actual arithmetic. Debits equal credits. Transactions add up. The computers have never been confused about that.
        </p>
        <p style={P}>
          The bottleneck is that the data arrives in different shapes from different systems on different schedules, and nothing in the stack treats it as the same object.
        </p>

        <h2 style={H2}>Bottleneck 1: Data collection (1-2 days)</h2>
        <p style={P}>
          Close starts with the finance team collecting everything that happened in the previous month. The challenge is not that the data doesn't exist — it does, somewhere, in some system. The challenge is that "somewhere" means 8 to 15 different places.
        </p>
        <p style={P}>A typical mid-market company's month-end data inventory looks like this:</p>
        <ul style={UL}>
          <li style={{ marginBottom: 8 }}><strong>Bank accounts</strong>: 3-8 accounts across 1-3 banks, each accessed through a different portal with a different export format</li>
          <li style={{ marginBottom: 8 }}><strong>Credit cards</strong>: corporate cards at 1-2 issuers, with their own portals and reports</li>
          <li style={{ marginBottom: 8 }}><strong>AP system</strong>: invoices entered into QuickBooks/NetSuite/Sage, but also a few still sitting in approvers' email inboxes</li>
          <li style={{ marginBottom: 8 }}><strong>AR system</strong>: invoices sent from the same ERP, plus any Stripe or payment processor revenue that hasn't been synced</li>
          <li style={{ marginBottom: 8 }}><strong>Payroll</strong>: ADP or Gusto or Rippling, with reports that don't match the GL account structure</li>
          <li style={{ marginBottom: 8 }}><strong>Expense reimbursements</strong>: Expensify or Ramp or Brex, in yet another format</li>
          <li style={{ marginBottom: 8 }}><strong>Inventory or COGS</strong>: a warehouse system for physical goods companies, cost accruals for SaaS companies</li>
          <li style={{ marginBottom: 8 }}><strong>Fixed assets and depreciation</strong>: usually a spreadsheet maintained by a single person</li>
          <li style={{ marginBottom: 8 }}><strong>Deferred revenue and prepaid expenses</strong>: another spreadsheet</li>
          <li style={{ marginBottom: 8 }}><strong>Intercompany transactions</strong>: tracked manually if the company has multiple entities</li>
        </ul>
        <p style={P}>
          For each source, someone on the finance team has to: log in, find the right report, export it (usually as CSV or PDF), save it to the right folder, and import it into the consolidation workbook. The consolidation workbook is, in almost all cases, Excel — a spreadsheet with hundreds of rows and dozens of tabs, maintained by someone who has been there at least two years because the institutional knowledge about which columns need to be mapped where lives only in their head.
        </p>
        <p style={P}>
          This process takes a full day, sometimes two, for the junior accountant whose job description includes "other duties as assigned."
        </p>

        <h2 style={H2}>Bottleneck 2: Reconciliation (1.5 days)</h2>
        <p style={P}>
          Once the raw data is collected, the next phase is reconciling each account's activity against its third-party record. Bank balance per the GL should match bank balance per the bank. Credit card balance per the GL should match credit card balance per the issuer. And so on.
        </p>
        <p style={P}>In practice, the numbers never match on the first pass. There are always discrepancies:</p>
        <ul style={UL}>
          <li style={{ marginBottom: 8 }}><strong>Timing differences</strong>: A check was cut on the 30th but didn't clear until the 3rd</li>
          <li style={{ marginBottom: 8 }}><strong>Missed entries</strong>: A wire transfer that nobody remembered to record in the AP system</li>
          <li style={{ marginBottom: 8 }}><strong>Duplicate entries</strong>: A vendor bill that got entered twice by two different people</li>
          <li style={{ marginBottom: 8 }}><strong>Miscoded entries</strong>: A software subscription that landed in "Office Expenses" instead of "Subscriptions"</li>
          <li style={{ marginBottom: 8 }}><strong>FX gains/losses</strong>: Foreign currency transactions that need to be remeasured at month-end rates</li>
          <li style={{ marginBottom: 8 }}><strong>Merchant category weirdness</strong>: A Stripe payout that includes 47 individual charges, 3 refunds, 1 chargeback, and a platform fee, all reported as a single line item</li>
        </ul>
        <p style={P}>
          For each discrepancy, a human has to investigate: open the bank statement, find the line item, trace it backwards to source (which invoice? which vendor?), determine the correct account coding, make the adjusting entry. A mid-market company might have 50 to 200 such items per month.
        </p>
        <p style={P}>
          Every one of these is a manual lookup across systems that don't share identifiers. The bank has its reference number. The ERP has its own transaction ID. The payment processor has a third ID. The vendor contract has a fourth. There is no reliable way to connect them except human pattern-matching ("this $2,431.00 charge on April 14 is probably the Cloudflare invoice from April 12, let me check").
        </p>
        <p style={P}>
          This is the single largest time sink in the close process. It is also the bottleneck that automation has moved the least.
        </p>

        <h2 style={H2}>Bottleneck 3: Accruals and adjusting entries (1-2 days)</h2>
        <p style={P}>
          After reconciliation, the team records accruals. These are entries that capture economic activity that occurred in the month even though cash hasn't moved yet.
        </p>
        <p style={P}>Common accruals:</p>
        <ul style={UL}>
          <li style={{ marginBottom: 6 }}><strong>Accrued bonuses</strong>: The company owes employees a bonus but hasn't paid it</li>
          <li style={{ marginBottom: 6 }}><strong>Accrued vacation</strong>: Used PTO that hasn't been paid out yet</li>
          <li style={{ marginBottom: 6 }}><strong>Deferred revenue</strong>: Customer paid in advance for a service not yet delivered</li>
          <li style={{ marginBottom: 6 }}><strong>Prepaid expenses</strong>: Company paid in advance for something like insurance, which needs to be expensed over time</li>
          <li style={{ marginBottom: 6 }}><strong>Accrued interest</strong>: Interest that has compounded on a loan but hasn't been charged yet</li>
          <li style={{ marginBottom: 6 }}><strong>Sales commissions</strong>: Owed to sales reps based on closed deals</li>
          <li style={{ marginBottom: 6 }}><strong>Utility and vendor estimates</strong>: Bills that haven't arrived yet but cover the month just ended</li>
        </ul>
        <p style={P}>
          Each of these requires a judgment call or a calculation that lives outside the transactional systems. The controller has to email department heads: "What's your best estimate of accrued consulting fees for April?" She has to wait for responses. She has to reconcile those responses against last month's actuals to see if the estimates are trending reasonably. She has to book the entries, reverse them next month, and track whether the actual invoice, when it finally arrives, matches the accrual.
        </p>
        <p style={P}>
          If you've never worked in finance, the accrual process is the part that feels most "why are you still doing this manually?" — and the answer is that it's the part that requires genuine judgment about economic activity that hasn't been invoiced yet. You can automate the mechanical steps (booking the entry, reversing it next month), but the estimate itself comes from human knowledge of what the business did.
        </p>
        <p style={P}>
          That said, a lot of accruals are mechanical: depreciation schedules, amortization schedules, rent, insurance. Those should be automated. In practice, they often aren't.
        </p>

        <h2 style={H2}>Bottleneck 4: Intercompany eliminations (half day to a full day)</h2>
        <p style={P}>
          If the company has multiple legal entities — subsidiaries, international offices, holding structures — any transaction between them has to be eliminated from the consolidated financials. Otherwise revenue gets double-counted: once when Entity A invoices Entity B, and once when Entity B recognizes the cost as an expense.
        </p>
        <p style={P}>Eliminations sound simple and usually aren't. The complications:</p>
        <ul style={UL}>
          <li style={{ marginBottom: 6 }}>Entities often use different chart-of-accounts codes for the same economic event</li>
          <li style={{ marginBottom: 6 }}>Currency conversion happens at different rates on different days</li>
          <li style={{ marginBottom: 6 }}>Intercompany balances (what A owes B) never match perfectly — there are always reconciling items</li>
          <li style={{ marginBottom: 6 }}>Transfer pricing documentation has to be maintained for tax purposes</li>
          <li style={{ marginBottom: 6 }}>Some entities close on different schedules, so the "month" is slightly different</li>
        </ul>
        <p style={P}>
          For companies with 3 or more entities, this alone can eat a full day.
        </p>

        <h2 style={H2}>Bottleneck 5: The review cycle (1 day)</h2>
        <p style={P}>
          At this point, the trial balance is assembled and the preliminary financials exist. Now the review loop starts.
        </p>
        <p style={P}>
          The controller reviews the junior accountant's work. The CFO reviews the controller's work. The CEO or audit committee reviews the CFO's presentation. At each layer, questions come back: "Why did legal fees triple this month?" "What's this $34,000 entry to Other?" "The revenue number doesn't match what I saw in Salesforce."
        </p>
        <p style={P}>
          Each question sends someone back into the data. Which transactions rolled up into legal fees? What is that Other line item? Why is the revenue discrepancy real vs. a timing issue? Each question takes 30 minutes to an hour to answer, sometimes more. A typical review cycle has 10 to 20 such questions.
        </p>
        <p style={P}>
          This phase cannot be eliminated — executive review is the control that catches errors. But it can be dramatically compressed if the data is traceable end-to-end. If the CEO can click on "legal fees" in the P&L and drill straight down to the 47 individual invoices that rolled up into that number, the question gets answered in 10 seconds instead of 45 minutes.
        </p>
        <p style={P}>
          That drill-down capability is what most finance stacks <em>claim</em> to offer and very few <em>actually</em> deliver, because the data crosses too many system boundaries.
        </p>

        <h2 style={H2}>Bottleneck 6: Reporting and variance analysis (half day)</h2>
        <p style={P}>
          The last phase is producing the actual deliverables: P&L, balance sheet, cash flow statement, variance report against budget, management commentary. These get packaged into a board deck or management report.
        </p>
        <p style={P}>
          The mechanics here are fast — pivot tables, formatted tables, charts. The slow part is the narrative. "Why is Q1 gross margin down 340 basis points?" requires the finance team to investigate each contributing factor, attribute the variance, and write a paragraph explaining it. If the underlying data is fragmented, that narrative is hard to produce because the finance team is still piecing together what happened.
        </p>

        <h2 style={H2}>The pattern, again</h2>
        <p style={P}>Every bottleneck above has the same shape:</p>
        <ol style={UL}>
          <li style={{ marginBottom: 6 }}>Data exists in multiple systems</li>
          <li style={{ marginBottom: 6 }}>The systems don't share identifiers</li>
          <li style={{ marginBottom: 6 }}>Humans manually correlate across systems</li>
          <li style={{ marginBottom: 6 }}>Each correlation is error-prone and slow</li>
          <li style={{ marginBottom: 6 }}>Errors propagate until someone catches them</li>
          <li style={{ marginBottom: 6 }}>Every review cycle requires repeating the correlation</li>
        </ol>
        <p style={P}>
          The finance tech stack has added dashboards, workflow tools, and AI assistants on top of this broken foundation. Each helps a little. None fix the underlying problem: the data doesn't share a model.
        </p>

        <h2 style={H2}>What would a 1-day close require?</h2>
        <p style={P}>
          If you designed the close process from scratch, knowing what we know now, what would need to be true?
        </p>
        <p style={P}>
          <strong>Data unified at ingestion, not at reporting time.</strong> Every transaction — whether it originates in a bank, credit card, payroll system, or ERP — needs to land in a single canonical schema as it arrives. Not on close day. Not during reconciliation. At the moment of ingestion. This alone eliminates Bottleneck 1 entirely.
        </p>
        <p style={P}>
          <strong>Transactions traceable to source.</strong> Every row in the GL should carry a reliable back-reference to the originating provider and the provider's own record ID. When a question arises in review, the answer is one hyperlink away, not a 45-minute archaeological dig.
        </p>
        <p style={P}>
          <strong>Reconciliation that runs continuously.</strong> If the schema is unified, reconciliation becomes a scheduled job rather than a manual process. The moment bank and GL diverge by more than a threshold, an exception is created. Close day becomes about reviewing flagged exceptions, not hunting for them.
        </p>
        <p style={P}>
          <strong>Accruals with automation baked in.</strong> Depreciation, amortization, rent, insurance — these are algorithmic. They should book themselves. Judgment-based accruals (bonuses, consulting fees) still need human estimates, but the booking and reversal mechanics should be zero-effort.
        </p>
        <p style={P}>
          <strong>Audit trail at the object level.</strong> Every adjustment, every entry, every override should carry a cryptographically verifiable log of who did it, when, with what justification. Not for paranoia — for the review cycle. "Why did you make this entry?" should be a query, not a meeting.
        </p>
        <p style={P}>
          <strong>A single schema across treasury, FP&A, accounting, and close.</strong> The treasury team's cash forecast, the FP&A team's variance model, the controller's trial balance, and the external auditor's workpapers should all read from the same underlying data. Today they read from four different copies.
        </p>
        <p style={P}>
          Of these six requirements, five are solvable with technology that exists today. The sixth — judgment-based accruals — is inherently human and will stay human.
        </p>

        <h2 style={H2}>The data model is the foundation</h2>
        <p style={P}>
          Every close-acceleration project we've seen fails when it tries to fix the close workflow without fixing the data foundation. You can buy a beautiful close management tool, a dashboard system, an AI copilot, a consolidation platform. Each will help a little. None will get you to a one-day close because the underlying problem — data fragmentation across systems that don't share a model — is beneath all of them.
        </p>
        <p style={P}>
          The boring, unglamorous work that actually compresses close time is establishing a unified data model at ingestion. Everything downstream gets faster once the data is normalized. Everything stays slow until it is.
        </p>
        <p style={P}>
          This is what we built <a href="https://claremesh.com" style={LINK}>ClareMesh</a> for. It publishes an open-source schema covering the five financial primitives — Account, Transaction, Entity, Balance, Forecast — and transforms raw API data from Plaid, Stripe, QuickBooks, Xero, and NetSuite into that schema. Every transaction that flows through ClareMesh carries source attribution, schema version, and a full lineage record. The schema is MIT licensed; the transforms are MIT licensed; the sync layer runs on your own infrastructure so customer data never leaves your servers.
        </p>
        <p style={P}>
          ClareMesh by itself doesn't give you a one-day close. It gives you the foundation on which a one-day close becomes feasible. The close workflow that sits on top — the reconciliation engine, the review queue, the exception manager — consumes the ClareMesh schema directly, so every tool that reads from it sees the same canonical data.
        </p>
        <p style={P}>
          The underlying bet is that close time is a data problem before it is a workflow problem.
        </p>

        <h2 style={H2}>For the finance leader reading this</h2>
        <p style={P}>
          If you're running finance at a mid-market company and your close is 5 days today, a realistic transition looks like this:
        </p>
        <ul style={UL}>
          <li style={{ marginBottom: 8 }}><strong>Month 0</strong>: Close is 5 days. Everything is as described above.</li>
          <li style={{ marginBottom: 8 }}><strong>Month 3</strong>: A unified schema is in place for at least your bank, card, and ERP data. Close is 4 days — the data collection bottleneck is mostly gone.</li>
          <li style={{ marginBottom: 8 }}><strong>Month 6</strong>: Continuous reconciliation is running. Exceptions flag during the month rather than accumulating to close day. Close is 3 days.</li>
          <li style={{ marginBottom: 8 }}><strong>Month 9</strong>: Drill-down is working end-to-end. Review cycles are faster because every question resolves in seconds. Close is 2 days.</li>
          <li style={{ marginBottom: 8 }}><strong>Month 12</strong>: Accruals are automated for the mechanical cases. Close is 1-2 days. Your team has their weekends back.</li>
        </ul>
        <p style={P}>
          None of this is mythical. The technology exists. The work is getting the unified data model in place and then systematically attacking each bottleneck.
        </p>
        <p style={P}>
          If you'd like to see what the unified schema looks like for your data, you can paste a raw Plaid, Stripe, QuickBooks, or Xero response into our <a href="/playground" style={LINK}>playground</a> and see the normalized output in real-time. It's a two-minute exercise that communicates the idea better than any sales deck.
        </p>

        {/* Footer CTA */}
        <div style={{ marginTop: 64, padding: "32px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)" }}>
          <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-copper)", marginBottom: 12 }}>TRY CLAREMESH</p>
          <p style={{ fontSize: 13, color: "var(--cm-text-panel-h)", lineHeight: 1.6, marginBottom: 12 }}>
            <strong>ClareMesh</strong> is an open-source financial data schema and bi-directional sync SDK. Start with the Open tier — 10,000 transforms per month, no credit card required.
          </p>
          <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
            <a href="/signup" style={{ display: "inline-block", padding: "10px 20px", fontSize: 13, fontFamily: F.d, fontWeight: 500, color: "#fff", background: "var(--cm-slate)", textDecoration: "none" }}>Get started free</a>
            <a href="/playground" style={{ display: "inline-block", padding: "10px 20px", fontSize: 13, fontFamily: F.d, fontWeight: 500, color: "var(--cm-text-panel-h)", border: "0.5px solid var(--cm-border-light)", textDecoration: "none" }}>Open the playground</a>
          </div>
          <p style={{ fontSize: 12, color: "var(--cm-text-dim)" }}>
            Questions about close acceleration? Email <a href="mailto:malik@claremesh.com" style={{ color: "var(--cm-slate)" }}>malik@claremesh.com</a>.
          </p>
        </div>
      </article>
    </div>
  );
}

export default function PostPage() { return <Suspense><MonthEndPost /></Suspense>; }

