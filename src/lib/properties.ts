import { supabase } from "@/lib/supabase";

type MerchantSummary = {
  business_name: string;
  whatsapp_number?: string | null;
  whatsapp?: string | null;
  phone?: string | null;
};

export type PropertyRow = {
  id: string;
  slug: string | null;
  title: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  area: string | null;
  property_type: string | null;
  listing_type: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  area_size: number | null;
  area_unit: string | null;
  amenities: string[] | null;
  featured_image: string | null;
  images: string[] | null;
  gallery?: string[] | null;
  status: string;
  is_featured: boolean | null;
  views: number | null;
  views_count: number | null;
  merchant_id: string | null;
  agent_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  merchants?: MerchantSummary | null;
  agents?: {
    full_name: string | null;
  } | null;
};

export type Property = {
  id: string;
  rowId: string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  price: string;
  period: string;
  country: string;
  state: string;
  city: string;
  address: string;
  area: string;
  beds: number;
  baths: number;
  features: string[];
  status: string;
  type: string;
  agent: string | null;
  merchants: {
    business_name: string;
    whatsapp_number: string | null;
    whatsapp: string | null;
    phone: string | null;
  } | null;
};

type FetchPropertiesOptions = {
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
  listingType?: "buy" | "rent" | "shortlet";
  rent?: boolean;
  limit?: number;
};

const propertySelect = `
  *,
  merchants (
    business_name,
    whatsapp_number,
    whatsapp,
    phone
  )
`;

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function listingLabel(listingType?: string | null) {
  switch (listingType) {
    case "rent":
      return "For Rent";
    case "shortlet":
      return "Shortlet";
    default:
      return "For Sale";
  }
}

function listingPeriod(listingType?: string | null) {
  switch (listingType) {
    case "rent":
      return " /month";
    case "shortlet":
      return " /night";
    default:
      return "";
  }
}

function toDisplayNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toString();
}

export function formatPrice(price: number | null | undefined, currency = "NGN") {
  if (price == null) return "Price on request";

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugToLabel(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function mapProperty(row: PropertyRow): Property {
  const images = Array.isArray(row.images)
    ? row.images
    : Array.isArray(row.gallery)
      ? row.gallery
      : [];
  const gallery =
    images.length > 0
      ? images
      : row.featured_image
        ? [row.featured_image]
        : [];
  const agentName = row.agents?.full_name ?? null;

  return {
    id: row.slug || row.id,
    rowId: row.id,
    title: row.title,
    description: row.description ?? "",
    image: row.featured_image ?? gallery[0] ?? "",
    gallery,
    price: formatPrice(row.price, row.currency ?? "NGN"),
    period: listingPeriod(row.listing_type),
    country: row.country ?? "",
    state: row.state ?? "",
    city: row.city ?? "",
    address: row.address ?? "",
    area: row.area_size
      ? `${toDisplayNumber(row.area_size)} ${row.area_unit ?? "sqm"}`
      : row.area ?? "",
    beds: row.bedrooms ?? 0,
    baths: row.bathrooms ?? 0,
    features: Array.isArray(row.amenities) ? row.amenities.filter(Boolean) : [],
    status: listingLabel(row.listing_type),
    type: row.property_type ?? "Property",
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

export async function fetchProperties(options: FetchPropertiesOptions = {}) {
  let query = supabase
    .from("properties")
    .select(propertySelect)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (options.country) query = query.eq("country", options.country);
  if (options.state) query = query.eq("state", options.state);
  if (options.city) query = query.eq("city", options.city);
  if (options.area) query = query.eq("area", options.area);
  if (options.propertyType) query = query.eq("property_type", options.propertyType);
  if (options.listingType) query = query.eq("listing_type", options.listingType);
  if (options.rent) query = query.eq("listing_type", "rent");
  if (options.minPrice != null) query = query.gte("price", options.minPrice);
  if (options.maxPrice != null) query = query.lte("price", options.maxPrice);
  if (options.minBeds != null) query = query.gte("bedrooms", options.minBeds);
  if (options.minBaths != null) query = query.gte("bathrooms", options.minBaths);
  if (options.limit != null) query = query.limit(options.limit);
  if (options.keyword) {
    const keyword = options.keyword.trim().replaceAll(",", "\\,");
    query = query.or(
      `title.ilike.%${keyword}%,description.ilike.%${keyword}%,address.ilike.%${keyword}%,city.ilike.%${keyword}%,area.ilike.%${keyword}%`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;

  return ((data ?? []) as PropertyRow[]).map(mapProperty);
}

export async function fetchPropertyById(identifier: string) {
  let query = supabase.from("properties").select(propertySelect).eq("slug", identifier);

  if (uuidPattern.test(identifier)) {
    query = supabase
      .from("properties")
      .select(propertySelect)
      .or(`slug.eq.${identifier},id.eq.${identifier}`);
  }

  const { data, error } = await query.maybeSingle();
  if (error) throw error;

  return data ? mapProperty(data as PropertyRow) : null;
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
