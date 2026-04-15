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

function SettingsContent() {
  const router = useRouter();
  const [org, setOrg] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [orgName, setOrgName] = useState("");
  const [tab, setTab] = useState("general");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data: p } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (p) {
        setProfile(p);
        const { data: o } = await supabase.from("organizations").select("*").eq("id", p.org_id).single();
        if (o) { setOrg(o); setOrgName(o.name || ""); }
        const { data: m } = await supabase.from("profiles").select("*").eq("org_id", p.org_id);
        setMembers(m || []);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  const handleSaveOrg = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("organizations").update({ name: orgName }).eq("id", org.id);
    setOrg({ ...org, name: orgName });
    setSaving(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--cm-panel)", fontFamily: F.m, fontSize: 12, color: "var(--cm-text-dim)" }}>Loading...</div>
  );

  const tabs = ["general", "team", "billing", "api"];

  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <Nav active="Settings" />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 24 }}>Settings</h1>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
          {tabs.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} style={{ fontFamily: F.m, fontSize: 10, padding: "6px 14px", border: "0.5px solid var(--cm-border-light)", background: tab === t ? "var(--cm-slate)" : "var(--cm-panel)", color: tab === t ? "#fff" : "var(--cm-text-mono)", cursor: "pointer", textTransform: "uppercase" }}>{t}</button>
          ))}
        </div>

        {/* General */}
        {tab === "general" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 6 }}>Organization name</label>
              <div style={{ display: "flex", gap: 8 }}>
                <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} style={{ flex: 1, padding: "8px 12px", fontSize: 13, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)", outline: "none" }} />
                <button type="button" onClick={handleSaveOrg} disabled={saving} style={{ padding: "8px 16px", fontSize: 12, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)", cursor: "pointer" }}>{saving ? "Saving..." : "Save"}</button>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 6 }}>Jurisdiction</label>
              <p style={{ fontFamily: F.m, fontSize: 12, color: "var(--cm-text-mono)", padding: "8px 12px", border: "0.5px solid var(--cm-border-light)" }}>{org?.jurisdiction || "US"}</p>
              <p style={{ fontSize: 10, color: "var(--cm-text-dim)", marginTop: 4 }}>Contact support to change jurisdiction after onboarding.</p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 6 }}>Data residency region</label>
              <p style={{ fontFamily: F.m, fontSize: 12, color: "var(--cm-text-mono)", padding: "8px 12px", border: "0.5px solid var(--cm-border-light)" }}>{org?.data_residency_region || "us-east-1"}</p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 6 }}>Organization ID</label>
              <p style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-dim)", padding: "8px 12px", border: "0.5px solid var(--cm-border-light)" }}>{org?.id}</p>
            </div>

            <div style={{ borderTop: "0.5px solid var(--cm-border-light)", paddingTop: 24, marginTop: 32 }}>
              <button type="button" onClick={handleSignOut} style={{ padding: "8px 16px", fontSize: 12, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-b)", cursor: "pointer" }}>Sign out</button>
            </div>
          </div>
        )}

        {/* Team */}
        {tab === "team" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)" }}>{members.length} member{members.length !== 1 ? "s" : ""}</p>
              <button type="button" style={{ padding: "6px 14px", fontSize: 12, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)", cursor: "pointer" }}>Invite member</button>
            </div>
            {members.map((m) => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "0.5px solid var(--cm-border-light)" }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>{m.display_name || m.email}</p>
                  <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>{m.email}</p>
                </div>
                <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-mono)", padding: "2px 8px", border: "0.5px solid var(--cm-border-light)" }}>{m.role?.toUpperCase() || "OWNER"}</span>
              </div>
            ))}
          </div>
        )}

        {/* Billing */}
        {tab === "billing" && (
          <div>
            <div style={{ padding: 20, border: "0.5px solid var(--cm-border-light)", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "var(--cm-text-panel-h)" }}>Current plan</p>
                  <p style={{ fontFamily: F.m, fontSize: 20, fontWeight: 500, color: "var(--cm-slate)", marginTop: 4 }}>{(org?.plan || "open").charAt(0).toUpperCase() + (org?.plan || "open").slice(1)}</p>
                </div>
                <a href="/pricing" style={{ padding: "8px 16px", fontSize: 12, fontFamily: F.b, border: "0.5px solid var(--cm-border-light)", background: "var(--cm-panel)", color: "var(--cm-text-panel-h)", textDecoration: "none" }}>Change plan</a>
              </div>
              {org?.plan !== "open" && (
                <p style={{ fontSize: 11, color: "var(--cm-text-dim)" }}>Manage billing, invoices, and payment methods through the Stripe customer portal.</p>
              )}
            </div>

            {/* Loyalty status */}
            <div style={{ padding: 20, border: "0.5px solid var(--cm-border-light)" }}>
              <p style={{ fontSize: 14, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Loyalty status</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                <div>
                  <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>COHORT</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginTop: 2 }}>{org?.cohort?.charAt(0).toUpperCase() + org?.cohort?.slice(1) || "General"}</p>
                </div>
                <div>
                  <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>LOYALTY MONTHS</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginTop: 2 }}>{org?.loyalty_months || 0}</p>
                </div>
                <div>
                  <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>LOYALTY SCORE</p>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginTop: 2 }}>{org?.loyalty_score || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API */}
        {tab === "api" && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 13, fontWeight: 500, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>API endpoints</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {[
                  { label: "Transform", url: "https://ddevkorgiutduydelhgv.supabase.co/functions/v1/transform", method: "POST" },
                  { label: "Schema registry", url: "https://ddevkorgiutduydelhgv.supabase.co/functions/v1/schema-registry", method: "GET" },
                  { label: "Compliance", url: "https://ddevkorgiutduydelhgv.supabase.co/functions/v1/compliance-dashboard", method: "GET" },
                ].map((ep) => (
                  <div key={ep.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", border: "0.5px solid var(--cm-border-light)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-copper)", padding: "1px 4px", border: "0.5px solid var(--cm-copper)" }}>{ep.method}</span>
                      <span style={{ fontSize: 12, color: "var(--cm-text-panel-h)" }}>{ep.label}</span>
                    </div>
                    <span style={{ fontFamily: F.m, fontSize: 9, color: "var(--cm-text-dim)", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ep.url}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ padding: 16, background: "var(--cm-terminal)", border: "0.5px solid var(--cm-terminal-bd)" }}>
              <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-mono)", marginBottom: 8 }}>AUTHENTICATION</p>
              <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-hero-b)", lineHeight: 2 }}>
                Authorization: Bearer {"<your-jwt-token>"}<br />
                apikey: {"<your-anon-key>"}
              </p>
              <p style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginTop: 8 }}>Get your JWT from supabase.auth.getSession(). The anon key is public and safe to use in client-side code.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return <Suspense><SettingsContent /></Suspense>;
}

