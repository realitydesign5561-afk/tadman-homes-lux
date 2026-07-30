import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Check, Globe2, LayoutDashboard, MessagesSquare, Upload } from "lucide-react";
import { PageHeader, Section } from "@/components/page-shell";

export const Route = createFileRoute("/merchant")({
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
  { icon: LayoutDashboard, t: "Private dashboard", d: "Manage every listing, lead and invoice in one secure workspace." },
  { icon: Upload, t: "Unlimited uploads", d: "Publish listings with galleries, floorplans and video walkthroughs." },
  { icon: MessagesSquare, t: "Direct enquiries", d: "Buyers and tenants message you straight from your listing page." },
  { icon: BarChart3, t: "Performance analytics", d: "See views, saves and enquiry conversion for every property." },
  { icon: Globe2, t: "Worldwide reach", d: "Get in front of 120,000 monthly buyers across 40+ countries." },
  { icon: Check, t: "Verified badge", d: "Build trust instantly with an accredited merchant badge." },
];

function MerchantPage() {
  return (
    <>
      <PageHeader
        eyebrow="Merchants"
        title="Advertise your properties worldwide"
        subtitle="Agencies, developers, landlords and managers subscribe monthly and get their own private dashboard."
      >
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-ink-foreground"
          >
            Create merchant account
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
            ["Register", "Create your merchant account in under two minutes."],
            ["Subscribe", "Pick a monthly plan that matches your portfolio size."],
            ["Publish", "Upload listings from your private dashboard."],
            ["Convert", "Receive qualified enquiries and close deals faster."],
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