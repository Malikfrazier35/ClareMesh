"use client";
import { useState, Suspense } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const H2 = { fontFamily: F.d, fontWeight: 700, fontSize: 20, letterSpacing: -0.3, color: "var(--cm-text-panel-h)", marginTop: 32, marginBottom: 12 };
const H3 = { fontFamily: F.d, fontWeight: 600, fontSize: 16, color: "var(--cm-text-panel-h)", marginTop: 24, marginBottom: 8 };
const P = { fontSize: 13, color: "var(--cm-text-panel-b)", lineHeight: 1.8, marginBottom: 16 };
const codeBlockStyle = { padding: "16px", background: "var(--cm-terminal)", border: "0.5px solid var(--cm-border-light)", fontFamily: F.m, fontSize: 11, color: "var(--cm-text-hero-b)", lineHeight: 1.8, overflowX: "auto" as const, whiteSpace: "pre-wrap" as const, wordBreak: "break-word" as const, marginBottom: 16, position: "relative" as const };
const labelStyle = { position: "absolute" as const, top: 0, right: 0, padding: "4px 8px", fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" };
const tableStyle = { width: "100%", borderCollapse: "collapse" as const, fontSize: 12, marginBottom: 16 };
const thStyle = { textAlign: "left" as const, padding: "8px 12px", borderBottom: "0.5px solid var(--cm-border-light)", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", background: "var(--cm-terminal)" };
const tdStyle = { padding: "8px 12px", borderBottom: "0.5px solid var(--cm-border-light)", color: "var(--cm-text-panel-b)" };
const inlineCode = { fontFamily: F.m, fontSize: 12, padding: "1px 5px", background: "var(--cm-terminal)", border: "0.5px solid var(--cm-border-light)", color: "var(--cm-text-panel-h)" };

function CodeBlock({ lang, children }: { lang: string; children: string }) {
  return <div style={codeBlockStyle}><span style={labelStyle}>{lang}</span><pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{children}</pre></div>;
}

// ═══ QUICKSTART TAB ═══
function QuickstartTab() {
  return (
    <div>
      <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 24 }}>Quickstart</h1>
      <p style={P}>Get ClareMesh running in under 5 minutes. Install the schema and transform packages, normalize your first financial record, and validate the output.</p>

      <CodeBlock lang="bash">{`npm install @claremesh/schema @claremesh/transforms`}</CodeBlock>

      <p style={P}>Import a provider-specific transform and your schema types:</p>

      <CodeBlock lang="ts">{`import { transformPlaidTransaction } from '@claremesh/transforms/plaid';
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
// provider_id preserves 'txn_abc123'`}</CodeBlock>

      <p style={P}>That's it. The transform handles sign convention, date parsing, currency normalization, and ID generation. Every edge case from the provider corpus is covered.</p>

      <h2 style={H2}>Next steps</h2>
      <p style={P}>Explore the <a href="/schema" style={{ color: "var(--cm-slate)" }}>schema browser</a> to see all five object types. Try the <a href="/playground" style={{ color: "var(--cm-slate)" }}>playground</a> to paste raw provider JSON and see normalized output instantly. Read the <a href="/blog/5-bugs-every-plaid-integration-ships" style={{ color: "var(--cm-slate)" }}>Plaid bugs post</a> to understand the edge cases ClareMesh handles for you.</p>
    </div>
  );
}

