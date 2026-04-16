"use client";
import { useState, useEffect, Suspense } from "react";
import AuthGate from "@/components/AuthGate";
import AppShell from "@/components/AppShell";
import DangerZone from "@/components/DangerZone";
import { supabase, canManageBilling, canManageTeam, canManageApiKeys, canUseApiKeys, UserProfile, Organization } from "@/lib/auth";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const inputStyle = { width: "100%", padding: "10px 14px", fontSize: 14, fontFamily: "'DM Sans',system-ui,sans-serif", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)", color: "var(--cm-text-panel-h)", outline: "none", boxSizing: "border-box" as const };

function GeneralTab({ profile, org }: { profile: UserProfile; org: Organization }) {
  const [displayName, setDisplayName] = useState(profile.display_name || "");
  const [saved, setSaved] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleSaveName = async () => {
    await supabase.from("profiles").update({ display_name: displayName }).eq("id", profile.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleChangePassword = async () => {
    setPwError(null); setPwSuccess(false);
    if (newPw.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    if (!/[A-Z]/.test(newPw)) { setPwError("Needs an uppercase letter."); return; }
    if (!/[0-9]/.test(newPw)) { setPwError("Needs a number."); return; }
    if (!/[^A-Za-z0-9]/.test(newPw)) { setPwError("Needs a special character."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }

    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (error) { setPwError(error.message); return; }
    await supabase.from("profiles").update({ last_password_changed_at: new Date().toISOString() }).eq("id", profile.id);
    setPwSuccess(true); setCurrentPw(""); setNewPw(""); setConfirmPw("");
  };

  return (
    <div>
      <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 18, color: "var(--cm-text-panel-h)", marginBottom: 20 }}>Profile</h2>

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>DISPLAY NAME</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your name" style={{ ...inputStyle, flex: 1 }} />
          <button onClick={handleSaveName} style={{ padding: "10px 20px", fontSize: 13, fontFamily: F.d, fontWeight: 500, color: "#fff", background: "var(--cm-slate)", border: "none", cursor: "pointer" }}>
            {saved ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>EMAIL</label>
        <input type="email" value={profile.email} disabled style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }} />
        <p style={{ fontSize: 11, color: "var(--cm-text-dim)", marginTop: 4 }}>Contact support to change your email address.</p>
      </div>

      <div style={{ borderTop: "0.5px solid var(--cm-border-light)", paddingTop: 24, marginTop: 32 }}>
        <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 18, color: "var(--cm-text-panel-h)", marginBottom: 20 }}>Change password</h2>

        {pwError && <div style={{ fontSize: 12, color: "#E24B4A", padding: "10px 14px", border: "0.5px solid #E24B4A", background: "rgba(226,75,74,0.04)", marginBottom: 16 }}>{pwError}</div>}
        {pwSuccess && <div style={{ fontSize: 12, color: "#1D9E75", padding: "10px 14px", border: "0.5px solid #1D9E75", background: "rgba(29,158,117,0.04)", marginBottom: 16 }}>Password updated successfully.</div>}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>NEW PASSWORD</label>
          <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min 8 chars, 1 upper, 1 number, 1 special" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>CONFIRM PASSWORD</label>
          <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="Re-enter new password" style={inputStyle} />
        </div>
        <button onClick={handleChangePassword} style={{ padding: "10px 20px", fontSize: 13, fontFamily: F.d, fontWeight: 500, color: "#fff", background: "var(--cm-slate)", border: "none", cursor: "pointer" }}>
          Update password
        </button>
      </div>

      <DangerZone profile={profile} org={org} />

      {profile.last_password_changed_at && (
        <p style={{ fontSize: 11, fontFamily: F.m, color: "var(--cm-text-dim)", marginTop: 12 }}>
          Last changed: {new Date(profile.last_password_changed_at).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function TeamTab({ profile, org }: { profile: UserProfile; org: Organization }) {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviteStatus, setInviteStatus] = useState<string | null>(null);

  useState(() => {
    supabase.from("profiles").select("*").eq("org_id", org.id).then(({ data }) => { if (data) setMembers(data as UserProfile[]); });
  });

  const handleInvite = async () => {
    if (!inviteEmail) return;
    const { error } = await supabase.from("team_invites").insert({
      org_id: org.id, email: inviteEmail, role: inviteRole, invited_by: profile.id,
    });
    if (error) { setInviteStatus("Failed: " + error.message); return; }
    setInviteStatus("Invite sent to " + inviteEmail);
    setInviteEmail("");
  };

  const isAdmin = canManageTeam(profile.role);

  return (
    <div>
      <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 18, color: "var(--cm-text-panel-h)", marginBottom: 20 }}>Team members</h2>

      <div style={{ border: "0.5px solid var(--cm-border-light)", marginBottom: 24 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px", padding: "8px 14px", background: "var(--cm-terminal)", borderBottom: "0.5px solid var(--cm-border-light)" }}>
          <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)" }}>MEMBER</span>
          <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)" }}>ROLE</span>
          <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)" }}>JOINED</span>
        </div>
        {members.map((m) => (
          <div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px", padding: "10px 14px", borderBottom: "0.5px solid var(--cm-border-light)", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--cm-text-panel-h)" }}>{m.display_name || m.email}</div>
              {m.display_name && <div style={{ fontSize: 11, color: "var(--cm-text-dim)" }}>{m.email}</div>}
            </div>
            <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-panel-b)" }}>{m.role}</span>
            <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-dim)" }}>{new Date(m.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>

      {isAdmin && (
        <div>
          <h3 style={{ fontFamily: F.d, fontWeight: 600, fontSize: 15, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>Invite team member</h3>
          {inviteStatus && <p style={{ fontSize: 12, color: "#1D9E75", marginBottom: 8 }}>{inviteStatus}</p>}
          <div style={{ display: "flex", gap: 8 }}>
            <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@company.com" style={{ ...inputStyle, flex: 1 }} />
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} style={{ ...inputStyle, width: 100, cursor: "pointer" }}>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
              <option value="viewer">Viewer</option>
            </select>
            <button onClick={handleInvite} style={{ padding: "10px 20px", fontSize: 13, fontFamily: F.d, fontWeight: 500, color: "#fff", background: "var(--cm-slate)", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
              Send invite
            </button>
          </div>
        </div>
      )}

      {!isAdmin && <p style={{ fontSize: 13, color: "var(--cm-text-dim)" }}>Only owners and admins can manage team members.</p>}
    </div>
  );
}

function BillingTab({ profile, org }: { profile: UserProfile; org: Organization }) {
  const planLabels: Record<string, string> = { open: "Open (Free)", build: "Build ($199/mo)", scale: "Scale ($799/mo)", enterprise: "Enterprise (Custom)" };
  const isOwner = canManageBilling(profile.role);

  return (
    <div>
      <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 18, color: "var(--cm-text-panel-h)", marginBottom: 20 }}>Billing</h2>

      <div style={{ padding: "16px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)", marginBottom: 24 }}>
        <div style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>CURRENT PLAN</div>
        <div style={{ fontSize: 18, fontFamily: F.d, fontWeight: 700, color: "var(--cm-text-panel-h)", marginBottom: 4 }}>{planLabels[org.plan] || org.plan}</div>
        {org.stripe_customer_id && <div style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)" }}>Stripe: {org.stripe_customer_id}</div>}
      </div>

      {isOwner ? (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/pricing" style={{ padding: "10px 20px", fontSize: 13, fontFamily: F.d, fontWeight: 500, color: "#fff", background: "var(--cm-slate)", textDecoration: "none", display: "inline-block" }}>
            {org.plan === "open" ? "Upgrade plan" : "Change plan"}
          </a>
          {org.stripe_customer_id && (
            <button onClick={async () => {
              // In production, this would call an edge function to create a Stripe Customer Portal session
              window.open("https://billing.stripe.com/p/login/test", "_blank");
            }} style={{ padding: "10px 20px", fontSize: 13, fontFamily: F.d, fontWeight: 500, color: "var(--cm-text-panel-h)", background: "transparent", border: "0.5px solid var(--cm-border-light)", cursor: "pointer" }}>
              Manage billing in Stripe
            </button>
          )}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "var(--cm-text-dim)" }}>Only the account owner can manage billing.</p>
      )}
    </div>
  );
}

