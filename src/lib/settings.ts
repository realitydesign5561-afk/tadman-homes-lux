import { supabase } from "@/lib/supabase";

export type BrandSettings = {
  site_name: string;
  motto: string;
  logo_url?: string;
  favicon_url?: string;
};

export type ContactSettings = {
  address: string;
  email: string;
  email_secondary?: string;
  phone: string;
  whatsapp: string;
  hours?: string;
};

export type HeroSettings = {
  title: string;
  subtitle: string;
  cta_label: string;
  cta_secondary_label: string;
};

export type FooterSettings = {
  about: string;
  socials: { facebook?: string; instagram?: string; linkedin?: string; x?: string };
};

export type PageSettings = { heading: string; body: string; cta_label?: string };

export type SiteSettings = {
  brand: BrandSettings;
  contact: ContactSettings;
  hero: HeroSettings;
  footer: FooterSettings;
  about_page: PageSettings;
  property_management_page: PageSettings;
  legal_team_page: PageSettings;
  contact_page: PageSettings;
};

export const MOTTO = "Buy, Sell, Rent & Manage Premium Properties with Confidence.";

export const defaultSettings: SiteSettings = {
  brand: {
    site_name: "Tadman Homes and Properties",
    motto: MOTTO,
    logo_url: "",
    favicon_url: "",
  },
  contact: {
    address: "26 Adisa Akintoye Street, Ketu Alapere, Lagos, Nigeria",
    email: "tadmanhomes@gmail.com",
    email_secondary: "ralphconsult99@gmail.com",
    phone: "07031556176",
    whatsapp: "09117511768",
    hours: "Mon – Sat, 8:00am – 6:00pm",
  },
  hero: {
    title: "Find Your Perfect Property with Confidence",
    subtitle: "Buy, sell, rent and manage premium properties through trusted professionals.",
    cta_label: "Find Properties",
    cta_secondary_label: "Become a Merchant",
  },
  footer: { about: MOTTO, socials: {} },
  about_page: {
    heading: "About Tadman Homes and Properties",
    body: "Tadman Homes and Properties is a Lagos-based real estate company helping clients buy, sell, rent and manage premium properties with confidence.",
  },
  property_management_page: {
    heading: "Property Management",
    body: "We manage residential and commercial properties end to end — tenant sourcing, rent collection, maintenance, inspections and reporting.",
  },
  legal_team_page: {
    heading: "Our Standby Legal Team",
    body: "Our legal team assists with property searches, due diligence, acquisition, sales, title verification, documentation and drafting legal agreements for a reasonable professional fee.",
    cta_label: "Speak With Our Legal Team",
  },
  contact_page: {
    heading: "Contact Tadman Homes and Properties",
    body: "Reach our team any time — we respond within one business day.",
  },
};

function parse<T>(raw: unknown, fallback: T): T {
  if (raw == null) return fallback;
  if (typeof raw === "object") return { ...fallback, ...(raw as T) };
  try {
    return { ...fallback, ...(JSON.parse(String(raw)) as T) };
  } catch {
    return fallback;
  }
}

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from("website_settings").select("key, value");
  if (error) return defaultSettings;
  const map = new Map<string, unknown>((data ?? []).map((r: any) => [r.key, r.value]));
  return {
    brand: parse(map.get("brand"), defaultSettings.brand),
    contact: parse(map.get("contact"), defaultSettings.contact),
    hero: parse(map.get("hero"), defaultSettings.hero),
    footer: parse(map.get("footer"), defaultSettings.footer),
    about_page: parse(map.get("about_page"), defaultSettings.about_page),
    property_management_page: parse(
      map.get("property_management_page"),
      defaultSettings.property_management_page,
    ),
    legal_team_page: parse(map.get("legal_team_page"), defaultSettings.legal_team_page),
    contact_page: parse(map.get("contact_page"), defaultSettings.contact_page),
  };
}

export async function saveSetting(key: keyof SiteSettings, value: unknown) {
  const { error } = await supabase
    .from("website_settings")
    .upsert({ key, value: JSON.stringify(value), updated_at: new Date().toISOString() });
  if (error) throw error;
}

/** Digits-only international WhatsApp number (Nigeria default). */
export function whatsappLink(raw: string, message?: string) {
  let digits = (raw || "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `234${digits.slice(1)}`;
  if (!digits.startsWith("234") && digits.length === 10) digits = `234${digits}`;
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${q}`;
}
