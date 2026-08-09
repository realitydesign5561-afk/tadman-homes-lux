import { useState } from "react";
import { Field, PrimaryButton } from "@/components/page-shell";
import { supabase } from "@/lib/supabase";
import { uploadPropertyImage } from "@/lib/storage";
import { slugify, type PropertyRow } from "@/lib/properties";
import { propertyTypes } from "@/data/properties";

export const PROPERTY_STATUSES = [
  "draft",
  "pending",
  "approved",
  "rejected",
  "sold",
  "rented",
  "archived",
] as const;

type Props = {
  userId: string;
  merchantId: string | null;
  property?: PropertyRow | null;
  agents?: {
    id: string;
    full_name: string;
  }[];
  canPublish?: boolean;
  canFeature?: boolean;
  onDone: () => void;
  onCancel?: () => void;
};

type FormData = {
  title: string;
  slug: string;
  description: string;

  price: string;
  currency: string;

  listing_type: string;
  property_type: string;

  country: string;
  state: string;
  city: string;
  address: string;

  bedrooms: string;
  bathrooms: string;
  area: string;

  amenities: string;

  status: string;
  is_featured: boolean;

  agent_id: string;
};

const selectClass =
  "h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm";

const LOCATION_DATA: Record<
  string,
  Record<string, Record<string, string[]>>
