import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { PageHeader, Section } from "@/components/page-shell";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Merchant Pricing | Tadman Homes & Properties" },
      {
        name: "description",
        content:
          "Simple monthly subscriptions for agents, agencies and developers. Advertise unlimited properties from a private dashboard.",
      },
      { property: "og:title", content: "Merchant Pricing | Tadman Homes" },
      { property: "og:description", content: "Monthly plans for agents, agencies and developers." },
    ],
  }),
  component: PricingPage,
});

const plans = [
  {
    name: "Starter",
    price: "$29",
    tagline: "For individual landlords",
    features: ["Up to 5 active listings", "Private dashboard", "Email enquiries", "Basic analytics"],
  },
  {
    name: "Professional",
    price: "$89",
    tagline: "For agents and small agencies",
    features: [
      "Up to 50 active listings",
      "Featured placement (5/mo)",
      "Verified merchant badge",
      "Lead inbox & analytics",
      "Team members (3)",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$249",
    tagline: "For agencies and developers",
    features: [
      "Unlimited listings",
      "Priority homepage placement",
      "Dedicated account manager",
      "API & bulk import",
      "Unlimited team members",
    ],
  },
];

function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Simple monthly plans"
        subtitle="Cancel any time. Every plan includes your own private merchant dashboard."
      />
      <Section>
        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.highlight
                  ? "rounded-[1.75rem] bg-ink p-8 text-ink-foreground shadow-lift"
                  : "surface-card rounded-[1.75rem] p-8"
              }
            >
              <p
                className={
                  plan.highlight
                    ? "text-xs font-semibold uppercase tracking-widest text-ink-foreground/60"
                    : "text-xs font-semibold uppercase tracking-widest text-primary"
                }
              >
                {plan.name}
              </p>
              <p className="mt-4 font-display text-4xl font-bold">
                {plan.price}
                <span
                  className={
                    plan.highlight
                      ? "text-sm font-medium text-ink-foreground/60"
                      : "text-sm font-medium text-muted-foreground"
                  }
                >
                  /month
                </span>
              </p>
              <p
                className={
                  plan.highlight
                    ? "mt-2 text-sm text-ink-foreground/70"
                    : "mt-2 text-sm text-muted-foreground"
                }
              >
                {plan.tagline}
              </p>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      className={plan.highlight ? "mt-0.5 size-4" : "mt-0.5 size-4 text-primary"}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className={
                  plan.highlight
                    ? "mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-ink-foreground text-sm font-semibold text-ink"
                    : "mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground transition-colors hover:bg-ink hover:text-ink-foreground"
                }
              >
                Choose {plan.name}
              </Link>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Frequently asked questions">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["Can I cancel any time?", "Yes. Subscriptions are monthly and can be cancelled from your dashboard."],
            ["Do buyers pay anything?", "No. Browsing, searching, saving favourites and contacting agents is free."],
            ["Can I upgrade later?", "Absolutely — change plan at any time and we prorate the difference."],
            ["Is my listing verified?", "Our team reviews every listing before it appears publicly."],
          ].map(([q, a]) => (
            <div key={q} className="surface-card rounded-2xl p-6">
              <p className="text-sm font-semibold text-foreground">{q}</p>
              <p className="mt-2 text-sm text-muted-foreground">{a}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}