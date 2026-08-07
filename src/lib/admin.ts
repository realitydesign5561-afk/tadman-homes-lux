import { supabase } from "@/lib/supabase";
import type { PropertyRow } from "@/lib/properties";

/* ============================================================================
   TYPES
============================================================================ */

export type ActivityRow = {
  id: string;
  actor_name: string | null;
  action: string;
  entity: string | null;
  created_at: string;
};

export type AdminOverview = {
  properties: number;
  merchants: number;
  agents: number;
  enquiries: number;
  management: number;
  approvedProperties: number;
  pendingProperties: number;
  draftProperties: number;
  soldProperties: number;
  rentedProperties: number;
};

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

export type SubscriptionRow = {
  id: string;
  merchant_id: string;
  start_date: string;
  expiry_date: string;
  payment_reference: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  plan_id: string | null;
  status: string;

  merchants?: {
    id: string;
    business_name: string;
    whatsapp_number: string | null;
  } | null;

  subscription_plans?: {
    name: string;
    price: number;
    interval: string;
  } | null;
};

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

export type EnquiryRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  property_id: string | null;
  merchant_id: string | null;
  source: string | null;
  status: string | null;
  is_read: boolean | null;
  reply: string | null;
  created_at: string;
};

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

export type AdminUserRow = {
  user_id: string;
  email: string | null;
  full_name: string | null;
};

/* ============================================================================
   ACTIVITY
============================================================================ */

export async function logActivity(
  action: string,
  entity?: string,
  entityId?: string,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("activity_log").insert({
    actor_id: user?.id ?? null,
    actor_name: user?.email ?? null,
    action,
    entity: entity ?? null,
    entity_id: entityId ?? null,
  });

  // Activity logging should never break the main admin action.
  if (error) {
    console.error("Activity log error:", error);
  }
}

export async function fetchActivity(limit = 100): Promise<ActivityRow[]> {
  const { data, error } = await supabase
    .from("activity_log")
    .select("id, actor_name, action, entity, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Fetch activity error:", error);
    throw error;
  }

  return (data ?? []) as ActivityRow[];
}

/* ============================================================================
   OVERVIEW
============================================================================ */

async function countRows(
  table: string,
  filter?: { column: string; value: string },
) {
  let query = supabase
    .from(table)
    .select("id", {
      count: "exact",
      head: true,
    });

  if (filter) {
    query = query.eq(filter.column, filter.value);
  }

  const { count, error } = await query;

  if (error) {
    console.error(`Count ${table} error:`, error);
    throw error;
  }

  return count ?? 0;
}

export async function fetchOverview(): Promise<AdminOverview> {
  const [
    properties,
    merchants,
    agents,
    enquiries,
    management,
    approvedProperties,
    pendingProperties,
    draftProperties,
    soldProperties,
    rentedProperties,
  ] = await Promise.all([
    countRows("properties"),
    countRows("merchants"),
    countRows("agents"),
    countRows("contact_requests"),
    countRows("property_management_requests"),

    countRows("properties", {
      column: "status",
      value: "approved",
    }),

    countRows("properties", {
      column: "status",
      value: "pending",
    }),

    countRows("properties", {
      column: "status",
      value: "draft",
    }),

    countRows("properties", {
      column: "status",
      value: "sold",
    }),

    countRows("properties", {
      column: "status",
      value: "rented",
    }),
  ]);

  return {
    properties,
    merchants,
    agents,
    enquiries,
    management,
    approvedProperties,
    pendingProperties,
    draftProperties,
    soldProperties,
    rentedProperties,
  };
}

/* ============================================================================
   PROPERTIES
============================================================================ */

export async function fetchAllProperties(): Promise<PropertyRow[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Fetch admin properties error:", error);
    throw error;
  }

  return (data ?? []) as PropertyRow[];
}

export async function updateProperty(
  id: string,
  patch: Record<string, unknown>,
) {
  const { error } = await supabase
    .from("properties")
    .update(patch)
    .eq("id", id);

  if (error) {
    console.error("Update property error:", error);
    throw error;
  }

  await logActivity("Updated property", "property", id);
}