function ApiKeysTab({ profile, org }: { profile: UserProfile; org: Organization }) {
  const [keys, setKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const isAdmin = canManageApiKeys(profile.role);
  const canUse = canUseApiKeys(org.plan);

  const functionUrl = (path = "") =>
    `https://ddevkorgiutduydelhgv.supabase.co/functions/v1/api-keys${path}`;

  const authHeaders = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.access_token ?? ""}`,
    };
  };

  const loadKeys = async () => {
    setListLoading(true);
    try {
      const res = await fetch(functionUrl(), { headers: await authHeaders() });
      const body = await res.json();
      if (res.ok) setKeys(body.keys || []);
      else setErr(body.error || "Failed to load keys");
    } catch (e: any) {
      setErr(e.message);
    }
    setListLoading(false);
  };

  // Load keys once on mount
  useEffect(() => { loadKeys(); }, []);

  const handleGenerate = async () => {
    if (!newKeyName) return;
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(functionUrl(), {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ name: newKeyName, scopes: ["transform:read", "transform:write"] }),
      });
      const body = await res.json();
      if (!res.ok) { setErr(body.error || "Failed to generate key"); setLoading(false); return; }
      setGeneratedKey(body.key);
      setNewKeyName("");
      await loadKeys();
    } catch (e: any) {
      setErr(e.message);
    }
    setLoading(false);
  };

  const handleRevoke = async (keyId: string) => {
    if (!confirm("Revoke this API key? Any integration using it will stop working. This cannot be undone.")) return;
    try {
      const res = await fetch(functionUrl(`/${keyId}`), {
        method: "DELETE",
        headers: await authHeaders(),
      });
      if (!res.ok) {
        const body = await res.json();
        setErr(body.error || "Failed to revoke");
        return;
      }
      await loadKeys();
    } catch (e: any) {
      setErr(e.message);
    }
  };

  if (!canUse) {
    return (
      <div>
        <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 18, color: "var(--cm-text-panel-h)", marginBottom: 12 }}>API keys</h2>
        <p style={{ fontSize: 13, color: "var(--cm-text-dim)" }}>API keys are available on the Build plan and above. <a href="/pricing" style={{ color: "var(--cm-slate)" }}>Upgrade</a></p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 18, color: "var(--cm-text-panel-h)", marginBottom: 6 }}>API keys</h2>
      <p style={{ fontSize: 13, color: "var(--cm-text-dim)", marginBottom: 20 }}>Use these keys to authenticate API requests. Pass as <code style={{ fontFamily: F.m, fontSize: 12, padding: "2px 6px", background: "var(--cm-terminal)", border: "0.5px solid var(--cm-border-light)" }}>Authorization: Bearer cm_live_...</code></p>

      {err && (
        <div style={{ padding: "10px 14px", border: "0.5px solid #E24B4A", background: "rgba(226,75,74,0.04)", marginBottom: 16, fontSize: 12, color: "#E24B4A" }}>{err}</div>
      )}

      {generatedKey && (
        <div style={{ padding: "16px", border: "0.5px solid #1D9E75", background: "rgba(29,158,117,0.04)", marginBottom: 20 }}>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#1D9E75", marginBottom: 8 }}>API key generated. Copy it now — you won&apos;t see it again.</p>
          <div style={{ fontFamily: F.m, fontSize: 13, padding: "10px 14px", background: "var(--cm-terminal)", border: "0.5px solid var(--cm-border-light)", wordBreak: "break-all", userSelect: "all" }}>{generatedKey}</div>
          <button onClick={() => { navigator.clipboard.writeText(generatedKey); setGeneratedKey(null); }} style={{ marginTop: 8, padding: "6px 16px", fontSize: 12, fontFamily: F.d, fontWeight: 500, color: "#fff", background: "var(--cm-slate)", border: "none", cursor: "pointer" }}>Copy and dismiss</button>
        </div>
      )}

      {isAdmin && (
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          <input type="text" value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="Key name (e.g. Production)" style={{ ...inputStyle, flex: 1 }} />
          <button onClick={handleGenerate} disabled={loading || !newKeyName} style={{ padding: "10px 20px", fontSize: 13, fontFamily: F.d, fontWeight: 500, color: "#fff", background: loading || !newKeyName ? "var(--cm-text-dim)" : "var(--cm-slate)", border: "none", cursor: loading || !newKeyName ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
            {loading ? "Generating..." : "Generate key"}
          </button>
        </div>
      )}

      <div style={{ border: "0.5px solid var(--cm-border-light)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 120px 1fr 110px 80px", padding: "8px 14px", background: "var(--cm-terminal)", borderBottom: "0.5px solid var(--cm-border-light)" }}>
          <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)" }}>NAME</span>
          <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)" }}>PREFIX</span>
          <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)" }}>SCOPES</span>
          <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)" }}>LAST USED</span>
          <span style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)" }}>STATUS</span>
        </div>
        {listLoading ? (
          <div style={{ padding: "20px 14px", textAlign: "center", fontSize: 13, color: "var(--cm-text-dim)" }}>Loading...</div>
        ) : keys.length === 0 ? (
          <div style={{ padding: "20px 14px", textAlign: "center", fontSize: 13, color: "var(--cm-text-dim)" }}>No API keys yet.</div>
        ) : keys.map((k) => {
          const expired = k.expires_at && new Date(k.expires_at) < new Date();
          const scopes: string[] = Array.isArray(k.scopes) ? k.scopes : [];
          return (
            <div key={k.id} style={{ display: "grid", gridTemplateColumns: "1.2fr 120px 1fr 110px 80px", padding: "10px 14px", borderBottom: "0.5px solid var(--cm-border-light)", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 13, color: "var(--cm-text-panel-h)" }}>{k.name || "Unnamed"}</div>
                <div style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-dim)", marginTop: 2 }}>Created {new Date(k.created_at).toLocaleDateString()}{k.expires_at && ` · Expires ${new Date(k.expires_at).toLocaleDateString()}`}</div>
              </div>
              <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-panel-b)" }}>{k.key_prefix}...</span>
              <span style={{ fontFamily: F.m, fontSize: 10, color: "var(--cm-text-panel-b)" }}>{scopes.length > 0 ? scopes.map(s => s.replace("transform:", "tx:")).join(", ") : "none"}</span>
              <span style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-dim)" }}>{k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : "Never"}</span>
              {k.revoked_at ? (
                <span style={{ fontFamily: F.m, fontSize: 10, color: "#E24B4A" }}>Revoked</span>
              ) : expired ? (
                <span style={{ fontFamily: F.m, fontSize: 10, color: "#C4884A" }}>Expired</span>
              ) : (
                isAdmin ? (
                  <button onClick={() => handleRevoke(k.id)} style={{ fontFamily: F.m, fontSize: 10, color: "#E24B4A", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textAlign: "left", padding: 0 }}>Revoke</button>
                ) : (
                  <span style={{ fontFamily: F.m, fontSize: 10, color: "#1D9E75" }}>Active</span>
                )
              )}
            </div>
          );
        })}
      </div>

      {!isAdmin && <p style={{ fontSize: 12, color: "var(--cm-text-dim)", marginTop: 12 }}>Only owners and admins can create or revoke API keys.</p>}
    </div>
  );
}

function SettingsContent() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <AuthGate>
      {({ profile, org }) => (
        <AppShell profile={profile} org={org} activePage="settings">
          <div style={{ padding: "32px 40px", maxWidth: 720 }}>
            <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 24, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 24 }}>Settings</h1>

            <div style={{ display: "flex", gap: 0, borderBottom: "0.5px solid var(--cm-border-light)", marginBottom: 32 }}>
              {[
                { key: "general", label: "General" },
                { key: "team", label: "Team", hidden: false },
                { key: "billing", label: "Billing", hidden: !canManageBilling(profile.role) && profile.role === "viewer" },
                { key: "api-keys", label: "API keys" },
              ].filter(t => !t.hidden).map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  padding: "8px 16px", fontSize: 13, fontFamily: F.b, cursor: "pointer", border: "none", borderBottom: activeTab === tab.key ? "2px solid var(--cm-slate)" : "2px solid transparent",
                  background: "transparent", color: activeTab === tab.key ? "var(--cm-text-panel-h)" : "var(--cm-text-panel-b)", fontWeight: activeTab === tab.key ? 500 : 400,
                }}>
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "general" && <GeneralTab profile={profile} org={org} />}
            {activeTab === "team" && <TeamTab profile={profile} org={org} />}
            {activeTab === "billing" && <BillingTab profile={profile} org={org} />}
            {activeTab === "api-keys" && <ApiKeysTab profile={profile} org={org} />}
          </div>
        </AppShell>
      )}
    </AuthGate>
  );
}

export default function SettingsPage() { return <Suspense><SettingsContent /></Suspense>; }