// ═══ SCHEMA REFERENCE TAB ═══
function SchemaTab() {
  return (
    <div>
      <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 24 }}>Schema reference</h1>
      <p style={P}>ClareMesh defines five canonical object types. Every provider's data normalizes into one of these shapes. All types are Zod-validated and exported as both TypeScript types and runtime validators.</p>

      <h2 style={H2}>Account</h2>
      <p style={P}>Represents a financial account — bank account, credit card, loan, investment, or any container that holds a balance.</p>
      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>FIELD</th><th style={thStyle}>TYPE</th><th style={thStyle}>DESCRIPTION</th></tr></thead>
        <tbody>
          <tr><td style={tdStyle}><code style={inlineCode}>id</code></td><td style={tdStyle}>uuid</td><td style={tdStyle}>ClareMesh-generated unique identifier</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>provider_id</code></td><td style={tdStyle}>string</td><td style={tdStyle}>Original ID from the provider (e.g. Plaid account_id)</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>provider</code></td><td style={tdStyle}>enum</td><td style={tdStyle}>plaid | stripe | quickbooks | xero | netsuite | csv</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>org_id</code></td><td style={tdStyle}>uuid</td><td style={tdStyle}>Your organization identifier</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>entity_id</code></td><td style={tdStyle}>uuid</td><td style={tdStyle}>The legal entity this account belongs to</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>name</code></td><td style={tdStyle}>string</td><td style={tdStyle}>Human-readable account name</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>type</code></td><td style={tdStyle}>enum</td><td style={tdStyle}>asset | liability | equity | revenue | expense</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>subtype</code></td><td style={tdStyle}>string?</td><td style={tdStyle}>Provider-specific subtype (checking, savings, credit, etc.)</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>currency</code></td><td style={tdStyle}>string</td><td style={tdStyle}>ISO 4217 currency code (uppercase)</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>current_balance</code></td><td style={tdStyle}>number</td><td style={tdStyle}>Balance in major units (not cents). Signed: positive = asset value.</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>status</code></td><td style={tdStyle}>enum</td><td style={tdStyle}>active | inactive | closed</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>synced_at</code></td><td style={tdStyle}>ISO 8601</td><td style={tdStyle}>Last successful sync timestamp (UTC)</td></tr>
        </tbody>
      </table>

      <h2 style={H2}>Transaction</h2>
      <p style={P}>A single financial movement — debit, credit, transfer, fee, or refund. ClareMesh uses signed amounts: negative = outflow (debit), positive = inflow (credit).</p>
      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>FIELD</th><th style={thStyle}>TYPE</th><th style={thStyle}>DESCRIPTION</th></tr></thead>
        <tbody>
          <tr><td style={tdStyle}><code style={inlineCode}>id</code></td><td style={tdStyle}>uuid</td><td style={tdStyle}>ClareMesh-generated unique identifier</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>provider_id</code></td><td style={tdStyle}>string</td><td style={tdStyle}>Original transaction ID from provider</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>account_id</code></td><td style={tdStyle}>uuid</td><td style={tdStyle}>Reference to the ClareMesh Account</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>amount</code></td><td style={tdStyle}>number</td><td style={tdStyle}>Signed amount in major units. Negative = debit/outflow.</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>currency</code></td><td style={tdStyle}>string</td><td style={tdStyle}>ISO 4217 currency code</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>date</code></td><td style={tdStyle}>ISO 8601</td><td style={tdStyle}>Transaction date (UTC)</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>description</code></td><td style={tdStyle}>string</td><td style={tdStyle}>Normalized description / merchant name</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>category</code></td><td style={tdStyle}>string?</td><td style={tdStyle}>ClareMesh-normalized category</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>status</code></td><td style={tdStyle}>enum</td><td style={tdStyle}>pending | posted | cancelled</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>metadata</code></td><td style={tdStyle}>object</td><td style={tdStyle}>Provider-specific fields preserved as-is</td></tr>
        </tbody>
      </table>

      <h2 style={H2}>Entity</h2>
      <p style={P}>A legal entity — company, subsidiary, or individual that owns accounts. Entities are the top-level grouping for multi-entity consolidation.</p>
      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>FIELD</th><th style={thStyle}>TYPE</th><th style={thStyle}>DESCRIPTION</th></tr></thead>
        <tbody>
          <tr><td style={tdStyle}><code style={inlineCode}>id</code></td><td style={tdStyle}>uuid</td><td style={tdStyle}>Unique identifier</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>name</code></td><td style={tdStyle}>string</td><td style={tdStyle}>Legal entity name</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>type</code></td><td style={tdStyle}>enum</td><td style={tdStyle}>company | subsidiary | individual</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>jurisdiction</code></td><td style={tdStyle}>string</td><td style={tdStyle}>ISO 3166 country code</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>fiscal_year_end</code></td><td style={tdStyle}>string</td><td style={tdStyle}>MM-DD format (e.g. "12-31")</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>base_currency</code></td><td style={tdStyle}>string</td><td style={tdStyle}>ISO 4217 reporting currency</td></tr>
        </tbody>
      </table>

      <h2 style={H2}>Balance</h2>
      <p style={P}>A point-in-time balance snapshot for an account. Used for historical balance tracking and reconciliation.</p>
      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>FIELD</th><th style={thStyle}>TYPE</th><th style={thStyle}>DESCRIPTION</th></tr></thead>
        <tbody>
          <tr><td style={tdStyle}><code style={inlineCode}>account_id</code></td><td style={tdStyle}>uuid</td><td style={tdStyle}>Reference to Account</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>current</code></td><td style={tdStyle}>number</td><td style={tdStyle}>Current balance in major units</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>available</code></td><td style={tdStyle}>number?</td><td style={tdStyle}>Available balance (if reported by provider)</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>as_of</code></td><td style={tdStyle}>ISO 8601</td><td style={tdStyle}>Timestamp of this snapshot</td></tr>
        </tbody>
      </table>

      <h2 style={H2}>Forecast</h2>
      <p style={P}>A projected future value for an account or metric. Used for cash flow forecasting and scenario planning.</p>
      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>FIELD</th><th style={thStyle}>TYPE</th><th style={thStyle}>DESCRIPTION</th></tr></thead>
        <tbody>
          <tr><td style={tdStyle}><code style={inlineCode}>account_id</code></td><td style={tdStyle}>uuid</td><td style={tdStyle}>Reference to Account</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>period_start</code></td><td style={tdStyle}>ISO 8601</td><td style={tdStyle}>Start of the forecast period</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>period_end</code></td><td style={tdStyle}>ISO 8601</td><td style={tdStyle}>End of the forecast period</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>projected_amount</code></td><td style={tdStyle}>number</td><td style={tdStyle}>Projected value in major units</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>confidence</code></td><td style={tdStyle}>number</td><td style={tdStyle}>Confidence score 0-1</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>method</code></td><td style={tdStyle}>enum</td><td style={tdStyle}>linear | ema | monte_carlo | manual</td></tr>
        </tbody>
      </table>

      <h2 style={H2}>Conventions</h2>
      <p style={P}><strong>Amounts:</strong> Always in major units (dollars, not cents). A $42.50 transaction is <code style={inlineCode}>42.50</code>, not <code style={inlineCode}>4250</code>. Signed: negative = outflow/debit, positive = inflow/credit.</p>
      <p style={P}><strong>Dates:</strong> ISO 8601 with UTC timezone. Example: <code style={inlineCode}>2026-04-15T00:00:00.000Z</code>.</p>
      <p style={P}><strong>Currency:</strong> ISO 4217 uppercase. Always <code style={inlineCode}>USD</code>, never <code style={inlineCode}>usd</code>.</p>
      <p style={P}><strong>IDs:</strong> ClareMesh generates UUID v4 for all <code style={inlineCode}>id</code> fields. Original provider IDs are preserved in <code style={inlineCode}>provider_id</code>.</p>
    </div>
  );
}

