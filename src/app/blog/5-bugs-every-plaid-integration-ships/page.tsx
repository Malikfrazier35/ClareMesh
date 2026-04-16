"use client";
import { Suspense } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

// Shared styles for prose
const H2 = { fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, lineHeight: 1.3, color: "var(--cm-text-panel-h)", marginTop: 40, marginBottom: 16 };
const P = { fontSize: 16, lineHeight: 1.8, color: "var(--cm-text-panel-h)", marginBottom: 20 };
const CODE_BLOCK = { fontFamily: F.m, fontSize: 13, lineHeight: 1.7, padding: "20px 24px", background: "var(--cm-terminal)", border: "0.5px solid var(--cm-border-light)", overflowX: "auto" as const, marginBottom: 24, color: "var(--cm-text-panel-h)", whiteSpace: "pre" as const };
const INLINE_CODE = { fontFamily: F.m, fontSize: 14, padding: "1px 6px", background: "var(--cm-terminal)", border: "0.5px solid var(--cm-border-light)", color: "var(--cm-text-panel-h)" };
const LINK = { color: "var(--cm-slate)", textDecoration: "underline", textUnderlineOffset: "3px" };
const BLOCKQUOTE = { fontSize: 15, lineHeight: 1.8, color: "var(--cm-text-panel-b)", borderLeft: "3px solid var(--cm-slate)", paddingLeft: 20, marginLeft: 0, marginBottom: 20, fontStyle: "italic" as const };

