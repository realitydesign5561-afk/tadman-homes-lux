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

    amenities: Array.isArray(property?.amenities)
      ? property!.amenities.join(", ")
      : "",

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
    property?.images ?? []
  );

  function update<K extends keyof FormData>(key: K) {
    return (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      setForm((prev) => ({
        ...prev,
        [key]: e.target.value,
      }));
    };
  }

    async function uploadImages() {
    const uploaded: string[] = [];

    for (const file of files) {
      const url = await uploadPropertyImage(
        merchantId ?? userId,
        file
      );

      uploaded.push(url);
    }

    return [...gallery, ...uploaded];
  }

  async function submit(status: string) {
    try {
      setBusy(true);
      setError("");

      if (!merchantId) {
        throw new Error("Merchant account not found.");
      }

      const images = await uploadImages();

      const payload = {
        title: form.title,
        slug:
          form.slug.trim() || slugify(form.title),

        description: form.description,

        price: form.price
          ? Number(form.price)
          : null,

        currency: form.currency,

        listing_type: form.listing_type,

        property_type: form.property_type,

        country: form.country,

        state: form.state,

        city: form.city,

        address: form.address,

        bedrooms: form.bedrooms
          ? Number(form.bedrooms)
          : null,

        bathrooms: form.bathrooms
          ? Number(form.bathrooms)
          : null,

        area: form.area
          ? Number(form.area)
          : null,

        area_unit: "sqm",

        console.log("Amenities value:", form.amenities);

const amenities =
  form.amenities
    ? form.amenities.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

        featured_image:
          images[0] ?? null,

        images,

        merchant_id: merchantId,

        status,

        is_featured:
          canFeature
            ? form.is_featured
            : false,

        agent_id:
          form.agent_id || null,

        published_at:
          status === "approved"
            ? new Date().toISOString()
            : null,
      };

      if (property?.id) {
        const { error } = await supabase
          .from("properties")
          .update(payload)
          .eq("id", property.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("properties")
          .insert(payload);

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
        void submit(form.status);
      }}
      className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
    >
      <Field
        label="Title"
        required
        value={form.title}
        onChange={update("title")}
      />

      <Field
        label="Slug"
        value={form.slug}
        onChange={update("slug")}
      />

      <Field
        label="Price"
        type="number"
        value={form.price}
        onChange={update("price")}
      />

      <Field
        label="Currency"
        value={form.currency}
        onChange={update("currency")}
      />

      <label>
        <span className="mb-1 block text-xs font-semibold">
          Listing Type
        </span>

        <select
          className={selectClass}
          value={form.listing_type}
          onChange={update("listing_type")}
        >
          <option value="buy">For Sale</option>
          <option value="rent">For Rent</option>
          <option value="shortlet">Shortlet</option>
        </select>
      </label>

      <label>
        <span className="mb-1 block text-xs font-semibold">
          Property Type
        </span>

        <select
          className={selectClass}
          value={form.property_type}
          onChange={update("property_type")}
        >
          {propertyTypes.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>
      </label>

      <Field
        label="Country"
        value={form.country}
        onChange={update("country")}
      />

      <Field
        label="State"
        value={form.state}
        onChange={update("state")}
      />

      <Field
        label="City"
        value={form.city}
        onChange={update("city")}
      />

      <Field
        label="Address"
        value={form.address}
        onChange={update("address")}
      />

      <Field
        label="Bedrooms"
        type="number"
        value={form.bedrooms}
        onChange={update("bedrooms")}
      />

      <Field
        label="Bathrooms"
        type="number"
        value={form.bathrooms}
        onChange={update("bathrooms")}
      />

      <Field
        label="Area (sqm)"
        type="number"
        value={form.area}
        onChange={update("area")}
      />

      <Field
        label="Amenities (comma separated)"
        value={form.amenities}
        onChange={update("amenities")}
      />

            <label className="sm:col-span-2">
        <span className="mb-1 block text-xs font-semibold">
          Description
        </span>

        <textarea
          rows={5}
          className="w-full rounded-2xl border border-border bg-secondary/60 p-4"
          value={form.description}
          onChange={update("description")}
        />
      </label>

      <label className="sm:col-span-2">
        <span className="mb-1 block text-xs font-semibold">
          Property Images
        </span>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setFiles(
              Array.from(e.target.files ?? [])
            )
          }
          className="w-full rounded-2xl border border-border bg-secondary/60 p-3"
        />
      </label>

      {gallery.length > 0 && (
        <div className="sm:col-span-2 flex flex-wrap gap-3">
          {gallery.map((image) => (
            <div
              key={image}
              className="relative"
            >
              <img
                src={image}
                alt=""
                className="h-20 w-20 rounded-xl object-cover"
              />

              <button
                type="button"
                onClick={() =>
                  setGallery((g) =>
                    g.filter(
                      (item) => item !== image
                    )
                  )
                }
                className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 text-xs text-white"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <label>
        <span className="mb-1 block text-xs font-semibold">
          Status
        </span>

        <select
          className={selectClass}
          value={form.status}
          onChange={update("status")}
        >
          {PROPERTY_STATUSES.map((status) => (
            <option
              key={status}
              value={status}
            >
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
                is_featured:
                  e.target.checked,
              }))
            }
          />

          Featured Property
        </label>
      )}

      {error && (
        <p className="sm:col-span-2 text-sm text-destructive">
          {error}
        </p>
      )}

            <div className="sm:col-span-2 flex flex-wrap gap-3">
        <PrimaryButton
          type="submit"
          disabled={busy}
        >
          {busy
            ? "Saving..."
            : property
            ? "Save Changes"
            : "Create Property"}
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
          onClick={() =>
            void submit(
              canPublish
                ? "approved"
                : "pending"
            )
          }
          className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold"
        >
          {canPublish
            ? "Publish"
            : "Submit for Review"}
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