// ═══ TRANSFORMS TAB ═══
function TransformsTab() {
  return (
    <div>
      <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 24 }}>Transforms</h1>
      <p style={P}>Each provider has a dedicated transform module that converts raw API responses into ClareMesh schema objects. Transforms handle sign convention, date parsing, currency normalization, status mapping, and edge cases specific to each provider.</p>

      <h2 style={H2}>Available transforms</h2>
      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>PROVIDER</th><th style={thStyle}>IMPORT PATH</th><th style={thStyle}>OBJECTS</th></tr></thead>
        <tbody>
          <tr><td style={tdStyle}>Plaid</td><td style={tdStyle}><code style={inlineCode}>@claremesh/transforms/plaid</code></td><td style={tdStyle}>Account, Transaction, Balance</td></tr>
          <tr><td style={tdStyle}>Stripe</td><td style={tdStyle}><code style={inlineCode}>@claremesh/transforms/stripe</code></td><td style={tdStyle}>Account, Transaction</td></tr>
          <tr><td style={tdStyle}>QuickBooks</td><td style={tdStyle}><code style={inlineCode}>@claremesh/transforms/quickbooks</code></td><td style={tdStyle}>Account, Transaction, Entity</td></tr>
          <tr><td style={tdStyle}>Xero</td><td style={tdStyle}><code style={inlineCode}>@claremesh/transforms/xero</code></td><td style={tdStyle}>Account, Transaction, Entity</td></tr>
          <tr><td style={tdStyle}>NetSuite</td><td style={tdStyle}><code style={inlineCode}>@claremesh/transforms/netsuite</code></td><td style={tdStyle}>Account, Transaction, Entity</td></tr>
          <tr><td style={tdStyle}>CSV</td><td style={tdStyle}><code style={inlineCode}>@claremesh/transforms/csv</code></td><td style={tdStyle}>Transaction (configurable column mapping)</td></tr>
        </tbody>
      </table>

      <h2 style={H2}>Plaid transforms</h2>
      <p style={P}>Plaid uses positive amounts for outflows and negative for inflows — the opposite of ClareMesh. The transform flips the sign automatically.</p>
      <CodeBlock lang="ts">{`import { transformPlaidTransaction, transformPlaidAccount } from '@claremesh/transforms/plaid';

// Transform a single transaction
const txn = transformPlaidTransaction(plaidResponse, { org_id, entity_id });

// Transform an account with balance
const acct = transformPlaidAccount(plaidAccount, { org_id, entity_id });`}</CodeBlock>

      <h3 style={H3}>Plaid edge cases handled</h3>
      <p style={P}><strong>Sign flip:</strong> Plaid positive = outflow becomes ClareMesh negative. <strong>Pending transactions:</strong> Status mapped to "pending", updated to "posted" on re-sync. <strong>Currency fallback:</strong> Uses <code style={inlineCode}>unofficial_currency_code</code> when <code style={inlineCode}>iso_currency_code</code> is null. <strong>Category mapping:</strong> Plaid's hierarchical categories flattened to ClareMesh single-level. <strong>Date parsing:</strong> Plaid returns date-only strings, ClareMesh converts to full ISO 8601 UTC.</p>

      <h2 style={H2}>Stripe transforms</h2>
      <p style={P}>Stripe uses amounts in cents (minor units). The transform divides by 100 to convert to major units.</p>
      <CodeBlock lang="ts">{`import { transformStripeCharge } from '@claremesh/transforms/stripe';

// Stripe charge of 4250 cents → ClareMesh amount of -42.50
const txn = transformStripeCharge(stripeCharge, { org_id, entity_id });`}</CodeBlock>

      <h2 style={H2}>QuickBooks transforms</h2>
      <p style={P}>QuickBooks journal entries use debit/credit columns instead of signed amounts. The transform normalizes to signed amounts based on the account type.</p>
      <CodeBlock lang="ts">{`import { transformQBJournalEntry } from '@claremesh/transforms/quickbooks';

const txns = transformQBJournalEntry(qbEntry, { org_id, entity_id });
// Returns an array — one Transaction per journal line`}</CodeBlock>

      <h2 style={H2}>Transform options</h2>
      <p style={P}>All transforms accept a second argument with context options:</p>
      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>OPTION</th><th style={thStyle}>TYPE</th><th style={thStyle}>REQUIRED</th><th style={thStyle}>DESCRIPTION</th></tr></thead>
        <tbody>
          <tr><td style={tdStyle}><code style={inlineCode}>org_id</code></td><td style={tdStyle}>string</td><td style={tdStyle}>Yes</td><td style={tdStyle}>Your organization ID</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>entity_id</code></td><td style={tdStyle}>string</td><td style={tdStyle}>Yes</td><td style={tdStyle}>The legal entity owning this data</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>default_currency</code></td><td style={tdStyle}>string</td><td style={tdStyle}>No</td><td style={tdStyle}>Fallback currency if provider doesn't specify</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>timezone</code></td><td style={tdStyle}>string</td><td style={tdStyle}>No</td><td style={tdStyle}>IANA timezone for date-only values (default: UTC)</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ═══ API REFERENCE TAB ═══
