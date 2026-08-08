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
  area: number | null;
  area_unit: string | null;
  amenities: string[] | null;
  featured_image: string | null;
  images: string[] | null;
  merchant_id: string | null;
  agent_id: string | null;
  status: string;
  is_featured: boolean;
  created_at: string;
  published_at: string | null;
};

export type Property = {
  rowId: string;
  id: string;
  title: string;
  description: string;
  image: string;
  gallery: string[];
  type: string;
  status: string;
  city: string;
  country: string;
  beds: number;
  baths: number;
  area: string;
  price: string;
  period: string;
  features: string[];
  merchants: {
    business_name: string;
    whatsapp_number: string | null;
    whatsapp: string | null;
    phone: string | null;
  } | null;
  agent: string | null;
};

/* ============================================================================
   HELPERS
============================================================================ */

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const PROPERTY_TYPE_MAP: Record<string, string> = {
  apartment: "Apartment",
  house: "House",
  villa: "Villa",
  penthouse: "Penthouse",
  duplex: "Duplex",
  land: "Land",
  commercial: "Commercial",
};

export function slugToLabel(slug: string): string | undefined {
  return PROPERTY_TYPE_MAP[slug.toLowerCase()];
}

export function formatPrice(
  price: number | null,
  currency = "NGN",
  listingType?: string | null,
): string {
  if (price == null) return "Price on request";

  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency ?? "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

  if (listingType === "rent" || listingType === "shortlet") {
    return `${formatted}/mo`;
  }

  return formatted;
}

const PROPERTY_SELECT = `
  *,
  merchants (
    business_name,
    whatsapp_number,
    whatsapp,
    phone
  ),
  agents (
    full_name
  )
`;

/* ============================================================================
   MAP
============================================================================ */

export function mapProperty(
  row: PropertyRow & {
    merchants?: {
      business_name: string;
      whatsapp_number: string | null;
      whatsapp: string | null;
      phone: string | null;
    } | null;
    agents?: { full_name: string } | null;
  },
): Property {
  const images: string[] = Array.isArray(row.images) ? row.images : [];
  const image = row.featured_image ?? images[0] ?? "";
  const gallery = images.length > 0 ? images : image ? [image] : [];

  const areaUnit = row.area_unit ?? "sqm";
  const areaLabel = row.area != null ? `${row.area} ${areaUnit}` : "N/A";

  const listingType = row.listing_type ?? "buy";
  const period =
    listingType === "rent" || listingType === "shortlet" ? "/mo" : "";

  const priceLabel =
    row.price != null
      ? new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: row.currency ?? "NGN",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(row.price)
      : "Price on request";

  const statusLabel =
    listingType === "rent" || listingType === "shortlet"
      ? "For Rent"
      : listingType === "buy"
        ? "For Sale"
        : row.status;

  const agentName = (row as any).agents?.full_name ?? null;

  return {
    rowId: row.id,
    id: row.slug ?? row.id,
    title: row.title,
    description: row.description ?? "",
    image,
    gallery,
    type: row.property_type ?? "Property",
    status: statusLabel,
    city: row.city ?? "",
    country: row.country ?? "",
    beds: row.bedrooms ?? 0,
    baths: row.bathrooms ?? 0,
    area: areaLabel,
    price: priceLabel,
    period,
    features: Array.isArray(row.amenities) ? row.amenities : [],
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

/* ============================================================================
   FETCH
============================================================================ */

export type FetchPropertiesOptions = {
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
  listingType?: "buy" | "rent" | "shortlet";
  limit?: number;
};

export async function fetchProperties(
  options: FetchPropertiesOptions = {},
): Promise<Property[]> {
  let query = supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (options.country) {
    query = query.ilike("country", options.country);
  }
  if (options.state) {
    query = query.ilike("state", options.state);
  }
  if (options.city) {
    query = query.ilike("city", options.city);
  }
  if (options.area) {
    query = query.ilike("address", `%${options.area}%`);
  }
  if (options.keyword) {
    query = query.ilike("title", `%${options.keyword}%`);
  }
  if (options.propertyType) {
    query = query.ilike("property_type", options.propertyType);
  }
  if (options.minBeds != null) {
    query = query.gte("bedrooms", options.minBeds);
  }
  if (options.minBaths != null) {
    query = query.gte("bathrooms", options.minBaths);
  }
  if (options.minPrice != null) {
    query = query.gte("price", options.minPrice);
  }
  if (options.maxPrice != null) {
    query = query.lte("price", options.maxPrice);
  }
  if (options.rent) {
    query = query.in("listing_type", ["rent", "shortlet"]);
  } else if (options.listingType) {
    query = query.eq("listing_type", options.listingType);
  }
  if (options.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Fetch properties error:", error);
    throw error;
  }

  return ((data ?? []) as any[]).map(mapProperty);
}

export async function fetchPropertyById(
  id: string,
): Promise<Property | null> {
  // Try slug first, fall back to UUID
  const { data: bySlug, error: slugError } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("slug", id)
    .maybeSingle();

  if (slugError) {
    console.error("Fetch property by slug error:", slugError);
  }

  if (bySlug) {
    return mapProperty(bySlug as any);
  }

  const { data: byId, error: idError } = await supabase
    .from("properties")
    .select(PROPERTY_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (idError) {
    console.error("Fetch property by id error:", idError);
    throw idError;
  }

  return byId ? mapProperty(byId as any) : null;
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
    console.error("Fetch my properties error:", error);
    throw error;
  }

  return (data ?? []) as PropertyRow[];
}
