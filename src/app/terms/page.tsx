"use client";
import { Suspense } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const H2 = { fontFamily: F.d, fontWeight: 700, fontSize: 20, color: "var(--cm-text-panel-h)", marginTop: 32, marginBottom: 12 };
const P = { fontSize: 14, lineHeight: 1.8, color: "var(--cm-text-panel-b)", marginBottom: 16 };

function TermsContent() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--cm-panel)", fontFamily: F.b }}>
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px", borderBottom: "0.5px solid var(--cm-border-light)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none"><rect x="4" y="4" width="14" height="14" fill="var(--cm-slate)" opacity={.15}/><rect x="12" y="12" width="14" height="14" fill="var(--cm-slate)" opacity={.25}/><rect x="22" y="22" width="14" height="14" fill="var(--cm-slate)" opacity={.4}/><circle cx="11" cy="11" r="2" fill="var(--cm-slate)"/><circle cx="20" cy="20" r="2" fill="var(--cm-slate)"/><circle cx="29" cy="29" r="2" fill="var(--cm-slate)"/><line x1="11" y1="11" x2="20" y2="20" stroke="var(--cm-slate)" strokeWidth="0.75"/><line x1="20" y1="20" x2="29" y2="29" stroke="var(--cm-slate)" strokeWidth="0.75"/></svg>
          <span style={{ fontFamily: F.d, fontWeight: 700, fontSize: 15, color: "var(--cm-text-panel-h)" }}>ClareMesh</span>
        </a>
      </nav>

      <article style={{ maxWidth: 640, margin: "0 auto", padding: "48px 32px 96px" }}>
        <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 2, color: "var(--cm-copper)", marginBottom: 12 }}>LEGAL</p>
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 36, letterSpacing: -1, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Terms of Service</h1>
        <p style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-dim)", marginBottom: 40 }}>Last updated: April 16, 2026</p>

        <p style={P}>These Terms of Service ("Terms") govern your access to and use of the ClareMesh platform, including the website at claremesh.com, the ClareMesh schema packages, transform SDK, hosted sync services, and any related APIs or documentation (collectively, the "Service"), provided by Financial Holding LLC ("Company", "we", "us").</p>
        <p style={P}>By creating an account or using the Service, you agree to be bound by these Terms. If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.</p>

        <h2 style={H2}>1. Service description</h2>
        <p style={P}>ClareMesh provides an open-source financial data schema and bi-directional sync SDK. The open-source components (schema and transforms) are licensed under the MIT License and are free to use without restriction. The hosted Service provides additional functionality including managed sync, compliance dashboards, team management, and enterprise support.</p>

        <h2 style={H2}>2. Accounts and registration</h2>
        <p style={P}>To access the hosted Service, you must create an account with a valid email address and password. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access.</p>

        <h2 style={H2}>3. Acceptable use</h2>
        <p style={P}>You agree not to use the Service to: (a) violate any applicable law or regulation; (b) infringe on the intellectual property rights of others; (c) transmit malicious code or attempt to gain unauthorized access to our systems; (d) interfere with or disrupt the integrity or performance of the Service; or (e) use the Service to process data in violation of applicable data protection laws.</p>

        <h2 style={H2}>4. Data ownership</h2>
        <p style={P}>You retain all rights, title, and interest in your data. We do not claim ownership of any data you process through the Service. For the hosted sync tier, your data is processed within your own Supabase project infrastructure and is never stored on or transmitted through our servers. See our <a href="/privacy" style={{ color: "var(--cm-slate)" }}>Privacy Policy</a> for details on how we handle account-level data.</p>

        <h2 style={H2}>5. Subscription and billing</h2>
        <p style={P}>Certain features of the Service require a paid subscription. Subscription fees are billed in advance on a monthly or annual basis as selected at the time of purchase. All fees are non-refundable except as required by law or as otherwise stated in our refund policy. We reserve the right to change our pricing with 30 days' notice to existing customers.</p>

        <h2 style={H2}>6. Intellectual property</h2>
        <p style={P}>The open-source schema and transform packages are licensed under the MIT License. The hosted Service, including its design, user interface, documentation, and proprietary code, is protected by copyright and other intellectual property laws. You may not copy, modify, or distribute the hosted Service except as expressly permitted by these Terms.</p>

        <h2 style={H2}>7. Limitation of liability</h2>
        <p style={P}>To the maximum extent permitted by law, the Company shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your use of the Service. Our aggregate liability for all claims related to the Service shall not exceed the amount you paid us in the twelve months preceding the claim.</p>

        <h2 style={H2}>8. Termination</h2>
        <p style={P}>Either party may terminate these Terms at any time. You may terminate your account through the Settings page. We may suspend or terminate your access if you violate these Terms. Upon termination, your right to use the Service ceases immediately. We will provide a 30-day grace period during which you may export your data before it is permanently deleted.</p>

        <h2 style={H2}>9. Changes to these terms</h2>
        <p style={P}>We may update these Terms from time to time. We will notify you of material changes by email or through the Service at least 30 days before they take effect. Your continued use of the Service after the effective date constitutes acceptance of the updated Terms.</p>

        <h2 style={H2}>10. Governing law</h2>
        <p style={P}>These Terms shall be governed by and construed in accordance with the laws of the State of Maryland, without regard to its conflict of law provisions. Any disputes arising from these Terms shall be resolved in the state or federal courts located in Prince George's County, Maryland.</p>

        <h2 style={H2}>11. Contact</h2>
        <p style={P}>If you have questions about these Terms, please contact us at <a href="mailto:malik@claremesh.com" style={{ color: "var(--cm-slate)" }}>malik@claremesh.com</a>.</p>

        <div style={{ marginTop: 40, padding: "16px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)", fontSize: 12, color: "var(--cm-text-dim)" }}>
          Financial Holding LLC, Prince George's County, Maryland, USA
        </div>
      </article>
    </div>
  );
}

export default function TermsPage() { return <Suspense><TermsContent /></Suspense>; }

