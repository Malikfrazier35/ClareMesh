"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const PROVIDERS = [
  { id: "plaid", name: "Plaid", desc: "Bank accounts, transactions, balances", tier: "open", status: "available", icon: "PLD", docs: "https://plaid.com/docs" },
  { id: "stripe", name: "Stripe", desc: "Payments, invoices, subscriptions, payouts", tier: "build", status: "available", icon: "STR", docs: "https://stripe.com/docs" },
  { id: "quickbooks", name: "QuickBooks Online", desc: "Chart of accounts, journal entries, P&L, balance sheet", tier: "build", status: "available", icon: "QB", docs: "https://developer.intuit.com" },
  { id: "xero", name: "Xero", desc: "Accounting data, contacts, bank transactions", tier: "build", status: "available", icon: "XRO", docs: "https://developer.xero.com" },
  { id: "csv", name: "CSV / Excel Upload", desc: "Manual file upload — map columns to ClareMesh schema", tier: "open", status: "available", icon: "CSV", docs: null },
  { id: "netsuite", name: "NetSuite", desc: "ERP financial modules, GL, AP/AR, fixed assets", tier: "scale", status: "coming_soon", icon: "NS", docs: null },
  { id: "sage", name: "Sage Intacct", desc: "Multi-entity accounting, dimensional reporting", tier: "scale", status: "coming_soon", icon: "SGE", docs: null },
  { id: "dynamics", name: "Microsoft Dynamics 365", desc: "Business Central, Finance & Operations", tier: "enterprise", status: "coming_soon", icon: "D365", docs: null },
];

function Nav({ active }: { active: string }) {
  const links = ["Dashboard", "Connectors", "Transforms", "Sync", "Compliance", "Settings"];
  return (
    <div style={{ padding: "12px 32px", borderBottom: "0.5px solid var(--cm-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 14, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
        <nav style={{ display: "flex", gap: 16 }}>
          {links.map((item) => (
            <a key={item} href={`/${item.toLowerCase()}`} style={{ fontSize: 12, fontFamily: F.b, color: item === active ? "var(--cm-text-panel-h)" : "var(--cm-text-panel-b)", textDecoration: "none", fontWeight: item === active ? 500 : 400 }}>{item}</a>
          ))}
        </nav>
      </div>
    </div>
  );
}

function ConnectorsContent() {
  const router = useRouter();
  const [connectors, setConnectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [org, setOrg] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
      if (profile) {
        const { data: o } = await supabase.from("organizations").select("*").eq("id", profile.org_id).single();
        setOrg(o);
        const { data: c } = await supabase.from("connectors").select("*").eq("org_id", profile.org_id);
        setConnectors(c || []);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const tierOrder: Record<string, number> = { open: 0, build: 1, scale: 2, enterprise: 3 };
  const userTier = tierOrder[org?.plan || "open"] || 0;

  const handleConnect = async (providerId: string) => {
    if (providerId === "csv") {
      // CSV upload flow — would open file picker
      alert("CSV upload coming soon — use the Transform API directly for now");
      return;
    }
    // OAuth flow — would redirect to provider OAuth
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
    if (!profile) return;

    const { error } = await supabase.from("connectors").insert({
      org_id: profile.org_id,
      provider: providerId,
      status: "pending",
      config: {},
    });
    if (!error) {
      const { data: c } = await supabase.from("connectors").select("*").eq("org_id", profile.org_id);
      setConnectors(c || []);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cm-panel)", fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>Loading...</div>
  );

  const activeConnectors = connectors.filter((c) => c.status === "active" || c.status === "pending");

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <Nav active="Connectors" />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>Connectors</h1>
            <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)" }}>{activeConnectors.length} active / {org?.plan === "open" ? "1" : org?.plan === "build" ? "5" : "unlimited"} available on {org?.plan || "open"} plan</p>
          </div>
        </div>

        {/* Active connectors */}
        {activeConnectors.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: F.d, fontWeight: 600, fontSize: 16, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>Active</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {activeConnectors.map((c) => {
                const provider = PROVIDERS.find((p) => p.id === c.provider);
                return (
                  <div key={c.id} style={{ padding: 16, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, border: "0.5px solid var(--cm-border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: F.m, fontSize: 8, color: "var(--cm-text-mono)" }}>{provider?.icon || "?"}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{provider?.name || c.provider}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ width: 6, height: 6, background: c.status === "active" ? "var(--cm-green)" : "var(--cm-copper)" }} />
                        <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-mono)" }}>{c.status.toUpperCase()}</span>
                      </div>
                    </div>
                    <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>Connected {new Date(c.created_at).toLocaleDateString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available providers */}
        <h2 style={{ fontFamily: F.d, fontWeight: 600, fontSize: 16, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>Available providers</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
          {PROVIDERS.map((p) => {
            const available = tierOrder[p.tier] <= userTier && p.status === "available";
            const connected = connectors.some((c) => c.provider === p.id);
            return (
              <div key={p.id} style={{ padding: 16, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", opacity: available && !connected ? 1 : 0.5, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ display: "flex", gap: 12, flex: 1 }}>
                  <div style={{ width: 36, height: 36, border: "0.5px solid var(--cm-border-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-mono)" }}>{p.icon}</span>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{p.name}</span>
                      {p.status === "coming_soon" && <span style={{ fontFamily: F.m, fontSize: 8, color: "var(--cm-copper)", padding: "1px 4px", border: "0.5px solid var(--cm-copper)" }}>SOON</span>}
                      {p.tier !== "open" && <span style={{ fontFamily: F.m, fontSize: 8, color: "var(--cm-text-dim)", padding: "1px 4px", border: "0.5px solid var(--cm-border-light)" }}>{p.tier.toUpperCase()}</span>}
                    </div>
                    <p style={{ fontSize: 11, color: "var(--cm-text-panel-b)", lineHeight: 1.5 }}>{p.desc}</p>
                  </div>
                </div>
                <div style={{ flexShrink: 0, marginLeft: 12 }}>
                  {connected ? (
                    <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-green)" }}>CONNECTED</span>
                  ) : available ? (
                    <button type="button" onClick={() => handleConnect(p.id)} style={{ fontFamily: F.b, fontSize: 11, fontWeight: 500, padding: "6px 12px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)", cursor: "pointer" }}>Connect</button>
                  ) : p.status === "coming_soon" ? (
                    <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>Q3 2026</span>
                  ) : (
                    <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>UPGRADE</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Transform API section */}
        <div style={{ marginTop: 32, padding: 20, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)" }}>
          <h3 style={{ fontFamily: F.d, fontWeight: 600, fontSize: 14, color: "var(--cm-text-hero-b)", marginBottom: 8 }}>Transform API</h3>
          <p style={{ fontSize: 12, color: "var(--cm-text-hero-sub)", marginBottom: 16, lineHeight: 1.7 }}>Send raw provider data directly to the transform endpoint. No connector setup required — just POST your JSON.</p>
          <div style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-mono)", lineHeight: 2 }}>
            <p style={{ color: "var(--cm-text-dim)" }}>// Example: transform a Plaid transaction</p>
            <p><span style={{ color: "var(--cm-copper)" }}>POST</span> https://ddevkorgiutduydelhgv.supabase.co/functions/v1/transform</p>
            <p style={{ color: "var(--cm-text-dim)" }}>Authorization: Bearer {"<your-jwt>"}</p>
            <p style={{ color: "var(--cm-text-dim)" }}>Content-Type: application/json</p>
            <p>{`{ "provider": "plaid", "records": [...] }`}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConnectorsPage() {
  return <Suspense><ConnectorsContent /></Suspense>;
}

