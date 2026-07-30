import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";
import { SearchPanel } from "@/components/search-panel";
import { PropertyCard } from "@/components/property-card";
import { properties } from "@/data/properties";

export const Route = createFileRoute("/properties/")({
  head: () => ({
    meta: [
      { title: "Properties for Sale & Rent | Tadman Homes" },
      {
        name: "description",
        content:
          "Browse verified apartments, houses, villas, penthouses, duplexes, land and commercial property worldwide.",
      },
      { property: "og:title", content: "Browse Properties | Tadman Homes" },
      {
        property: "og:description",
        content: "Search premium properties for sale and rent across 40+ countries.",
      },
    ],
  }),
  component: PropertiesPage,
});

function PropertiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="All Properties"
        subtitle="Filter by country, city, price, bedrooms, type and status to find the right home."
      />
      <Section>
        <SearchPanel />
        <p className="mt-8 text-sm text-muted-foreground">
          Showing {properties.length} of 18,420 listings
        </p>
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </Section>
    </>
  );
}