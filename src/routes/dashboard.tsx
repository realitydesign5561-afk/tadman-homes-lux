import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { PageHeader, Section, Field, PrimaryButton } from "@/components/page-shell";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { fetchMyProperties, formatPrice, slugify, type PropertyRow } from "@/lib/properties";
import { uploadPropertyImage } from "@/lib/storage";
import { propertyTypes } from "@/data/properties";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
  },
  head: () => ({
    meta: [
      { title: "Merchant Dashboard | Tadman Homes & Properties" },
      { name: "description", content: "Manage your Tadman property listings, uploads and enquiries." },
      { property: "og:title", content: "Merchant Dashboard | Tadman Homes" },
      { property: "og:description", content: "Publish and manage your property listings." },
    ],
  }),
  component: DashboardPage,
});

const statusStyles: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  rejected: "bg-red-100 text-red-800",
  draft: "bg-secondary text-muted-foreground",
};

function DashboardPage() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const listings = useQuery({
    queryKey: ["my-properties", user?.id],
    queryFn: () => fetchMyProperties(user!.id),
    enabled: Boolean(user?.id),
  });

  const merchant = useQuery({
    queryKey: ["my-merchant", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("merchants")
        .select("id, business_name, status")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data as { id: string; business_name: string; status: string } | null;
    },
    enabled: Boolean(user?.id),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-properties"] }),
  });

  const rows = listings.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={merchant.data?.business_name || "Your dashboard"}
        subtitle={user?.email ?? undefined}
      >
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-ink-foreground"
          >
            <Plus className="size-4" /> {showForm ? "Close form" : "Add listing"}
          </button>
          {isAdmin && (
            <Link
              to="/admin"
              className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold"
            >
              Admin panel
            </Link>
          )}
          <button
            type="button"
            onClick={async () => {
              await queryClient.cancelQueries();
              queryClient.clear();
              await signOut();
              navigate({ to: "/login", replace: true });
            }}
            className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold"
          >
            Sign out
          </button>
        </div>
      </PageHeader>

      {showForm && (
        <Section title="New listing">
          <ListingForm
            userId={user!.id}
            merchantId={merchant.data?.id ?? null}
            onDone={() => {
              setShowForm(false);
              queryClient.invalidateQueries({ queryKey: ["my-properties"] });
            }}
          />
        </Section>
      )}

      <Section
        title="Your listings"
        subtitle="New listings are reviewed by an administrator before they appear publicly."
      >
        {listings.isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading listings…
          </p>
        ) : listings.error ? (
          <p className="text-sm text-destructive">Could not load your listings.</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You have no listings yet. Use “Add listing” to publish your first property.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((row: PropertyRow) => (
              <div key={row.id} className="surface-card overflow-hidden rounded-2xl">
                {row.featured_image && (
                  <img
                    src={row.featured_image}
                    alt={row.title}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                )}
                <div className="space-y-2 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{row.title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[row.status] ?? "bg-secondary"}`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {[row.city, row.country].filter(Boolean).join(", ")}
                  </p>
                  <p className="font-display text-sm font-bold text-primary">
                    {formatPrice(row.price, row.currency)}
                  </p>
                  <p className="text-xs text-muted-foreground">{row.views_count} views</p>
                  <button
                    type="button"
                    onClick={() => remove.mutate(row.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-destructive"
                  >
                    <Trash2 className="size-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

function ListingForm({
  userId,
  merchantId,
  onDone,
}: {
  userId: string;
  merchantId: string | null;
  onDone: () => void;
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    currency: "NGN",
    listing_type: "buy",
    property_type: "Apartment",
    city: "",
    state: "",
    country: "Nigeria",
    address: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    amenities: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const urls: string[] = [];
      for (const file of files) urls.push(await uploadPropertyImage(userId, file));

      const { error } = await supabase.from("properties").insert({
        owner_id: userId,
        merchant_id: merchantId,
        title: form.title,
        slug: slugify(form.title),
        description: form.description,
        price: form.price ? Number(form.price) : null,
        currency: form.currency,
        listing_type: form.listing_type,
        property_type: form.property_type,
        city: form.city,
        state: form.state,
        country: form.country,
        address: form.address,
        bedrooms: form.bedrooms ? Number(form.bedrooms) : null,
        bathrooms: form.bathrooms ? Number(form.bathrooms) : null,
        size: form.size ? Number(form.size) : null,
        amenities: form.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        featured_image: urls[0] ?? null,
        gallery: urls,
        status: "pending",
      });
      if (error) throw error;
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the listing.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
      <Field label="Title" required value={form.title} onChange={set("title")} />
      <Field label="Price" type="number" min={0} value={form.price} onChange={set("price")} />
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Listing type
        </span>
        <select
          value={form.listing_type}
          onChange={set("listing_type")}
          className="h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm"
        >
          <option value="buy">For sale</option>
          <option value="rent">For rent</option>
          <option value="shortlet">Shortlet</option>
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Property type
        </span>
        <select
          value={form.property_type}
          onChange={set("property_type")}
          className="h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm"
        >
          {propertyTypes.map((t) => (
            <option key={t}>{t}</option>
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
      <Field
        label="Amenities (comma separated)"
        value={form.amenities}
        onChange={set("amenities")}
      />
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Description
        </span>
        <textarea
          rows={4}
          value={form.description}
          onChange={set("description")}
          className="w-full rounded-2xl border border-border bg-secondary/60 p-4 text-sm"
        />
      </label>
      <label className="block sm:col-span-2">
        <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Photos
        </span>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="w-full rounded-2xl border border-border bg-secondary/60 p-3 text-sm"
        />
      </label>
      {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
      <div className="sm:col-span-2">
        <PrimaryButton type="submit" disabled={busy}>
          {busy ? "Publishing…" : "Submit for review"}
        </PrimaryButton>
      </div>
    </form>
  );
}
