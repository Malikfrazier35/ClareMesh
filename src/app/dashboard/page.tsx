"use client";
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

interface DashData {
  org: any;
  plan: any;
  connectors: any[];
  recentTransforms: any[];
  anomalies: any[];
  usageThisPeriod: number;
  transformLimit: number;
  complianceScore: number;
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ padding: "16px 20px", border: "0.5px solid var(--cm-border-light)" }}>
      <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginBottom: 6, letterSpacing: 0.5 }}>{label}</p>
      <p style={{ fontFamily: F.m, fontSize: 24, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: "var(--cm-text-panel-b)", marginTop: 4 }}>{sub}</p>}
    </div>
  );
}

function StatusDot({ status }: { status: string }) {
  const color = status === "active" ? "var(--cm-copper)" : status === "unhealthy" ? "#E24B4A" : "var(--cm-text-dim)";
  return <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: color, marginRight: 6 }} />;
}

function DashboardContent() {
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (!profile) { window.location.href = "/onboarding"; return; }

      const orgId = profile.org_id;

      const [orgRes, planRes, connRes, logRes, anomRes, usageRes] = await Promise.all([
        supabase.from("organizations").select("*").eq("id", orgId).single(),
        supabase.from("plan_definitions").select("*").eq("slug", "open").single(),
        supabase.from("connectors").select("*").eq("org_id", orgId).order("created_at", { ascending: false }),
        supabase.from("transform_logs").select("*").eq("org_id", orgId).order("created_at", { ascending: false }).limit(10),
        supabase.from("anomaly_queue").select("*").eq("org_id", orgId).eq("status", "pending").order("created_at", { ascending: false }).limit(5),
        supabase.from("usage_records").select("value").eq("org_id", orgId).eq("metric", "transforms").gte("period_start", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
      ]);

      // Get current plan from org
      const org = orgRes.data;
      let plan = planRes.data;
      if (org?.current_plan) {
        const { data: p } = await supabase.from("plan_definitions").select("*").eq("slug", org.current_plan).single();
        if (p) plan = p;
      }

      const usageTotal = (usageRes.data || []).reduce((sum: number, r: any) => sum + (r.value || 0), 0);
      const transformLimit = plan?.config?.transform_limit || 1000;

      // Compliance score: count passing controls
      const { data: controls } = await supabase.from("compliance_controls").select("status").eq("org_id", orgId);
      const totalControls = (controls || []).length;
      const passingControls = (controls || []).filter((c: any) => c.status === "passing").length;
      const complianceScore = totalControls > 0 ? Math.round((passingControls / totalControls) * 100) : 0;

      setData({
        org,
        plan,
        connectors: connRes.data || [],
        recentTransforms: logRes.data || [],
        anomalies: anomRes.data || [],
        usageThisPeriod: usageTotal,
        transformLimit,
        complianceScore,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div style={{ padding: 40 }}>
          <p style={{ fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>Loading dashboard...</p>
        </div>
      </AppShell>
    );
  }

  if (!data) return null;

  const usagePct = data.transformLimit > 0 ? Math.min(100, Math.round((data.usageThisPeriod / data.transformLimit) * 100)) : 0;

  return (
    <AppShell>
      <div style={{ padding: "24px 32px", maxWidth: 960 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 20, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>Overview</h1>
            <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)" }}>{data.org?.name || "Your organization"}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-copper)", padding: "3px 8px", border: "0.5px solid var(--cm-border-light)" }}>{(data.plan?.name || "Open").toUpperCase()}</span>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
          <StatCard label="TRANSFORMS THIS PERIOD" value={data.usageThisPeriod.toLocaleString()} sub={`of ${data.transformLimit.toLocaleString()} limit`} />
          <StatCard label="ACTIVE CONNECTORS" value={data.connectors.filter(c => c.status === "active").length} sub={`${data.connectors.length} total`} />
          <StatCard label="COMPLIANCE SCORE" value={`${data.complianceScore}%`} sub={`controls passing`} />
          <StatCard label="PENDING ANOMALIES" value={data.anomalies.length} sub={data.anomalies.length > 0 ? "review needed" : "all clear"} />
        </div>

        {/* Usage meter */}
        <div style={{ padding: "16px 20px", border: "0.5px solid var(--cm-border-light)", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>Transform usage</p>
            <p style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-dim)" }}>{usagePct}%</p>
          </div>
          <div style={{ height: 4, background: "var(--cm-terminal)", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${usagePct}%`, background: usagePct > 90 ? "#E24B4A" : usagePct > 70 ? "var(--cm-copper)" : "var(--cm-slate)", borderRadius: 2, transition: "width 0.5s ease" }} />
          </div>
          <p style={{ fontSize: 10, color: "var(--cm-text-dim)", marginTop: 6 }}>{data.usageThisPeriod.toLocaleString()} of {data.transformLimit.toLocaleString()} transforms used this billing period</p>
        </div>

        {/* Two-column: Connectors + Recent transforms */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
          {/* Connectors */}
          <div style={{ border: "0.5px solid var(--cm-border-light)", padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>Connectors</p>
              <a href="/connectors" style={{ fontSize: 11, color: "var(--cm-text-dim)", textDecoration: "none" }}>Manage</a>
            </div>
            {data.connectors.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ fontSize: 12, color: "var(--cm-text-dim)", marginBottom: 8 }}>No connectors configured</p>
                <a href="/connectors" style={{ fontSize: 11, color: "var(--cm-text-panel-h)", textDecoration: "none", padding: "6px 12px", border: "0.5px solid var(--cm-border-light)" }}>Add connector</a>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {data.connectors.slice(0, 5).map((c) => (
                  <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid var(--cm-border-light)" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <StatusDot status={c.status} />
                      <span style={{ fontSize: 12, color: "var(--cm-text-panel-h)" }}>{c.name || c.provider}</span>
                    </div>
                    <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{c.provider}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent transforms */}
          <div style={{ border: "0.5px solid var(--cm-border-light)", padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>Recent transforms</p>
              <a href="/transforms" style={{ fontSize: 11, color: "var(--cm-text-dim)", textDecoration: "none" }}>View all</a>
            </div>
            {data.recentTransforms.length === 0 ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <p style={{ fontSize: 12, color: "var(--cm-text-dim)" }}>No transforms yet</p>
                <p style={{ fontSize: 11, color: "var(--cm-text-dim)", marginTop: 4 }}>Connect a provider and run your first transform</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {data.recentTransforms.slice(0, 5).map((t) => (
                  <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "0.5px solid var(--cm-border-light)" }}>
                    <div>
                      <span style={{ fontSize: 12, color: "var(--cm-text-panel-h)" }}>{t.source_type}</span>
                      <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginLeft: 8 }}>{t.records_in} in / {t.records_out} out</span>
                    </div>
                    <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{new Date(t.created_at).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Anomaly queue */}
        {data.anomalies.length > 0 && (
          <div style={{ border: "0.5px solid var(--cm-border-light)", padding: "16px 20px", marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>Anomaly queue</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {data.anomalies.map((a) => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "0.5px solid var(--cm-border-light)" }}>
                  <div>
                    <span style={{ fontFamily: F.m, fontSize: 10, color: a.severity === "critical" ? "#E24B4A" : a.severity === "high" ? "var(--cm-copper)" : "var(--cm-text-dim)", padding: "2px 6px", border: "0.5px solid var(--cm-border-light)", marginRight: 8 }}>{a.severity.toUpperCase()}</span>
                    <span style={{ fontSize: 12, color: "var(--cm-text-panel-h)" }}>{a.anomaly_type.replace(/_/g, " ")}</span>
                  </div>
                  <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{new Date(a.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          <a href="/connectors" style={{ padding: "12px 16px", border: "0.5px solid var(--cm-border-light)", textDecoration: "none", textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>Add connector</p>
            <p style={{ fontSize: 11, color: "var(--cm-text-dim)", marginTop: 2 }}>Connect Plaid, Stripe, QB, Xero</p>
          </a>
          <a href="/compliance" style={{ padding: "12px 16px", border: "0.5px solid var(--cm-border-light)", textDecoration: "none", textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>Compliance dashboard</p>
            <p style={{ fontSize: 11, color: "var(--cm-text-dim)", marginTop: 2 }}>Review controls and evidence</p>
          </a>
          <a href="/docs" style={{ padding: "12px 16px", border: "0.5px solid var(--cm-border-light)", textDecoration: "none", textAlign: "center" }}>
            <p style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>Documentation</p>
            <p style={{ fontSize: 11, color: "var(--cm-text-dim)", marginTop: 2 }}>API reference and guides</p>
          </a>
        </div>
      </div>
    </AppShell>
  );
}

export default function DashboardPage() {
  return <Suspense><DashboardContent /></Suspense>;
}

