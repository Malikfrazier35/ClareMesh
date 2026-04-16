"use client";
import { useState, useEffect, Suspense } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const EXAMPLES: Record<string, { label: string; description: string; input: string }> = {
  plaid_account: {
    label: "Plaid Account",
    description: "Raw /accounts/get response from Plaid API",
    input: JSON.stringify({
      account_id: "blgvvBlXw3cq5GMPwqB6s6q4dLKB9WcVqGDGo",
      balances: {
        available: 4273.55,
        current: 4273.55,
        iso_currency_code: "USD",
        limit: null,
        unofficial_currency_code: null,
      },
      mask: "4444",
      name: "Plaid Checking",
      official_name: "Plaid Gold Standard 0% Interest Checking",
      subtype: "checking",
      type: "depository",
    }, null, 2),
  },
  plaid_transaction: {
    label: "Plaid Transaction",
    description: "Single transaction from /transactions/get",
    input: JSON.stringify({
      account_id: "blgvvBlXw3cq5GMPwqB6s6q4dLKB9WcVqGDGo",
      amount: 89.4,
      iso_currency_code: "USD",
      category: ["Food and Drink", "Restaurants"],
      category_id: "13005000",
      date: "2026-04-14",
      authorized_date: "2026-04-13",
      name: "SPARKFUN",
      merchant_name: "SparkFun",
      payment_channel: "in store",
      pending: false,
      transaction_id: "lPNjeW1nR6CDn5okmGQ6hEpMo4lLNoSrzqDje",
    }, null, 2),
  },
  stripe_charge: {
    label: "Stripe Charge",
    description: "Raw charge object from Stripe API",
    input: JSON.stringify({
      id: "ch_1NirD82eZvKYlo2CXkSLL2aT",
      object: "charge",
      amount: 12500,
      amount_captured: 12500,
      currency: "usd",
      created: 1776200000,
      customer: "cus_OZ8vWvKYlo2CX",
      description: "Invoice INV-0042",
      paid: true,
      status: "succeeded",
      payment_method_details: { type: "card", card: { last4: "4242", brand: "visa" } },
    }, null, 2),
  },
  quickbooks_account: {
    label: "QuickBooks Account",
    description: "Chart of accounts entry from QB Online",
    input: JSON.stringify({
      Id: "35",
      Name: "Checking",
      AccountType: "Bank",
      AccountSubType: "Checking",
      Classification: "Asset",
      CurrentBalance: 15432.87,
      CurrencyRef: { value: "USD" },
      Active: true,
      MetaData: { CreateTime: "2024-01-15T09:32:00-07:00", LastUpdatedTime: "2026-04-15T14:22:00-07:00" },
    }, null, 2),
  },
  xero_invoice: {
    label: "Xero Invoice",
    description: "Accounts receivable invoice from Xero",
    input: JSON.stringify({
      InvoiceID: "e4a72f3d-1b88-4a91-9c2f-8a4e5d6f7c21",
      Type: "ACCREC",
      Contact: { ContactID: "c3b5e2a1-7f4d-4b92-a1c8-2d5e6f7a8b90", Name: "Acme Corp" },
      Date: "/Date(1776200000000+0000)/",
      DueDate: "/Date(1778792000000+0000)/",
      Status: "AUTHORISED",
      LineAmountTypes: "Exclusive",
      Total: 5250.00,
      CurrencyCode: "USD",
      Reference: "PO-2026-0142",
    }, null, 2),
  },
};