export async function setPropertyStatus(
  id: string,
  status: string,
) {
  const patch: Record<string, unknown> = {
    status,
  };

  if (status === "approved") {
    patch.published_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("properties")
    .update(patch)
    .eq("id", id);

  if (error) {
    console.error("Set property status error:", error);
    throw error;
  }

  await logActivity(
    `Property marked ${status}`,
    "property",
    id,
  );
}

export async function setPropertyFeatured(
  id: string,
  featured: boolean,
) {
  const { error } = await supabase
    .from("properties")
    .update({
      is_featured: featured,
    })
    .eq("id", id);

  if (error) {
    console.error("Feature property error:", error);
    throw error;
  }

  await logActivity(
    featured ? "Featured property" : "Unfeatured property",
    "property",
    id,
  );
}

export async function deleteProperty(id: string) {
  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete property error:", error);
    throw error;
  }

  await logActivity(
    "Deleted property",
    "property",
    id,
  );
}

/* ============================================================================
   MERCHANTS
============================================================================ */

export async function fetchMerchants(): Promise<MerchantRow[]> {
  const { data, error } = await supabase
    .from("merchants")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Fetch merchants error:", error);
    throw error;
  }

  return (data ?? []) as MerchantRow[];
}

export async function setMerchantStatus(
  id: string,
  status: string,
) {
  const { error } = await supabase
    .from("merchants")
    .update({
      status,
      verified: status === "approved",
    })
    .eq("id", id);

  if (error) {
    console.error("Set merchant status error:", error);
    throw error;
  }

  await logActivity(
    `Merchant marked ${status}`,
    "merchant",
    id,
  );
}

export async function deleteMerchant(id: string) {
  const { error } = await supabase
    .from("merchants")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete merchant error:", error);
    throw error;
  }

  await logActivity(
    "Deleted merchant",
    "merchant",
    id,
  );
}

/* ============================================================================
   SUBSCRIPTIONS
============================================================================ */

const subscriptionSelect = `
  *,
  merchants (
    id,
    business_name,
    whatsapp_number
  ),
  subscription_plans (
    name,
    price,
    interval
  )
`;

export async function fetchSubscriptions(): Promise<
  SubscriptionRow[]
> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select(subscriptionSelect)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Fetch subscriptions error:", error);
    throw error;
  }

  return (data ?? []) as SubscriptionRow[];
}

export async function fetchExpiringSubscriptions(): Promise<
  SubscriptionRow[]
> {
  const now = new Date();

  const threeDaysFromNow = new Date(
    now.getTime() + 3 * 24 * 60 * 60 * 1000,
  );

  const { data, error } = await supabase
    .from("subscriptions")
    .select(subscriptionSelect)
    .eq("status", "active")
    .gte("expiry_date", now.toISOString())
    .lte(
      "expiry_date",
      threeDaysFromNow.toISOString(),
    )
    .order("expiry_date", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Fetch expiring subscriptions error:",
      error,
    );
    throw error;
  }

  return (data ?? []) as SubscriptionRow[];
}

export async function fetchExpiredSubscriptions(): Promise<
  SubscriptionRow[]
> {
  const now = new Date();

  const { data, error } = await supabase
    .from("subscriptions")
    .select(subscriptionSelect)
    .lt("expiry_date", now.toISOString())
    .eq("status", "active")
    .order("expiry_date", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Fetch expired subscriptions error:",
      error,
    );
    throw error;
  }

  return (data ?? []) as SubscriptionRow[];
}

/* ============================================================================
   AGENTS
============================================================================ */

export async function fetchAllAgents(): Promise<
  AdminAgentRow[]
> {
  const { data, error } = await supabase
    .from("agents")
    .select(
      "id, full_name, title, bio, photo_url, email, phone, whatsapp, is_active, sort_order",
    )
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    console.error("Fetch agents error:", error);
    throw error;
  }

  return (data ?? []) as AdminAgentRow[];
}

