"use client";
import { useState, useEffect, Suspense } from "react";

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
          <a href="/schema" style={{ fontSize: 12, fontFamily: F.b, color: "var(--cm-text-panel-h)", textDecoration: "none", fontWeight: 500 }}>Schema</a>
        </nav>
      </div>
    </div>
  );
}

function SchemaContent() {
  const [schema, setSchema] = useState<any>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/schema-registry`);
        const data = await res.json();
        setSchema(data);
        if (data?.schema?.objects) {
          setSelected(Object.keys(data.schema.objects)[0]);
        }
      } catch (e) {
        console.error("Schema fetch error:", e);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cm-panel)", fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>Loading schema...</div>
  );

  const objects = schema?.schema?.objects || {};
  const conventions = schema?.schema?.conventions || {};
  const obj = selected ? objects[selected] : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <Nav active="" />
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
            <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)" }}>Schema Browser</h1>
            <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-slate)", padding: "2px 8px", border: "0.5px solid var(--cm-slate)" }}>v{schema?.version || "1.0.0"}</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)" }}>The canonical ClareMesh data model. {Object.keys(objects).length} objects, {Object.keys(conventions).length} conventions.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16 }}>
          {/* Object list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {Object.entries(objects).map(([name, def]: [string, any]) => (
              <button key={name} type="button" onClick={() => setSelected(name)} style={{
                padding: "10px 12px", textAlign: "left", border: selected === name ? "0.5px solid var(--cm-slate)" : "0.5px solid var(--cm-border-light)",
                background: selected === name ? "var(--cm-panel)" : "var(--cm-panel)", cursor: "pointer", fontFamily: F.b,
              }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 2 }}>{name}</p>
                <p style={{ fontSize: 10, color: "var(--cm-text-dim)" }}>{Object.keys(def.fields || {}).length} fields</p>
              </button>
            ))}

            {/* Conventions */}
            <div style={{ marginTop: 16 }}>
              <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>Conventions</p>
              {Object.entries(conventions).map(([key, val]) => (
                <div key={key} style={{ marginBottom: 8 }}>
                  <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-slate)" }}>{key}</p>
                  <p style={{ fontSize: 10, color: "var(--cm-text-dim)", lineHeight: 1.5 }}>{String(val)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Field detail */}
          {obj && (
            <div style={{ border: "0.5px solid var(--cm-border-light)", padding: 20 }}>
              <div style={{ marginBottom: 16 }}>
                <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 20, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>{selected}</h2>
                <p style={{ fontSize: 12, color: "var(--cm-text-panel-b)" }}>{obj.description}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {/* Header */}
                <div style={{ display: "grid", gridTemplateColumns: "140px 100px 60px 1fr", gap: 8, padding: "8px 0", borderBottom: "0.5px solid var(--cm-border-light)" }}>
                  <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>FIELD</span>
                  <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>TYPE</span>
                  <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>REQ</span>
                  <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)" }}>DESCRIPTION</span>
                </div>
                {Object.entries(obj.fields || {}).map(([fieldName, fieldDef]: [string, any]) => (
                  <div key={fieldName} style={{ display: "grid", gridTemplateColumns: "140px 100px 60px 1fr", gap: 8, padding: "6px 0", borderBottom: "0.5px solid var(--cm-border-light)" }}>
                    <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-panel-h)" }}>{fieldName}</span>
                    <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-slate)" }}>
                      {fieldDef.type}
                      {fieldDef.format ? ` (${fieldDef.format})` : ""}
                      {fieldDef.values ? ` [${fieldDef.values.length}]` : ""}
                    </span>
                    <span style={{ fontFamily: F.m, fontSize: 10, color: fieldDef.required ? "var(--cm-text-panel-h)" : "var(--cm-text-dim)" }}>{fieldDef.required ? "yes" : "no"}</span>
                    <span style={{ fontSize: 11, color: "var(--cm-text-panel-b)", lineHeight: 1.5 }}>
                      {fieldDef.description || ""}
                      {fieldDef.refs ? ` → ${fieldDef.refs}` : ""}
                      {fieldDef.values ? ` Values: ${fieldDef.values.join(", ")}` : ""}
                      {fieldDef.encrypted ? " (encrypted)" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* API endpoint */}
        <div style={{ marginTop: 32, padding: 16, background: "var(--cm-terminal)", border: "0.5px solid var(--cm-terminal-bd)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-mono)" }}>SCHEMA REGISTRY ENDPOINT</span>
            <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-green)" }}>PUBLIC / NO AUTH</span>
          </div>
          <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-hero-b)" }}>GET {SUPABASE_URL}/functions/v1/schema-registry</p>
          <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginTop: 4 }}>Cache-Control: public, max-age=3600</p>
        </div>
      </div>
    </div>
  );
}

export default function SchemaPage() {
  return <Suspense><SchemaContent /></Suspense>;
}

