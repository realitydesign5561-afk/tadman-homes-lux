import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";
import { SearchPanel, minFrom, priceRange, type PropertySearch } from "@/components/search-panel";
import { PropertyGrid } from "@/components/property-grid";

export const Route = createFileRoute("/properties/")({
  validateSearch: (search: Record<string, unknown>): PropertySearch => ({
    country: (search.country as string) || undefined,
    state: (search.state as string) || undefined,
    city: (search.city as string) || undefined,
    area: (search.area as string) || undefined,
    keyword: (search.keyword as string) || undefined,
    price: (search.price as string) || undefined,
    beds: (search.beds as string) || undefined,
    baths: (search.baths as string) || undefined,
    type: (search.type as string) || undefined,
    status: (search.status as string) || undefined,
  }),
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
  const search = Route.useSearch();

  const options = {
    country: search.country,
    state: search.state,
    city: search.city,
    area: search.area,
    keyword: search.keyword,
    propertyType: search.type,
    minBeds: minFrom(search.beds),
    minBaths: minFrom(search.baths),
    ...priceRange(search.price),
    ...(search.status === "For Rent"
      ? { rent: true as const }
      : search.status === "For Sale"
        ? { listingType: "buy" as const }
        : {}),
  };

  return (
    <>
      <PageHeader
        eyebrow="Marketplace"
        title="Browse Verified Properties"
        subtitle="Explore verified houses, apartments, land and commercial properties from trusted merchants worldwide."
      />
      <Section>
        <SearchPanel initial={search} />
        <div className="mt-8">
          <PropertyGrid
            options={options}
            queryKey={JSON.stringify(options)}
            showCount
            emptyMessage="No listings match your search. Try widening your filters."
          />
        </div>
      </Section>
    </>
  );
}
