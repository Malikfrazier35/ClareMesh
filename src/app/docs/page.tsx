"use client";
import { useState, Suspense } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const SECTIONS = [
  {
    id: "quickstart", title: "Quickstart", content: [
      { type: "p", text: "Get ClareMesh running in under 5 minutes. Install the schema and transform packages, normalize your first financial record, and validate the output." },
      { type: "code", lang: "bash", text: "npm install @claremesh/schema @claremesh/transforms" },
      { type: "p", text: "Import a provider-specific transform and your schema types:" },
      { type: "code", lang: "ts", text: `import { transformPlaidTransaction } from '@claremesh/transforms/plaid';
import type { Transaction } from '@claremesh/schema';

// Your raw Plaid API response
const plaidTxn = {
  transaction_id: 'txn_abc123',
  amount: 42.50,        // Plaid: positive = outflow
  date: '2026-04-15',
  merchant_name: 'Starbucks',
  iso_currency_code: 'USD',
};

// Normalize to ClareMesh schema
const txn: Transaction = transformPlaidTransaction(plaidTxn, {
  org_id: 'org_d8afc85d',
  entity_id: 'ent_acme_01',
});

// Result: amount is now -42.50 (ClareMesh: negative = outflow)
// currency is 'USD' (uppercase ISO 4217)
// date is '2026-04-15T00:00:00.000Z' (ISO 8601 UTC)
// id is a generated UUID v4
// provider_id preserves 'txn_abc123'` },
      { type: "p", text: "That's it. The transform handles sign convention, date parsing, currency normalization, and ID generation. Every edge case from the provider corpus is covered." },
    ]
  },
  {
    id: "schema", title: "Schema reference", content: [
      { type: "p", text: "The ClareMesh schema defines 5 canonical objects. All financial data from any provider normalizes into these objects." },
      { type: "h3", text: "Account" },
      { type: "code", lang: "ts", text: `interface Account {
  id: string;              // UUID v4
  org_id: string;          // Organization ID
  provider_id: string;     // Original ID from provider
  name: string;            // Account name
  type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  subtype?: string;        // Provider-specific subtype
  currency: string;        // ISO 4217 (uppercase)
  parent_id?: string;      // Parent account UUID (hierarchy)
  institution_name?: string;
  metadata: Record<string, unknown>;  // Provider-specific fields
  created_at: string;      // ISO 8601 UTC
  updated_at: string;
}` },
      { type: "h3", text: "Transaction" },
      { type: "code", lang: "ts", text: `interface Transaction {
  id: string;              // UUID v4
  org_id: string;
  account_id: string;      // FK to Account
  provider_id: string;     // Original ID from provider
  amount: number;          // Positive = inflow, negative = outflow
  currency: string;        // ISO 4217
  date: string;            // ISO 8601 UTC
  description: string;     // Merchant name or memo
  category?: string;
  status: 'pending' | 'posted' | 'void';
  entity_id?: string;      // FK to Entity (counterparty)
  metadata: Record<string, unknown>;
  created_at: string;
}` },
      { type: "h3", text: "Entity" },
      { type: "code", lang: "ts", text: `interface Entity {
  id: string;
  org_id: string;
  name: string;            // Normalized entity name
  type: 'vendor' | 'customer' | 'employee' | 'institution';
  tax_id?: string;         // EIN/TIN for resolution
  aliases: string[];       // All known names across providers
  metadata: Record<string, unknown>;
  created_at: string;
}` },
      { type: "h3", text: "Balance" },
      { type: "code", lang: "ts", text: `interface Balance {
  id: string;
  org_id: string;
  account_id: string;      // FK to Account
  current: number;         // Current balance
  available?: number;      // Available balance (if different)
  currency: string;
  as_of: string;           // Balance snapshot timestamp
  created_at: string;
}` },
      { type: "h3", text: "Forecast" },
      { type: "code", lang: "ts", text: `interface Forecast {
  id: string;
  org_id: string;
  account_id: string;
  period_start: string;
  period_end: string;
  projected_balance: number;
  confidence: number;      // 0-1
  method: 'linear' | 'ema' | 'monte_carlo';
  metadata: Record<string, unknown>;
  created_at: string;
}` },
    ]
  },
  {
    id: "transforms", title: "Transforms", content: [
      { type: "p", text: "Each provider has a dedicated transform module. Transforms handle every known edge case from that provider's API." },
      { type: "h3", text: "Plaid" },
      { type: "p", text: "Plaid sign convention is inverted: positive amounts mean money leaving the account. ClareMesh flips this. Pending transactions are normalized with status='pending'. The authorized_date vs date discrepancy is resolved by using date as the canonical timestamp." },
      { type: "code", lang: "ts", text: `import { transformPlaidTransaction, transformPlaidAccount } from '@claremesh/transforms/plaid';

// Batch transform
const transactions = plaidResponse.transactions.map(txn =>
  transformPlaidTransaction(txn, { org_id, entity_id })
);` },
      { type: "h3", text: "Stripe" },
      { type: "p", text: "Stripe amounts are in minor units (cents). ClareMesh divides by 100 for most currencies but not for zero-decimal currencies like JPY. Unix timestamps are converted to ISO 8601. Refunds are separate objects linked by charge ID." },
      { type: "code", lang: "ts", text: `import { transformStripeCharge } from '@claremesh/transforms/stripe';

const txn = transformStripeCharge(charge, { org_id, entity_id });
// $42.50 charge: Stripe amount=4250 → ClareMesh amount=42.50` },
      { type: "h3", text: "QuickBooks" },
      { type: "p", text: "QuickBooks JournalEntry objects contain multiple Lines. Each Line becomes a separate ClareMesh Transaction. PostingType determines sign: Debit = positive, Credit = negative. CurrencyRef is an object, not a string." },
      { type: "code", lang: "ts", text: `import { transformQBJournalEntry } from '@claremesh/transforms/quickbooks';

// One JournalEntry with 3 lines → 3 ClareMesh Transactions
const transactions = transformQBJournalEntry(journalEntry, { org_id });` },
      { type: "h3", text: "Xero" },
      { type: "p", text: "Xero dates use legacy ASP.NET format: /Date(1234567890000+0000)/. ClareMesh parses these to ISO 8601. Total vs SubTotal depends on tax inclusion. Contacts are embedded objects resolved to Entity references." },
      { type: "code", lang: "ts", text: `import { transformXeroInvoice } from '@claremesh/transforms/xero';

const txn = transformXeroInvoice(invoice, { org_id, entity_id });` },
      { type: "h3", text: "CSV" },
      { type: "p", text: "For custom data sources, the CSV transform accepts a column mapping configuration." },
      { type: "code", lang: "ts", text: `import { transformCSV } from '@claremesh/transforms/csv';

const transactions = transformCSV(csvData, {
  org_id,
  mapping: {
    amount: 'Amount',
    date: 'Transaction Date',
    description: 'Description',
    currency: 'Currency',
  },
});` },
    ]
  },
  {
    id: "api", title: "API reference", content: [
      { type: "h3", text: "Transform endpoint" },
      { type: "code", lang: "bash", text: `POST https://ddevkorgiutduydelhgv.supabase.co/functions/v1/transform

Headers:
  Authorization: Bearer <your-jwt-token>
  apikey: <your-anon-key>
  Content-Type: application/json

Body:
{
  "source_type": "plaid" | "stripe" | "quickbooks" | "xero" | "csv",
  "data": { ... },          // Raw provider response
  "org_id": "org_...",
  "entity_id": "ent_..."    // Optional
}

Response:
{
  "records": [ ... ],       // Array of normalized ClareMesh objects
  "records_in": 10,
  "records_out": 10,
  "errors": 0,
  "duration_ms": 12,
  "schema_version": "1.0.0"
}` },
      { type: "h3", text: "Schema registry endpoint" },
      { type: "code", lang: "bash", text: `GET https://ddevkorgiutduydelhgv.supabase.co/functions/v1/schema-registry

No authentication required. Public, CDN-cached.

Response:
{
  "version": "1.0.0",
  "objects": {
    "account": { ... },
    "transaction": { ... },
    "entity": { ... },
    "balance": { ... },
    "forecast": { ... }
  }
}` },
      { type: "h3", text: "Compliance dashboard endpoint" },
      { type: "code", lang: "bash", text: `GET https://ddevkorgiutduydelhgv.supabase.co/functions/v1/compliance-dashboard

Headers:
  Authorization: Bearer <your-jwt-token>
  apikey: <your-anon-key>

Query params:
  ?jurisdiction=US          // Filter by jurisdiction code

Response:
{
  "controls": [ ... ],
  "frameworks": ["SOC 2", "GDPR", ...],
  "jurisdiction": "US"
}` },
      { type: "h3", text: "Authentication" },
      { type: "p", text: "All authenticated endpoints require two headers: Authorization (Bearer JWT from Supabase auth) and apikey (your project's anon key). The JWT identifies the user; the anon key identifies the project. RLS policies enforce org-level isolation automatically." },
      { type: "h3", text: "Error codes" },
      { type: "code", lang: "json", text: `{
  "AUTH_001": "Missing authorization header",
  "AUTH_002": "Invalid or expired token",
  "TRANSFORM_001": "Unknown source_type",
  "TRANSFORM_002": "Invalid input data shape",
  "QUOTA_001": "Transform quota exceeded for current billing period",
  "RATE_001": "Rate limit exceeded (see Retry-After header)",
  "PLAN_001": "Feature not available on current plan",
  "COMPLIANCE_001": "Data residency violation"
}` },
    ]
  },
  {
    id: "billing", title: "Plans and billing", content: [
      { type: "p", text: "ClareMesh uses usage-based pricing. Every plan includes a base allocation of transforms per month. Overages are billed at the end of the billing cycle — transforms are never throttled." },
      { type: "h3", text: "Plan comparison" },
      { type: "code", lang: "text", text: `Plan        Monthly    Transforms    Connectors  Sync    Compliance  Audit
────────────────────────────────────────────────────────────────────────────
Open        $0         1,000/mo      1           No      0           7 days
Build       $199/mo    50,000/mo     5           No      4 controls  30 days
Scale       $799/mo    500,000/mo    Unlimited   Yes     14 controls 1 year
Enterprise  Custom     Unlimited     Unlimited   Yes     29 controls Forever` },
      { type: "p", text: "Annual billing saves 25%. All paid plans include a 30-day money-back guarantee. Your price never increases — early adopters keep their signup-era pricing forever." },
      { type: "h3", text: "Loyalty milestones" },
      { type: "p", text: "ClareMesh rewards tenure with permanent feature unlocks. At 3 months: +2,000 transforms. At 6 months: 30-day audit log on any plan. At 12 months: +5,000 transforms and custom transforms. Milestones never expire, even if you change plans." },
    ]
  },
];

