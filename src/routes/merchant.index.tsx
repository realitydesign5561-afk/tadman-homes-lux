import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Check, Globe2, LayoutDashboard, MessagesSquare, Upload } from "lucide-react";
import { PageHeader, Section } from "@/components/page-shell";

export const Route = createFileRoute("/merchant/")({
  head: () => ({
    meta: [
      { title: "Become a Merchant | Tadman Homes & Properties" },
      {
        name: "description",
        content:
          "Subscribe monthly to advertise your properties on Tadman, with a private merchant dashboard, analytics and direct enquiries.",
      },
      { property: "og:title", content: "Become a Merchant | Tadman Homes" },
      {
        property: "og:description",
        content: "Advertise your properties to a worldwide audience with your own dashboard.",
      },
    ],
  }),
  component: MerchantPage,
});

const benefits = [
  {
    icon: LayoutDashboard,
    t: "Merchant Dashboard",
    d: "Manage your listings, enquiries, subscriptions and account from one secure dashboard.",
  },
  {
    icon: Upload,
    t: "Easy Property Upload",
    d: "Upload houses, apartments, land and commercial properties in minutes.",
  },
  {
    icon: MessagesSquare,
    t: "Direct Buyer Enquiries",
    d: "Receive enquiries directly from interested buyers and tenants.",
  },
  {
    icon: BarChart3,
    t: "Listing Analytics",
    d: "Track property views, enquiries and listing performance.",
  },
  {
    icon: Globe2,
    t: "Worldwide Exposure",
    d: "Reach buyers and investors from different cities and countries.",
  },
  {
    icon: Check,
    t: "Verified Merchant Badge",
    d: "Increase trust with a verified merchant profile on every listing.",
  },
];

function MerchantPage() {
  return (
    <>
      <PageHeader
        eyebrow="Merchants"
        title="Grow Your Real Estate Business with Tadman Homes & Properties"
        subtitle="Join our trusted merchant network to list properties, manage enquiries, reach qualified buyers and grow your business from one powerful dashboard."
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-ink-foreground"
          >
            Become a Merchant
          </Link>
          <Link
            to="/pricing"
            className="inline-flex h-12 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground"
          >
            View pricing
          </Link>
        </div>
      </PageHeader>

      <Section title="Everything in your subscription">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.t} className="surface-card rounded-2xl p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
                <b.icon className="size-5" />
              </span>
              <p className="mt-4 text-sm font-semibold text-foreground">{b.t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="How it works">
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            [
              "Create Account",
              "Register as a verified merchant on Tadman Homes & Properties.",
            ],
            [
              "Choose a Plan",
              "Select the subscription plan that best fits your business.",
            ],
            [
              "List Your Properties",
              "Publish and manage your property listings from your dashboard.",
            ],
            [
              "Receive Enquiries",
              "Connect directly with buyers, tenants and investors worldwide.",
            ],
            ].map(([t, d], i) => (
            <div key={t} className="surface-card rounded-2xl p-6">
              <p className="font-display text-3xl font-bold text-primary/30">0{i + 1}</p>
              <p className="mt-3 text-sm font-semibold text-foreground">{t}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
