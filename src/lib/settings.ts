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

export type PageSettings = { heading: string; body: string; cta_label?: string };
export type HomepageSettings = {
  featured_heading: string;
  featured_subheading: string;

  stats_happy_clients: string;
  stats_properties: string;
  stats_agents: string;
  stats_cities: string;

  why_choose_title: string;
  why_choose_subtitle: string;

  testimonials_title: string;
  testimonials_subtitle: string;

  faq_title: string;
  faq_subtitle: string;

  newsletter_title: string;
  newsletter_subtitle: string;

  copyright: string;
};

export type SeoSettings = {
  meta_title: string;
  meta_description: string;
  keywords: string;
};

export type SocialSettings = {
  facebook: string;
  instagram: string;
  linkedin: string;
  x: string;
  youtube: string;
  tiktok: string;
};

export type FooterSettings = {
  about: string;
  socials: SocialSettings;
};

export type AppearanceSettings = {
  primary_color: string;
  secondary_color: string;
  accent_color: string;

  hero_image: string;
  hero_video: string;

  favicon: string;
};
export type SiteSettings = {
  footer: FooterSettings;
  brand: BrandSettings;
  contact: ContactSettings;
  hero: HeroSettings;

  homepage: HomepageSettings;
  seo: SeoSettings;
  social: SocialSettings;
  appearance: AppearanceSettings;

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
  subtitle:
    "Buy, sell, rent and manage premium properties through trusted professionals.",
  cta_label: "Find Properties",
  cta_secondary_label: "Become a Merchant",
},

homepage: {
  featured_heading: "Featured Properties",
  featured_subheading: "Explore our premium listings.",

  stats_happy_clients: "1500+",
  stats_properties: "500+",
  stats_agents: "35+",
  stats_cities: "20+",

  why_choose_title: "Why Choose Tadman",
  why_choose_subtitle:
    "Trusted professionals for every property transaction.",

  testimonials_title: "What Our Clients Say",
  testimonials_subtitle:
    "Real stories from satisfied clients.",

  faq_title: "Frequently Asked Questions",
  faq_subtitle: "Everything you need to know.",

  newsletter_title: "Stay Updated",
  newsletter_subtitle:
    "Subscribe for the latest property updates.",

  copyright:
    "© 2026 Tadman Homes and Properties. All rights reserved.",
},

seo: {
  meta_title: "Tadman Homes and Properties",
  meta_description:
    "Buy, Sell, Rent and Manage Premium Properties in Nigeria.",
  keywords:
    "real estate, properties, houses, land, apartments, Lagos, Nigeria",
},

social: {
  facebook: "",
  instagram: "",
  linkedin: "",
  x: "",
  youtube: "",
  tiktok: "",
},

appearance: {
  primary_color: "#0A1A2F",
  secondary_color: "#F8F9FA",
  accent_color: "#D4AF37",

  hero_image: "",
  hero_video: "",

  favicon: "",
},
  
footer: {
  about:
    "Tadman Homes and Properties helps clients buy, sell, rent and manage premium properties with confidence.",
  socials: {
    facebook: "",
    instagram: "",
    linkedin: "",
    x: "",
    youtube: "",
    tiktok: "",
  },
},
  
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
  const { data, error } = await supabase
    .from("website_settings")
    .select("key, value");

  if (error) {
    console.error("Settings fetch error:", error);
    throw error;
  }

  const map = new Map<string, unknown>(
    (data ?? []).map((r: any) => [r.key, r.value])
  );

  return {
    footer: parse(map.get("footer"), defaultSettings.footer),

    brand: parse(
      map.get("brand"),
      defaultSettings.brand
    ),

    contact: parse(
      map.get("contact"),
      defaultSettings.contact
    ),

    hero: parse(
      map.get("hero"),
      defaultSettings.hero
    ),

    homepage: parse(
      map.get("homepage"),
      defaultSettings.homepage
    ),

    seo: parse(
      map.get("seo"),
      defaultSettings.seo
    ),

    social: parse(
      map.get("social"),
      defaultSettings.social
    ),

    appearance: parse(
      map.get("appearance"),
      defaultSettings.appearance
    ),

    about_page: {
      heading: String(
        map.get("about_heading") ??
        defaultSettings.about_page.heading
      ),
      body: String(
        map.get("about_text") ??
        defaultSettings.about_page.body
      ),
    },

    property_management_page: parse(
      map.get("property_management_page"),
      defaultSettings.property_management_page
    ),

    legal_team_page: parse(
      map.get("legal_team"),
      defaultSettings.legal_team_page
    ),

    contact_page: parse(
      map.get("contact_page"),
      defaultSettings.contact_page
    ),
  };
}
export async function saveSetting(
  key: string,
  value: unknown
){
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
