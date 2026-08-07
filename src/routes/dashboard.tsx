import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";

import { PageHeader, Section } from "@/components/page-shell";
import { PropertyForm } from "@/components/property-form";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/use-auth";
import {
  fetchMyProperties,
  formatPrice,
  type PropertyRow,
} from "@/lib/properties";

export const Route = createFileRoute("/dashboard")({
  ssr: false,

  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: DashboardPage,
});

const FILTERS = [
  "all",
  "draft",
  "pending",
  "approved",
  "sold",
  "rented",
] as const;

const STATUS_STYLE: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  sold: "bg-blue-100 text-blue-700",
  rented: "bg-indigo-100 text-indigo-700",
  draft: "bg-secondary",
};

function DashboardPage() {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { user, loading, isMerchant, isAdmin, signOut } =
    useAuth();

  const [showForm, setShowForm] = useState(false);

  const [editing, setEditing] =
    useState<PropertyRow | null>(null);

  const [filter, setFilter] =
    useState<(typeof FILTERS)[number]>("all");

  const merchant = useQuery({
    queryKey: ["merchant", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("merchants")
        .select("id,business_name,status")
        .eq("user_id", user!.id)
        .single();

      if (error) throw error;

      return data;
    },
  });

  const properties = useQuery({
    queryKey: ["merchant-properties", merchant.data?.id],
    enabled: !!merchant.data?.id,
    queryFn: () => fetchMyProperties(merchant.data!.id),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["merchant-properties"],
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => {
      const { error } = await supabase
        .from("properties")
        .update({
          status,
        })
        .eq("id", id);

      if (error) throw error;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["merchant-properties"],
      });
    },
  });

  if (!loading && !isMerchant && !isAdmin) {
    navigate({
      to: "/",
      replace: true,
    });

    return null;
  }

  const rows = properties.data ?? [];

  const filtered =
    filter === "all"
      ? rows
      : rows.filter((p) => p.status === filter);

  const stats = {
    total: rows.length,
    approved: rows.filter(

        return (
    <>
      <PageHeader
        eyebrow="Merchant Dashboard"
        title={merchant.data?.business_name ?? "Dashboard"}
        subtitle="Manage your property listings"
      >
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setShowForm(!showForm);
            }}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white"
          >
            <Plus className="size-4" />
            {showForm ? "Close Form" : "Add Property"}
          </button>

          <button
            type="button"
            onClick={async () => {
              await signOut();
              navigate({
                to: "/login",
                replace: true,
              });
            }}
            className="inline-flex h-12 items-center rounded-full border border-border px-6 text-sm font-semibold"
          >
            Sign Out
          </button>
        </div>
      </PageHeader>

      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase text-muted-foreground">
              Total Listings
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              {stats.total}
            </h3>
          </div>

          <div className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase text-muted-foreground">
              Approved
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              {stats.approved}
            </h3>
          </div>

          <div className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase text-muted-foreground">
              Pending
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              {stats.pending}
            </h3>
          </div>

          <div className="surface-card rounded-2xl p-5">
            <p className="text-xs uppercase text-muted-foreground">
              Sold
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              {stats.sold}
            </h3>
          </div>
        </div>
      </Section>

      {(showForm || editing) && (
        <Section title={editing ? "Edit Property" : "New Property"}>
          <PropertyForm
            userId={user!.id}
            merchantId={merchant.data?.id ?? null}
            property={editing}
            canPublish={isAdmin}
            canFeature={isAdmin}
            onDone={() => {
              setShowForm(false);
              setEditing(null);
              queryClient.invalidateQueries({
                queryKey: ["merchant-properties"],
              });
            }}
            onCancel={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </Section>
      )}

            <Section title="Your Listings">
        <div className="mb-5 flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-xs font-semibold capitalize ${
                filter === item
                  ? "bg-ink text-white"
                  : "border border-border bg-card"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {properties.isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading properties...
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No properties found.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((property) => (
              <div
                key={property.id}
                className="surface-card overflow-hidden rounded-2xl"
              >
                {property.featured_image && (
                  <img
                    src={property.featured_image}
                    alt={property.title}
                    className="aspect-[4/3] w-full object-cover"
                  />
                )}

                <div className="space-y-3 p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">
                      {property.title}
                    </h3>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        STATUS_STYLE[property.status] ??
                        "bg-secondary"
                      }`}
                    >
                      {property.status}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {[property.city, property.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  <p className="font-bold text-primary">
                    {formatPrice(
                      property.price,
                      property.currency
                    )}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(property);
                        setShowForm(false);
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                      className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-2 text-xs font-semibold"
                    >
                      <Pencil className="size-3.5" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        statusMutation.mutate({
                          id: property.id,
                          status: "sold",
                        })
                      }
                      className="rounded-full border border-border px-3 py-2 text-xs font-semibold"
                    >
                      Mark Sold
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteMutation.mutate(property.id)
                      }
                      className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                    >
                      <Trash2 className="size-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
     
