"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ddevkorgiutduydelhgv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZXZrb3JnaXV0ZHV5ZGVsaGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODI0NDIsImV4cCI6MjA5MTc1ODQ0Mn0.J42xtXgMJ0J4DdTwg3eCHKafOHTe0Tb6WRlTwZ9B-eE"
);

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const inputStyle = { width: "100%", padding: "10px 14px", fontSize: 14, fontFamily: "'DM Sans',system-ui,sans-serif", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)", color: "var(--cm-text-panel-h)", outline: "none", boxSizing: "border-box" as const };

function AcceptInviteContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [invite, setInvite] = useState<any>(null);
  const [orgName, setOrgName] = useState("");
  const [status, setStatus] = useState<"loading" | "valid" | "expired" | "used" | "not_found" | "signup" | "accepted">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadInvite() {
      if (!token) { setStatus("not_found"); return; }
      const { data, error } = await supabase.from("team_invites").select("*, organizations(name)").eq("token", token).single();
      if (error || !data) { setStatus("not_found"); return; }
      if (data.accepted_at) { setStatus("used"); return; }
      if (new Date(data.expires_at) < new Date()) { setStatus("expired"); return; }
      setInvite(data);
      setEmail(data.email);
      setOrgName(data.organizations?.name || "");

      // Check if user is already logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.email === data.email) {
        // Auto-accept: create profile in the invited org
        await acceptInvite(user.id, data);
        return;
      }

      setStatus("signup");
    }
    loadInvite();
  }, [token]);

  async function acceptInvite(userId: string, inv: any) {
    // Create profile in the invited org
    await supabase.from("profiles").upsert({
      id: userId,
      org_id: inv.org_id,
      email: inv.email,
      role: inv.role,
      onboarding_completed: true,
      onboarding_step: 3,
    });

    // Mark invite as accepted
    await supabase.from("team_invites").update({ accepted_at: new Date().toISOString() }).eq("id", inv.id);

    // Log in audit
    await supabase.from("audit_log").insert({
      org_id: inv.org_id,
      actor_id: userId,
      action: "team_member_joined",
      resource_type: "profile",
      resource_id: userId,
      metadata: { email: inv.email, role: inv.role, invited_by: inv.invited_by },
    });

    setStatus("accepted");
    setTimeout(() => { window.location.href = "/dashboard"; }, 2000);
  }

  const handleSignupAndAccept = async () => {
    setError(null);
    if (!password || password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!/[A-Z]/.test(password)) { setError("Needs an uppercase letter."); return; }
    if (!/[0-9]/.test(password)) { setError("Needs a number."); return; }

    setLoading(true);
    const { data, error: authErr } = await supabase.auth.signUp({
      email: invite.email,
      password,
      options: { data: { org_name: orgName, invited: true } },
    });

    if (authErr) {
      // If user already exists, try to sign in
      if (authErr.message.includes("already registered")) {
        const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({ email: invite.email, password });
        if (loginErr) { setError("Account exists. " + loginErr.message); setLoading(false); return; }
        if (loginData.user) { await acceptInvite(loginData.user.id, invite); return; }
      }
      setError(authErr.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await acceptInvite(data.user.id, invite);
    }
  };

  if (status === "loading") return <CenterMessage text="Loading invite..." />;
  if (status === "not_found") return <CenterMessage text="Invite not found. Please ask your team admin for a new link." />;
  if (status === "expired") return <CenterMessage text="This invite has expired. Please ask your team admin for a new one." />;
  if (status === "used") return <CenterMessage text="This invite has already been accepted." link="/login" linkText="Sign in" />;
  if (status === "accepted") return <CenterMessage text="You're in! Redirecting to dashboard..." />;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.b, padding: 32 }}>
      <div style={{ width: "100%", maxWidth: 380 }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 40 }}>
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 15, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>

        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 28, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Join {orgName}</h1>
        <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)", marginBottom: 32 }}>
          You've been invited to join as <strong>{invite?.role}</strong>. Create a password to get started.
        </p>

        {error && <div style={{ fontSize: 12, color: "#E24B4A", padding: "10px 14px", border: "0.5px solid #E24B4A", background: "rgba(226,75,74,0.04)", marginBottom: 16 }}>{error}</div>}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>EMAIL</label>
          <input type="email" value={email} disabled style={{ ...inputStyle, opacity: 0.6, cursor: "not-allowed" }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>PASSWORD</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSignupAndAccept()} placeholder="Create a password" style={inputStyle} />
        </div>

        <button onClick={handleSignupAndAccept} disabled={loading} style={{ width: "100%", padding: "12px", fontSize: 14, fontFamily: F.d, fontWeight: 600, color: "#fff", background: "var(--cm-slate)", border: "none", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Joining..." : "Join team"}
        </button>
      </div>
    </div>
  );
}

function CenterMessage({ text, link, linkText }: { text: string; link?: string; linkText?: string }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',system-ui,sans-serif", textAlign: "center", padding: 32 }}>
      <div>
        <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)", marginBottom: 12 }}>{text}</p>
        {link && <a href={link} style={{ fontSize: 13, color: "var(--cm-slate)", textDecoration: "none", fontWeight: 500 }}>{linkText}</a>}
      </div>
    </div>
  );
}

export default function AcceptInvitePage() { return <Suspense><AcceptInviteContent /></Suspense>; }

