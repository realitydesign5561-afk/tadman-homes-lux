import { supabase } from "./supabase";

export async function canCreateProperty(
  merchantId: string
) {
  const { data, error } = await supabase.rpc(
    "check_merchant_listing_limit",
    {
      p_merchant_id: merchantId,
    }
  );

  if (error) {
    console.error("Subscription check error:", error);
    throw error;
  }

  return data === true;
}
