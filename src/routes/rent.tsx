import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";
import { SearchPanel } from "@/components/search-panel";
import { PropertyCard } from "@/components/property-card";
import { properties } from "@/data/properties";

export const Route = createFileRoute("/rent")({
  head: () => ({
    meta: [
      { title: "Rent a Property | Tadman Homes & Properties" },
      {
        name: "description",
        content:
          "Long and short term rentals worldwide — apartments, villas, penthouses and commercial space from trusted landlords.",
      },
      { property: "og:title", content: "Rent a Property | Tadman Homes" },
      { property: "og:description", content: "Premium rentals worldwide, verified and ready to move in." },
    ],
  }),
  component: RentPage,
});

function RentPage() {
  const forRent = properties.filter((p) => p.status === "For Rent");
  return (
    <>
      <PageHeader
        eyebrow="Rent"
        title="Rentals you'll actually want to live in"
        subtitle="Long term and short term homes from verified landlords and managed agencies."
      />
      <Section>
        <SearchPanel />
      </Section>
      <Section title="Available rentals">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {forRent.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </Section>
      <Section title="What's included">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Deposit protection", "Funds held securely until both parties confirm handover."],
            ["Verified landlords", "Identity and ownership checks completed before listing."],
            ["Digital contracts", "Sign your tenancy agreement online, wherever you are."],
          ].map(([t, d]) => (
            <div key={t} className="surface-card rounded-2xl p-6">
              <p className="text-sm font-semibold text-foreground">{t}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}