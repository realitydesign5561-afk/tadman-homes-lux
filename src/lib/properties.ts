import { supabase } from "@/lib/supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PropertyRow = {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  property_type: string | null;
  status: string;
  images: string[] | null;
  price: number | null;
  currency: string | null;
  interval: string | null;
  city: string | null;
  country: string | null;
  beds: number | null;
  baths: number | null;
  area_sqm: number | null;
  features: string[] | null;
  is_featured: boolean | null;
  merchant_id: string | null;
  agent_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string | null;
  // joined relation (optional)
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
  type: string;
  status: string;
  image: string;
  gallery: string[];
  price: string;
  period: string;
  city: string;
  country: string;
  beds: number;
  baths: number;
  area: string;
  features: string[];
  isFeatured: boolean;
  merchantId: string | null;
  agent: string | null;
  merchants: {
    business_name: string;
    whatsapp_number: string | null;
    whatsapp: string | null;
    phone: string | null;
  } | null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugToLabel(slug: string): string | null {
  const map: Record<string, string> = {
    apartment: "Apartment",
    house: "House",
    villa: "Villa",
    penthouse: "Penthouse",
    duplex: "Duplex",
    land: "Land",
    commercial: "Commercial",
  };
  return map[slug.toLowerCase()] ?? null;
}

export function formatPrice(
  price: number | null | undefined,
  currency: string | null | undefined,
  interval?: string | null,
): string {
  if (!price) return "Price on request";
  const curr = currency ?? "USD";
  let formatted: string;
  try {
    formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    formatted = `${curr} ${price.toLocaleString()}`;
  }
  if (interval === "month") return `${formatted}/mo`;
  if (interval === "year") return `${formatted}/yr`;
  return formatted;
}

const PLACEHOLDER =
  "https://images.pexels.com/photos/28054849/pexels-photo-28054849.jpeg?auto=compress&cs=tinysrgb&w=900&h=700";

export function mapProperty(row: PropertyRow): Property {
  const images = Array.isArray(row.images) ? row.images : [];
  const [image = PLACEHOLDER] = images;
  const gallery = images.length > 0 ? images : [PLACEHOLDER];

  const priceFormatted = formatPrice(row.price, row.currency, row.interval);
  const period =
    row.interval === "month"
      ? "/mo"
      : row.interval === "year"
        ? "/yr"
        : "";

  return {
    rowId: row.id,
    id: row.slug ?? row.id,
    title: row.title,
    description: row.description ?? "",
    type: row.property_type ?? "Property",
    status: row.status,
    image,
    gallery,
    price: priceFormatted,
    period,
    city: row.city ?? "",
    country: row.country ?? "",
    beds: row.beds ?? 0,
    baths: row.baths ?? 0,
    area: row.area_sqm ? `${row.area_sqm} m²` : "N/A",
    features: row.features ?? [],
    isFeatured: row.is_featured ?? false,
    merchantId: row.merchant_id ?? null,
    agent: null,
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

// ---------------------------------------------------------------------------
// Fetch options
// ---------------------------------------------------------------------------

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
  rent?: boolean;
  listingType?: "buy" | "rent";
  featured?: boolean;
  limit?: number;
};

const MERCHANT_SELECT = `
  merchants (
    business_name,
    whatsapp_number,
    whatsapp,
    phone
  )
`;

// ---------------------------------------------------------------------------
// Public fetch functions
// ---------------------------------------------------------------------------

export async function fetchProperties(
  opts: FetchOptions = {},
): Promise<Property[]> {
  let query = supabase
    .from("properties")
    .select(`*, ${MERCHANT_SELECT}`)
    .eq("status", "approved")
    .order("published_at", { ascending: false });

  if (opts.country) query = query.ilike("country", `%${opts.country}%`);
  if (opts.city) query = query.ilike("city", `%${opts.city}%`);
  if (opts.area) query = query.ilike("area", `%${opts.area}%`);
  if (opts.keyword)
    query = query.or(
      `title.ilike.%${opts.keyword}%,description.ilike.%${opts.keyword}%`,
    );
  if (opts.propertyType)
    query = query.ilike("property_type", `%${opts.propertyType}%`);
  if (opts.minBeds) query = query.gte("beds", opts.minBeds);
  if (opts.minBaths) query = query.gte("baths", opts.minBaths);
  if (opts.minPrice) query = query.gte("price", opts.minPrice);
  if (opts.maxPrice) query = query.lte("price", opts.maxPrice);
  if (opts.rent) query = query.eq("interval", "month");
  if (opts.listingType === "buy") query = query.is("interval", null);
  if (opts.featured) query = query.eq("is_featured", true);
  if (opts.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) {
    console.error("fetchProperties error:", error);
    throw error;
  }
  return (data as PropertyRow[]).map(mapProperty);
}

export async function fetchPropertyById(
  idOrSlug: string,
): Promise<Property | null> {
  const bySlug = await supabase
    .from("properties")
    .select(`*, ${MERCHANT_SELECT}`)
    .eq("slug", idOrSlug)
    .maybeSingle();

  if (!bySlug.error && bySlug.data) {
    return mapProperty(bySlug.data as PropertyRow);
  }

  const byId = await supabase
    .from("properties")
    .select(`*, ${MERCHANT_SELECT}`)
    .eq("id", idOrSlug)
    .maybeSingle();

  if (byId.error) {
    console.error("fetchPropertyById error:", byId.error);
    return null;
  }

  return byId.data ? mapProperty(byId.data as PropertyRow) : null;
}

export async function fetchMyProperties(
  merchantId: string,
): Promise<PropertyRow[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("merchant_id", merchantId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("fetchMyProperties error:", error);
    throw error;
  }

  return (data ?? []) as PropertyRow[];
}
