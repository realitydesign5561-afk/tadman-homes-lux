import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader, Section } from "@/components/page-shell";
import { PropertyForm } from "@/components/property-form";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import { fetchMyProperties, formatPrice, type PropertyRow } from "@/lib/properties";

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
  sold: "bg-blue-100 text-blue-800",
  rented: "bg-indigo-100 text-indigo-800",
  draft: "bg-secondary text-muted-foreground",
  archived: "bg-secondary text-muted-foreground",
};

const FILTERS = ["all", "draft", "pending", "approved", "sold", "rented"] as const;

function DashboardPage() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PropertyRow | null>(null);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("all");

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

  const enquiries = useQuery({
    queryKey: ["merchant-enquiries", user?.id],
    queryFn: async () => {
      const ids = (listings.data ?? []).map((r) => r.id);
      if (ids.length === 0) return [];
      const { data } = await supabase
        .from("contact_requests")
        .select("id, name, email, phone, message, property_id, created_at")
        .in("property_id", ids)
        .order("created_at", { ascending: false })
        .limit(30);
      return (data ?? []) as {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        message: string;
        property_id: string | null;
        created_at: string;
      }[];
    },
    enabled: Boolean(user?.id) && (listings.data ?? []).length > 0,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-properties"] }),
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("properties").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-properties"] }),
  });

  const rows = listings.data ?? [];
  const visible = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const stats = {
    total: rows.length,
    live: rows.filter((r) => r.status === "approved").length,
    pending: rows.filter((r) => r.status === "pending").length,
    views: rows.reduce((sum, r) => sum + (r.views_count ?? 0), 0),
  };

  function closeForm() {
    setShowForm(false);
    setEditing(null);
    queryClient.invalidateQueries({ queryKey: ["my-properties"] });
  }

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
            onClick={() => {
              setEditing(null);
              setShowForm((v) => !v);
            }}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-ink-foreground"
          >
            <Plus className="size-4" /> {showForm && !editing ? "Close form" : "Add listing"}
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

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total listings", value: stats.total },
            { label: "Live", value: stats.live },
            { label: "Awaiting review", value: stats.pending },
            { label: "Total views", value: stats.views },
          ].map((s) => (
            <div key={s.label} className="surface-card rounded-2xl p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-2 font-display text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </Section>

      {(showForm || editing) && user && (
        <Section title={editing ? "Edit listing" : "New listing"}>
          <PropertyForm
            userId={user.id}
            merchantId={merchant.data?.id ?? null}
            property={editing}
            canPublish={isAdmin}
            canFeature={isAdmin}
            onDone={closeForm}
            onCancel={closeForm}
          />
        </Section>
      )}

      <Section
        title="Your listings"
        subtitle="Drafts stay private. Submitted listings are reviewed by an administrator before they go live."
      >
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${
                filter === f ? "bg-ink text-ink-foreground" : "border border-border bg-card"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {listings.isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading listings…
          </p>
        ) : listings.error ? (
          <p className="text-sm text-destructive">Could not load your listings.</p>
        ) : visible.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No listings in this view. Use “Add listing” to create one.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((row) => (
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
                  <p className="text-xs text-muted-foreground">{row.views_count ?? 0} views</p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(row);
                        setShowForm(false);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
                    >
                      <Pencil className="size-3.5" /> Edit
                    </button>
                    {row.status === "draft" && (
                      <button
                        type="button"
                        onClick={() => setStatus.mutate({ id: row.id, status: "pending" })}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
                      >
                        Submit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setStatus.mutate({ id: row.id, status: "sold" })}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
                    >
                      Mark sold
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus.mutate({ id: row.id, status: "rented" })}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
                    >
                      Mark rented
                    </button>
                    <button
                      type="button"
                      onClick={() => remove.mutate(row.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-destructive"
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Enquiries on your listings">
        {(enquiries.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No enquiries yet.</p>
        ) : (
          <div className="space-y-3">
            {(enquiries.data ?? []).map((e) => (
              <div key={e.id} className="surface-card rounded-2xl p-5">
                <p className="text-sm font-semibold text-foreground">
                  {e.name}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    {e.email ?? e.phone ?? ""}
                  </span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{e.message}</p>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
