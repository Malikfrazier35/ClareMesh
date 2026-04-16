"use client";
import { useState, Suspense } from "react";
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

function validatePassword(pw: string) {
  const checks = [
    { label: "At least 8 characters", pass: pw.length >= 8 },
    { label: "One uppercase letter", pass: /[A-Z]/.test(pw) },
    { label: "One number", pass: /[0-9]/.test(pw) },
    { label: "One special character", pass: /[^A-Za-z0-9]/.test(pw) },
  ];
  return { checks, valid: checks.every((c) => c.pass) };
}

function SignupContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [tosAccepted, setTosAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPwChecks, setShowPwChecks] = useState(false);

  const pwValidation = validatePassword(password);

  const handleSignup = async () => {
    setError(null);
    if (!email || !password || !orgName) { setError("All fields are required."); return; }
    if (!pwValidation.valid) { setError("Password does not meet requirements."); return; }
    if (!tosAccepted) { setError("You must accept the Terms of Service and Privacy Policy."); return; }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { org_name: orgName },
        emailRedirectTo: "https://claremesh.com/auth/callback",
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").update({
        tos_accepted_at: new Date().toISOString(),
        privacy_accepted_at: new Date().toISOString(),
      }).eq("id", data.user.id);
    }

    window.location.href = "/onboarding";
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: F.b }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 40 }}>
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
            <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 15, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
          </a>

          <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 28, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)", marginBottom: 32 }}>Start normalizing financial data in under 5 minutes.</p>

          {error && (
            <div style={{ fontSize: 12, color: "#E24B4A", padding: "10px 14px", border: "0.5px solid #E24B4A", background: "rgba(226,75,74,0.04)", marginBottom: 16 }}>{error}</div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>ORGANIZATION NAME</label>
            <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Acme Corp" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>EMAIL</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>PASSWORD</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onFocus={() => setShowPwChecks(true)} placeholder="Min 8 chars, 1 upper, 1 number, 1 special" style={inputStyle} />
          </div>

          {showPwChecks && password.length > 0 && (
            <div style={{ marginBottom: 16, padding: "8px 12px", background: "var(--cm-terminal)", border: "0.5px solid var(--cm-border-light)" }}>
              {pwValidation.checks.map((c) => (
                <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: F.m, color: c.pass ? "#1D9E75" : "var(--cm-text-dim)", marginBottom: 2 }}>
                  <span>{c.pass ? "\u2713" : "\u2717"}</span>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          )}

          <div style={{ marginBottom: 24, marginTop: 16 }}>
            <label style={{ display: "flex", alignItems: "flex-start", gap: 8, cursor: "pointer" }}>
              <input type="checkbox" checked={tosAccepted} onChange={(e) => setTosAccepted(e.target.checked)} style={{ marginTop: 3, accentColor: "var(--cm-slate)" }} />
              <span style={{ fontSize: 12, color: "var(--cm-text-panel-b)", lineHeight: 1.5 }}>
                I agree to the <a href="/terms" target="_blank" style={{ color: "var(--cm-slate)", textDecoration: "underline", textUnderlineOffset: "2px" }}>Terms of Service</a> and <a href="/privacy" target="_blank" style={{ color: "var(--cm-slate)", textDecoration: "underline", textUnderlineOffset: "2px" }}>Privacy Policy</a>.
              </span>
            </label>
          </div>

          <button onClick={handleSignup} disabled={loading} style={{ width: "100%", padding: "12px", fontSize: 14, fontFamily: F.d, fontWeight: 600, color: "#fff", background: "var(--cm-slate)", border: "none", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Creating account..." : "Create account"}
          </button>

          <p style={{ marginTop: 20, fontSize: 13, color: "var(--cm-text-dim)", textAlign: "center" }}>
            Already have an account? <a href="/login" style={{ color: "var(--cm-slate)", textDecoration: "none", fontWeight: 500 }}>Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() { return <Suspense><SignupContent /></Suspense>; }

