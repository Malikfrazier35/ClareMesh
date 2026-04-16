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

function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setError(null);
    if (!email) { setError("Please enter your email address."); return; }

    setLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://claremesh.com/auth/callback?type=recovery",
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: F.b }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", marginBottom: 40 }}>
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
            <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 15, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
          </a>

          <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 28, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Reset your password</h1>
          <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)", marginBottom: 32 }}>
            {sent ? "Check your email for a reset link." : "Enter the email associated with your account."}
          </p>

          {error && (
            <div style={{ fontSize: 12, color: "#E24B4A", padding: "10px 14px", border: "0.5px solid #E24B4A", background: "rgba(226,75,74,0.04)", marginBottom: 16 }}>{error}</div>
          )}

          {sent ? (
            <div style={{ padding: "16px", border: "0.5px solid #1D9E75", background: "rgba(29,158,117,0.04)" }}>
              <p style={{ fontSize: 13, color: "#1D9E75", lineHeight: 1.6, marginBottom: 12 }}>
                If an account exists with <strong>{email}</strong>, a password reset link has been sent. The link expires in 1 hour.
              </p>
              <p style={{ fontSize: 12, color: "var(--cm-text-dim)", lineHeight: 1.5 }}>
                Check your spam folder if you don't see it within a few minutes.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>EMAIL</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleReset()} placeholder="you@company.com" style={inputStyle} />
              </div>

              <button onClick={handleReset} disabled={loading} style={{ width: "100%", padding: "12px", fontSize: 14, fontFamily: F.d, fontWeight: 600, color: "#fff", background: "var(--cm-slate)", border: "none", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.6 : 1 }}>
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </>
          )}

          <p style={{ marginTop: 20, fontSize: 13, color: "var(--cm-text-dim)", textAlign: "center" }}>
            <a href="/login" style={{ color: "var(--cm-slate)", textDecoration: "none", fontWeight: 500 }}>Back to sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ForgotPasswordPage() { return <Suspense><ForgotPasswordContent /></Suspense>; }

