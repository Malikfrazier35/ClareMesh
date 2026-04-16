import { supabase } from "@/lib/auth";

// ═══ DATA EXPORT ═══
export async function exportOrgData(orgId: string, userId: string): Promise<string> {
  const tables = [
    "connectors",
    "transform_logs",
    "sync_channels",
    "sync_events",
    "anomaly_queue",
    "compliance_controls",
    "api_keys",
    "audit_log",
    "account_mappings",
    "lineage_records",
    "usage_records",
  ];

  const exportData: Record<string, any[]> = {};
  const tablesIncluded: string[] = [];

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select("*").eq("org_id", orgId);
      if (data && data.length > 0) {
        exportData[table] = data;
        tablesIncluded.push(table);
      }
    } catch {
      // Table might not have org_id or might not be accessible
    }
  }

  // Add org and profile data
  const { data: org } = await supabase.from("organizations").select("*").eq("id", orgId).single();
  const { data: profiles } = await supabase.from("profiles").select("id, email, role, display_name, created_at").eq("org_id", orgId);

  exportData._organization = org ? [org] : [];
  exportData._profiles = profiles || [];

  const exportJson = JSON.stringify({
    exported_at: new Date().toISOString(),
    org_id: orgId,
    tables_included: tablesIncluded,
    data: exportData,
  }, null, 2);

  // Record the export
  await supabase.from("data_exports").insert({
    org_id: orgId,
    requested_by: userId,
    status: "completed",
    tables_included: tablesIncluded,
    file_size_bytes: new Blob([exportJson]).size,
    completed_at: new Date().toISOString(),
  });

  // Log in audit
  await supabase.from("audit_log").insert({
    org_id: orgId,
    actor_id: userId,
    action: "data_export",
    resource_type: "organization",
    resource_id: orgId,
    metadata: { tables: tablesIncluded, size_bytes: new Blob([exportJson]).size },
  });

  return exportJson;
}

export function downloadJson(data: string, filename: string) {
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ═══ ACCOUNT DELETION ═══
export async function requestAccountDeletion(orgId: string, userId: string, reason?: string) {
  // Create deletion request
  const { error } = await supabase.from("account_deletion_requests").insert({
    org_id: orgId,
    requested_by: userId,
    reason: reason || null,
    status: "grace_period",
  });

  if (error) throw error;

  // Mark org as pending deletion
  const graceEnd = new Date();
  graceEnd.setDate(graceEnd.getDate() + 30);

  await supabase.from("organizations").update({
    deletion_requested_at: new Date().toISOString(),
    deletion_grace_ends_at: graceEnd.toISOString(),
  }).eq("id", orgId);

  // Log in audit
  await supabase.from("audit_log").insert({
    org_id: orgId,
    actor_id: userId,
    action: "account_deletion_requested",
    resource_type: "organization",
    resource_id: orgId,
    metadata: { reason, grace_period_ends: graceEnd.toISOString() },
  });
}

export async function cancelAccountDeletion(orgId: string, userId: string) {
  await supabase.from("account_deletion_requests")
    .update({ status: "cancelled" })
    .eq("org_id", orgId)
    .eq("status", "grace_period");

  await supabase.from("organizations").update({
    deletion_requested_at: null,
    deletion_grace_ends_at: null,
  }).eq("id", orgId);

  await supabase.from("audit_log").insert({
    org_id: orgId,
    actor_id: userId,
    action: "account_deletion_cancelled",
    resource_type: "organization",
    resource_id: orgId,
  });
}

