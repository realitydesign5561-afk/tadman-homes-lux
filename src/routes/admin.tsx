import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { PageHeader, Section } from "@/components/page-shell";
import { supabase } from "@/lib/supabase";
import { formatPrice, type PropertyRow } from "@/lib/properties";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Admin Panel | Tadman Homes & Properties" },
      { name: "description", content: "Approve listings, merchants and review enquiries." },
      { property: "og:title", content: "Admin Panel | Tadman Homes" },
      { property: "og:description", content: "Internal moderation tools for Tadman Homes." },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const queryClient = useQueryClient();

  const pending = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PropertyRow[];
    },
  });

  const merchants = useQuery({
    queryKey: ["admin-merchants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("merchants")
        .select("id, business_name, email, phone, status, verified, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as {
        id: string;
        business_name: string;
        email: string | null;
        phone: string | null;
        status: string;
        verified: boolean;
      }[];
    },
  });

  const enquiries = useQuery({
    queryKey: ["admin-enquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_requests")
        .select("id, name, email, phone, subject, message, created_at, is_read")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data as {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        subject: string | null;
        message: string;
        created_at: string;
      }[];
    },
  });

  const setPropertyStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("properties")
        .update({
          status,
          published_at: status === "approved" ? new Date().toISOString() : null,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-properties"] }),
  });

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase.from("properties").update({ is_featured: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-properties"] }),
  });

  const setMerchantStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("merchants")
        .update({ status, verified: status === "approved" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-merchants"] }),
  });

  const properties = pending.data ?? [];
  const awaiting = properties.filter((p) => p.status === "pending");

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Admin panel"
        subtitle="Approve listings and merchants, and review incoming enquiries."
      />

      <Section title={`Listings awaiting review (${awaiting.length})`}>
        {pending.isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading…
          </p>
        ) : properties.length === 0 ? (
          <p className="text-sm text-muted-foreground">No listings yet.</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {properties.map((p) => (
              <div key={p.id} className="surface-card rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {[p.city, p.country].filter(Boolean).join(", ")} • {p.listing_type}
                    </p>
                  </div>
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold">
                    {p.status}
                  </span>
                </div>
                <p className="mt-2 font-display text-sm font-bold text-primary">
                  {formatPrice(p.price, p.currency)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setPropertyStatus.mutate({ id: p.id, status: "approved" })}
                    className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-ink-foreground"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setPropertyStatus.mutate({ id: p.id, status: "rejected" })}
                    className="rounded-full border border-border px-4 py-2 text-xs font-semibold"
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleFeatured.mutate({ id: p.id, value: !p.is_featured })}
                    className="rounded-full border border-border px-4 py-2 text-xs font-semibold"
                  >
                    {p.is_featured ? "Unfeature" : "Feature"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Merchants">
        {merchants.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (merchants.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No merchants registered yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(merchants.data ?? []).map((m) => (
              <div key={m.id} className="surface-card rounded-2xl p-5">
                <p className="text-sm font-semibold text-foreground">{m.business_name}</p>
                <p className="text-xs text-muted-foreground">{m.email ?? m.phone ?? "—"}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  {m.status}
                </p>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setMerchantStatus.mutate({ id: m.id, status: "approved" })}
                    className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-ink-foreground"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setMerchantStatus.mutate({ id: m.id, status: "suspended" })}
                    className="rounded-full border border-border px-4 py-2 text-xs font-semibold"
                  >
                    Suspend
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Recent enquiries">
        {enquiries.isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (enquiries.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No enquiries yet.</p>
        ) : (
          <div className="space-y-3">
            {(enquiries.data ?? []).map((e) => (
              <div key={e.id} className="surface-card rounded-2xl p-5">
                <p className="text-sm font-semibold text-foreground">
                  {e.name} <span className="text-xs font-normal text-muted-foreground">{e.email}</span>
                </p>
                {e.subject && <p className="text-xs text-muted-foreground">{e.subject}</p>}
                <p className="mt-2 text-sm text-muted-foreground">{e.message}</p>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
