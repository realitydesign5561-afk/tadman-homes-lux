import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section, Field, PrimaryButton } from "@/components/page-shell";
import { propertyTypes } from "@/data/properties";

export const Route = createFileRoute("/sell")({
  head: () => ({
    meta: [
      { title: "Sell Your Property | Tadman Homes & Properties" },
      {
        name: "description",
        content:
          "List your property with Tadman and reach qualified buyers worldwide. Free valuation and expert agent support.",
      },
      { property: "og:title", content: "Sell Your Property | Tadman Homes" },
      { property: "og:description", content: "Reach qualified buyers worldwide. Free valuation." },
    ],
  }),
  component: SellPage,
});

function SellPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sell"
        title="Sell faster, for the right price"
        subtitle="Request a free valuation and we'll match your property with buyers already searching."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            {[
              ["Free valuation in 24 hours", "A local specialist reviews comparable sales and sends a realistic range."],
              ["Professional marketing", "Photography, floorplans and a premium listing page included."],
              ["Global exposure", "Your listing is promoted to buyers in 40+ countries."],
              ["One dedicated agent", "A single point of contact from listing to completion."],
            ].map(([t, d]) => (
              <div key={t} className="surface-card rounded-2xl p-6">
                <p className="text-sm font-semibold text-foreground">{t}</p>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="surface-card h-fit space-y-4 rounded-[1.75rem] p-7"
          >
            <h2 className="text-xl font-semibold text-foreground">Request a free valuation</h2>
            <Field label="Full name" placeholder="Jane Doe" />
            <Field label="Email" type="email" placeholder="jane@email.com" />
            <Field label="Phone" placeholder="+1 555 000 0000" />
            <Field label="Property address" placeholder="Street, city, country" />
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Property type
              </span>
              <select className="h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm outline-none focus:border-primary">
                {propertyTypes.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <PrimaryButton type="submit">Get my valuation</PrimaryButton>
          </form>
        </div>
      </Section>
    </>
  );
}