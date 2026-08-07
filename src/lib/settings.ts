import { supabase } from "@/lib/supabase";

export type SiteSettings = {
  brand: {
    site_name: string;
    motto: string;
    logo_url: string;
    favicon_url: string;
  };

  contact: {
    address: string;
    email: string;
    email_secondary: string;
    phone: string;
    whatsapp: string;
    hours: string;
  };

  hero: {
    title: string;
    subtitle: string;
    cta_label: string;
    cta_secondary_label: string;
  };

  footer: {
    about: string;
    socials: {
      facebook: string;
      instagram: string;
      linkedin: string;
      x: string;
      youtube: string;
      tiktok: string;
    };
  };

  about_page: {
    heading: string;
    body: string;
  };

  property_management_page: {
    heading: string;
    body: string;
  };

  legal_team_page: {
    heading: string;
    body: string;
  };

  contact_page: {
    heading: string;
    body: string;
  };
};

export const defaultSettings: SiteSettings = {
  brand: {
    site_name: "Tadman Homes and Properties",
    motto: "Buy, Sell & Rent Premium Properties Worldwide",
    logo_url: "",
    favicon_url: "",
  },

  contact: {
    address: "26 Adisa Akintoye street Ketu Alapere",
    email: "tadmanhomes@gmail.com",
    email_secondary: "ralphconsult99@gmail.com",
    phone: "07031556176",
    whatsapp: "09117511768",
    hours: "",
  },

  hero: {
    title: "Buy, Sell & Rent Premium Properties Worldwide",
    subtitle: "",
    cta_label: "Find Properties",
    cta_secondary_label: "List Your Property",
  },

  footer: {
    about: "",
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
    body: "",
  },

  property_management_page: {
    heading: "Property Management",
    body: "",
  },

  legal_team_page: {
    heading: "Legal Team",
    body: "",
  },

  contact_page: {
    heading: "Contact Tadman Homes and Properties",
    body: "",
  },
};

export async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("setting_key, setting_value");

  if (error) {
    throw error;
  }

  const result: SiteSettings = structuredClone(defaultSettings);

  for (const row of data ?? []) {
    const key = row.setting_key as keyof SiteSettings;

    if (key in result && row.setting_value) {
      result[key] = {
        ...result[key],
        ...(row.setting_value as Partial<SiteSettings[typeof key]>),
      };
    }
  }

  return result;
}

export async function saveSetting<K extends keyof SiteSettings>(
  key: K,
  value: SiteSettings[K],
) {
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      {
        setting_key: key,
        setting_value: value,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "setting_key",
      },
    );

  if (error) {
    throw error;
  }
}

export const whatsappLink =
  "https://wa.me/2349117511768";
