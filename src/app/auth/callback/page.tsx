"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ddevkorgiutduydelhgv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZXZrb3JnaXV0ZHV5ZGVsaGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODI0NDIsImV4cCI6MjA5MTc1ODQ0Mn0.J42xtXgMJ0J4DdTwg3eCHKafOHTe0Tb6WRlTwZ9B-eE"
);

function CallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      // Handle email confirmation or OAuth callback
      const code = searchParams.get("code");
      const token_hash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (code) {
        // OAuth or PKCE flow
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          console.error("Auth callback error:", error);
          window.location.href = "/login?error=callback_failed";
          return;
        }
      } else if (token_hash && type) {
        // Email confirmation / magic link
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as any,
        });
        if (error) {
          console.error("OTP verification error:", error);
          window.location.href = "/login?error=verification_failed";
          return;
        }
      }

      // Check if user needs onboarding
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("onboarding_completed").eq("id", user.id).single();
        if (profile && profile.onboarding_completed) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/onboarding";
        }
      } else {
        window.location.href = "/login";
      }
    }

    handleCallback();
  }, [searchParams]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)" }}>Completing sign in...</p>
        <p style={{ fontFamily: "'Geist Mono',monospace", fontSize: 11, color: "var(--cm-text-dim)", marginTop: 8 }}>Redirecting to dashboard</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><p>Loading...</p></div>}><CallbackContent /></Suspense>;
}
