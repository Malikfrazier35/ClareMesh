"use client";
import AuthGate from "@/components/AuthGate";
import AppShellNew from "@/components/AppShell";
import { useState, useEffect, Suspense } from "react";
import { createClient } from "@supabase/supabase-js";
import AppShell from "@/components/AppShell";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const supabase = createClient(
  "https://ddevkorgiutduydelhgv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZXZrb3JnaXV0ZHV5ZGVsaGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODI0NDIsImV4cCI6MjA5MTc1ODQ0Mn0.J42xtXgMJ0J4DdTwg3eCHKafOHTe0Tb6WRlTwZ9B-eE"
);

const PROVIDERS = [
  { id: "plaid", name: "Plaid", desc: "Bank accounts, transactions, balances", badge: "Most popular" },
  { id: "stripe", name: "Stripe", desc: "Charges, refunds, payouts, invoices", badge: null },
  { id: "quickbooks", name: "QuickBooks", desc: "Journal entries, invoices, accounts", badge: null },
  { id: "xero", name: "Xero", desc: "Invoices, bank transactions, contacts", badge: null },
  { id: "csv", name: "CSV Upload", desc: "Custom data from any source", badge: "Free" },
];

function ConnectorsContent() {
  const [connectors, setConnectors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
      if (!profile) return;
      const { data } = await supabase.from("connectors").select("*").eq("org_id", profile.org_id).order("created_at", { ascending: false });
      setConnectors(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <AuthGate>{({ profile, org }) => (
    <AppShell profile={profile} org={org} activePage="connectors">
      <div style={{ padding: "24px 32px", maxWidth: 960 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 20, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>Connectors</h1>
            <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)" }}>Connect financial data sources to normalize and sync</p>
          </div>
          <button type="button" onClick={() => setShowAdd(!showAdd)} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 500, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", border: "none", cursor: "pointer" }}>
            {showAdd ? "Cancel" : "Add connector"}
          </button>
        </div>

        {/* Add connector panel */}
        {showAdd && (
          <div style={{ border: "0.5px solid var(--cm-border-light)", padding: 20, marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>Choose a provider</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {PROVIDERS.map((p) => (
                <button key={p.id} type="button" onClick={() => alert(`${p.name} connector setup coming soon. For now, use the transform API endpoint directly.`)} style={{
                  padding: "16px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", cursor: "pointer", textAlign: "left", position: "relative",
                }}>
                  {p.badge && <span style={{ position: "absolute", top: 8, right: 8, fontFamily: F.m, fontSize: 9, color: "var(--cm-copper)", padding: "2px 6px", border: "0.5px solid var(--cm-border-light)" }}>{p.badge}</span>}
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: "var(--cm-text-dim)" }}>{p.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Existing connectors */}
        {loading ? (
          <p style={{ fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>Loading connectors...</p>
        ) : connectors.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", border: "0.5px solid var(--cm-border-light)" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>No connectors yet</p>
            <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", marginBottom: 16, maxWidth: 400, margin: "0 auto 16px" }}>Connect your first financial data source to start normalizing. Each connector syncs data from a provider into the ClareMesh schema.</p>
            <button type="button" onClick={() => setShowAdd(true)} style={{ padding: "8px 16px", fontSize: 12, fontWeight: 500, fontFamily: F.b, background: "var(--cm-slate)", color: "#fff", border: "none", cursor: "pointer" }}>Add your first connector</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 100px 80px", gap: 0, padding: "8px 16px", background: "var(--cm-terminal)" }}>
              <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>NAME</span>
              <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>PROVIDER</span>
              <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>LAST SYNC</span>
              <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>RECORDS</span>
              <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>STATUS</span>
            </div>
            {connectors.map((c) => (
              <div key={c.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 120px 100px 80px", gap: 0, padding: "10px 16px", borderBottom: "0.5px solid var(--cm-border-light)", alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{c.name || c.provider}</span>
                <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-panel-b)" }}>{c.provider}</span>
                <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{c.last_sync_at ? new Date(c.last_sync_at).toLocaleDateString() : "Never"}</span>
                <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-panel-b)" }}>{(c.config?.total_records || 0).toLocaleString()}</span>
                <span style={{ fontFamily: F.m, fontSize: 10, color: c.status === "active" ? "var(--cm-copper)" : c.status === "unhealthy" ? "#E24B4A" : "var(--cm-text-dim)", padding: "2px 6px", border: "0.5px solid var(--cm-border-light)" }}>{c.status?.toUpperCase() || "PENDING"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
    )}}</AuthGate>
  );
}

export default function ConnectorsPage() {
  return <Suspense><ConnectorsContent /></Suspense>;
}

