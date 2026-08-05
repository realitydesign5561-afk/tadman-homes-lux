import { supabase } from "./supabase";

export async function canCreateProperty(...) {

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select(`
      *,
      subscription_plans (
        listing_limit
      )
    `)
    .eq("merchant_id", merchantId)
    .eq("status", "active")
    .gt("expiry_date", new Date().toISOString())
    .single();


  if (error || !subscription) {
    return false;
  }


  const limit =
    subscription.subscription_plans?.listing_limit ?? 0;


  const { count } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("merchant_id", merchantId)
    .in("status", ["pending", "approved"]);


  return (count ?? 0) < limit;
}
