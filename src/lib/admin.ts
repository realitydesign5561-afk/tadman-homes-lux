import { supabase } from "@/lib/supabase";
import type { PropertyRow } from "@/lib/properties";

/* ----------------------------- activity log ----------------------------- */

export type ActivityRow = {
  id: string;
  actor_name: string | null;
  action: string;
  entity: string | null;
  created_at: string;
};

export async function logActivity(action: string, entity?: string, entityId?: string) {
  const { data } = await supabase.auth.getUser();
  await supabase.from("activity_log").insert({
    actor_id: data.user?.id ?? null,
    actor_name: data.user?.email ?? null,
    action,
    entity: entity ?? null,
    entity_id: entityId ?? null,
  });
}

export async function fetchActivity(limit = 12): Promise<ActivityRow[]> {
  const { data, error } = await supabase
    .from("activity_log")
    .select("id, actor_name, action, entity, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as ActivityRow[];
}

/* ------------------------------- overview ------------------------------- */

async function countOf(table: string) {
  const { count, error } = await supabase.from(table).select("id", { count: "exact", head: true });
  if (error) return 0;
  return count ?? 0;
}

export async function fetchOverview() {
  const [properties, merchants, agents, enquiries, management] = await Promise.all([
    countOf("properties"),
    countOf("merchants"),
    countOf("agents"),
    countOf("contact_requests"),
    countOf("property_management_requests"),
  ]);
  return { properties, merchants, agents, enquiries, management };
}

/* ------------------------------ properties ------------------------------ */

export async function fetchAllProperties(): Promise<PropertyRow[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PropertyRow[];
}

export async function updateProperty(id: string, patch: Record<string, unknown>) {
  const { error } = await supabase.from("properties").update(patch).eq("id", id);
  if (error) throw error;
  await logActivity(`Updated property`, "property", id);
}

export async function setPropertyStatus(id: string, status: string) {
  await updateProperty(id, {
    status,
    published_at: status === "approved" ? new Date().toISOString() : null,
  });
}

export async function deleteProperty(id: string) {
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) throw error;
  await logActivity("Deleted property", "property", id);
}

/* ------------------------------- merchants ------------------------------ */

export type MerchantRow = {
  id: string;
  user_id: string | null;
  business_name: string;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  website: string | null;
  logo_url: string | null;
  description: string | null;
  status: string;
  verified: boolean;
  created_at: string;
};

export async function fetchMerchants(): Promise<MerchantRow[]> {
  const { data, error } = await supabase
    .from("merchants")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as MerchantRow[];
}

export async function setMerchantStatus(id: string, status: string) {
  const { error } = await supabase
    .from("merchants")
    .update({ status, verified: status === "approved" })
    .eq("id", id);
  if (error) throw error;
  await logActivity(`Merchant marked ${status}`, "merchant", id);
}

export async function deleteMerchant(id: string) {
  const { error } = await supabase.from("merchants").delete().eq("id", id);
  if (error) throw error;
  await logActivity("Deleted merchant", "merchant", id);
}

export type SubscriptionRow = {
  id: string;
  merchant_id: string | null;
  status: string;
  current_period_end: string | null;
  provider: string | null;
};

export async function fetchSubscriptions(): Promise<SubscriptionRow[]> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("id, merchant_id, status, current_period_end, provider");
  if (error) return [];
  return (data ?? []) as SubscriptionRow[];
}

/* --------------------------------- agents -------------------------------- */

export type AdminAgentRow = {
  id: string;
  full_name: string;
  title: string | null;
  bio: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  is_active: boolean;
  sort_order: number | null;
};

export async function fetchAllAgents(): Promise<AdminAgentRow[]> {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AdminAgentRow[];
}

export async function upsertAgent(agent: Partial<AdminAgentRow>) {
  const { error } = await supabase.from("agents").upsert(agent);
  if (error) throw error;
  await logActivity(agent.id ? "Updated agent" : "Added agent", "agent", agent.id);
}

export async function deleteAgent(id: string) {
  const { error } = await supabase.from("agents").delete().eq("id", id);
  if (error) throw error;
  await logActivity("Deleted agent", "agent", id);
}

/* ------------------------------- enquiries ------------------------------- */

export type EnquiryRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  property_id: string | null;
  source: string | null;
  status: string | null;
  is_read: boolean | null;
  reply: string | null;
  created_at: string;
};

export async function fetchEnquiries(): Promise<EnquiryRow[]> {
  const { data, error } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw error;
  return (data ?? []) as EnquiryRow[];
}

export async function updateEnquiry(id: string, patch: Record<string, unknown>) {
  const { error } = await supabase.from("contact_requests").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteEnquiry(id: string) {
  const { error } = await supabase.from("contact_requests").delete().eq("id", id);
  if (error) throw error;
}

/* ------------------- property management requests ------------------- */

export type ManagementRow = {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  property_address: string | null;
  property_type: string | null;
  service: string | null;
  message: string | null;
  status: string;
  is_read: boolean;
  created_at: string;
};

export async function fetchManagementRequests(): Promise<ManagementRow[]> {
  const { data, error } = await supabase
    .from("property_management_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as ManagementRow[];
}

export async function updateManagementRequest(id: string, patch: Record<string, unknown>) {
  const { error } = await supabase.from("property_management_requests").update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteManagementRequest(id: string) {
  const { error } = await supabase.from("property_management_requests").delete().eq("id", id);
  if (error) throw error;
}

/* ------------------------------ admin users ------------------------------ */

export type AdminUserRow = { user_id: string; email: string | null; full_name: string | null };

export async function fetchAdminUsers(): Promise<AdminUserRow[]> {
  const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "admin");
  const ids = (roles ?? []).map((r: any) => r.user_id);
  if (ids.length === 0) return [];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, email, full_name")
    .in("id", ids);
  return (profiles ?? []).map((p: any) => ({
    user_id: p.id,
    email: p.email,
    full_name: p.full_name,
  }));
}

export async function changeOwnPassword(password: string) {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}
