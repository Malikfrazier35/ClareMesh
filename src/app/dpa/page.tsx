"use client";
import { Suspense } from "react";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  b: "'DM Sans','SF Pro Text','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

const H2 = { fontFamily: F.d, fontWeight: 700, fontSize: 20, color: "var(--cm-text-panel-h)", marginTop: 32, marginBottom: 12 };
const P = { fontSize: 14, lineHeight: 1.8, color: "var(--cm-text-panel-b)", marginBottom: 16 };

function DpaContent() {
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
        <h1 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 36, letterSpacing: -1, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Data Processing Agreement</h1>
        <p style={{ fontFamily: F.m, fontSize: 11, color: "var(--cm-text-dim)", marginBottom: 40 }}>Last updated: April 16, 2026 · GDPR Article 28 compliant</p>

        <p style={P}>This Data Processing Agreement ("DPA") forms part of the Terms of Service between Financial Holding LLC ("Processor", "ClareMesh") and the Customer ("Controller") and governs the processing of personal data by the Processor on behalf of the Controller.</p>

        <h2 style={H2}>1. Definitions</h2>
        <p style={P}>"Personal Data", "Processing", "Data Subject", "Controller", and "Processor" have the meanings given in the GDPR (Regulation 2016/679). "Customer Data" means any personal data that the Controller provides to or that is collected by the Processor in connection with the Service.</p>

        <h2 style={H2}>2. Scope and purpose of processing</h2>
        <p style={P}>The Processor processes Customer Data solely to provide the Service as described in the Terms of Service. The categories of data processed include: account identifiers (email, name, organization), usage metadata (transform counts, API call logs), and technical data (IP addresses for security). The Processor does not process the Controller's end-user financial data — this data is processed within the Controller's own infrastructure.</p>

        <h2 style={H2}>3. Processor obligations</h2>
        <p style={P}>The Processor shall: (a) process Personal Data only on documented instructions from the Controller; (b) ensure that persons authorized to process Personal Data have committed to confidentiality; (c) implement appropriate technical and organizational security measures as described at claremesh.com/security; (d) not engage sub-processors without prior written authorization; (e) assist the Controller in responding to data subject requests; (f) delete or return all Personal Data upon termination; and (g) make available all information necessary to demonstrate compliance with this DPA.</p>

        <h2 style={H2}>4. Sub-processors</h2>
        <p style={P}>The Controller authorizes the use of the sub-processors listed at <a href="/security/sub-processors" style={{ color: "var(--cm-slate)" }}>claremesh.com/security/sub-processors</a>. The Processor will notify the Controller at least 30 days before engaging a new sub-processor and will provide the Controller with an opportunity to object. Each sub-processor is bound by data protection obligations no less protective than those in this DPA.</p>

        <h2 style={H2}>5. Security measures</h2>
        <p style={P}>The Processor implements security measures including: encryption in transit (TLS 1.2+) and at rest, row-level security for multi-tenant data isolation, hashed credential storage, access controls and audit logging, regular security assessments, and incident response procedures. The full list of 61 security controls is documented at <a href="/security/controls" style={{ color: "var(--cm-slate)" }}>claremesh.com/security/controls</a>.</p>

        <h2 style={H2}>6. Data breach notification</h2>
        <p style={P}>The Processor shall notify the Controller without undue delay and in any event within 72 hours after becoming aware of a Personal Data breach. The notification shall include: the nature of the breach, categories and approximate number of data subjects affected, likely consequences, and measures taken or proposed to address the breach.</p>

        <h2 style={H2}>7. Data transfers</h2>
        <p style={P}>The Service is hosted in the us-east-1 region (Virginia, USA). For transfers of Personal Data outside the European Economic Area, the parties rely on the Standard Contractual Clauses (Commission Implementing Decision 2021/914) which are incorporated by reference into this DPA. The Controller may request a copy of the SCCs by contacting malik@claremesh.com.</p>

        <h2 style={H2}>8. Data retention and deletion</h2>
        <p style={P}>Upon termination of the Service, the Processor will delete all Customer Data within 30 days unless retention is required by applicable law. The Controller may export all data prior to termination using the data export feature in the Settings page.</p>

        <h2 style={H2}>9. Audits</h2>
        <p style={P}>The Processor shall make available to the Controller all information necessary to demonstrate compliance with this DPA and allow for and contribute to audits conducted by the Controller or an auditor mandated by the Controller. The Controller shall provide at least 30 days' prior written notice of any audit. Audits shall be conducted during normal business hours and shall not unreasonably interfere with the Processor's operations.</p>

        <h2 style={H2}>10. Governing law</h2>
        <p style={P}>This DPA shall be governed by the laws of the State of Maryland, USA. For data subjects in the European Economic Area, the GDPR shall apply to the extent of any conflict with local law.</p>

        <div style={{ marginTop: 40, padding: "20px", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)" }}>
          <p style={{ fontFamily: F.m, fontSize: 10, letterSpacing: 1.5, color: "var(--cm-copper)", marginBottom: 12 }}>EXECUTION</p>
          <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)", lineHeight: 1.6, marginBottom: 12 }}>
            This DPA is automatically incorporated into the Terms of Service upon account creation. If you require a separately executed copy for your records, contact <a href="mailto:malik@claremesh.com" style={{ color: "var(--cm-slate)" }}>malik@claremesh.com</a>.
          </p>
          <p style={{ fontSize: 12, color: "var(--cm-text-dim)" }}>Financial Holding LLC, Prince George's County, Maryland, USA</p>
        </div>
      </article>
    </div>
  );
}

export default function DpaPage() { return <Suspense><DpaContent /></Suspense>; }

