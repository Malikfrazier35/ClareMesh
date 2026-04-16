"use client";
import { useState } from "react";
import { UserProfile, Organization, canManageBilling } from "@/lib/auth";
import { exportOrgData, downloadJson, requestAccountDeletion, cancelAccountDeletion } from "@/lib/lifecycle";

const F = {
  d: "'Instrument Sans','SF Pro Display','Segoe UI',system-ui,sans-serif",
  m: "'Geist Mono','SF Mono','Cascadia Code','Consolas','Courier New',monospace",
};

export default function DangerZone({ profile, org }: { profile: UserProfile; org: Organization }) {
  const [exporting, setExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletionPending, setDeletionPending] = useState(!!org.deletion_requested_at);
  const [cancelling, setCancelling] = useState(false);

  const isOwner = canManageBilling(profile.role);

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportOrgData(org.id, profile.id);
      downloadJson(data, `claremesh-export-${org.slug}-${new Date().toISOString().split("T")[0]}.json`);
      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
    } catch (err: any) {
      alert("Export failed: " + err.message);
    }
    setExporting(false);
  };

  const handleDelete = async () => {
    setDeleteError(null);
    if (deleteConfirm !== org.name) { setDeleteError(`Type "${org.name}" to confirm.`); return; }

    setDeleting(true);
    try {
      await requestAccountDeletion(org.id, profile.id, deleteReason);
      setDeletionPending(true);
    } catch (err: any) {
      setDeleteError(err.message);
    }
    setDeleting(false);
  };

  const handleCancelDeletion = async () => {
    setCancelling(true);
    await cancelAccountDeletion(org.id, profile.id);
    setDeletionPending(false);
    setCancelling(false);
  };

  const inputStyle = { width: "100%", padding: "10px 14px", fontSize: 14, fontFamily: "'DM Sans',system-ui,sans-serif", border: "0.5px solid var(--cm-border-light)", background: "var(--cm-terminal)", color: "var(--cm-text-panel-h)", outline: "none", boxSizing: "border-box" as const };

  return (
    <div style={{ borderTop: "0.5px solid var(--cm-border-light)", paddingTop: 32, marginTop: 40 }}>
      {/* Data Export */}
      <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 18, color: "var(--cm-text-panel-h)", marginBottom: 8 }}>Data export</h2>
      <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)", lineHeight: 1.6, marginBottom: 16 }}>
        Download all your organization's data as a JSON file. Includes connectors, transforms, sync events, compliance controls, audit log, and usage records.
      </p>
      <button onClick={handleExport} disabled={exporting} style={{ padding: "10px 20px", fontSize: 13, fontFamily: F.d, fontWeight: 500, color: "var(--cm-text-panel-h)", background: "transparent", border: "0.5px solid var(--cm-border-light)", cursor: exporting ? "wait" : "pointer" }}>
        {exporting ? "Exporting..." : exportDone ? "Downloaded" : "Export all data"}
      </button>

      {/* Account Deletion — owner only */}
      {isOwner && (
        <div style={{ marginTop: 40, padding: "20px", border: "0.5px solid #E24B4A", background: "rgba(226,75,74,0.02)" }}>
          <h2 style={{ fontFamily: F.d, fontWeight: 700, fontSize: 18, color: "#E24B4A", marginBottom: 8 }}>Delete account</h2>

          {deletionPending ? (
            <div>
              <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)", lineHeight: 1.6, marginBottom: 12 }}>
                Account deletion has been requested. Your data will be permanently deleted after the 30-day grace period
                {org.deletion_grace_ends_at && <> (ends {new Date(org.deletion_grace_ends_at).toLocaleDateString()})</>}.
                You can cancel this at any time before then.
              </p>
              <button onClick={handleCancelDeletion} disabled={cancelling} style={{ padding: "10px 20px", fontSize: 13, fontFamily: F.d, fontWeight: 500, color: "#fff", background: "var(--cm-slate)", border: "none", cursor: "pointer" }}>
                {cancelling ? "Cancelling..." : "Cancel deletion"}
              </button>
            </div>
          ) : (
            <div>
              <p style={{ fontSize: 13, color: "var(--cm-text-panel-b)", lineHeight: 1.6, marginBottom: 8 }}>
                This will permanently delete your organization, all connectors, transform history, compliance records, and team members. This action cannot be undone after the 30-day grace period.
              </p>
              <p style={{ fontSize: 12, color: "var(--cm-text-dim)", marginBottom: 16 }}>
                We recommend exporting your data first. Active Stripe subscriptions will be cancelled automatically.
              </p>

              {deleteError && <div style={{ fontSize: 12, color: "#E24B4A", marginBottom: 12 }}>{deleteError}</div>}

              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "var(--cm-text-dim)", marginBottom: 6 }}>REASON (OPTIONAL)</label>
                <input type="text" value={deleteReason} onChange={(e) => setDeleteReason(e.target.value)} placeholder="Why are you leaving?" style={inputStyle} />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontFamily: F.m, fontSize: 10, letterSpacing: 1, color: "#E24B4A", marginBottom: 6 }}>TYPE "{org.name}" TO CONFIRM</label>
                <input type="text" value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder={org.name} style={{ ...inputStyle, borderColor: "#E24B4A" }} />
              </div>

              <button onClick={handleDelete} disabled={deleting || deleteConfirm !== org.name} style={{ padding: "10px 20px", fontSize: 13, fontFamily: F.d, fontWeight: 500, color: "#fff", background: deleteConfirm === org.name ? "#E24B4A" : "var(--cm-text-dim)", border: "none", cursor: deleteConfirm === org.name ? "pointer" : "not-allowed" }}>
                {deleting ? "Processing..." : "Delete account"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

