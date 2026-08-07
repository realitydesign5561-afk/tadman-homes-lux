           import { supabase } from "@/lib/supabase";
import { propertyImages } from "@/data/properties";

export type PropertyRow = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  price: number | null;
  currency: string;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  property_type: string | null;
  listing_type: "buy" | "sell" | "rent" | "shortlet";
  bedrooms: number | null;
  bathrooms: number | null;
  toilets: number | null;
  area: number | null;
  area_unit: string | null;
  amenities: string[] | null;
  featured_image: string | null;
  images: string[] | null;
  status: string;
  is_featured: boolean;
  views: number;
  merchant_id: string | null;
  created_at: string;

  merchants?: {
  business_name: string;
  whatsapp_number: string | null;
  phone: string | null;
} | null;
};

export type Property = {
  id: string;
  rowId: string;
  title: string;
  type: string;
  status: "For Sale" | "For Rent";
  price: string;
  period?: string;
  city: string;
  country: string;
  beds: number;
  baths: number;
  area: string;
  image: string;
  gallery: string[];
  featured?: boolean;
  description: string;
  features: string[];
  agent: string;

  merchants?: {
  business_name: string;
  whatsapp_number: string | null;
  phone: string | null;
} | null;
};

export function formatPrice(price: number | null, currency = "NGN") {
  if (price == null) return "Price on request";
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString()}`;
  }
}

export function mapProperty(row: PropertyRow, agentName = "Tadman Homes"): Property {
  const isRent = row.listing_type === "rent" || row.listing_type === "shortlet";
  return {
    id: row.slug || row.id,
    rowId: row.id,
    title: row.title,
    type: row.property_type || "Property",
    status: isRent ? "For Rent" : "For Sale",
    price: formatPrice(row.price, row.currency),
    period: isRent ? "/month" : undefined,
    city: row.city || "",
    country: row.country || "",
    beds: row.bedrooms ?? 0,
    baths: row.bathrooms ?? 0,
    area: row.area ? `${row.area} ${row.area_unit || "sqm"}` : "—",
    image: row.featured_image || row.images?.[0] || propertyImages.prop1,
    gallery: row.images?.length ? row.images : row.featured_image ? [row.featured_image] : [],
    featured: row.is_featured,
    description: row.description || "",
    features: row.amenities ?? [],
    agent: agentName,
    merchant: row.merchants ?? null,
  };
}

const SELECT = "*";

export async function fetchProperties(options: {
  listingType?: "buy" | "sell" | "rent" | "shortlet";
  rent?: boolean;
  featured?: boolean;
  limit?: number;
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  keyword?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
} = {}): Promise<Property[]> {
  let query = supabase
  .from("properties")
  .select(`
    *,
    merchants (
  business_name,
  whatsapp_number,
  phone
)
  `)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (options.rent) query = query.in("listing_type", ["rent", "shortlet"]);
  else if (options.listingType) query = query.eq("listing_type", options.listingType);
  if (options.featured) query = query.eq("is_featured", true);
  if (options.country) query = query.ilike("country", `%${options.country}%`);
  if (options.state) query = query.ilike("state", `%${options.state}%`);
  if (options.city) query = query.ilike("city", `%${options.city}%`);
  if (options.area) query = query.ilike("address", `%${options.area}%`);
  if (options.propertyType) query = query.eq("property_type", options.propertyType);
  if (options.minPrice != null) query = query.gte("price", options.minPrice);
  if (options.maxPrice != null) query = query.lte("price", options.maxPrice);
  if (options.minBeds != null) query = query.gte("bedrooms", options.minBeds);
  if (options.minBaths != null) query = query.gte("bathrooms", options.minBaths);
  if (options.keyword) {
    const k = options.keyword.replace(/[,%]/g, " ");
    query = query.or(`title.ilike.%${k}%,description.ilike.%${k}%`);
  }
  if (options.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data as PropertyRow[]).map((row) => mapProperty(row));
}

export async function fetchPropertyById(idOrSlug: string): Promise<Property | null> {
  const isUuid = /^[0-9a-f-]{36}$/i.test(idOrSlug);
  const { data, error } = await supabase
    .from("properties")
    .select(`
     *,
      merchants (
  business_name,
  whatsapp_number,
  phone
)
     `)
    .eq(isUuid ? "id" : "slug", idOrSlug)
    .eq("status", "approved")
    .maybeSingle();
  if (error) throw error;
  return data ? mapProperty(data as PropertyRow) : null;
}

export async function fetchMyProperties(merchantId: string): Promise<PropertyRow[]> {
  const { data, error } = await supabase
    .from("properties")
    .select(SELECT)
    .eq("merchant_id", merchantId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as PropertyRow[];
}

export function slugify(value: string) {
  return `${value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}-${Math.random().toString(36).slice(2, 7)}`;
}

