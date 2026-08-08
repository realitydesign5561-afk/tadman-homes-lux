import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ActivityLog = {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export default function ActivityTab() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLogs() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("activity_log")
      .select(
        "id,user_id,action,entity_type,entity_id,metadata,created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Failed to load activity logs:", error);
      setError("Unable to load activity logs.");
      setLogs([]);
    } else {
      setLogs(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadLogs();
  }, []);

  function formatDate(value: string) {
    return new Date(value).toLocaleString();
  }

  function formatAction(action: string) {
    return action
      .replace(/[_-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  if (loading) {
    return (
      <div className="rounded-xl border p-6">
        <p>Loading activity...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor important actions performed across the admin system.
          </p>
        </div>

        <button
          type="button"
          onClick={loadLogs}
          className="rounded-lg border px-4 py-2 text-sm font-semibold"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!error && logs.length === 0 && (
        <div className="rounded-xl border p-8 text-center">
          <h3 className="font-semibold">No activity yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Activity will appear here as admin actions are recorded.
          </p>
        </div>
      )}

      {logs.length > 0 && (
        <div className="overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="border-b bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">
                  Action
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Entity
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Entity ID
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  User ID
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b last:border-b-0"
                >
                  <td className="px-4 py-3 font-medium">
                    {formatAction(log.action)}
                  </td>

                  <td className="px-4 py-3">
                    {log.entity_type || "—"}
                  </td>

                  <td className="px-4 py-3 font-mono text-xs">
                    {log.entity_id || "—"}
                  </td>

                  <td className="px-4 py-3 font-mono text-xs">
                    {log.user_id || "—"}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {formatDate(log.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