// Pure-function simulator of what @claremesh/transforms will do
function transformPlaidAccount(raw: any): any {
  const TYPE_MAP: Record<string, string> = {
    depository: "asset",
    credit: "liability",
    loan: "liability",
    investment: "asset",
  };
  return {
    id: `acc_${raw.account_id.substring(0, 12)}`,
    org_id: "org_example",
    entity_id: "ent_example",
    account_type: TYPE_MAP[raw.type] || "asset",
    name: raw.official_name || raw.name,
    currency: raw.balances?.iso_currency_code || "USD",
    balance: raw.balances?.current ?? 0,
    available_balance: raw.balances?.available ?? null,
    source_provider: "plaid",
    source_account_id: raw.account_id,
    metadata: { mask: raw.mask, subtype: raw.subtype },
    schema_version: "2.4.1",
  };
}
function transformPlaidTransaction(raw: any): any {
  return {
    id: `txn_${raw.transaction_id.substring(0, 12)}`,
    org_id: "org_example",
    entity_id: "ent_example",
    account_id: `acc_${raw.account_id.substring(0, 12)}`,
    amount: -raw.amount, // Plaid expenses are positive; ClareMesh uses signed (debit negative)
    currency: raw.iso_currency_code || "USD",
    transaction_date: raw.date,
    posted_date: raw.authorized_date || raw.date,
    description: raw.merchant_name || raw.name,
    category: (raw.category || []).join(" · "),
    source_provider: "plaid",
    source_transaction_id: raw.transaction_id,
    metadata: { pending: raw.pending, payment_channel: raw.payment_channel, category_id: raw.category_id },
    schema_version: "2.4.1",
  };
}
function transformStripeCharge(raw: any): any {
  return {
    id: `txn_${raw.id.substring(3, 15)}`,
    org_id: "org_example",
    entity_id: "ent_example",
    account_id: "acc_stripe_balance",
    amount: raw.amount / 100, // cents → major units
    currency: (raw.currency || "usd").toUpperCase(),
    transaction_date: new Date(raw.created * 1000).toISOString().split("T")[0],
    posted_date: new Date(raw.created * 1000).toISOString().split("T")[0],
    description: raw.description || `Stripe charge ${raw.id}`,
    category: "revenue · card_payment",
    source_provider: "stripe",
    source_transaction_id: raw.id,
    metadata: {
      customer: raw.customer,
      card_brand: raw.payment_method_details?.card?.brand,
      card_last4: raw.payment_method_details?.card?.last4,
      status: raw.status,
    },
    schema_version: "2.4.1",
  };
}
function transformQuickbooksAccount(raw: any): any {
  const TYPE_MAP: Record<string, string> = {
    Bank: "asset",
    "Other Current Asset": "asset",
    "Fixed Asset": "asset",
    "Accounts Payable": "liability",
    "Credit Card": "liability",
    "Long Term Liability": "liability",
    Equity: "equity",
    Income: "revenue",
    Expense: "expense",
  };
  return {
    id: `acc_qb_${raw.Id}`,
    org_id: "org_example",
    entity_id: "ent_example",
    account_type: TYPE_MAP[raw.AccountType] || "asset",
    name: raw.Name,
    currency: raw.CurrencyRef?.value || "USD",
    balance: raw.CurrentBalance ?? 0,
    source_provider: "quickbooks",
    source_account_id: raw.Id,
    metadata: { classification: raw.Classification, subtype: raw.AccountSubType, active: raw.Active },
    schema_version: "2.4.1",
  };
}
function transformXeroInvoice(raw: any): any {
  // Xero dates come as /Date(epochms+0000)/
  const parseXeroDate = (d: string) => {
    const m = /\/Date\((\d+)/.exec(d || "");
    return m ? new Date(Number(m[1])).toISOString().split("T")[0] : null;
  };
  return {
    id: `txn_xero_${raw.InvoiceID.substring(0, 8)}`,
    org_id: "org_example",
    entity_id: "ent_example",
    account_id: "acc_accounts_receivable",
    amount: raw.Type === "ACCREC" ? raw.Total : -raw.Total,
    currency: raw.CurrencyCode || "USD",
    transaction_date: parseXeroDate(raw.Date),
    posted_date: parseXeroDate(raw.DueDate),
    description: `${raw.Contact?.Name || "Unknown"} — ${raw.Reference || raw.InvoiceID}`,
    category: raw.Type === "ACCREC" ? "revenue · invoice" : "expense · bill",
    source_provider: "xero",
    source_transaction_id: raw.InvoiceID,
    metadata: { status: raw.Status, contact_id: raw.Contact?.ContactID, reference: raw.Reference },
    schema_version: "2.4.1",
  };
}

function detectAndTransform(input: string): { output: any; detected: string; error: string | null } {
  let parsed: any;
  try { parsed = JSON.parse(input); }
  catch (e: any) { return { output: null, detected: "", error: `Invalid JSON: ${e.message}` }; }

  // Heuristic detection
  if (parsed.InvoiceID && parsed.Type && (parsed.Type === "ACCREC" || parsed.Type === "ACCPAY")) {
    return { output: transformXeroInvoice(parsed), detected: "Xero Invoice", error: null };
  }
  if (parsed.Id && parsed.AccountType && parsed.Classification) {
    return { output: transformQuickbooksAccount(parsed), detected: "QuickBooks Account", error: null };
  }
  if (parsed.object === "charge" && parsed.id?.startsWith("ch_")) {
    return { output: transformStripeCharge(parsed), detected: "Stripe Charge", error: null };
  }
  if (parsed.transaction_id && parsed.account_id) {
    return { output: transformPlaidTransaction(parsed), detected: "Plaid Transaction", error: null };
  }
  if (parsed.account_id && parsed.balances) {
    return { output: transformPlaidAccount(parsed), detected: "Plaid Account", error: null };
  }
  return { output: null, detected: "", error: "Could not auto-detect provider. Try one of the examples on the left." };
}

function PlaygroundContent() {
  const [input, setInput] = useState(EXAMPLES.plaid_account.input);
  const [activeExample, setActiveExample] = useState("plaid_account");
  const [result, setResult] = useState<{ output: any; detected: string; error: string | null }>({ output: null, detected: "", error: null });
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  // On mount, check URL for ?demo= param
  useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const demo = url.searchParams.get("demo");
    const shared = url.searchParams.get("s");
    if (shared) {
      try {
        const decoded = atob(shared);
        setInput(decoded);
        setActiveExample("custom");
      } catch {}
    } else if (demo && EXAMPLES[demo]) {
      setInput(EXAMPLES[demo].input);
      setActiveExample(demo);
    }
  }, []);

  // Transform on every input change
  useEffect(() => {
    setResult(detectAndTransform(input));
  }, [input]);

  const selectExample = (key: string) => {
    setInput(EXAMPLES[key].input);
    setActiveExample(key);
    const url = new URL(window.location.href);
    url.searchParams.set("demo", key);
    url.searchParams.delete("s");
    window.history.replaceState({}, "", url.toString());
  };

  const copyOutput = async () => {
    if (!result.output) return;
    await navigator.clipboard.writeText(JSON.stringify(result.output, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    const encoded = btoa(input);
    const url = new URL(window.location.href);
    url.searchParams.delete("demo");
    url.searchParams.set("s", encoded);
    await navigator.clipboard.writeText(url.toString());
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", borderBottom: "0.5px solid var(--cm-border-light)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 15, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
        <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
          <a href="/schema" style={{ color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Schema</a>
          <a href="/docs" style={{ color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Docs</a>
          <a href="/playground" style={{ color: "var(--cm-text-panel-h)", textDecoration: "none", fontWeight: 500 }}>Playground</a>
          <a href="/pricing" style={{ color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Pricing</a>
          <a href="/signup" style={{ color: "var(--cm-slate)", textDecoration: "none", fontWeight: 500 }}>Sign up</a>
        </div>
      </nav>

      {/* Header */}
      <div style={{ padding: "32px 32px 24px", maxWidth: 1200, margin: "0 auto" }}>
        <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2.5, color: "var(--cm-slate)", marginBottom: 8 }}>PLAYGROUND</p>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 32, letterSpacing: -0.8, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>
          Paste raw data, see the schema
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--cm-text-panel-b)", maxWidth: 720 }}>
          Drop in a raw Plaid, Stripe, QuickBooks, or Xero response. We auto-detect the provider and show what <code style={{ fontFamily: F.m, fontSize: 12, padding: "1px 6px", background: "var(--cm-terminal)", border: "0.5px solid var(--cm-border-light)" }}>@claremesh/transforms</code> produces. No signup. No data leaves your browser — this runs entirely client-side.
        </p>
      </div>

      {/* Main grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr 1fr", gap: 16 }}>
          {/* Example picker */}
          <div>
            <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-text-dim)", marginBottom: 12 }}>EXAMPLES</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {Object.entries(EXAMPLES).map(([key, ex]) => (
                <button key={key} type="button" onClick={() => selectExample(key)} style={{
                  padding: "10px 12px", textAlign: "left", border: "0.5px solid var(--cm-border-light)", cursor: "pointer",
                  background: activeExample === key ? "var(--cm-terminal)" : "var(--cm-panel)",
                  borderLeft: activeExample === key ? "2px solid var(--cm-slate)" : "0.5px solid var(--cm-border-light)",
                }}>
                  <p style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 2 }}>{ex.label}</p>
                  <p style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)", lineHeight: 1.4 }}>{ex.description}</p>
                </button>
              ))}
            </div>

            <div style={{ marginTop: 24, padding: 12, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)" }}>
              <p style={{ fontFamily: F.m, fontSize: 9, letterSpacing: 1.5, color: "var(--cm-copper)", marginBottom: 6 }}>ABOUT THIS</p>
              <p style={{ fontSize: 11, color: "var(--cm-text-panel-b)", lineHeight: 1.5, marginBottom: 8 }}>
                The playground simulates what <code style={{ fontFamily: F.m, fontSize: 10 }}>@claremesh/transforms</code> does. Auto-detection is heuristic-based.
              </p>
              <a href="https://github.com/Malikfrazier35/ClareMesh" target="_blank" rel="noopener" style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-slate)", textDecoration: "none" }}>
                Source on GitHub →
              </a>
            </div>
          </div>

          {/* Input */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-text-dim)" }}>INPUT · RAW PROVIDER JSON</p>
              <button type="button" onClick={shareLink} style={{ fontFamily: F.m, fontSize: 10, color: shared ? "var(--cm-copper)" : "var(--cm-slate)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                {shared ? "✓ LINK COPIED" : "SHARE LINK"}
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setActiveExample("custom"); }}
              spellCheck={false}
              style={{
                width: "100%", height: 520, padding: 16,
                fontFamily: F.m, fontSize: 12, lineHeight: 1.6,
                border: "0.5px solid var(--cm-border-light)",
                background: "var(--cm-terminal)",
                color: "var(--cm-text-panel-h)",
                resize: "vertical",
                outline: "none",
              }}
            />
          </div>

          {/* Output */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-text-dim)" }}>
                OUTPUT · CLAREMESH SCHEMA
                {result.detected && <span style={{ color: "var(--cm-copper)", marginLeft: 8 }}>· DETECTED: {result.detected.toUpperCase()}</span>}
              </p>
              <button type="button" onClick={copyOutput} disabled={!result.output} style={{ fontFamily: F.m, fontSize: 10, color: copied ? "var(--cm-copper)" : "var(--cm-slate)", background: "none", border: "none", cursor: result.output ? "pointer" : "default", padding: 0, opacity: result.output ? 1 : 0.4 }}>
                {copied ? "✓ COPIED" : "COPY"}
              </button>
            </div>
            <div style={{
              width: "100%", height: 520, padding: 16,
              fontFamily: F.m, fontSize: 12, lineHeight: 1.6,
              border: "0.5px solid var(--cm-border-light)",
              background: "var(--cm-panel)",
              color: "var(--cm-text-panel-h)",
              overflow: "auto",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}>
              {result.error ? (
                <span style={{ color: "#E24B4A" }}>{result.error}</span>
              ) : result.output ? (
                JSON.stringify(result.output, null, 2)
              ) : (
                <span style={{ color: "var(--cm-text-dim)" }}>Paste JSON on the left to see normalized output.</span>
              )}
            </div>
          </div>
        </div>

        {/* Code snippet */}
        {result.output && !result.error && (
          <div style={{ marginTop: 24, border: "0.5px solid var(--cm-border-light)" }}>
            <div style={{ padding: "10px 16px", background: "var(--cm-terminal)", borderBottom: "0.5px solid var(--cm-border-light)" }}>
              <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-text-dim)" }}>DO THIS IN YOUR OWN CODE</p>
            </div>
            <div style={{ padding: 16, fontFamily: F.m, fontSize: 12, lineHeight: 1.8, color: "var(--cm-text-panel-h)" }}>
              <div><span style={{ color: "var(--cm-slate)" }}>import</span> {`{ ${result.detected.replace(/\s/g, "").replace(/^./, c => "transform" + c.toUpperCase()).replace(/([A-Z])/g, (m, _, i) => i === 0 ? m : m)} }`} <span style={{ color: "var(--cm-slate)" }}>from</span> <span style={{ color: "var(--cm-copper)" }}>'@claremesh/transforms/{result.detected.split(" ")[0].toLowerCase()}'</span>;</div>
              <div><span style={{ color: "var(--cm-slate)" }}>import type</span> {`{ ${result.detected.includes("Transaction") || result.detected.includes("Charge") || result.detected.includes("Invoice") ? "Transaction" : "Account"} }`} <span style={{ color: "var(--cm-slate)" }}>from</span> <span style={{ color: "var(--cm-copper)" }}>'@claremesh/schema'</span>;</div>
              <br />
              <div><span style={{ color: "var(--cm-slate)" }}>const</span> result = {`transform${result.detected.replace(/\s/g, "")}`}(rawResponse, {`{`}</div>
              <div style={{ paddingLeft: 24 }}>org_id: <span style={{ color: "var(--cm-copper)" }}>'org_d8afc85d'</span>,</div>
              <div style={{ paddingLeft: 24 }}>entity_id: <span style={{ color: "var(--cm-copper)" }}>'ent_acme_01'</span>,</div>
              <div>{`}`});</div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: 32, padding: "24px 28px", border: "0.5px solid var(--cm-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 }}>
          <div>
            <p style={{ fontFamily: F.d, fontSize: 18, fontWeight: 600, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>Like what you see?</p>
            <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)" }}>Install the packages, star the repo, or spin up a hosted instance in 60 seconds.</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="https://github.com/Malikfrazier35/ClareMesh" target="_blank" rel="noopener" style={{ padding: "10px 18px", fontSize: 13, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", color: "var(--cm-text-panel-h)", textDecoration: "none", whiteSpace: "nowrap" }}>Star on GitHub</a>
            <a href="/signup" style={{ padding: "10px 18px", fontSize: 13, fontWeight: 500, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", textDecoration: "none", whiteSpace: "nowrap" }}>Start free</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlaygroundPage() { return <Suspense><PlaygroundContent /></Suspense>; }

