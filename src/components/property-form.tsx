import React, { useState } from "react";
import { Field, PrimaryButton } from "@/components/page-shell";
import { supabase } from "@/lib/supabase";
import { slugify, type PropertyRow } from "@/lib/properties";
import { uploadPropertyImage } from "@/lib/storage";
import { propertyTypes } from "@/data/properties";
import { logActivity } from "@/lib/admin";
import { canCreateProperty } from "@/lib/subscriptions";

export const PROPERTY_STATUSES = [
"draft",
"pending",
"approved",
"rejected",
"sold",
"rented",
"archived",
] as const;

type FormState = {
title: string;
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
size: string;
amenities: string;
slug: string;
status: string;
is_featured: boolean;
agent_id: string;
};

function initial(row?: PropertyRow | null): FormState {
const r = row as (PropertyRow & { category?: string; map_url?: string; agent_id?: string }) | null | undefined;
return {
title: r?.title ?? "",
description: r?.description ?? "",
price: r?.price != null ? String(r.price) : "",
currency: r?.currency ?? "NGN",
listing_type: r?.listing_type ?? "buy",
property_type: r?.property_type ?? "Apartment",
country: r?.country ?? "Nigeria",
state: r?.state ?? "",
city: r?.city ?? "",
address: r?.address ?? "",
bedrooms: r?.bedrooms != null ? String(r.bedrooms) : "",
bathrooms: r?.bathrooms != null ? String(r.bathrooms) : "",
size: r?.size != null ? String(r.size) : "",
amenities: Array.isArray(r?.amenities)
? r.amenities.join(", ")
: "",
slug: r?.slug ?? "",
status: r?.status ?? "draft",
is_featured: Boolean(r?.is_featured),
agent_id: r?.agent_id ?? "",
};
}

const selectClass =
"h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm text-foreground";