function DocsContent() {
  const [activeSection, setActiveSection] = useState("quickstart");
  const section = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <div style={{ padding: "12px 32px", borderBottom: "0.5px solid var(--cm-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 14, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
          <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginLeft: 4 }}>DOCS</span>
        </a>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/pricing" style={{ fontSize: 12, color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Pricing</a>
          <a href="/schema" style={{ fontSize: 12, color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Schema browser</a>
          <a href="/signup" style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", textDecoration: "none", padding: "4px 12px", border: "0.5px solid var(--cm-border-light)" }}>Get started</a>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", maxWidth: 1040, margin: "0 auto" }}>
        {/* Sidebar */}
        <div style={{ borderRight: "0.5px solid var(--cm-border-light)", padding: "24px 16px", position: "sticky", top: 0, height: "fit-content" }}>
          {SECTIONS.map(s => (
            <button key={s.id} type="button" onClick={() => setActiveSection(s.id)} style={{
              display: "block", width: "100%", textAlign: "left", padding: "8px 12px", marginBottom: 2,
              fontSize: 12, fontFamily: F.b, cursor: "pointer", border: "none",
              background: activeSection === s.id ? "var(--cm-slate)" : "transparent",
              color: activeSection === s.id ? "#fff" : "var(--cm-text-panel-b)",
              fontWeight: activeSection === s.id ? 500 : 400,
            }}>{s.title}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: "32px 40px", maxWidth: 720 }}>
          <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 24 }}>{section.title}</h1>

          {section.content.map((block, i) => {
            if (block.type === "p") return <p key={i} style={{ fontSize: 13, color: "var(--cm-text-panel-b)", lineHeight: 1.8, marginBottom: 16 }}>{block.text}</p>;
            if (block.type === "h3") return <h3 key={i} style={{ fontFamily: F.d, fontWeight: 600, fontSize: 16, color: "var(--cm-text-panel-h)", marginTop: 28, marginBottom: 12 }}>{block.text}</h3>;
            if (block.type === "code") return (
              <div key={i} style={{ marginBottom: 16, position: "relative" }}>
                <div style={{ position: "absolute", top: 0, right: 0, padding: "4px 8px", fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>{block.lang}</div>
                <pre style={{ padding: "16px 16px 16px 16px", background: "var(--cm-terminal)", border: "0.5px solid var(--cm-terminal-bd)", fontFamily: F.m, fontSize: 11, color: "var(--cm-text-hero-b)", lineHeight: 1.8, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{block.text}</pre>
              </div>
            );
            return null;
          })}
        </div>
      </div>
    </div>
  );
}

export default function DocsPage() {
  return <Suspense><DocsContent /></Suspense>;
}