> = {
  Nigeria: {
    Lagos: {
      "Lagos Island": ["Ikoyi", "Victoria Island", "Lekki Phase 1"],
      "Lagos Mainland": ["Yaba", "Surulere", "Ikeja"],
    },
    Abuja: {
      "Municipal Area Council": ["Maitama", "Wuse", "Garki"],
      "Bwari Area Council": ["Kubwa", "Bwari Town", "Dutse"],
    },
  },
  "United States": {
    California: {
      "Los Angeles County": ["Beverly Hills", "Santa Monica", "Pasadena"],
      "San Francisco County": ["SOMA", "Mission District", "Sunset District"],
    },
    Texas: {
      "Harris County": ["Houston Downtown", "Katy", "The Woodlands"],
      "Dallas County": ["Downtown Dallas", "Irving", "Richardson"],
    },
  },
  "United Kingdom": {
    England: {
      London: ["Chelsea", "Canary Wharf", "Greenwich"],
      Manchester: ["Didsbury", "Salford", "Stockport"],
    },
    Scotland: {
      Edinburgh: ["Leith", "New Town", "Morningside"],
      Glasgow: ["West End", "Merchant City", "Southside"],
    },
  },
  Canada: {
    Ontario: {
      Toronto: ["Downtown", "North York", "Scarborough"],
      Ottawa: ["Kanata", "Nepean", "Orleans"],
    },
    Alberta: {
      Calgary: ["Beltline", "Bridgeland", "Auburn Bay"],
      Edmonton: ["Downtown", "Strathcona", "Windermere"],
    },
  },
  Ghana: {
    "Greater Accra": {
      Accra: ["Airport Residential", "East Legon", "Osu"],
      Tema: ["Community 1", "Community 18", "Sakumono"],
    },
    Ashanti: {
      Kumasi: ["Adum", "Asokwa", "Suame"],
      Obuasi: ["Tutuka", "Anyinam", "New Town"],
    },
  },
  Kenya: {
    Nairobi: {
      Nairobi: ["Westlands", "Kilimani", "Karen"],
      Kiambu: ["Ruiru", "Thika", "Juja"],
    },
    Mombasa: {
      Mombasa: ["Nyali", "Bamburi", "Likoni"],
      Kilifi: ["Malindi", "Watamu", "Kilifi Town"],
    },
  },
  "South Africa": {
    Gauteng: {
      Johannesburg: ["Sandton", "Rosebank", "Soweto"],
      Pretoria: ["Centurion", "Hatfield", "Brooklyn"],
    },
    "Western Cape": {
      "Cape Town": ["Sea Point", "Bellville", "Stellenbosch"],
      George: ["Fancourt", "George Central", "Thembalethu"],
    },
  },
  "United Arab Emirates": {
    Dubai: {
      Dubai: ["Downtown Dubai", "Marina", "Jumeirah"],
      "Dubai South": ["Emaar South", "Dubai Investment Park", "Expo City"],
    },
    "Abu Dhabi": {
      "Abu Dhabi City": ["Al Reem Island", "Khalifa City", "Saadiyat Island"],
      Al Ain: ["Al Jimi", "Al Hili", "Zakher"],
    },
  },
  Rwanda: {
    Kigali: {
      Gasabo: ["Kimironko", "Remera", "Kacyiru"],
      Kicukiro: ["Niboye", "Gahanga", "Kagarama"],
    },
  },
  "Côte d'Ivoire": {
    Abidjan: {
      Cocody: ["Riviera", "Deux Plateaux", "Angré"],
      Yopougon: ["Niangon", "Sicogi", "Andokoi"],
    },
  },
  Senegal: {
    Dakar: {
      Dakar: ["Plateau", "Ngor", "Yoff"],
      Pikine: ["Thiaroye", "Dalifort", "Guédiawaye"],
    },
  },
  Tanzania: {
    "Dar es Salaam": {
      Kinondoni: ["Masaki", "Mikocheni", "Sinza"],
      Ilala: ["Upanga", "Kariakoo", "Tabata"],
    },
  },
  Uganda: {
    Central: {
      Kampala: ["Kololo", "Ntinda", "Muyenga"],
      Wakiso: ["Entebbe", "Kira", "Nansana"],
    },
  },
  Gambia: {
    Banjul: {
      Banjul: ["Half-Die", "Mccarthy Square", "Campama"],
      "Kanifing Municipal": ["Serrekunda", "Bakau", "Fajara"],
    },
  },
  "Sierra Leone": {
    "Western Area": {
      Freetown: ["Aberdeen", "Lumley", "Congo Cross"],
      Waterloo: ["Hastings", "Masiaka", "Kissy"],
    },
  },
  Liberia: {
    Montserrado: {
      Monrovia: ["Sinkor", "Mamba Point", "Congo Town"],
      Paynesville: ["Red Light", "Duport Road", "ELWA"],
    },
  },
  Benin: {
    Littoral: {
      Cotonou: ["Cadjehoun", "Ganhi", "Akpakpa"],
      PortoNovo: ["Adjarra", "Djassin", "Ouando"],
    },
  },
  Togo: {
    Maritime: {
      Lomé: ["Tokoin", "Bè", "Agoè"],
      Aného: ["Gbodjomé", "Glidji", "Aklakou"],
    },
  },
  Cameroon: {
    Centre: {
      Yaoundé: ["Bastos", "Mvog-Ada", "Essos"],
      Mbalmayo: ["Nkolnguet", "Nkolmefou", "Minkama"],
    },
    Littoral: {
      Douala: ["Bonanjo", "Akwa", "Bonamoussadi"],
      Edea: ["Pongo", "Mouanko", "Dizangué"],
    },
  },
  Other: {
    Other: {
      Other: ["Other"],
    },
  },
};

const COUNTRIES = Object.keys(LOCATION_DATA);

const CURRENCIES = ["NGN", "USD", "GBP", "EUR", "CAD", "KES", "ZAR", "GHS", "AED"];

const BEDROOM_OPTIONS = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];
const BATHROOM_OPTIONS = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"];

function initialData(property?: PropertyRow | null): FormData {
  return {
    title: property?.title ?? "",
    slug: property?.slug ?? "",
    description: property?.description ?? "",

    price: property?.price ? String(property.price) : "",
    currency: property?.currency ?? "NGN",

    listing_type: property?.listing_type ?? "buy",
    property_type: property?.property_type ?? "Apartment",

    country: property?.country ?? "Nigeria",
    state: property?.state ?? "",
    city: property?.city ?? "",
    address: property?.address ?? "",

    bedrooms: property?.bedrooms ? String(property.bedrooms) : "",
    bathrooms: property?.bathrooms ? String(property.bathrooms) : "",
    area: property?.area ? String(property.area) : "",

    amenities: Array.isArray(property?.amenities) ? property!.amenities.join(", ") : "",

    status: property?.status ?? "draft",

    is_featured: property?.is_featured ?? false,

    agent_id: "",
  };
}

