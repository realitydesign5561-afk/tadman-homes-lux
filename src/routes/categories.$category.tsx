import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageHeader, Section } from "@/components/page-shell";
import { PropertyGrid } from "@/components/property-grid";
import { slugToLabel } from "@/lib/properties";

export const Route = createFileRoute("/categories/$category")({
  head: ({ params }) => ({
    meta: [
      { title: `${slugToLabel(params.category)} Properties | Tadman Homes` },
      {
        name: "description",
        content: `Browse verified ${slugToLabel(params.category).toLowerCase()} properties for sale and rent on Tadman Homes.`,
      },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useParams();
  const label = slugToLabel(category);

  return (
    <>
      <PageHeader
        eyebrow="Category"
        title={`${label} Properties`}
        subtitle={`Explore verified ${label.toLowerCase()} listings from trusted merchants worldwide.`}
      />
      <Section
        action={
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            All properties <ArrowUpRight className="size-4" />
          </Link>
        }
      >
        <PropertyGrid
          options={{ propertyType: label }}
          queryKey={`category-${category}`}
          showCount
          emptyMessage={`No ${label.toLowerCase()} properties are published yet. Please check back soon.`}
        />
      </Section>
    </>
  );
}
