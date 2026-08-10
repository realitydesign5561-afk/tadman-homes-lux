import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2 } from "lucide-react";
import { PageHeader, Section } from "@/components/page-shell";
import { fetchFaqs, fetchPlans } from "@/lib/content";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Merchant Pricing | Tadman Homes & Properties" },
      {
        name: "description",
        content:
         "Affordable merchant subscription plans for property owners, agencies and developers to advertise properties on Tadman Homes & Properties.",
      },
      { property: "og:title", content: "Merchant Pricing | Tadman Homes" },
      { property: "og:description", content: "Monthly plans for agents, agencies and developers." },
    ],
  }),
  component: PricingPage,
});

function formatAmount(price: number, currency: string) {
  if (currency === "NGN") return `#${price.toLocaleString()}`;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString()}`;
  }
}

function PricingPage() {
  const { data: plans, isLoading, error } = useQuery({ queryKey: ["plans"], queryFn: fetchPlans });
  const { data: faqs } = useQuery({ queryKey: ["faq", "pricing"], queryFn: () => fetchFaqs() });

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Merchant Subscription Plans"
        subtitle="Choose a subscription plan to list your properties, manage enquiries and grow your real estate business."
      />
      <Section>
        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading subscription plans...
          </p>
        ) : error ? (
          <p className="text-sm text-destructive">Unable to load subscription plans. Please try again.</p>
        ) : (plans ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">Merchant subscription plans will be available soon.</p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-3">
            {(plans ?? []).map((plan, index) => {
              const highlight = index === 1;
              return (
                <div
                  key={plan.id}
                  className={
                    highlight
                      ? "rounded-[1.75rem] bg-ink p-8 text-ink-foreground shadow-lift"
                      : "surface-card rounded-[1.75rem] p-8"
                  }
                >
                  <p
                    className={
                      highlight
                        ? "text-xs font-semibold uppercase tracking-widest text-ink-foreground/60"
                        : "text-xs font-semibold uppercase tracking-widest text-primary"
                    }
                  >
                    {plan.name}
                  </p>
                  <p className="mt-4 font-display text-4xl font-bold">
                    {formatAmount(plan.price, plan.currency)}
                    <span
                      className={
                        highlight
                          ? "text-sm font-medium text-ink-foreground/60"
                          : "text-sm font-medium text-muted-foreground"
                      }
                    >
                      /{plan.interval}
                    </span>
                  </p>
                  <p
                    className={
                      highlight
                        ? "mt-2 text-sm text-ink-foreground/70"
                        : "mt-2 text-sm text-muted-foreground"
                    }
                  >
                    {plan.listing_limit == null
                      ? "Unlimited Property Listings"
                      : `Up to ${plan.listing_limit} Property Listings`}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {(plan.features ?? []).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className={highlight ? "mt-0.5 size-4" : "mt-0.5 size-4 text-primary"} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    className={
                      highlight
                        ? "mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-ink-foreground text-sm font-semibold text-ink"
                        : "mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground transition-colors hover:bg-ink hover:text-ink-foreground"
                    }
                  >
                    Subscribe Now
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {(faqs ?? []).length > 0 && (
        <Section title="Frequently Asked Questions">
          <div className="grid gap-4 sm:grid-cols-2">
            {(faqs ?? []).map((item) => (
              <div key={item.id} className="surface-card rounded-2xl p-6">
                <p className="text-sm font-semibold text-foreground">{item.question}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