export async function upsertAgent(
  agent: Partial<AdminAgentRow>,
) {
  const payload = {
    ...agent,
  };

  const { data, error } = await supabase
    .from("agents")
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error("Save agent error:", error);
    throw error;
  }

  await logActivity(
    agent.id ? "Updated agent" : "Added agent",
    "agent",
    data.id,
  );

  return data as AdminAgentRow;
}

export async function setAgentStatus(
  id: string,
  isActive: boolean,
) {
  const { error } = await supabase
    .from("agents")
    .update({
      is_active: isActive,
    })
    .eq("id", id);

  if (error) {
    console.error("Set agent status error:", error);
    throw error;
  }

  await logActivity(
    isActive ? "Activated agent" : "Deactivated agent",
    "agent",
    id,
  );
}

export async function deleteAgent(id: string) {
  const { error } = await supabase
    .from("agents")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete agent error:", error);
    throw error;
  }

  await logActivity(
    "Deleted agent",
    "agent",
    id,
  );
}

/* ============================================================================
   ENQUIRIES
============================================================================ */

export async function fetchEnquiries(): Promise<
  EnquiryRow[]
> {
  const { data, error } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(200);

  if (error) {
    console.error("Fetch enquiries error:", error);
    throw error;
  }

  return (data ?? []) as EnquiryRow[];
}

export async function updateEnquiry(
  id: string,
  patch: Record<string, unknown>,
) {
  const { error } = await supabase
    .from("contact_requests")
    .update(patch)
    .eq("id", id);

  if (error) {
    console.error("Update enquiry error:", error);
    throw error;
  }

  await logActivity(
    "Updated enquiry",
    "enquiry",
    id,
  );
}

export async function deleteEnquiry(id: string) {
  const { error } = await supabase
    .from("contact_requests")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete enquiry error:", error);
    throw error;
  }

  await logActivity(
    "Deleted enquiry",
    "enquiry",
    id,
  );
}

/* ============================================================================
   PROPERTY MANAGEMENT REQUESTS
============================================================================ */

export async function fetchManagementRequests(): Promise<
  ManagementRow[]
> {
  const { data, error } = await supabase
    .from("property_management_requests")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Fetch management requests error:",
      error,
    );
    throw error;
  }

  return (data ?? []) as ManagementRow[];
}

export async function updateManagementRequest(
  id: string,
  patch: Record<string, unknown>,
) {
  const { error } = await supabase
    .from("property_management_requests")
    .update(patch)
    .eq("id", id);

  if (error) {
    console.error(
      "Update management request error:",
      error,
    );
    throw error;
  }

  await logActivity(
    "Updated management request",
    "management_request",
    id,
  );
}

export async function deleteManagementRequest(
  id: string,
) {
  const { error } = await supabase
    .from("property_management_requests")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(
      "Delete management request error:",
      error,
    );
    throw error;
  }

  await logActivity(
    "Deleted management request",
    "management_request",
    id,
  );
}

/* ============================================================================
   ADMIN USERS
============================================================================ */

export async function fetchAdminUsers(): Promise<
  AdminUserRow[]
> {
  const { data: roles, error: rolesError } =
    await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");

  if (rolesError) {
    console.error(
      "Fetch admin roles error:",
      rolesError,
    );
    throw rolesError;
  }

  const ids = (roles ?? [])
    .map((row) => row.user_id)
    .filter(Boolean);

  if (ids.length === 0) {
    return [];
  }

  const { data: profiles, error: profilesError } =
    await supabase
      .from("profiles")
      .select("id, email, full_name")
      .in("id", ids);

  if (profilesError) {
    console.error(
      "Fetch admin profiles error:",
      profilesError,
    );
    throw profilesError;
  }

  return (profiles ?? []).map((profile) => ({
    user_id: profile.id,
    email: profile.email,
    full_name: profile.full_name,
  }));
}

export async function changeOwnPassword(
  password: string,
) {
  if (!password || password.length < 6) {
    throw new Error(
      "Password must be at least 6 characters.",
    );
  }

  const { error } =
    await supabase.auth.updateUser({
      password,
    });

  if (error) {
    console.error(
      "Change password error:",
      error,
    );
    throw error;
  }

  await logActivity(
    "Updated admin password",
    "admin",
  );
}
