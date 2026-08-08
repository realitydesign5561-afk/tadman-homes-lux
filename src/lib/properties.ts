import { supabase } from "@/lib/supabase";

// ─── Row shape (mirrors the database table) ──────────────────────────────────

export type PropertyRow = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  price: number | null;
  currency: string | null;
  listing_type: string | null;
  property_type: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area: number | null;
  amenities: string | null;
  features: string[] | null;
  images: string[] | null;
  status: string | null;
  is_featured: boolean | null;
  agent_id: string | null;
  created_at: string | null;
  // joined relations (optional)
  agents?: { full_name: string } | null;
  merchants?: {
    business_name: string | null;
    whatsapp_number?: string | null;
    whatsapp?: string | null;
    phone?: string | null;
  } | null;
};

// ─── Mapped shape used in UI components ──────────────────────────────────────

export type Property = {
  rowId: string;
  id: string; // slug
  title: string;
  description: string;
  image: string;
  gallery: string[];
  city: string;
  country: string;
  status: string;
  type: string;
  price: string;
  period: string;
  beds: number | null;
  baths: number | null;
  area: string;
  features: string[];
  agent: string | null;
  merchants: {
    business_name: string | null;
    whatsapp_number: string | null;
    whatsapp: string | null;
    phone: string | null;
  } | null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugToLabel(slug: string): string {
  return slug
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatPrice(price: number | null, currency: string | null): string {
  if (price == null) return "Price on request";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency ?? "USD",
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency ?? ""} ${price.toLocaleString()}`.trim();
  }
}

export function mapProperty(row: PropertyRow): Property {
  const images: string[] = Array.isArray(row.images) ? row.images : [];
  const agentName = row.agents?.full_name ?? null;
  return {
    rowId: row.id,
    id: row.slug ?? row.id,
    title: row.title,
    description: row.description ?? "",
    image: images[0] ?? "",
    gallery: images,
    city: row.city ?? "",
    country: row.country ?? "",
    status: row.status ?? "active",
    type: row.property_type ?? "",
    price: formatPrice(row.price, row.currency),
    period: row.listing_type === "rent" ? "/mo" : "",
    beds: row.bedrooms ?? null,
    baths: row.bathrooms ?? null,
    area: row.area ? `${row.area.toLocaleString()} sqft` : "",
    features: Array.isArray(row.features) ? row.features : [],
    agent: agentName,
    merchants: row.merchants
      ? {
          business_name: row.merchants.business_name,
          whatsapp_number:
            row.merchants.whatsapp_number ?? row.merchants.whatsapp ?? null,
          whatsapp:
            row.merchants.whatsapp_number ?? row.merchants.whatsapp ?? null,
          phone: row.merchants.phone ?? null,
        }
      : null,
  };
}

// ─── Fetch functions ──────────────────────────────────────────────────────────

type FetchOptions = {
  limit?: number;
  listingType?: string;
  propertyType?: string;
  city?: string;
  country?: string;
  minPrice?: number;
  maxPrice?: number;
};

export async function fetchProperties(options: FetchOptions = {}): Promise<Property[]> {
  let query = supabase
    .from("properties")
    .select(
      "*, agents(full_name), merchants(business_name, whatsapp_number, whatsapp, phone)"
    )
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (options.listingType) query = query.eq("listing_type", options.listingType);
  if (options.propertyType) query = query.eq("property_type", options.propertyType);
  if (options.city) query = query.ilike("city", `%${options.city}%`);
  if (options.country) query = query.eq("country", options.country);
  if (options.minPrice != null) query = query.gte("price", options.minPrice);
  if (options.maxPrice != null) query = query.lte("price", options.maxPrice);
  if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data as PropertyRow[]).map(mapProperty);
}

export async function fetchPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from("properties")
    .select(
      "*, agents(full_name), merchants(business_name, whatsapp_number, whatsapp, phone)"
    )
    .or(`id.eq.${id},slug.eq.${id}`)
    .eq("status", "approved")
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapProperty(data as PropertyRow);
}

export async function fetchMyProperties(merchantId: string): Promise<PropertyRow[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("merchant_id", merchantId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PropertyRow[];
}
