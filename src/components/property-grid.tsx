import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { fetchProperties } from "@/lib/properties";

type Options = Parameters<typeof fetchProperties>[0];

export function PropertyGrid({
  options = {},
  queryKey,
  emptyMessage = "No listings are published yet. Please check back soon.",
  showCount = false,
}: {
  options?: Options;
  queryKey: string;
  emptyMessage?: string;
  showCount?: boolean;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["properties", queryKey, options],
    queryFn: () => fetchProperties(options),
  });

  if (isLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> Loading properties…
      </p>
    );
  }
  if (error) {
    return <p className="text-sm text-muted-foreground">Properties not available right now. Please check back soon.</p>;
  }
  const properties = data ?? [];
  if (properties.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>;
  }

  return (
    <>
      {showCount && (
        <p className="mb-4 text-sm text-muted-foreground">
          Showing {properties.length} listing{properties.length === 1 ? "" : "s"}
        </p>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p.rowId} property={p} />
        ))}
      </div>
    </>
  );
}