function ApiTab() {
  return (
    <div>
      <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 24 }}>API reference</h1>
      <p style={P}>The ClareMesh API is available on paid plans (Build and above). Authentication is via API key passed as a Bearer token. All endpoints are served from your Supabase project's edge functions.</p>

      <h2 style={H2}>Authentication</h2>
      <CodeBlock lang="bash">{`curl -X POST https://your-project.supabase.co/functions/v1/transform \\
  -H "Authorization: Bearer cm_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"provider": "plaid", "data": {...}}'`}</CodeBlock>

      <h2 style={H2}>POST /functions/v1/transform</h2>
      <p style={P}>Transform raw provider data into ClareMesh schema. Accepts a single record or a batch of up to 1,000 records.</p>
      <h3 style={H3}>Request body</h3>
      <CodeBlock lang="json">{`{
  "provider": "plaid",
  "type": "transaction",
  "data": { ... },
  "options": {
    "org_id": "your-org-id",
    "entity_id": "your-entity-id"
  }
}`}</CodeBlock>

      <h3 style={H3}>Response</h3>
      <CodeBlock lang="json">{`{
  "success": true,
  "data": {
    "id": "uuid-v4",
    "provider_id": "original-id",
    "amount": -42.50,
    "currency": "USD",
    "date": "2026-04-15T00:00:00.000Z",
    "status": "posted"
  },
  "lineage": {
    "transform_version": "2.4.1",
    "provider": "plaid",
    "transformed_at": "2026-04-16T18:00:00.000Z"
  }
}`}</CodeBlock>

      <h2 style={H2}>POST /functions/v1/transform/batch</h2>
      <p style={P}>Transform up to 1,000 records in a single request. Same format as single transform but <code style={inlineCode}>data</code> is an array.</p>

      <h2 style={H2}>GET /functions/v1/schema-registry</h2>
      <p style={P}>Returns the current schema version and all object type definitions as JSON Schema.</p>

      <h2 style={H2}>Error codes</h2>
      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>CODE</th><th style={thStyle}>STATUS</th><th style={thStyle}>DESCRIPTION</th></tr></thead>
        <tbody>
          <tr><td style={tdStyle}><code style={inlineCode}>invalid_provider</code></td><td style={tdStyle}>400</td><td style={tdStyle}>Provider not recognized or not supported</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>validation_error</code></td><td style={tdStyle}>400</td><td style={tdStyle}>Input data fails Zod validation</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>auth_required</code></td><td style={tdStyle}>401</td><td style={tdStyle}>Missing or invalid API key</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>plan_exceeded</code></td><td style={tdStyle}>403</td><td style={tdStyle}>Transform count exceeds plan limit</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>rate_limited</code></td><td style={tdStyle}>429</td><td style={tdStyle}>Too many requests — wait and retry</td></tr>
          <tr><td style={tdStyle}><code style={inlineCode}>transform_error</code></td><td style={tdStyle}>500</td><td style={tdStyle}>Internal transform failure — report as bug</td></tr>
        </tbody>
      </table>

      <h2 style={H2}>Rate limits</h2>
      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>PLAN</th><th style={thStyle}>REQUESTS/MIN</th><th style={thStyle}>BATCH SIZE</th></tr></thead>
        <tbody>
          <tr><td style={tdStyle}>Build</td><td style={tdStyle}>60</td><td style={tdStyle}>100</td></tr>
          <tr><td style={tdStyle}>Scale</td><td style={tdStyle}>300</td><td style={tdStyle}>1,000</td></tr>
          <tr><td style={tdStyle}>Enterprise</td><td style={tdStyle}>Custom</td><td style={tdStyle}>Custom</td></tr>
        </tbody>
      </table>
    </div>
  );
}

