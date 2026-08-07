import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Trash2 } from "lucide-react";

async function fetchMerchants() {
  const { data, error } = await supabase
    .from("merchants")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

async function logActivity(
  action: string,
  entityType: string,
  entityId: string,
  metadata: Record<string, unknown> = {},
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be logged in to record activity.");
  }

  const { error } = await supabase.from("activity_logs").insert({
    user_id: user.id,
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata,
  });

  if (error) throw error;
}

async function updateMerchantStatus(
  id: string,
  status: string,
) {
  const { error } = await supabase
    .from("merchants")
    .update({
      status,
      verified: status === "approved",
    })
    .eq("id", id);

  if (error) throw error;
}

async function deleteMerchant(id: string) {
  const { error } = await supabase
    .from("merchants")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export default function MerchantsTab() {
  const qc = useQueryClient();

  const {
    data = [],
    isLoading,
  } = useQuery({
    queryKey: ["admin-merchants"],
    queryFn: fetchMerchants,
  });

  const statusMutation = useMutation({
    mutationFn: async ({
      id,
      status,
      businessName,
    }: {
      id: string;
      status: string;
      businessName: string;
    }) => {
      await updateMerchantStatus(id, status);

      await logActivity(
        `merchant_${status}`,
        "merchant",
        id,
        {
          business_name: businessName,
          status,
        },
      );
    },

    onSuccess() {
      qc.invalidateQueries({
        queryKey: ["admin-merchants"],
      });

      qc.invalidateQueries({
        queryKey: ["admin-activity"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async ({
      id,
      businessName,
    }: {
      id: string;
      businessName: string;
    }) => {
      await deleteMerchant(id);

      await logActivity(
        "merchant_deleted",
        "merchant",
        id,
        {
          business_name: businessName,
        },
      );
    },

    onSuccess() {
      qc.invalidateQueries({
        queryKey: ["admin-merchants"],
      });

      qc.invalidateQueries({
        queryKey: ["admin-activity"],
      });
    },
  });

  if (isLoading) {
    return <p>Loading merchants...</p>;
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold">
        Merchants
      </h2>

      {data.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No merchants registered yet.
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.map((merchant: any) => (
          <div
            key={merchant.id}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">
                  {merchant.business_name}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {merchant.email}
                </p>

                <p className="text-sm text-muted-foreground">
                  {merchant.phone || merchant.whatsapp || ""}
                </p>

                <p className="mt-2 text-xs font-bold uppercase">
                  {merchant.status}
                </p>
              </div>

              <button
                type="button"
                className="text-red-500"
                disabled={deleteMutation.isPending}
                onClick={() =>
                  deleteMutation.mutate({
                    id: merchant.id,
                    businessName: merchant.business_name,
                  })
                }
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="mt-4 flex gap-2 flex-wrap">
              <button
                type="button"
                className="rounded-full border px-3 py-1 text-sm"
                disabled={statusMutation.isPending}
                onClick={() =>
                  statusMutation.mutate({
                    id: merchant.id,
                    status: "approved",
                    businessName: merchant.business_name,
                  })
                }
              >
                Approve
              </button>

              <button
                type="button"
                className="rounded-full border px-3 py-1 text-sm"
                disabled={statusMutation.isPending}
                onClick={() =>
                  statusMutation.mutate({
                    id: merchant.id,
                    status: "suspended",
                    businessName: merchant.business_name,
                  })
                }
              >
                Suspend
              </button>

              <button
                type="button"
                className="rounded-full border px-3 py-1 text-sm"
                disabled={statusMutation.isPending}
                onClick={() =>
                  statusMutation.mutate({
                    id: merchant.id,
                    status: "pending_approval",
                    businessName: merchant.business_name,
                  })
                }
              >
                Pending
              </button>
            </div>
          </div>
        ))}
      </div>

      {statusMutation.isError && (
        <p className="text-sm text-red-600">
          Failed to update merchant status.
        </p>
      )}

      {deleteMutation.isError && (
        <p className="text-sm text-red-600">
          Failed to delete merchant.
        </p>
      )}
    </div>
  );
}
