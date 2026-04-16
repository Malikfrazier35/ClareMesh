"use client";
import { useEffect, useState, Suspense } from "react";
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

function CallbackContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing...");
  const [showResetForm, setShowResetForm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function handleCallback() {
      const code = searchParams.get("code");
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      // Password recovery flow — show reset form
      if (type === "recovery") {
        // Exchange code for session first
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            window.location.href = "/login?error=callback_failed";
            return;
          }
        }
        setShowResetForm(true);
        setStatus("Set your new password");
        return;
      }

      // PKCE / OAuth flow
      if (code) {
        setStatus("Exchanging token...");
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          window.location.href = "/login?error=callback_failed";
          return;
        }
        await redirectAfterAuth();
        return;
      }

      // Email confirmation / magic link
      if (token_hash && type) {
        setStatus("Verifying...");
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as "signup" | "email" | "magiclink",
        });
        if (error) {
          window.location.href = "/login?error=verification_failed";
          return;
        }
        await redirectAfterAuth();
        return;
      }

      // Hash fragment flow (Supabase implicit grant)
      if (typeof window !== "undefined" && window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const hashType = hashParams.get("type");

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            window.location.href = "/login?error=callback_failed";
            return;
          }

          if (hashType === "recovery") {
            setShowResetForm(true);
            setStatus("Set your new password");
            return;
          }

          await redirectAfterAuth();
          return;
        }
      }

      // No recognizable params — redirect to login
      window.location.href = "/login";
    }

    handleCallback();
  }, [searchParams]);

  async function redirectAfterAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("onboarding_completed").eq("id", user.id).single();
      window.location.href = profile?.onboarding_completed ? "/dashboard" : "/onboarding";
    } else {
      window.location.href = "/login";
    }
  }

  const handlePasswordReset = async () => {
    setError(null);
    if (newPassword.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!/[A-Z]/.test(newPassword)) { setError("Password must contain an uppercase letter."); return; }
    if (!/[0-9]/.test(newPassword)) { setError("Password must contain a number."); return; }
    if (!/[^A-Za-z0-9]/.test(newPassword)) { setError("Password must contain a special character."); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match."); return; }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // Update last_password_changed_at
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({ last_password_changed_at: new Date().toISOString() }).eq("id", user.id);
    }

    window.location.href = "/login?message=password_reset";
  };

  const inputStyle = { width: "100%", padding: "10px 14px", fontSize: 14, fontFamily: "'DM Sans',system-ui,sans-serif", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)", color: "var(--cm-text-panel-h)", outline: "none", boxSizing: "border-box" as const };

  if (showResetForm) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.b, padding: 32 }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 28, letterSpacing: -0.5, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Set new password</h1>
          <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)", marginBottom: 32 }}>Enter your new password below.</p>

          {error && (
            <div style={{ fontSize: 12, color: "#E24B4A", padding: "10px 14px", border: "0.5px solid #E24B4A", background: "rgba(226,75,74,0.04)", marginBottom: 16 }}>{error}</div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>NEW PASSWORD</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 chars, 1 upper, 1 number, 1 special" style={inputStyle} />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>CONFIRM PASSWORD</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handlePasswordReset()} placeholder="Re-enter password" style={inputStyle} />
          </div>

          <button onClick={handlePasswordReset} disabled={loading} style={{ width: "100%", padding: "12px", fontSize: 14, fontFamily: F.d, fontWeight: 600, color: "#fff", background: "var(--cm-slate)", border: "none", cursor: loading ? "wait" : "pointer", opacity: loading ? 0.6 : 1 }}>
            {loading ? "Updating..." : "Update password"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: F.b }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)" }}>{status}</p>
        <p style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-dim)", marginTop: 8 }}>Redirecting...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p>Loading...</p></div>}><CallbackContent /></Suspense>;
}

