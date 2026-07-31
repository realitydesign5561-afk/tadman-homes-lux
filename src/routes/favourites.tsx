import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { PageHeader, Section } from "@/components/page-shell";
import { PropertyCard } from "@/components/property-card";
import { fetchFavoriteProperties } from "@/lib/favorites";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/favourites")({
  head: () => ({
    meta: [
      { title: "Saved Properties | Tadman Homes & Properties" },
      { name: "description", content: "Every property you have saved, in one place." },
      { property: "og:title", content: "Saved Properties | Tadman Homes" },
      { property: "og:description", content: "Review and compare the homes you saved." },
    ],
  }),
  component: FavouritesPage,
});

function FavouritesPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login", replace: true });
  }, [loading, user, navigate]);

  const { data, isLoading } = useQuery({
    queryKey: ["favourites", user?.id],
    queryFn: () => fetchFavoriteProperties(user!.id),
    enabled: Boolean(user?.id),
  });

  const properties = data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Your account"
        title="Saved properties"
        subtitle="Homes you have saved while browsing Tadman."
      />
      <Section>
        {isLoading || loading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading your saved homes…
          </p>
        ) : properties.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You have not saved any properties yet.{" "}
            <Link to="/properties" className="font-semibold text-primary">
              Browse listings
            </Link>
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard key={p.rowId} property={p} />
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
