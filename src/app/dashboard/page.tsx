"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

function DashboardContent() {
  const router = useRouter();
  const [org, setOrg] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: p } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
      if (p && !p.onboarding_completed) { router.push("/onboarding"); return; }
      if (p) {
        setProfile(p);
        const { data: o } = await supabase.from("organizations").select("*").eq("id", p.org_id).single();
        setOrg(o);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cm-panel)", fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>
      Loading...
    </div>
  );

  const stats = [
    { label: "Connectors", value: "0", sub: org?.plan === "open" ? "1 available" : "5 available" },
    { label: "Transforms this period", value: "0", sub: "of 1,000" },
    { label: "Compliance controls", value: "0", sub: "configured" },
    { label: "Sync channels", value: "0", sub: org?.plan === "scale" || org?.plan === "enterprise" ? "available" : "requires Scale" },
  ];

  const quickActions = [
    { label: "Connect a data source", desc: "Plaid, Stripe, QuickBooks, CSV", href: "/connectors" },
    { label: "Browse the schema", desc: "5 objects, v1.0.0", href: "/schema" },
    { label: "View compliance controls", desc: "29 controls across 10 frameworks", href: "/compliance" },
    { label: "Manage your team", desc: "Invite members, set roles", href: "/settings" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      {/* Top nav */}
      <div style={{ padding: "12px 32px", borderBottom: "0.5px solid var(--cm-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
            <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 14, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
          </a>
          <nav style={{ display: "flex", gap: 16 }}>
            {["Dashboard", "Connectors", "Transforms", "Sync", "Compliance", "Settings"].map((item, i) => (
              <a key={item} href={`/${item.toLowerCase()}`} className="cm-nl" style={{ fontSize: 12, color: i === 0 ? "var(--cm-text-panel-h)" : "var(--cm-text-panel-b)", textDecoration: "none", fontWeight: i === 0 ? 500 : 400 }}>{item}</a>
            ))}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-mono)", padding: "3px 8px", border: "0.5px solid var(--cm-border-light)" }}>{org?.plan?.toUpperCase() || "OPEN"}</span>
          <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-mono)", padding: "3px 8px", border: "0.5px solid var(--cm-border-light)" }}>{org?.jurisdiction || "US"}</span>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>
            {org?.name || "Dashboard"}
          </h1>
          <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)" }}>
            {org?.jurisdiction || "US"} jurisdiction / {org?.plan || "open"} plan / schema v1.0.0
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 32 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ padding: "16px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)" }}>
              <p style={{ fontFamily: F.m, fontSize: 24, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 2 }}>{s.label}</p>
              <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <h2 style={{ fontFamily: F.d, fontWeight: 600, fontSize: 16, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>Get started</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 32 }}>
          {quickActions.map((a) => (
            <a key={a.label} href={a.href} className="cm-cell" style={{ padding: "16px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", textDecoration: "none", display: "block" }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 2 }}>{a.label}</p>
              <p style={{ fontSize: 11, color: "var(--cm-text-panel-b)" }}>{a.desc}</p>
            </a>
          ))}
        </div>

        {/* System status */}
        <h2 style={{ fontFamily: F.d, fontWeight: 600, fontSize: 16, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>System status</h2>
        <div style={{ padding: "16px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)" }}>
          <div style={{ display: "flex", gap: 24 }}>
            {["Transform engine", "Sync engine", "Auth", "Compliance evaluator", "Billing"].map((svc) => (
              <div key={svc} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 6, height: 6, background: "var(--cm-green)" }} />
                <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-mono)" }}>{svc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <Suspense><DashboardContent /></Suspense>;
}

