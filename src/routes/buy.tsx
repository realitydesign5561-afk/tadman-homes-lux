import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";
import { SearchPanel } from "@/components/search-panel";
import { PropertyGrid } from "@/components/property-grid";

export const Route = createFileRoute("/buy")({
  head: () => ({
    meta: [
      { title: "Buy a Property | Tadman Homes & Properties" },
      {
        name: "description",
        content:
          "Homes, villas, penthouses and land for sale worldwide. Search verified listings and buy with confidence.",
      },
      { property: "og:title", content: "Buy a Property | Tadman Homes" },
      { property: "og:description", content: "Premium properties for sale worldwide." },
    ],
  }),
  component: BuyPage,
});

const steps = [
  { n: "01", t: "Search & shortlist", d: "Filter by budget, location and property type, then save favourites." },
  { n: "02", t: "Book a viewing", d: "Meet an accredited agent in person or take a live video tour." },
  { n: "03", t: "Make an offer", d: "Negotiate with guidance from your agent and secure the property." },
  { n: "04", t: "Complete & move in", d: "We coordinate legal checks, paperwork and handover of keys." },
];

function BuyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Buy"
        title="Buy your next property with confidence"
        subtitle="Every listing verified, every agent accredited. From first homes to trophy estates."
      />
      <Section>
        <SearchPanel />
      </Section>
      <Section title="Properties for sale">
        <PropertyGrid
          queryKey="buy"
          options={{ listingType: "buy" }}
          emptyMessage="No properties for sale are published yet. Please check back soon."
        />
      </Section>
      <Section title="How buying works">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="surface-card rounded-2xl p-6">
              <p className="font-display text-3xl font-bold text-primary/30">{s.n}</p>
              <p className="mt-3 text-sm font-semibold text-foreground">{s.t}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}