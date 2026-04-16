"use client";
import { useState, useEffect, Suspense } from "react";
import AuthGate from "@/components/AuthGate";
import AppShell from "@/components/AppShell";
import { supabase, getTransformLimit, canUseSync, UserProfile, Organization } from "@/lib/auth";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

function DashboardContent() {
  return (
    <AuthGate>
      {({ profile, org }) => (
        <AppShell profile={profile} org={org} activePage="dashboard">
          <DashboardInner profile={profile} org={org} />
        </AppShell>
      )}
    </AuthGate>
  );
}

function DashboardInner({ profile, org }: { profile: UserProfile; org: Organization }) {
  const [stats, setStats] = useState({ connectors: 0, transforms: 0, anomalies: 0, apiKeys: 0 });

  useEffect(() => {
    async function load() {
      const [c, t, a, k] = await Promise.all([
        supabase.from("connectors").select("id", { count: "exact", head: true }).eq("org_id", org.id),
        supabase.from("transform_logs").select("id", { count: "exact", head: true }).eq("org_id", org.id),
        supabase.from("anomaly_queue").select("id", { count: "exact", head: true }).eq("org_id", org.id).eq("status", "open"),
        supabase.from("api_keys").select("id", { count: "exact", head: true }).eq("org_id", org.id).is("revoked_at", null),
      ]);
      setStats({ connectors: c.count || 0, transforms: t.count || 0, anomalies: a.count || 0, apiKeys: k.count || 0 });
    }
    load();
  }, [org.id]);

  const limit = getTransformLimit(org.plan);
  const usagePct = limit === Infinity ? 0 : Math.min((stats.transforms / limit) * 100, 100);
  const planLabels: Record<string, string> = { open: "Open", build: "Build", scale: "Scale", enterprise: "Enterprise" };

  const statCards = [
    { label: "Connectors", value: stats.connectors, href: "/connectors" },
    { label: "Transforms", value: stats.transforms.toLocaleString(), href: "/transforms" },
    { label: "Open anomalies", value: stats.anomalies, href: "/compliance" },
    { label: "Active API keys", value: stats.apiKeys, href: "/settings?tab=api-keys" },
  ];

  return (
    <div style={{ padding: "32px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>
            {profile.display_name ? `Welcome back, ${profile.display_name}` : "Dashboard"}
          </h1>
          <p style={{ fontSize: 13, color: "var(--cm-text-dim)" }}>{org.name}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontFamily: F.m, fontSize: 10, padding: "2px 8px", background: "var(--cm-slate)", color: "#fff", letterSpacing: 0.5 }}>{planLabels[org.plan]}</span>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        {statCards.map((s) => (
          <a key={s.label} href={s.href} style={{ padding: "16px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)", textDecoration: "none" }}>
            <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 8 }}>{s.label.toUpperCase()}</div>
            <div style={{ fontFamily: F.d, fontSize: 28, fontWeight: 700, color: "var(--cm-text-panel-h)" }}>{s.value}</div>
          </a>
        ))}
      </div>

      {/* Usage meter */}
      {limit !== Infinity && (
        <div style={{ padding: "16px", border: "0.5px solid var(--cm-border-light)", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)" }}>TRANSFORM USAGE</span>
            <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-panel-b)" }}>{stats.transforms.toLocaleString()} / {limit.toLocaleString()}</span>
          </div>
          <div style={{ height: 6, background: "var(--cm-border-light)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${usagePct}%`, background: usagePct > 80 ? "#E24B4A" : usagePct > 60 ? "#BA7517" : "var(--cm-slate)", transition: "width 0.5s" }} />
          </div>
          {usagePct > 80 && (
            <p style={{ fontSize: 11, color: "#E24B4A", marginTop: 6 }}>You're approaching your plan limit. <a href="/pricing" style={{ color: "var(--cm-slate)" }}>Upgrade</a></p>
          )}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 style={{ fontFamily: F.d, fontWeight: 600, fontSize: 16, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>Quick actions</h2>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <a href="/connectors" style={{ padding: "8px 16px", fontSize: 12, fontFamily: F.d, fontWeight: 500, color: "var(--cm-text-panel-h)", border: "0.5px solid var(--cm-border-light)", textDecoration: "none" }}>Add connector</a>
          <a href="/transforms" style={{ padding: "8px 16px", fontSize: 12, fontFamily: F.d, fontWeight: 500, color: "var(--cm-text-panel-h)", border: "0.5px solid var(--cm-border-light)", textDecoration: "none" }}>View transforms</a>
          {canUseSync(org.plan) && <a href="/sync" style={{ padding: "8px 16px", fontSize: 12, fontFamily: F.d, fontWeight: 500, color: "var(--cm-text-panel-h)", border: "0.5px solid var(--cm-border-light)", textDecoration: "none" }}>Configure sync</a>}
          <a href="/docs" style={{ padding: "8px 16px", fontSize: 12, fontFamily: F.d, fontWeight: 500, color: "var(--cm-text-panel-h)", border: "0.5px solid var(--cm-border-light)", textDecoration: "none" }}>Read docs</a>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() { return <Suspense><DashboardContent /></Suspense>; }

