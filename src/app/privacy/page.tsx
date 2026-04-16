"use client";
import { Suspense } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const H2 = { fontFamily: F.d, fontWeight: 700, fontSize: 20, color: "var(--cm-text-panel-h)", marginTop: 32, marginBottom: 12 };
const P = { fontSize: 14, lineHeight: 1.8, color: "var(--cm-text-panel-b)", marginBottom: 16 };

function PrivacyContent() {
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
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 36, letterSpacing: -1, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Privacy Policy</h1>
        <p style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-dim)", marginBottom: 40 }}>Last updated: April 16, 2026</p>

        <p style={P}>This Privacy Policy describes how Financial Holding LLC ("ClareMesh", "we", "us") collects, uses, and protects information when you use the ClareMesh platform and services. We are committed to protecting your privacy and processing your data in compliance with applicable laws including GDPR, CCPA, and other data protection regulations.</p>

        <h2 style={H2}>1. Data we collect</h2>
        <p style={P}><strong>Account data:</strong> When you create an account, we collect your email address, organization name, and hashed password. We store your role, plan selection, and onboarding preferences.</p>
        <p style={P}><strong>Usage data:</strong> We collect aggregated usage metrics including transform counts, API call volumes, and feature usage patterns. This data is used for plan enforcement and service improvement.</p>
        <p style={P}><strong>Technical data:</strong> We automatically collect IP addresses, browser type, and device information for security purposes (login activity logging, abuse prevention).</p>
        <p style={P}><strong>Customer financial data:</strong> ClareMesh's architecture is designed so that your customers' financial data (bank transactions, account balances, invoices) is processed within your own infrastructure. On the hosted sync tier, transforms run in your Supabase project. We do not have access to, store, or transmit your customers' financial data.</p>

        <h2 style={H2}>2. How we use your data</h2>
        <p style={P}>We use account data to provide and maintain the Service, authenticate your access, manage billing, and communicate service updates. Usage data is used for plan limit enforcement, performance monitoring, and product improvement. Technical data is used for security monitoring and abuse prevention. We do not sell your data to third parties.</p>

        <h2 style={H2}>3. Sub-processors</h2>
        <p style={P}>We use the following sub-processors to deliver the Service. A complete list with processing details is available at <a href="/security/sub-processors" style={{ color: "var(--cm-slate)" }}>claremesh.com/security/sub-processors</a>.</p>
        <p style={P}>Supabase (database and authentication), Vercel (hosting and edge delivery), Stripe (payment processing), GitHub (source code hosting), Cloudflare (DNS and CDN), Resend (transactional email), and Sentry (error monitoring).</p>

        <h2 style={H2}>4. Data retention</h2>
        <p style={P}>We retain account data for the duration of your active subscription plus 30 days after account closure. Usage data is retained for 12 months. Audit logs are retained for 24 months or as required by your compliance framework. You may request data deletion at any time through the Settings page or by contacting us.</p>

        <h2 style={H2}>5. Your rights</h2>
        <p style={P}>Depending on your jurisdiction, you may have the right to: access the personal data we hold about you, request correction of inaccurate data, request deletion of your data, object to or restrict processing of your data, receive your data in a portable format, and withdraw consent where processing is based on consent. To exercise any of these rights, contact us at malik@claremesh.com or use the data export feature in your Settings page.</p>

        <h2 style={H2}>6. GDPR (European users)</h2>
        <p style={P}>For users in the European Economic Area, we process personal data on the following legal bases: contract performance (account data necessary to provide the Service), legitimate interest (usage analytics for service improvement), and consent (where required). Our Data Processing Agreement is available at <a href="/dpa" style={{ color: "var(--cm-slate)" }}>claremesh.com/dpa</a>.</p>

        <h2 style={H2}>7. CCPA (California users)</h2>
        <p style={P}>California residents have the right to know what personal information we collect, request deletion, and opt out of the sale of personal information. We do not sell personal information. To exercise your CCPA rights, contact us at malik@claremesh.com.</p>

        <h2 style={H2}>8. Security</h2>
        <p style={P}>We implement industry-standard security measures including encryption in transit (TLS), hashed credential storage, row-level security for data isolation, and regular security assessments. Our security posture is documented at <a href="/security" style={{ color: "var(--cm-slate)" }}>claremesh.com/security</a> with 61 documented controls across SOC 2, ISO 27001, GDPR, CCPA, PCI DSS, and SOX frameworks.</p>

        <h2 style={H2}>9. Cookies</h2>
        <p style={P}>We use essential cookies for authentication session management. We do not use tracking cookies, advertising cookies, or third-party analytics cookies. The only cookies set by ClareMesh are session tokens necessary for the Service to function.</p>

        <h2 style={H2}>10. Changes to this policy</h2>
        <p style={P}>We will notify you of material changes to this Privacy Policy at least 30 days before they take effect via email or in-app notification.</p>

        <h2 style={H2}>11. Contact</h2>
        <p style={P}>For privacy-related inquiries, contact our data protection team at <a href="mailto:malik@claremesh.com" style={{ color: "var(--cm-slate)" }}>malik@claremesh.com</a>.</p>

        <div style={{ marginTop: 40, padding: "16px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)", fontSize: 12, color: "var(--cm-text-dim)" }}>
          Financial Holding LLC, Prince George's County, Maryland, USA
        </div>
      </article>
    </div>
  );
}

export default function PrivacyPage() { return <Suspense><PrivacyContent /></Suspense>; }

