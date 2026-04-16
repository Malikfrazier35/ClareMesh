"use client";
import { useEffect } from "react";

export default function DocsCompliancePage() {
  useEffect(() => {
    window.location.replace("/security");
  }, []);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans',system-ui,sans-serif" }}>
      <p style={{ fontSize: 14, color: "var(--cm-text-panel-b)" }}>Redirecting to security trust center...</p>
    </div>
  );
}