// ═══ PLANS TAB ═══
function PlansTab() {
  return (
    <div>
      <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 24 }}>Plans and billing</h1>

      <table style={tableStyle}>
        <thead><tr><th style={thStyle}>FEATURE</th><th style={thStyle}>OPEN (FREE)</th><th style={thStyle}>BUILD ($199/MO)</th><th style={thStyle}>SCALE ($799/MO)</th><th style={thStyle}>ENTERPRISE</th></tr></thead>
        <tbody>
          <tr><td style={tdStyle}>Schema + transforms</td><td style={tdStyle}>Unlimited</td><td style={tdStyle}>Unlimited</td><td style={tdStyle}>Unlimited</td><td style={tdStyle}>Unlimited</td></tr>
          <tr><td style={tdStyle}>Transforms/month</td><td style={tdStyle}>1,000</td><td style={tdStyle}>50,000</td><td style={tdStyle}>500,000</td><td style={tdStyle}>Unlimited</td></tr>
          <tr><td style={tdStyle}>API access</td><td style={tdStyle}>—</td><td style={tdStyle}>Yes</td><td style={tdStyle}>Yes</td><td style={tdStyle}>Yes</td></tr>
          <tr><td style={tdStyle}>Bi-directional sync</td><td style={tdStyle}>—</td><td style={tdStyle}>—</td><td style={tdStyle}>Yes</td><td style={tdStyle}>Yes</td></tr>
          <tr><td style={tdStyle}>Compliance dashboard</td><td style={tdStyle}>Basic</td><td style={tdStyle}>Full</td><td style={tdStyle}>Full + export</td><td style={tdStyle}>Full + audit</td></tr>
          <tr><td style={tdStyle}>Team members</td><td style={tdStyle}>1</td><td style={tdStyle}>5</td><td style={tdStyle}>25</td><td style={tdStyle}>Unlimited</td></tr>
          <tr><td style={tdStyle}>Support</td><td style={tdStyle}>Community</td><td style={tdStyle}>Email</td><td style={tdStyle}>Priority</td><td style={tdStyle}>Dedicated + SLA</td></tr>
          <tr><td style={tdStyle}>Data residency</td><td style={tdStyle}>US</td><td style={tdStyle}>US</td><td style={tdStyle}>US, EU</td><td style={tdStyle}>Custom region</td></tr>
        </tbody>
      </table>

      <h2 style={H2}>Usage metering</h2>
      <p style={P}>Transform usage is metered per calendar month. Each call to a transform function (whether via npm package or API) counts as one transform. Batch transforms count as one transform per record in the batch. Usage resets on the first of each month at midnight UTC.</p>

      <h2 style={H2}>Overages</h2>
      <p style={P}>If you exceed your plan's monthly transform limit, additional transforms are billed at the following rates: Build plan: $0.005/transform, Scale plan: $0.002/transform. You can set a hard cap in Settings to prevent overages. Enterprise plans have no overage charges.</p>

      <h2 style={H2}>Billing cycle</h2>
      <p style={P}>Subscriptions are billed monthly or annually (annual saves ~17%). You can upgrade, downgrade, or cancel at any time. Upgrades take effect immediately with prorated billing. Downgrades take effect at the end of the current billing period. Cancellation triggers a 30-day grace period during which you can export your data.</p>

      <h2 style={H2}>Managing your subscription</h2>
      <p style={P}>You can manage your subscription from <a href="/settings?tab=billing" style={{ color: "var(--cm-slate)" }}>Settings → Billing</a>. The billing tab shows your current plan, usage, and provides access to the Stripe Customer Portal for payment method updates and invoice downloads.</p>

      <h2 style={H2}>Enterprise</h2>
      <p style={P}>Enterprise plans include dedicated infrastructure, custom SLAs, SOC 2 Type II reports, dedicated support engineer, and custom data residency regions. Contact <a href="mailto:malik@claremesh.com" style={{ color: "var(--cm-slate)" }}>malik@claremesh.com</a> for enterprise pricing.</p>
    </div>
  );
}

