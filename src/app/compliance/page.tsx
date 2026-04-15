"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const SUPABASE_URL = "https://ddevkorgiutduydelhgv.supabase.co";

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

function ComplianceContent() {
  const router = useRouter();
  const [controls, setControls] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [jurisdiction, setJurisdiction] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/login"); return; }

      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/compliance-dashboard`, {
          headers: { Authorization: `Bearer ${session.access_token}`, "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.controls) {
          setControls(data.controls);
          setSummary(data.summary);
          setJurisdiction(data.jurisdiction);
          setPlan(data.plan);
        }
      } catch (e) {
        console.error("Compliance fetch error:", e);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cm-panel)", fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>Loading compliance data...</div>
  );

  const filtered = filter === "all" ? controls : controls.filter((c) => c.status === filter);
  const categories = [...new Set(controls.map((c) => c.category))];

  const statusColor: Record<string, string> = {
    passing: "var(--cm-green)",
    needs_config: "var(--cm-copper)",
    not_configured: "var(--cm-text-dim)",
    failing: "#ef4444",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <Nav active="Compliance" />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>Compliance Controls</h1>
          <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)" }}>{jurisdiction} jurisdiction / {controls.length} applicable controls / {plan} plan</p>
        </div>

        {/* Summary cards */}
        {summary && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
            {[
              { label: "Total", value: summary.total, color: "var(--cm-text-panel-h)" },
              { label: "Passing", value: summary.passing, color: "var(--cm-green)" },
              { label: "Needs config", value: summary.needs_config, color: "var(--cm-copper)" },
              { label: "Not configured", value: summary.not_configured, color: "var(--cm-text-dim)" },
            ].map((s) => (
              <div key={s.label} style={{ padding: 16, border: "0.5px solid var(--cm-border-light)" }}>
                <p style={{ fontFamily: F.m, fontSize: 28, fontWeight: 500, color: s.color, marginBottom: 4 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
          {["all", "not_configured", "needs_config", "passing", "failing"].map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} style={{
              fontFamily: F.m, fontSize: 10, padding: "6px 12px", border: "0.5px solid var(--cm-border-light)",
              background: filter === f ? "var(--cm-slate)" : "var(--cm-panel)",
              color: filter === f ? "#fff" : "var(--cm-text-mono)",
              cursor: "pointer",
            }}>{f.replace("_", " ").toUpperCase()}</button>
          ))}
        </div>

        {/* Controls list grouped by category */}
        {categories.map((cat) => {
          const catControls = filtered.filter((c) => c.category === cat);
          if (catControls.length === 0) return null;
          return (
            <div key={cat} style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>{cat}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {catControls.map((c) => (
                  <div key={c.control_id} style={{ padding: "12px 16px", border: "0.5px solid var(--cm-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-slate)" }}>{c.control_id}</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{c.title}</span>
                      </div>
                      <p style={{ fontSize: 11, color: "var(--cm-text-panel-b)", marginBottom: 4 }}>{c.description}</p>
                      <div style={{ display: "flex", gap: 6 }}>
                        {(c.frameworks || []).map((f: string) => (
                          <span key={f} style={{ fontFamily: F.m, fontSize: 8, color: "var(--cm-text-dim)", padding: "1px 4px", border: "0.5px solid var(--cm-border-light)" }}>{f}</span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 16 }}>
                      <div style={{ width: 6, height: 6, background: statusColor[c.status] || "var(--cm-text-dim)" }} />
                      <span style={{ fontFamily: F.m, fontSize: 9, color: statusColor[c.status] || "var(--cm-text-dim)" }}>{c.status.replace("_", " ").toUpperCase()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CompliancePage() {
  return <Suspense><ComplianceContent /></Suspense>;
}