function PlaidBugsPost() {
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
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24, fontSize: 12 }}>
          <a href="/blog" style={{ color: "var(--cm-text-dim)", textDecoration: "none" }}>Blog</a>
          <span style={{ color: "var(--cm-text-dim)" }}>/</span>
          <span style={{ color: "var(--cm-text-panel-h)" }}>Engineering</span>
        </div>

        {/* Header */}
        <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2.5, color: "var(--cm-copper)", marginBottom: 12 }}>ENGINEERING</p>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 42, letterSpacing: -1.2, lineHeight: 1.1, color: "var(--cm-text-panel-h)", marginBottom: 16 }}>
          5 bugs every Plaid integration ships (and how to catch them)
        </h1>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13, color: "var(--cm-text-dim)", marginBottom: 48, paddingBottom: 32, borderBottom: "0.5px solid var(--cm-border-light)" }}>
          <span style={{ fontFamily: F.m }}>April 16, 2026</span>
          <span>·</span>
          <span style={{ fontFamily: F.m }}>ClareMesh Engineering</span>
          <span>·</span>
          <span style={{ fontFamily: F.m }}>12 min read</span>
        </div>

        {/* Intro */}
        <p style={P}>
          Every team that integrates Plaid for the first time writes roughly the same code, ships it to production, and then — six to eighteen months later — discovers the same five bugs. We've audited our own codebase, the codebases of three design partners, and several open-source fintech projects on GitHub. These bugs are in all of them.
        </p>
        <p style={P}>
          This isn't a knock on Plaid. The Plaid API is well-documented and the design decisions behind it are defensible. These bugs come from the friction of <em>translating</em> Plaid's shape into your application's shape — the normalization layer every fintech product eventually writes. The bugs are so consistent that we've made avoiding them the core design of <a href="https://www.npmjs.com/package/@claremesh/transforms" style={LINK}><code style={INLINE_CODE}>@claremesh/transforms</code></a>.
        </p>
        <p style={P}>
          If you're building treasury, FP&A, month-end close, or any product that reads from Plaid, you should read this before your next sprint.
        </p>

        <h2 style={H2}>The Plaid data model in 60 seconds</h2>
        <p style={P}>Plaid returns two main object types when you're dealing with balances:</p>
        <ul style={{ fontSize: 16, lineHeight: 1.8, color: "var(--cm-text-panel-h)", marginBottom: 20, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}><strong>Account</strong> — a bank account, credit card, loan, or investment account. Has <code style={INLINE_CODE}>account_id</code>, <code style={INLINE_CODE}>balances</code>, <code style={INLINE_CODE}>type</code>, <code style={INLINE_CODE}>subtype</code>.</li>
          <li style={{ marginBottom: 8 }}><strong>Transaction</strong> — a single financial event. Has <code style={INLINE_CODE}>transaction_id</code>, <code style={INLINE_CODE}>account_id</code>, <code style={INLINE_CODE}>amount</code>, <code style={INLINE_CODE}>date</code>, <code style={INLINE_CODE}>category</code>.</li>
        </ul>
        <p style={P}>Both look reasonable. The bugs are in how these fields interact with the rest of your application.</p>

        <h2 style={H2}>Bug #1: The sign flip</h2>
        <p style={P}>This is the single most common production bug in fintech applications that use Plaid.</p>
        <p style={P}>
          Plaid represents a $50 restaurant charge as <code style={INLINE_CODE}>amount: 50.0</code> — a <strong>positive</strong> number. Plaid's documentation is explicit about this:
        </p>
        <blockquote style={BLOCKQUOTE}>
          Positive values when money moves out of the account; negative values when money moves in. For example, debit card purchases are positive; credit card payments, direct deposits, or refunds are negative.
        </blockquote>
        <p style={P}>
          Now read that again carefully. A debit card purchase is <code style={INLINE_CODE}>+50</code>. A credit card <em>payment</em> (i.e., paying off the card) is <code style={INLINE_CODE}>-50</code>.
        </p>
        <p style={P}>
          The problem: almost every accounting system in the world uses the opposite convention. In double-entry bookkeeping, a debit is negative (money leaving an asset) and a credit is positive (money entering). When you persist Plaid transactions into your GL, your ledger or FP&A platform, every sign is backwards.
        </p>
        <p style={P}>Teams typically discover this one of three ways:</p>
        <ol style={{ fontSize: 16, lineHeight: 1.8, color: "var(--cm-text-panel-h)", marginBottom: 20, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}>The first real customer runs a cash flow report and sees "net inflows" where they expect outflows.</li>
          <li style={{ marginBottom: 8 }}>An auditor reviews reconciliation and flags that checking account activity looks inverted.</li>
          <li style={{ marginBottom: 8 }}>Someone syncs Plaid data into QuickBooks and the QuickBooks balance diverges from the Plaid balance by 2x.</li>
        </ol>
        <p style={P}>
          The fix is trivial — multiply every Plaid transaction amount by -1 when normalizing — but teams often make it in the wrong place. The cleanest fix is in your transformation layer, before the data enters your application domain:
        </p>
        <pre style={CODE_BLOCK}><code>{`// Wrong: handle it at query time
const cashFlow = transactions.reduce((sum, t) => sum - t.amount, 0);

// Wrong: handle it in the UI
<span>{transaction.amount > 0 ? '-' : '+'}\${Math.abs(transaction.amount)}</span>

// Right: handle it once, at ingestion, in a dedicated normalization layer
function normalizePlaidTransaction(raw: PlaidTransaction): Transaction {
  return {
    // ... other fields
    amount: -raw.amount, // flip sign to match accounting convention
  };
}`}</code></pre>
        <p style={P}>
          Put the sign flip in one place. Make that place obvious. Write a test for it. Every downstream consumer should be able to trust that <code style={INLINE_CODE}>amount</code> follows a consistent convention.
        </p>

        <h2 style={H2}>Bug #2: Assuming pending transactions are immutable</h2>
        <p style={P}>
          Plaid's <code style={INLINE_CODE}>pending</code> field is a boolean. That's the first trap: developers treat it as a permanent property of a transaction. "This is a pending transaction." "That's a posted transaction."
        </p>
        <p style={P}>It's actually a <em>state</em> that every transaction passes through.</p>
        <p style={P}>
          When a transaction first appears, Plaid returns it with <code style={INLINE_CODE}>pending: true</code> and a <code style={INLINE_CODE}>transaction_id</code>. Days later, when the transaction posts, Plaid returns the same underlying event as a <strong>new transaction</strong> with <code style={INLINE_CODE}>pending: false</code> and <strong>a completely different <code style={INLINE_CODE}>transaction_id</code></strong>. The relationship between the two is represented by a <code style={INLINE_CODE}>pending_transaction_id</code> field on the posted version.
        </p>
        <p style={P}>Teams get bitten when they:</p>
        <ul style={{ fontSize: 16, lineHeight: 1.8, color: "var(--cm-text-panel-h)", marginBottom: 20, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}>Dedupe on <code style={INLINE_CODE}>transaction_id</code> alone and end up with both the pending and posted version in their database. Now the user's running total is wrong by exactly the amount of every pending-then-posted transaction.</li>
          <li style={{ marginBottom: 8 }}>Treat the pending transaction as canonical and never update it when the posted version arrives. Now the amount is wrong (posted amounts often differ from pending — tips on restaurant charges, gas station pre-authorizations).</li>
          <li style={{ marginBottom: 8 }}>Use the pending transaction's category/merchant/date. These can all change when the transaction posts.</li>
        </ul>
        <p style={P}>
          The correct handling: maintain a join key between <code style={INLINE_CODE}>pending_transaction_id</code> and <code style={INLINE_CODE}>transaction_id</code>, and when a posted transaction arrives, supersede the pending one.
        </p>
        <pre style={CODE_BLOCK}><code>{`// When ingesting a new Plaid transaction
function upsertTransaction(raw: PlaidTransaction) {
  if (raw.pending_transaction_id) {
    // This is a posted version of a previously-pending transaction.
    // Delete or archive the old pending row, insert the new posted one.
    deleteByTransactionId(raw.pending_transaction_id);
  }
  insertTransaction(normalizePlaidTransaction(raw));
}`}</code></pre>
        <p style={P}>
          The second trap: Plaid retains pending transactions for a limited window. If a pending transaction is removed before it posts (an authorization that never captures, for example), you'll see it in <code style={INLINE_CODE}>removed_transactions</code> in the <code style={INLINE_CODE}>/transactions/sync</code> response. You need to handle removals or your database will accumulate ghost transactions.
        </p>

        <h2 style={H2}>Bug #3: Currency drift on multi-currency accounts</h2>
        <p style={P}>
          Plaid returns <code style={INLINE_CODE}>iso_currency_code</code> on transactions and balances. For most US banks, it's <code style={INLINE_CODE}>USD</code>. Good.
        </p>
        <p style={P}>
          For multi-currency accounts, for international fintech products, and for investment accounts holding foreign securities, there's a second field called <code style={INLINE_CODE}>unofficial_currency_code</code>. This is what Plaid returns when the currency isn't part of ISO 4217 — crypto, reward points, certain emerging market currencies.
        </p>
        <p style={P}>
          The bug: teams select <code style={INLINE_CODE}>iso_currency_code</code> as the canonical currency field and don't handle the case where it's null. When Plaid returns an account denominated in, say, a stablecoin, the transaction arrives with <code style={INLINE_CODE}>iso_currency_code: null</code> and <code style={INLINE_CODE}>unofficial_currency_code: "USDC"</code>. Your application reads <code style={INLINE_CODE}>null</code>, assumes USD (the common default), and now has a mixed-currency account modeled as if it were dollars.
        </p>
        <p style={P}>The fix is to pick a canonical field at the normalization layer and fall through cleanly:</p>
        <pre style={CODE_BLOCK}><code>{`function normalizeCurrency(raw: PlaidAccount | PlaidTransaction): string {
  if (raw.iso_currency_code) return raw.iso_currency_code;
  if (raw.unofficial_currency_code) return raw.unofficial_currency_code;
  throw new Error(\`Account \${raw.account_id} has no currency information\`);
}`}</code></pre>
        <p style={P}>
          The exception throw is deliberate. Silent fallback to USD is how you end up with ledger errors six months later. Loud failure at ingestion time is how you catch the problem in development.
        </p>

        <h2 style={H2}>Bug #4: Category assumptions that break when Plaid changes</h2>
        <p style={P}>
          Plaid returns a <code style={INLINE_CODE}>category</code> array and a <code style={INLINE_CODE}>category_id</code>. The category looks like <code style={INLINE_CODE}>["Food and Drink", "Restaurants"]</code>. The category_id looks like <code style={INLINE_CODE}>13005000</code>.
        </p>
        <p style={P}>Teams universally treat these as stable. They write application logic like:</p>
        <pre style={CODE_BLOCK}><code>{`if (transaction.category[0] === 'Food and Drink') {
  // handle restaurant expense
}`}</code></pre>
        <p style={P}>Three things are wrong here.</p>
        <p style={P}>
          First, Plaid's category taxonomy changes. Not constantly, but enough. In 2024 Plaid introduced a new taxonomy called "Personal Finance Categories" that replaced the legacy <code style={INLINE_CODE}>category</code> field for new customers. Legacy customers still get the old field. Both coexist. If you're a new customer, <code style={INLINE_CODE}>transaction.category</code> is null by default and you need to read <code style={INLINE_CODE}>transaction.personal_finance_category</code>.
        </p>
        <p style={P}>
          Second, the category array ordering isn't guaranteed to be consistent over time for edge cases. A transaction categorized as <code style={INLINE_CODE}>["Transfer", "Internal Account Transfer"]</code> today might be <code style={INLINE_CODE}>["Transfer", "Account Transfer"]</code> after a taxonomy update.
        </p>
        <p style={P}>
          Third, category strings are localized in some markets. Your hardcoded English string match fails for non-US institutions.
        </p>
        <p style={P}>The fix has two layers:</p>
        <pre style={CODE_BLOCK}><code>{`// Normalization layer: pick a canonical category representation
function normalizeCategory(raw: PlaidTransaction): string {
  // Prefer the newer personal_finance_category if available
  if (raw.personal_finance_category) {
    return raw.personal_finance_category.primary;
  }
  // Fall back to category_id (stable integer taxonomy)
  if (raw.category_id) {
    return PLAID_CATEGORY_ID_TO_NAME[raw.category_id];
  }
  // Last resort: the category array
  return (raw.category ?? []).join(' · ');
}

// Application layer: use your own category enum, not Plaid's strings
enum ExpenseCategory {
  FOOD_AND_DRINK = 'food_and_drink',
  TRANSPORTATION = 'transportation',
  // ...
}`}</code></pre>
        <p style={P}>
          The key move is to never persist Plaid's category strings into your business logic. Normalize once on the way in, map to your own stable enum, and decouple from Plaid's taxonomy changes.
        </p>

        <h2 style={H2}>Bug #5: The account_type / subtype confusion</h2>
        <p style={P}>
          Plaid's account <code style={INLINE_CODE}>type</code> is one of: <code style={INLINE_CODE}>depository</code>, <code style={INLINE_CODE}>credit</code>, <code style={INLINE_CODE}>loan</code>, <code style={INLINE_CODE}>investment</code>, <code style={INLINE_CODE}>brokerage</code>, <code style={INLINE_CODE}>other</code>.
        </p>
        <p style={P}>
          Plaid's account <code style={INLINE_CODE}>subtype</code> is more granular: <code style={INLINE_CODE}>checking</code>, <code style={INLINE_CODE}>savings</code>, <code style={INLINE_CODE}>money market</code>, <code style={INLINE_CODE}>cd</code>, <code style={INLINE_CODE}>credit card</code>, <code style={INLINE_CODE}>student loan</code>, <code style={INLINE_CODE}>mortgage</code>, <code style={INLINE_CODE}>ira</code>, <code style={INLINE_CODE}>401k</code>, and about 30 more.
        </p>
        <p style={P}>Teams usually do one of two things that create bugs:</p>
        <p style={P}>
          <strong>Option A</strong>: Use <code style={INLINE_CODE}>type</code> for classification. Result: a 401(k) and a savings account look the same to your application because both are <code style={INLINE_CODE}>investment</code> or <code style={INLINE_CODE}>depository</code> at the type level.
        </p>
        <p style={P}>
          <strong>Option B</strong>: Use <code style={INLINE_CODE}>subtype</code> for classification. Result: adding new accounts breaks your application whenever a user connects something your enum doesn't recognize.
        </p>
        <p style={P}>
          Neither is right. The correct move is to map Plaid's type/subtype combo to your own canonical account classification — typically the five double-entry accounting categories:
        </p>
        <pre style={CODE_BLOCK}><code>{`type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

function classifyAccount(plaidType: string, plaidSubtype: string): AccountType {
  // Asset: things you own
  if (plaidType === 'depository') return 'asset';   // checking, savings
  if (plaidType === 'investment') return 'asset';   // 401k, IRA, brokerage
  if (plaidType === 'brokerage') return 'asset';

  // Liability: things you owe
  if (plaidType === 'credit') return 'liability';   // credit cards
  if (plaidType === 'loan') return 'liability';     // mortgages, student loans

  // Fallback
  return 'asset';  // or throw, depending on your risk tolerance
}`}</code></pre>
        <p style={P}>
          Once classified this way, your downstream GL, balance sheet, and reconciliation code can reason about accounts without caring whether a specific account is a checking or an IRA. The granularity stays available in the subtype field for display purposes, but doesn't leak into business logic.
        </p>

        <h2 style={H2}>Meta: the pattern behind all five bugs</h2>
        <p style={P}>Notice the shape of every fix above. It's the same pattern:</p>
        <ol style={{ fontSize: 16, lineHeight: 1.8, color: "var(--cm-text-panel-h)", marginBottom: 20, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}>Plaid returns data in Plaid's shape.</li>
          <li style={{ marginBottom: 8 }}>You write a <strong>normalization layer</strong> that converts Plaid's shape to your application's shape.</li>
          <li style={{ marginBottom: 8 }}>All downstream code operates on <em>your</em> shape, not Plaid's.</li>
          <li style={{ marginBottom: 8 }}>When Plaid changes (and they do), you change one file.</li>
        </ol>
        <p style={P}>
          This is why we built <a href="https://claremesh.com" style={LINK}>ClareMesh</a>. Every fintech team eventually writes this normalization layer. They all get the same bugs wrong the first time. They all end up rewriting the layer after the first production incident. The layer is generic enough that sharing it across teams is valuable, and specific enough (5 object types, 6 providers) that it's tractable to maintain.
        </p>
        <p style={P}>
          <code style={INLINE_CODE}>@claremesh/transforms/plaid</code> handles all five bugs above correctly. The sign flip happens at ingestion. The pending-to-posted transition is a first-class operation. Currency is canonicalized from both Plaid fields. Categories are mapped through a stable intermediate representation. Account classification is via the double-entry framework.
        </p>
        <p style={P}>
          It's MIT licensed and runs entirely in your infrastructure. There's a <a href="/playground" style={LINK}>playground</a> where you can paste a raw Plaid response and see the normalized output in real-time.
        </p>

        <h2 style={H2}>Your action items</h2>
        <p style={P}>If you're integrating Plaid right now:</p>
        <ol style={{ fontSize: 16, lineHeight: 1.8, color: "var(--cm-text-panel-h)", marginBottom: 20, paddingLeft: 24 }}>
          <li style={{ marginBottom: 8 }}>Search your codebase for <code style={INLINE_CODE}>amount</code> and verify sign convention is consistent.</li>
          <li style={{ marginBottom: 8 }}>Check whether your dedupe logic handles <code style={INLINE_CODE}>pending_transaction_id</code>.</li>
          <li style={{ marginBottom: 8 }}>Grep for <code style={INLINE_CODE}>iso_currency_code</code> and confirm you handle null.</li>
          <li style={{ marginBottom: 8 }}>Find every string match against <code style={INLINE_CODE}>category[0]</code> — those are landmines.</li>
          <li style={{ marginBottom: 8 }}>Audit how <code style={INLINE_CODE}>account.type</code> and <code style={INLINE_CODE}>account.subtype</code> are used in your business logic.</li>
        </ol>
        <p style={P}>
          If any of those reveal problems, you can either fix them case-by-case or adopt a normalization layer (ours or your own) and push the fixes into one place.
        </p>
        <p style={P}>
          If you're just starting a Plaid integration, skip ahead — use a normalization layer from day one. You'll save yourself the six-month production incident.
        </p>

        {/* Footer CTA */}
        <div style={{ marginTop: 64, padding: "32px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)" }}>
          <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-copper)", marginBottom: 8 }}>ABOUT CLAREMESH</p>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--cm-text-panel-h)", marginBottom: 16 }}>
            ClareMesh is an open-source financial data schema and bi-directional sync SDK. It publishes a unified schema for financial primitives and provides MIT-licensed transforms for Plaid, Stripe, QuickBooks, Xero, and NetSuite. Customer data never leaves customer infrastructure.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13 }}>
            <a href="https://github.com/Malikfrazier35/ClareMesh" target="_blank" rel="noopener" style={{ color: "var(--cm-slate)", textDecoration: "none", fontWeight: 500 }}>Star on GitHub →</a>
            <a href="/playground" style={{ color: "var(--cm-slate)", textDecoration: "none", fontWeight: 500 }}>Try the playground →</a>
            <a href="/docs" style={{ color: "var(--cm-slate)", textDecoration: "none", fontWeight: 500 }}>Read the docs →</a>
          </div>
          <p style={{ fontSize: 12, color: "var(--cm-text-dim)", marginTop: 16 }}>
            Questions or corrections? Email <a href="mailto:malik@claremesh.com" style={{ color: "var(--cm-slate)" }}>malik@claremesh.com</a> or open an issue on GitHub.
          </p>
        </div>
      </article>
    </div>
  );
}

export default function PostPage() { return <Suspense><PlaidBugsPost /></Suspense>; }