// ═══ MAIN DOCS PAGE ═══
const TABS = [
  { key: "quickstart", label: "Quickstart" },
  { key: "schema", label: "Schema reference" },
  { key: "transforms", label: "Transforms" },
  { key: "api", label: "API reference" },
  { key: "plans", label: "Plans and billing" },
];

function DocsContent() {
  const [activeTab, setActiveTab] = useState("quickstart");

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
          <a href="/playground" style={{ fontSize: 12, color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Playground</a>
          <a href="/signup" style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", textDecoration: "none", padding: "4px 12px", border: "0.5px solid var(--cm-border-light)" }}>Get started</a>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ borderRight: "0.5px solid var(--cm-border-light)", padding: "24px 16px", position: "sticky" as const, top: 0, height: "fit-content" }}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              display: "block", width: "100%", textAlign: "left", padding: "8px 12px", marginBottom: 2,
              fontSize: 12, fontFamily: F.b, cursor: "pointer", border: "none",
              background: activeTab === tab.key ? "var(--cm-slate)" : "transparent",
              color: activeTab === tab.key ? "#fff" : "var(--cm-text-panel-b)",
              fontWeight: activeTab === tab.key ? 500 : 400,
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "32px 40px", maxWidth: 720 }}>
          {activeTab === "quickstart" && <QuickstartTab />}
          {activeTab === "schema" && <SchemaTab />}
          {activeTab === "transforms" && <TransformsTab />}
          {activeTab === "api" && <ApiTab />}
          {activeTab === "plans" && <PlansTab />}
        </div>
      </div>
    </div>
  );
}

export default function DocsPage() { return <Suspense><DocsContent /></Suspense>; }

