"use client";
import { useState, Suspense } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const CHECKOUT_LINKS: Record<string, Record<string, string>> = {
  build: {
    monthly: "https://buy.stripe.com/28E4gzepp9EK47obIVdwc0S",
    annual: "https://buy.stripe.com/aFa28r5STeZ433kbIVdwc0U",
  },
  scale: {
    monthly: "https://buy.stripe.com/eVq6oH2GH5ougUadR3dwc0T",
    annual: "https://buy.stripe.com/eVqdR9dll7wC9rI00ddwc0V",
  },
};

const PLANS = [
  {
    code: "open", name: "Open", monthly: 0, annual: 0, cta: "Get started free",
    features: ["1 connector (CSV or Plaid)", "1,000 transforms/month", "7-day audit log", "Schema v1.0.0 access", "Community support"],
  },
  {
    code: "build", name: "Build", monthly: 199, annual: 149, cta: "Start Build",
    features: ["5 connectors", "50,000 transforms/month", "4 compliance controls", "30-day audit log", "Custom transforms", "Email support (24hr SLA)"],
  },
  {
    code: "scale", name: "Scale", monthly: 799, annual: 599, popular: true, cta: "Start Scale",
    features: ["Unlimited connectors", "500,000 transforms/month", "Bi-directional sync", "14 compliance controls", "1-year audit log", "Self-hosted option", "Priority support (4hr SLA)"],
  },
  {
    code: "enterprise", name: "Enterprise", monthly: null, annual: null, cta: "Contact us",
    features: ["Everything in Scale", "Unlimited transforms", "Dedicated Supabase project", "29 compliance controls", "Infinite audit retention", "SAML SSO + SCIM", "Custom SLA", "Dedicated account manager"],
  },
];

function PricingContent() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  const getHref = (code: string) => {
    if (code === "open") return "/signup";
    if (code === "enterprise") return "mailto:malik@claremesh.com?subject=ClareMesh%20Enterprise";
    return CHECKOUT_LINKS[code]?.[billing] || "/signup?plan=" + code;
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <div style={{ padding: "12px 32px", borderBottom: "0.5px solid var(--cm-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 14, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/security" style={{ fontSize: 12, color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Security</a>
          <a href="/loyalty" style={{ fontSize: 12, color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Loyalty</a>
          <a href="/login" style={{ fontSize: 12, color: "var(--cm-text-panel-b)", textDecoration: "none" }}>Log in</a>
          <a href="/signup" style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", textDecoration: "none", padding: "4px 12px", border: "0.5px solid var(--cm-border-light)" }}>Get started</a>
        </div>
      </div>

      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 32, letterSpacing: -1, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Simple, transparent pricing</h1>
          <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)", marginBottom: 24 }}>Start free. Upgrade when your data pipeline demands it. 30-day money-back guarantee on all paid plans.</p>
          <div style={{ display: "inline-flex", border: "0.5px solid var(--cm-border-light)", padding: 2 }}>
            <button type="button" onClick={() => setBilling("monthly")} style={{ padding: "6px 16px", fontSize: 12, fontFamily: F.b, cursor: "pointer", border: "none", background: billing === "monthly" ? "var(--cm-slate)" : "transparent", color: billing === "monthly" ? "#fff" : "var(--cm-text-panel-b)" }}>Monthly</button>
            <button type="button" onClick={() => setBilling("annual")} style={{ padding: "6px 16px", fontSize: 12, fontFamily: F.b, cursor: "pointer", border: "none", background: billing === "annual" ? "var(--cm-slate)" : "transparent", color: billing === "annual" ? "#fff" : "var(--cm-text-panel-b)" }}>
              Annual <span style={{ fontFamily: F.m, fontSize: 9, color: billing === "annual" ? "#fff" : "var(--cm-copper)" }}>SAVE 25%</span>
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
          {PLANS.map((p) => {
            const price = billing === "annual" ? p.annual : p.monthly;
            return (
              <div key={p.code} style={{ padding: "24px 20px", border: p.popular ? "2px solid var(--cm-slate)" : "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", display: "flex", flexDirection: "column", position: "relative" }}>
                {p.popular && <span style={{ position: "absolute", top: -1, right: 16, fontFamily: F.m, fontSize: 9, color: "var(--cm-panel)", background: "var(--cm-slate)", padding: "3px 8px" }}>RECOMMENDED</span>}
                <p style={{ fontFamily: F.d, fontWeight: 700, fontSize: 18, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>{p.name}</p>
                <div style={{ marginBottom: 20 }}>
                  {price !== null ? (
                    <>
                      <span style={{ fontFamily: F.m, fontSize: 36, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>${price}</span>
                      {price > 0 && <span style={{ fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>/mo</span>}
                      {billing === "annual" && p.monthly && p.monthly > 0 && (
                        <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginTop: 2 }}>
                          <span style={{ textDecoration: "line-through" }}>${p.monthly}</span> billed annually
                        </p>
                      )}
                    </>
                  ) : (
                    <span style={{ fontFamily: F.d, fontSize: 20, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>Custom</span>
                  )}
                </div>
                <div style={{ flex: 1, marginBottom: 20 }}>
                  {p.features.map((f) => (
                    <p key={f} style={{ fontSize: 12, color: "var(--cm-text-panel-b)", lineHeight: 2.2 }}>{f}</p>
                  ))}
                </div>
                <a href={getHref(p.code)} style={{
                  display: "block", textAlign: "center", padding: 12, fontSize: 13, fontWeight: 500, fontFamily: F.b, textDecoration: "none",
                  color: p.popular ? "#fff" : "var(--cm-text-panel-h)",
                  background: p.popular ? "var(--cm-slate)" : "var(--cm-panel)",
                  border: p.popular ? "none" : "0.5px solid var(--cm-border-light)",
                }}>{p.cta}</a>
              </div>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 40 }}>
          {[
            { title: "30-day money-back", desc: "Not satisfied? Full refund, no questions asked." },
            { title: "Your price never goes up", desc: "Early adopters keep their signup-era pricing forever." },
            { title: "Rewards never expire", desc: "Loyalty milestones are permanent. Downgrade and come back — they're waiting." },
          ].map((g) => (
            <div key={g.title} style={{ padding: 16, border: "0.5px solid var(--cm-border-light)" }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>{g.title}</p>
              <p style={{ fontSize: 11, color: "var(--cm-text-panel-b)", lineHeight: 1.6 }}>{g.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return <Suspense><PricingContent /></Suspense>;
}

