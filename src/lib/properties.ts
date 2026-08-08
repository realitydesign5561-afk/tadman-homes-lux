import { supabase } from "@/lib/supabase";

/* ============================================================================
   TYPES
============================================================================ */

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
  area: number | string | null;
  amenities: string[] | null;
  features: string[] | null;
  images: string[] | null;
  status: string | null;
  is_featured: boolean | null;
  agent_id: string | null;
  merchant_id: string | null;
  created_at: string;
  merchants?: {
    business_name: string;
    whatsapp_number: string | null;
    whatsapp: string | null;
    phone: string | null;
  } | null;
};

export type Property = {
  rowId: string;
  id: string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  city: string;
  country: string;
  state: string;
  address: string;
  status: string;
  type: string;
  price: string;
  period: string;
  beds: number;
  baths: number;
  area: string;
  features: string[];
  amenities: string[];
  merchant_id: string | null;
  agent?: string;
  merchants: {
    business_name: string;
    whatsapp_number: string | null;
    whatsapp: string | null;
    phone: string | null;
  } | null;
};

/* ============================================================================
   HELPERS
============================================================================ */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugToLabel(slug: string): string | undefined {
  return slug
    ? slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : undefined;
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

const PLACEHOLDER = "https://images.pexels.com/photos/28054849/pexels-photo-28054849.jpeg?auto=compress&cs=tinysrgb&w=900";

export function mapProperty(row: PropertyRow, agentName?: string): Property {
  const images: string[] = Array.isArray(row.images) ? row.images.filter(Boolean) : [];
  const currency = row.currency ?? "USD";
  const listingType = row.listing_type ?? "buy";
  const period = listingType === "rent" ? "/month" : "";

  return {
    rowId: row.id,
    id: row.slug ?? row.id,
    title: row.title,
    description: row.description ?? "",
    image: images[0] ?? PLACEHOLDER,
    gallery: images.length > 0 ? images : [PLACEHOLDER],
    city: row.city ?? "",
    country: row.country ?? "",
    state: row.state ?? "",
    address: row.address ?? "",
    status: row.status === "approved" ? (listingType === "rent" ? "For Rent" : "For Sale") : (row.status ?? ""),
    type: row.property_type ?? "",
    price: formatPrice(row.price, currency),
    period,
    beds: row.bedrooms ?? 0,
    baths: row.bathrooms ?? 0,
    area: row.area != null ? `${row.area} sqm` : "",
    features: Array.isArray(row.features) ? row.features : [],
    amenities: Array.isArray(row.amenities) ? row.amenities : [],
    merchant_id: row.merchant_id ?? null,
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
  } as Property;
}

/* ============================================================================
   FETCH
============================================================================ */

type FetchOptions = {
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  keyword?: string;
  propertyType?: string;
  minBeds?: number;
  minBaths?: number;
  minPrice?: number;
  maxPrice?: number;
  rent?: true;
  listingType?: "buy" | "rent";
  featured?: boolean;
  limit?: number;
  merchantId?: string;
};

export async function fetchProperties(opts: FetchOptions = {}): Promise<Property[]> {
  let query = supabase
    .from("properties")
    .select("*, merchants(business_name, whatsapp_number, whatsapp, phone)")
    .eq("status", "approved");

  if (opts.featured) query = query.eq("is_featured", true);
  if (opts.country) query = query.ilike("country", `%${opts.country}%`);
  if (opts.state) query = query.ilike("state", `%${opts.state}%`);
  if (opts.city) query = query.ilike("city", `%${opts.city}%`);
  if (opts.area) query = query.ilike("address", `%${opts.area}%`);
  if (opts.keyword)
    query = query.or(
      `title.ilike.%${opts.keyword}%,description.ilike.%${opts.keyword}%`,
    );
  if (opts.propertyType) query = query.ilike("property_type", opts.propertyType);
  if (opts.minBeds) query = query.gte("bedrooms", opts.minBeds);
  if (opts.minBaths) query = query.gte("bathrooms", opts.minBaths);
  if (opts.minPrice) query = query.gte("price", opts.minPrice);
  if (opts.maxPrice) query = query.lte("price", opts.maxPrice);
  if (opts.rent || opts.listingType === "rent")
    query = query.eq("listing_type", "rent");
  else if (opts.listingType === "buy") query = query.eq("listing_type", "buy");
  if (opts.merchantId) query = query.eq("merchant_id", opts.merchantId);
  if (opts.limit) query = query.limit(opts.limit);

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw error;
  return (data as PropertyRow[]).map((row) => mapProperty(row));
}

export async function fetchPropertyById(idOrSlug: string): Promise<Property | null> {
  // Try slug first, fall back to id
  const { data: bySlug } = await supabase
    .from("properties")
    .select("*, merchants(business_name, whatsapp_number, whatsapp, phone)")
    .eq("slug", idOrSlug)
    .maybeSingle();

  if (bySlug) return mapProperty(bySlug as PropertyRow);

  const { data: byId, error } = await supabase
    .from("properties")
    .select("*, merchants(business_name, whatsapp_number, whatsapp, phone)")
    .eq("id", idOrSlug)
    .maybeSingle();

  if (error) throw error;
  return byId ? mapProperty(byId as PropertyRow) : null;
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
