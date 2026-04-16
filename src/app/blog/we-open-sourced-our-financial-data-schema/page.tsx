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

function ManifestoPost() {
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
          <span style={{ color: "var(--cm-text-panel-h)" }}>Philosophy</span>
        </div>

        <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2.5, color: "var(--cm-copper)", marginBottom: 12 }}>PHILOSOPHY</p>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 42, letterSpacing: -1.2, lineHeight: 1.1, color: "var(--cm-text-panel-h)", marginBottom: 16 }}>
          We open-sourced our financial data schema. Here's why.
        </h1>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "var(--cm-text-dim)", marginBottom: 48, paddingBottom: 32, borderBottom: "0.5px solid var(--cm-border-light)" }}>
          <span style={{ fontFamily: F.m }}>April 30, 2026</span>
          <span>·</span>
          <span style={{ fontFamily: F.m }}>ClareMesh Engineering</span>
          <span>·</span>
          <span style={{ fontFamily: F.m }}>11 min read</span>
        </div>

        <p style={P}>
          Two years ago we started building a treasury product. We spent the first three months writing normalization code: taking Plaid's snake_case responses, Stripe's amount-in-cents, QuickBooks' journal entry trees, and Xero's invoice objects, and turning them into a shape our application could reason about.
        </p>
        <p style={P}>We shipped it. It worked. We moved on to building the actual treasury features.</p>
        <p style={P}>
          Six months later we started building an FP&A product. On day one, our team opened a new repository and started writing the same normalization code.
        </p>
        <p style={P}>
          Nine months later we started building a month-end close product. On day one, we opened another new repository and — you can see where this is going — started writing the same normalization code.
        </p>
        <p style={P}>
          At some point during that third implementation, we realized we were solving the same problem for the fourth time across four different codebases. Worse, we were introducing the same five bugs each time. The sign flip. The pending-to-posted transition. The currency drift. The category assumptions. The type/subtype confusion. We wrote about those bugs in a <a href="/blog/5-bugs-every-plaid-integration-ships" style={LINK}>separate post</a> because they're universal — every fintech team hits them.
        </p>
        <p style={P}>
          That's when we extracted the normalization layer, cleaned it up, published it under MIT, and called it <a href="https://claremesh.com" style={LINK}>ClareMesh</a>.
        </p>
        <p style={P}>
          This post explains why we open-sourced it rather than keeping it as proprietary infrastructure for our own suite, and why we think more fintech infrastructure should follow the same pattern.
        </p>

        <h2 style={H2}>The closed-source era of fintech data</h2>
        <p style={P}>
          For fifteen years, the default architecture for financial data integration has been closed.
        </p>
        <p style={P}>
          Plaid is closed-source. Their normalization logic is their moat. If your application needs Plaid data, you pay Plaid, and you get their shape.
        </p>
        <p style={P}>
          Stripe is closed-source in the same way. Their data model is their data model. You adapt.
        </p>
        <p style={P}>
          Merge.dev is closed-source by design. They unify multiple providers behind a single API. Their unification logic is the product. You rent access.
        </p>
        <p style={P}>
          Codat, Rutter, Finch — all closed-source. All built on the premise that financial data unification is valuable enough to be a paid SaaS service and proprietary enough to be a defensible moat.
        </p>
        <p style={P}>This architecture worked. It still works for many use cases. We're not going to argue it was wrong.</p>

        <h2 style={H2}>Why closed worked</h2>
        <p style={P}>
          Three conditions made closed-source fintech data unification defensible from 2010 to roughly 2022:
        </p>
        <p style={P}>
          <strong>Integration complexity was a real moat.</strong> Building and maintaining connections to 20+ banks through fragile scraping APIs was genuinely hard. Plaid's value was that you didn't have to do it. Most development teams couldn't build what Plaid offered even if they wanted to.
        </p>
        <p style={P}>
          <strong>Data shape was proprietary.</strong> Each provider returned something slightly different, and the intermediate shape a unification service produced was genuinely novel. There was intellectual property in the mapping logic.
        </p>
        <p style={P}>
          <strong>Trust was transactional.</strong> Customers accepted that if they wanted Plaid's data, they'd send data through Plaid's servers. The zero-egress architecture wasn't yet an expectation.
        </p>
        <p style={P}>
          For most of a decade, those three conditions held, and closed-source unification was the rational default.
        </p>

        <h2 style={H2}>What changed</h2>
        <p style={P}>Three things have shifted since 2022.</p>
        <p style={P}>
          <strong>The integrations became commoditized.</strong> Plaid, Teller, MX, Finicity, and increasingly open banking APIs (FDX in the US, PSD2 in Europe) have largely stabilized the ability to connect to banks. The raw connection is no longer the moat. What you do with the data after you have it — that's become the harder problem.
        </p>
        <p style={P}>
          <strong>AI-native finance teams arrived.</strong> The first generation of fintech applications was spreadsheet replacements. The new generation is AI copilots, autonomous agents, continuous reconciliation engines. These systems don't just read data — they reason over it, detect patterns, generate forecasts, write journal entries. They need data in a canonical, typed, validated shape. Not Plaid's shape. Not Stripe's shape. A shape designed for AI consumption.
        </p>
        <p style={P}>
          <strong>Data residency became table stakes.</strong> A decade ago, customers shrugged at "your data passes through our servers." Today, fintech CISOs reject that architecture on slide two. GDPR, CCPA, banking regulations across six jurisdictions, and enterprise data governance teams have all converged on the same requirement: if you want to process our financial data, do it on our infrastructure.
        </p>
        <p style={P}>
          Each of these shifts weakens the closed-source unification model. The first commoditizes the raw capability. The second demands a shape the closed vendors don't ship. The third rejects the zero-egress architecture entirely.
        </p>

        <h2 style={H2}>The open-source thesis</h2>
        <p style={P}>
          In this new environment, we believe the right architecture for financial data infrastructure looks like this:
        </p>
        <p style={P}>
          <strong>The schema is open.</strong> The shape financial data takes — Account, Transaction, Entity, Balance, Forecast — should be a shared standard, not a trade secret. Every fintech team should be able to inspect, audit, extend, and fork the schema. If the canonical shape of a financial transaction is owned by one company, every downstream application is at the mercy of that company's product decisions.
        </p>
        <p style={P}>
          <strong>The transforms are open.</strong> The logic that turns Plaid's API response into a canonical Transaction object has no legitimate reason to be closed. It's plumbing. It's the kind of code that benefits from dozens of engineers fixing edge cases rather than five engineers at one company guessing at them. Keeping transforms closed wastes human effort across the industry.
        </p>
        <p style={P}>
          <strong>The runtime is self-hosted.</strong> The software that reads your customer's financial data should run on their infrastructure. Not on the vendor's. Not in the vendor's "secure cloud." On the customer's servers, under their compliance posture, under their data residency controls, under their audit logs.
        </p>
        <p style={P}>
          <strong>The commercial layer sits above infrastructure.</strong> There's still room for paid services — hosted sync, conflict resolution at scale, compliance dashboards, enterprise support. But these should ride on top of the open foundation, not replace it.
        </p>
        <p style={P}>
          This is the architecture we've bet on. The schema (<code style={INLINE_CODE}>@claremesh/schema</code>) is MIT licensed. The transforms (<code style={INLINE_CODE}>@claremesh/transforms</code>) are MIT licensed. The sync layer is hosted on the customer's own Supabase project — we operate the control plane, but we never touch the data. The paid tier wraps all of this with customer-grade conveniences: a dashboard, scheduled jobs, audit exports, compliance artifacts.
        </p>

        <h2 style={H2}>Why this is better, concretely</h2>
        <p style={{ ...P, fontWeight: 500 }}>For developers:</p>
        <ul style={UL}>
          <li style={{ marginBottom: 8 }}>You can read the code. Every transform. Every edge case. Every assumption. When Plaid changes their API, you can see exactly what we changed in response. When we get something wrong, you can file a PR.</li>
          <li style={{ marginBottom: 8 }}>You can fork it. If we shut down, go in a direction you disagree with, or get acquired by someone who raises the price, you have the source. Your business doesn't depend on our business.</li>
          <li style={{ marginBottom: 8 }}>You can extend it. Adding a provider we don't support yet is a 200-line PR, not a feature request that takes six months.</li>
        </ul>

        <p style={{ ...P, fontWeight: 500 }}>For customers:</p>
        <ul style={UL}>
          <li style={{ marginBottom: 8 }}>Your data doesn't leave your infrastructure. The transforms run in your Supabase edge functions. Our servers never see your customer's bank transactions.</li>
          <li style={{ marginBottom: 8 }}>You own the compliance posture. You can show an auditor every line of code that processes customer data. You can host in whatever region regulators require. You can configure retention policies to whatever your DPA commitments say.</li>
          <li style={{ marginBottom: 8 }}>Your costs don't scale with integration count. In the closed model, adding a new provider usually means a price tier bump. With open transforms, adding a provider is just configuration.</li>
        </ul>

        <p style={{ ...P, fontWeight: 500 }}>For the industry:</p>
        <ul style={UL}>
          <li style={{ marginBottom: 8 }}>The normalization layer stops being a secret that every team rediscovers. When one team finds an edge case in Stripe's handling of disputes, every team gets the fix. Compound progress.</li>
          <li style={{ marginBottom: 8 }}>The shape of financial data becomes a shared language. If four different applications read the same schema, integrating them is trivial. If the schema is proprietary, integration is a quarterly planning meeting.</li>
          <li style={{ marginBottom: 8 }}>Innovation moves up the stack. Engineers stop writing normalization code and start building actual products — AI copilots, autonomous agents, better treasury tools, better close workflows. The commodity layer becomes commodity, and the value creation moves where it should.</li>
        </ul>

        <h2 style={H2}>Why we still have a business</h2>
        <p style={P}>Some readers will ask: if the schema and transforms are free, how do you make money?</p>
        <p style={P}>The answer is that unification logic is necessary but not sufficient. Production fintech infrastructure also needs:</p>
        <ul style={UL}>
          <li style={{ marginBottom: 8 }}><strong>Bi-directional sync</strong> — pushing normalized data back to providers (updating QuickBooks from ClareMesh, writing to Xero invoices from an external system) is substantially harder than reading. It requires conflict resolution, change detection, idempotency, and dry-run capabilities.</li>
          <li style={{ marginBottom: 8 }}><strong>Continuous reconciliation</strong> — running scheduled jobs that flag discrepancies between sources before they become close-day fire drills.</li>
          <li style={{ marginBottom: 8 }}><strong>Compliance and audit infrastructure</strong> — 61 documented controls, framework mapping, evidence generation, sub-processor tracking, retention enforcement.</li>
          <li style={{ marginBottom: 8 }}><strong>Enterprise operations</strong> — customer-managed encryption keys, dedicated regions, SLAs, SOC 2 Type II reports, support response times.</li>
        </ul>
        <p style={P}>
          These are the things customers pay for. They're the things that require ongoing engineering investment, compliance work, and operational commitments. The schema and transforms are the foundation that makes all of this easier to build on top of — but they're not the business.
        </p>
        <p style={P}>
          Our pricing reflects this. The Open tier is free forever, no asterisks. The Build tier ($199/mo) adds hosted operations. The Scale tier ($799/mo) adds sync, conflict resolution, and expanded compliance. The Enterprise tier adds dedicated infrastructure and support.
        </p>
        <p style={P}>
          If you only need the schema and transforms, you never have to pay us. That's the deal. If the hosted layer is worth more to you than operating it yourself, we're the best option. If it isn't, we've still done useful work by contributing the foundation.
        </p>

        <h2 style={H2}>What this means for fintech builders</h2>
        <p style={P}>
          If you're building a fintech product and you're about to write your own normalization layer, stop. Use ours. Contribute back when you find edge cases. Save yourself three months of work that every team before you has also done.
        </p>
        <p style={P}>
          If you're running a fintech data infrastructure company and you're thinking about your moat — the moat isn't the schema anymore. The moat is the operational layer on top: the sync engine, the compliance artifacts, the support relationships, the SLA commitments. Trying to defend the schema and transforms will lose to the open-source version within 18 months, because every engineer on earth can collectively maintain it better than any single vendor.
        </p>
        <p style={P}>
          If you're a customer evaluating fintech data vendors, ask whether their schema is open. Ask whether their transforms are open. Ask whether the runtime is self-hosted. If the answer is no to all three, ask why. The answers should be specific and defensible. "It's our IP" is not an answer. "It's how we make money" is an answer but a bad one.
        </p>

        <h2 style={H2}>How you can help</h2>
        <p style={P}>If you've read this far and think we're pointed in roughly the right direction:</p>
        <ul style={UL}>
          <li style={{ marginBottom: 8 }}><a href="https://github.com/Malikfrazier35/ClareMesh" target="_blank" rel="noopener" style={LINK}>Star the repo</a>. It's the single biggest signal to other teams that open-source fintech infrastructure is a real thing.</li>
          <li style={{ marginBottom: 8 }}><a href="/playground" style={LINK}>Try the playground</a>. Paste a real Plaid, Stripe, QuickBooks, or Xero response and see the normalized output. Two minutes. No signup.</li>
          <li style={{ marginBottom: 8 }}><a href="https://github.com/Malikfrazier35/ClareMesh/issues" target="_blank" rel="noopener" style={LINK}>File issues</a>. Edge cases. Bugs. Things we got wrong. The schema is better when more people audit it.</li>
          <li style={{ marginBottom: 8 }}><a href="https://github.com/Malikfrazier35/ClareMesh/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener" style={LINK}>Submit transforms for new providers</a>. Sage Intacct, FreshBooks, Zoho Books, Wave — if you use them, a transform PR would help.</li>
          <li style={{ marginBottom: 8 }}><a href="https://www.npmjs.com/package/@claremesh/schema" target="_blank" rel="noopener" style={LINK}>Use it in your product</a>. If you're building a fintech product on top of ClareMesh, we want to hear about it. Email malik@claremesh.com.</li>
        </ul>
        <p style={P}>
          This is the start of something, not the end. The schema is at v2.4.1 today. It will be at v3 in a year, v4 the year after. Each version will be better because more people use it, contribute to it, and find edge cases we missed.
        </p>
        <p style={P}>Come build it with us.</p>

        {/* Footer */}
        <div style={{ marginTop: 64, padding: "32px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)" }}>
          <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-copper)", marginBottom: 12 }}>CLAREMESH</p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--cm-text-panel-h)", marginBottom: 16 }}>
            ClareMesh is an open-source financial data schema and bi-directional sync SDK. It publishes a unified schema for financial primitives and provides MIT-licensed transforms for Plaid, Stripe, QuickBooks, Xero, and NetSuite. Customer data never leaves customer infrastructure.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13, marginBottom: 16 }}>
            <a href="https://github.com/Malikfrazier35/ClareMesh" target="_blank" rel="noopener" style={{ color: "var(--cm-slate)", textDecoration: "none", fontWeight: 500 }}>GitHub →</a>
            <a href="/playground" style={{ color: "var(--cm-slate)", textDecoration: "none", fontWeight: 500 }}>Playground →</a>
            <a href="/docs" style={{ color: "var(--cm-slate)", textDecoration: "none", fontWeight: 500 }}>Docs →</a>
            <a href="/pricing" style={{ color: "var(--cm-slate)", textDecoration: "none", fontWeight: 500 }}>Pricing →</a>
          </div>
          <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", lineHeight: 1.6, marginBottom: 12 }}>
            ClareMesh is the data infrastructure layer of a four-product suite: <strong>ClareMesh</strong> (normalization), <strong><a href="https://vaultline.app" style={{ color: "var(--cm-slate)", textDecoration: "none" }}>Vaultline</a></strong> (treasury), <strong><a href="https://castford.com" style={{ color: "var(--cm-slate)", textDecoration: "none" }}>Castford</a></strong> (FP&A), and <strong><a href="https://ashfordledger.com" style={{ color: "var(--cm-slate)", textDecoration: "none" }}>Ashford Ledger</a></strong> (month-end close).
          </p>
          <p style={{ fontSize: 12, color: "var(--cm-text-dim)" }}>
            Questions or corrections? Email <a href="mailto:malik@claremesh.com" style={{ color: "var(--cm-slate)" }}>malik@claremesh.com</a>.
          </p>
        </div>
      </article>
    </div>
  );
}

export default function PostPage() { return <Suspense><ManifestoPost /></Suspense>; }