export function PropertyForm({
userId,
merchantId,
property,
agents = [],
canFeature = false,
canPublish = false,
onDone,
onCancel,
}: {
userId: string;
merchantId?: string | null;
property?: PropertyRow | null;
agents?: { id: string; full_name: string }[];
canFeature?: boolean;
canPublish?: boolean;
onDone: () => void;
onCancel?: () => void;
}) {
const [form, setForm] = useState<FormState>(initial(property));
const [files, setFiles] = useState<File[]>([]);
const [gallery, setGallery] = useState<string[]>(
  Array.isArray(property?.images) ? property.images : []
);
const [error, setError] = useState<string | null>(null);
const [busy, setBusy] = useState(false);

function set<K extends keyof FormState>(key: K) {
return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
setForm((f) => ({ ...f, [key]: e.target.value }));
}

async function save(targetStatus?: string) {
  alert("save() started");
  console.log("SAVE STARTED");

  setBusy(true);
  setError(null);

try {

if (!property?.id && merchantId) {  

  const allowed = await canCreateProperty(  
    merchantId  
  );  

 if (!allowed) {  
    throw new Error(  
    "Your subscription listing limit has been reached. Upgrade your plan to add more properties."  
   );  
 }  
}

const uploaded: string[] = [];

for (const file of files) {
const url = await uploadPropertyImage(file, merchantId ?? userId);
uploaded.push(url);
}
const allImages = [...gallery, ...uploaded];
const payload: Record<string, any> = {
  title: form.title,
  slug: form.slug || slugify(form.title),
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

  size: form.size ? Number(form.size) : null,
  size_unit: "sqm",

  amenities: form.amenities
    .split(",")
    .map(a => a.trim())
    .filter(Boolean),

  featured_image: allImages[0] ?? null,
images: allImages,
  
  agent_id: form.agent_id || null,

  status: targetStatus ?? form.status,
  is_featured: form.is_featured,
};
if (payload.status === "approved") {
payload.published_at = new Date().toISOString();
}
if (property?.id) {

const { data, error } = await supabase
  .from("properties")
  .update(payload)
  .eq("id", property.id)
  .select("*")
  .single();

console.log("UPDATED:", data);
console.log("UPDATE ERROR:", error);

if (error) throw error;

await logActivity(
  "Updated property",
  "property",
  property.id
);
} else {

if (!merchantId) {
  throw new Error("Merchant account not found. Please login again.");
}

console.log(payload);
console.log({
merchant_id: merchantId,
owner_id: userId,
});
  
const { data: authData } = await supabase.auth.getUser();
 console.log("AUTH USER:", authData.user);
 console.log("USER ID PROP:", userId);
 console.log("MERCHANT ID:", merchantId);
  
const { data, error } = await supabase
  .from("properties")
  .insert([{
  ...payload,
  merchant_id: merchantId,
  owner_id: userId,
}])
  .select("*");

console.log("USER ID:", userId);
console.log("MERCHANT ID:", merchantId);
console.log("PAYLOAD:", payload);
console.log("RESULT:", data);
console.log("ERROR:", error);

if (error) {
  console.log("SUPABASE ERROR", error);
  alert(JSON.stringify(error, null, 2));
  throw error;
}
await logActivity("Created property", "property");
}

onDone();
} catch (err) {
console.error("SAVE ERROR:", err);
alert(JSON.stringify(err, null, 2));

setError(
err instanceof Error
? err.message
: JSON.stringify(err)
);
} finally {
setBusy(false);
}
}

return (
<form
onSubmit={(e) => {
e.preventDefault();
void save();
}}
className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
>
<Field label="Title" required value={form.title} onChange={set("title")} />
<Field label="SEO slug" placeholder="auto-generated" value={form.slug} onChange={set("slug")} />
<Field label="Price" type="number" min={0} value={form.price} onChange={set("price")} />
<Field label="Currency" value={form.currency} onChange={set("currency")} />

<label className="block">  
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">  
      Listing type  
    </span>  
    <select value={form.listing_type} onChange={set("listing_type")} className={selectClass}>  
      <option value="buy">For sale</option>  
      <option value="rent">For rent</option>  
      <option value="shortlet">Shortlet</option>  
    </select>  
  </label>  

  <label className="block">  
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">  
      Property type  
    </span>  
    <select value={form.property_type} onChange={set("property_type")} className={selectClass}>  
      {propertyTypes.map((t) => (  
        <option key={t}>{t}</option>  
      ))}  
    </select>  
  </label>  

  <label className="block">  
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">  
      Agent  
    </span>  
    <select value={form.agent_id} onChange={set("agent_id")} className={selectClass}>  
      <option value="">Unassigned</option>  
      {agents.map((a) => (  
        <option key={a.id} value={a.id}>  
          {a.full_name}  
        </option>  
      ))}  
    </select>  
  </label>  

  <Field label="City" value={form.city} onChange={set("city")} />  
  <Field label="State" value={form.state} onChange={set("state")} />  
  <Field label="Country" value={form.country} onChange={set("country")} />  
  <Field label="Address" value={form.address} onChange={set("address")} />  
  <Field label="Bedrooms" type="number" min={0} value={form.bedrooms} onChange={set("bedrooms")} />  
  <Field label="Bathrooms" type="number" min={0} value={form.bathrooms} onChange={set("bathrooms")} />  
  <Field label="Size (sqm)" type="number" min={0} value={form.size} onChange={set("size")} />  
  <Field label="Amenities (comma separated)" value={form.amenities} onChange={set("amenities")} />  

  <label className="block sm:col-span-2">  
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">  
      Description  
    </span>  
    <textarea  
      rows={5}  
      value={form.description}  
      onChange={set("description")}  
      className="w-full rounded-2xl border border-border bg-secondary/60 p-4 text-sm"  
    />  
  </label>  

  <label className="block sm:col-span-2">  
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">  
      Gallery images (multiple)  
    </span>  
    <input  
      type="file"  
      accept="image/*"  
      multiple  
      onChange={(e) => setFiles(Array.from(e.target.files ?? []))}  
      className="w-full rounded-2xl border border-border bg-secondary/60 p-3 text-sm"  
    />  
  </label>  

  {gallery.length > 0 && (  
    <div className="flex flex-wrap gap-3 sm:col-span-2">  
      {gallery.map((url) => (  
        <div key={url} className="relative">  
          <img src={url} alt="" className="size-20 rounded-xl object-cover" />  
          <button  
            type="button"  
            onClick={() => setGallery((g) => g.filter((u) => u !== url))}  
            className="absolute -right-2 -top-2 rounded-full bg-destructive px-2 text-xs font-bold text-white"  
          >  
            ×  
          </button>  
        </div>  
      ))}  
      <p className="w-full text-[11px] text-muted-foreground">  
        The first image is used as the featured image.  
      </p>  
    </div>  
  )}  

  <label className="block">  
    <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">  
      Status  
    </span>  
    <select value={form.status} onChange={set("status")} className={selectClass}>  
      {PROPERTY_STATUSES.filter((s) => canPublish || s !== "approved").map((s) => (  
        <option key={s} value={s}>  
          {s}  
        </option>  
      ))}  
    </select>  
  </label>  

  {canFeature && (  
    <label className="flex items-end gap-2 pb-2 text-sm text-foreground">  
      <input  
        type="checkbox"  
        checked={form.is_featured}  
        onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}  
      />  
      Featured listing  
    </label>  
  )}  

  {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}  

  <div className="flex flex-wrap gap-3 sm:col-span-2">  
    <div className="w-full sm:w-auto">  
      <PrimaryButton
  type="button"
  disabled={busy}
  onClick={() => {
    alert("BUTTON CLICKED");
    console.log("BUTTON CLICKED");
    save();
  }}
>
  {busy ? "Saving..." : property?.id ? "Save changes" : "Save listing"}
</PrimaryButton>
    </div>  
    <button  
      type="button"  
      disabled={busy}  
      onClick={() => void save("draft")}  
      className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold"  
    >  
      Save as draft  
    </button>  
    <button  
      type="button"  
      disabled={busy}  
      onClick={() => void save(canPublish ? "approved" : "pending")}  
      className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold"  
    >  
      {canPublish ? "Publish" : "Submit for review"}  
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

