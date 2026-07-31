import { supabase } from "@/lib/supabase";
import { mapProperty, type Property, type PropertyRow } from "@/lib/properties";

export async function fetchFavoriteIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("favorites")
    .select("property_id")
    .eq("user_id", userId);
  if (error) throw error;
  return ((data ?? []) as { property_id: string }[]).map((r) => r.property_id);
}

export async function fetchFavoriteProperties(userId: string): Promise<Property[]> {
  const ids = await fetchFavoriteIds(userId);
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .in("id", ids)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data as PropertyRow[]).map((row) => mapProperty(row));
}

export async function toggleFavorite(userId: string, propertyId: string, isSaved: boolean) {
  if (isSaved) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("property_id", propertyId);
    if (error) throw error;
    return false;
  }
  const { error } = await supabase.from("favorites").insert({ user_id: userId, property_id: propertyId });
  if (error) throw error;
  return true;
}
