import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ddevkorgiutduydelhgv.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkZXZrb3JnaXV0ZHV5ZGVsaGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODI0NDIsImV4cCI6MjA5MTc1ODQ0Mn0.J42xtXgMJ0J4DdTwg3eCHKafOHTe0Tb6WRlTwZ9B-eE"
);

export type UserProfile = {
  id: string;
  org_id: string;
  email: string;
  role: "owner" | "admin" | "member" | "viewer";
  display_name: string | null;
  onboarding_completed: boolean;
  onboarding_step: number;
  tos_accepted_at: string | null;
  privacy_accepted_at: string | null;
  last_password_changed_at: string | null;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  plan: "open" | "build" | "scale" | "enterprise";
  suspended_at: string | null;
  stripe_customer_id: string | null;
};

export async function getAuthState() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { user: null, profile: null, org: null, redirect: "/login" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return { user, profile: null, org: null, redirect: "/onboarding" };
  if (!profile.onboarding_completed) return { user, profile, org: null, redirect: "/onboarding" };

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", profile.org_id)
    .single();

  // Check suspension
  if (org?.suspended_at) {
    return { user, profile: profile as UserProfile, org: org as Organization, suspended: true, redirect: null };
  }

  return { user, profile: profile as UserProfile, org: org as Organization, suspended: false, redirect: null };
}

// RBAC helpers
export function canManageBilling(role: string) { return role === "owner"; }
export function canManageTeam(role: string) { return role === "owner" || role === "admin"; }
export function canManageApiKeys(role: string) { return role === "owner" || role === "admin"; }
export function canManageConnectors(role: string) { return role === "owner" || role === "admin"; }
export function canViewCompliance(role: string) { return role !== "viewer"; }

// Plan-based feature gates
export function canUseSync(plan: string) { return plan === "scale" || plan === "enterprise"; }
export function canExportCompliance(plan: string) { return plan !== "open"; }
export function canUseApiKeys(plan: string) { return plan !== "open"; }
export function getTransformLimit(plan: string) {
  switch (plan) {
    case "open": return 1000;
    case "build": return 50000;
    case "scale": return 500000;
    case "enterprise": return Infinity;
    default: return 1000;
  }
}

