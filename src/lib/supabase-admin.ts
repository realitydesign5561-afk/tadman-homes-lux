import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRole) {
  // Do not throw at import time — server deployments should set these.
  // Consumers should validate before use.
}

export function createAdminSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceRole) {
    throw new Error(
      "Missing server Supabase environment variables. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
    );
  }

  return createClient(supabaseUrl, supabaseServiceRole, {
    auth: { persistSession: false },
  });
}