export function PropertyForm({
  userId,
  merchantId,
  property,
  agents = [],
  canPublish = false,
  canFeature = false,
  onDone,
  onCancel,
}: Props) {
  const [form, setForm] = useState<FormData>(initialData(property));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [gallery, setGallery] = useState<string[]>(
    Array.isArray(property?.images) ? property.images : []
  );

  const states = Object.keys(LOCATION_DATA[form.country] ?? {});
  const cities = Object.keys((LOCATION_DATA[form.country] ?? {})[form.state] ?? {});
  const areas = ((LOCATION_DATA[form.country] ?? {})[form.state] ?? {})[form.city] ?? [];

  function update<K extends keyof FormData>(key: K) {
    return (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      const value = e.target.value;

      if (key === "country") {
        setForm((prev) => ({
          ...prev,
          country: value,
          state: "",
          city: "",
          area: "",
        }));
        return;
      }

      if (key === "state") {
        setForm((prev) => ({
          ...prev,
          state: value,
          city: "",
          area: "",
        }));
        return;
      }

      if (key === "city") {
        setForm((prev) => ({
          ...prev,
          city: value,
          area: "",
        }));
        return;
      }

      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    };
  }

  async function uploadImages(actualMerchantId: string) {
    const uploaded: string[] = [];

    for (const file of files) {
      const url = await uploadPropertyImage(actualMerchantId, file);
      uploaded.push(url);
    }

    return [...gallery, ...uploaded];
  }

  async function submit(status: string) {
    try {
      setBusy(true);
      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("You are not logged in. Please sign in again.");

      const { data: merchant, error: merchantError } = await supabase
        .from("merchants")
        .select("id, user_id, status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (merchantError) throw merchantError;
      if (!merchant) throw new Error("Merchant account not found.");

      if (merchant.status !== "approved") {
        throw new Error(
          `Your merchant account is pending approval. Current status: ${merchant.status}. Please wait for admin approval.`
        );
      }

      const actualMerchantId = merchant.id;
      const images = await uploadImages(actualMerchantId);

      const amenities = String(form.amenities ?? "")
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);

      const payload = {
        title: form.title,
        slug: form.slug.trim() || slugify(form.title),
        description: form.description,

        price: form.price ? Number(form.price) : null,
        currency: form.currency,

        listing_type: form.listing_type,
        property_type: form.property_type,

        country: form.country,
        state: form.state,
        city: form.city,
        address: form.address,

        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        area: form.area ? Number(form.area) : null,
        area_unit: "sqm",

        amenities,

        featured_image: images[0] ?? null,
        images,

        merchant_id: actualMerchantId,

        status,
        is_featured: canFeature ? form.is_featured : false,
        agent_id: form.agent_id || null,

        published_at: status === "approved" ? new Date().toISOString() : null,
      };

      if (property?.id) {
        const { error } = await supabase.from("properties").update(payload).eq("id", property.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("properties").insert(payload);
        if (error) throw error;
      }

      onDone();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const status = canPublish ? form.status : "pending";
        void submit(status);
      }}
      className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
    >
      <Field label="Title" required value={form.title} onChange={update("title")} />

      <Field label="Slug" value={form.slug} onChange={update("slug")} />

      <Field label="Price" type="number" value={form.price} onChange={update("price")} />

      <label>
        <span className="mb-1 block text-xs font-semibold">Currency</span>
        <select className={selectClass} value={form.currency} onChange={update("currency")}>
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="mb-1 block text-xs font-semibold">Listing Type</span>
        <select className={selectClass} value={form.listing_type} onChange={update("listing_type")}>
          <option value="buy">For Sale</option>
          <option value="rent">For Rent</option>
          <option value="shortlet">Shortlet</option>
        </select>
      </label>

      <label>
        <span className="mb-1 block text-xs font-semibold">Property Type</span>
        <select className={selectClass} value={form.property_type} onChange={update("property_type")}>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="mb-1 block text-xs font-semibold">Country</span>
        <select className={selectClass} value={form.country} onChange={update("country")}>
          <option value="">Select country</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="mb-1 block text-xs font-semibold">State</span>
        <select
          className={selectClass}
          value={form.state}
          onChange={update("state")}
          disabled={!form.country}
        >
          <option value="">Select state</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="mb-1 block text-xs font-semibold">City</span>
        <select
          className={selectClass}
          value={form.city}
          onChange={update("city")}
          disabled={!form.state}
        >
          <option value="">Select city</option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <Field label="Address" value={form.address} onChange={update("address")} />

      <label>
        <span className="mb-1 block text-xs font-semibold">Area</span>
        <select
          className={selectClass}
          value={form.area}
          onChange={update("area")}
          disabled={!form.city}
        >
          <option value="">Select area</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="mb-1 block text-xs font-semibold">Bedrooms</span>
        <select className={selectClass} value={form.bedrooms} onChange={update("bedrooms")}>
          <option value="">Select bedrooms</option>
          {BEDROOM_OPTIONS.filter(Boolean).map((b) => (
            <option key={b} value={b.replace("+", "")}>
              {b}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span className="mb-1 block text-xs font-semibold">Bathrooms</span>
        <select className={selectClass} value={form.bathrooms} onChange={update("bathrooms")}>
          <option value="">Select bathrooms</option>
          {BATHROOM_OPTIONS.filter(Boolean).map((b) => (
            <option key={b} value={b.replace("+", "")}>
              {b}
            </option>
          ))}
        </select>
      </label>

      <Field label="Amenities (comma separated)" value={form.amenities} onChange={update("amenities")} />

      <label className="sm:col-span-2">
        <span className="mb-1 block text-xs font-semibold">Description</span>
        <textarea
          rows={5}
          className="w-full rounded-2xl border border-border bg-secondary/60 p-4"
          value={form.description}
          onChange={update("description")}
        />
      </label>

      <label className="sm:col-span-2">
        <span className="mb-1 block text-xs font-semibold">Property Images</span>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="w-full rounded-2xl border border-border bg-secondary/60 p-3"
        />
      </label>

      {gallery.length > 0 && (
        <div className="sm:col-span-2 flex flex-wrap gap-3">
          {gallery.map((image) => (
            <div key={image} className="relative">
              <img src={image} alt="" className="h-20 w-20 rounded-xl object-cover" />
              <button
                type="button"
                onClick={() => setGallery((g) => g.filter((item) => item !== image))}
                className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label>
        <span className="mb-1 block text-xs font-semibold">Status</span>
        <select
          className={selectClass}
          value={form.status}
          onChange={update("status")}
          disabled={!canPublish}
        >
          {PROPERTY_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>

      {canFeature && (
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                is_featured: e.target.checked,
              }))
            }
          />
          Featured Property
        </label>
      )}

      {error && <p className="sm:col-span-2 text-sm text-destructive">{error}</p>}

      <div className="sm:col-span-2 flex flex-wrap gap-3">
        <PrimaryButton type="submit" disabled={busy}>
          {busy ? "Saving..." : property ? "Save Changes" : "Create Property"}
        </PrimaryButton>

        <button
          type="button"
          disabled={busy}
          onClick={() => void submit("draft")}
          className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold"
        >
          Save Draft
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => void submit(canPublish ? "approved" : "pending")}
          className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold"
        >
          {canPublish ? "Publish" : "Submit for Review"}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-12 items-center rounded-full border border-border px-6 text-sm font-semibold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
