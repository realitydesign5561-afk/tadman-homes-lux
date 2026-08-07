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
