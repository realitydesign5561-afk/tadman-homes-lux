import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

const card =
  "surface-card rounded-2xl p-5";

const chip =
  "rounded-full border border-border px-3 py-1.5 text-xs font-semibold";

const chipDark =
  "rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-ink-foreground";

export default function ManagementTab() {
  const qc = useQueryClient();

  const requests = useQuery({
    queryKey: ["admin-management"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("property_management_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => {
      const { error } = await supabase
        .from("property_management_requests")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-management"],
      });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("property_management_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },

    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["admin-management"],
      });
    },
  });

  if (requests.isLoading) {
    return (
      <p className="text-sm text-muted-foreground">
        Loading management requests...
      </p>
    );
  }

  if (requests.isError) {
    return (
      <p className="text-sm text-destructive">
        Could not load management requests.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Property Management Requests
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage property owners requesting management services.
        </p>
      </div>

      {requests.data.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No management requests yet.
        </p>
      ) : (
        <div className="space-y-4">
          {requests.data.map((request: any) => (
            <div key={request.id} className={card}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-foreground">
                    {request.full_name}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {request.email || "No email"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {request.phone || "No phone"}
                  </p>
                </div>

                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold capitalize">
                  {request.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                {request.property_address && (
                  <p className="text-sm">
                    <strong>Address:</strong>{" "}
                    {request.property_address}
                  </p>
                )}

                {request.property_type && (
                  <p className="text-sm">
                    <strong>Property type:</strong>{" "}
                    {request.property_type}
                  </p>
                )}

                {request.service && (
                  <p className="text-sm">
                    <strong>Service:</strong>{" "}
                    {request.service}
                  </p>
                )}

                {request.message && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    {request.message}
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className={chip}
                  onClick={() =>
                    updateStatus.mutate({
                      id: request.id,
                      status: "in_progress",
                    })
                  }
                >
                  In progress
                </button>

                <button
                  type="button"
                  className={chipDark}
                  onClick={() =>
                    updateStatus.mutate({
                      id: request.id,
                      status: "completed",
                    })
                  }
                >
                  Completed
                </button>

                {request.email && (
                  <a
                    href={`mailto:${request.email}`}
                    className={chip}
                  >
                    Email
                  </a>
                )}

                {request.phone && (
                  <a
                    href={`https://wa.me/${request.phone.replace(
                      /^0/,
                      "234"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={chip}
                  >
                    WhatsApp
                  </a>
                )}

                <button
                  type="button"
                  className={chip + " text-destructive"}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Delete this management request?"
                      )
                    ) {
                      remove.mutate(request.id);
                    }
                  }}
                >
                  Delete
                </button>
              </div>

              <p className="mt-3 text-xs text-muted-foreground">
                Submitted{" "}
                {new Date(request.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
