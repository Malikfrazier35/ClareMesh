"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

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

function TransformsContent() {
  const router = useRouter();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total_in: 0, total_out: 0, total_errors: 0, avg_duration: 0 });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: profile } = await supabase.from("profiles").select("org_id").eq("id", user.id).single();
      if (profile) {
        const { data } = await supabase.from("transform_logs").select("*").eq("org_id", profile.org_id).order("created_at", { ascending: false }).limit(50);
        setLogs(data || []);
        if (data && data.length > 0) {
          setStats({
            total_in: data.reduce((s: number, l: any) => s + (l.records_in || 0), 0),
            total_out: data.reduce((s: number, l: any) => s + (l.records_out || 0), 0),
            total_errors: data.reduce((s: number, l: any) => s + (l.errors || 0), 0),
            avg_duration: Math.round(data.reduce((s: number, l: any) => s + (l.duration_ms || 0), 0) / data.length),
          });
        }
      }
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cm-panel)", fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>Loading transform logs...</div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <Nav active="Transforms" />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>Transform log</h1>
          <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)" }}>{logs.length} transforms recorded</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 24 }}>
          {[
            { label: "Records in", value: stats.total_in.toLocaleString() },
            { label: "Records out", value: stats.total_out.toLocaleString() },
            { label: "Errors", value: stats.total_errors.toLocaleString(), color: stats.total_errors > 0 ? "var(--cm-copper)" : undefined },
            { label: "Avg duration", value: `${stats.avg_duration}ms` },
          ].map((s) => (
            <div key={s.label} style={{ padding: 16, border: "0.5px solid var(--cm-border-light)" }}>
              <p style={{ fontFamily: F.m, fontSize: 24, fontWeight: 500, color: s.color || "var(--cm-text-panel-h)", marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Log table */}
        {logs.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", border: "0.5px solid var(--cm-border-light)" }}>
            <p style={{ fontSize: 14, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>No transforms yet</p>
            <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)", marginBottom: 16 }}>Send your first transform via the API or connect a data source.</p>
            <a href="/connectors" style={{ fontFamily: F.b, fontSize: 12, fontWeight: 500, padding: "8px 16px", border: "0.5px solid var(--cm-border-light)", color: "var(--cm-text-panel-h)", textDecoration: "none" }}>Connect a source</a>
          </div>
        ) : (
          <div style={{ border: "0.5px solid var(--cm-border-light)" }}>
            {/* Header */}
            <div style={{ display: "grid", gridTemplateColumns: "140px 80px 80px 80px 60px 80px 1fr", gap: 0, borderBottom: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel-inset)" }}>
              {["Timestamp", "Provider", "In", "Out", "Errors", "Duration", "Connector"].map((h) => (
                <div key={h} style={{ padding: "8px 10px", fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>{h.toUpperCase()}</div>
              ))}
            </div>
            {/* Rows */}
            {logs.map((log, i) => (
              <div key={log.id} style={{ display: "grid", gridTemplateColumns: "140px 80px 80px 80px 60px 80px 1fr", gap: 0, borderBottom: i < logs.length - 1 ? "0.5px solid var(--cm-border-light)" : "none" }}>
                <div style={{ padding: "6px 10px", fontFamily: F.m, fontSize: 10, color: "var(--cm-text-mono)" }}>{new Date(log.created_at).toLocaleString()}</div>
                <div style={{ padding: "6px 10px", fontFamily: F.m, fontSize: 10, color: "var(--cm-slate)" }}>{log.source_type}</div>
                <div style={{ padding: "6px 10px", fontFamily: F.m, fontSize: 10, color: "var(--cm-text-panel-h)" }}>{log.records_in}</div>
                <div style={{ padding: "6px 10px", fontFamily: F.m, fontSize: 10, color: "var(--cm-text-panel-h)" }}>{log.records_out}</div>
                <div style={{ padding: "6px 10px", fontFamily: F.m, fontSize: 10, color: log.errors > 0 ? "var(--cm-copper)" : "var(--cm-text-dim)" }}>{log.errors}</div>
                <div style={{ padding: "6px 10px", fontFamily: F.m, fontSize: 10, color: "var(--cm-text-mono)" }}>{log.duration_ms}ms</div>
                <div style={{ padding: "6px 10px", fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.connector_id === "00000000-0000-0000-0000-000000000000" ? "API direct" : log.connector_id?.slice(0, 8)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function TransformsPage() {
  return <Suspense><TransformsContent /></Suspense>;
}

