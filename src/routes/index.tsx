import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BadgeCheck, Search, Building2, Hop as Home, Landmark, LayoutGrid, Mail, MapPin, Quote, ShieldCheck, Sparkles, Star, Trees, Warehouse } from "lucide-react";
import { Section } from "@/components/page-shell";
import { SearchReveal } from "@/components/search-reveal";
import { useSettings } from "@/hooks/use-settings";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PropertyGrid } from "@/components/property-grid";
import { fetchLocations, fetchPosts, fetchTestimonials, subscribeNewsletter } from "@/lib/content";
// Stock hero image (Pexels) — real photo
const heroVilla = "https://images.pexels.com/photos/28054849/pexels-photo-28054849.jpeg?auto=compress&cs=tinysrgb&w=1400&h=1000";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tadman Homes And Properties" },
      {
        name: "description",
        content:
          "Buy, sell and rent verified properties worldwide with Tadman Homes & Properties. Explore houses, apartments, land, commercial properties and luxury homes.",
      },
      { property: "og:title", content: "Tadman Homes & Properties | Buy, Sell & Rent Properties Worldwide" },
      {
        property: "og:description",
        content: "Tadman Homes & Properties is a premium Real Estate Marketplace SaaS for buying, selling, and renting properties globally.",
      },
    ],
  }),
  component: Index,
});

const categories = [
  { label: "Apartment", icon: Building2, slug: "apartment" },
  { label: "House", icon: Home, slug: "house" },
  { label: "Villa", icon: Sparkles, slug: "villa" },
  { label: "Penthouse", icon: LayoutGrid, slug: "penthouse" },
  { label: "Duplex", icon: Landmark, slug: "duplex" },
  { label: "Land", icon: Trees, slug: "land" },
  { label: "Commercial", icon: Warehouse, slug: "commercial" },
];
const reasons = [
  {
    title: "Verified Properties",
    body: "Every listing is verified before publication.",
    icon: ShieldCheck,
  },
  {
    title: "Global Marketplace",
    body: "Buy, sell and rent properties across multiple countries.",
    icon: MapPin,
  },
  {
    title: "Secure Transactions",
    body: "Built with trust, transparency and reliability.",
    icon: BadgeCheck,
  },
];

function Index() {
  const settings = useSettings();
  const [searchOpen, setSearchOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setNewsletterState("busy");
    try {
      await subscribeNewsletter(newsletterEmail);
      setNewsletterEmail("");
      setNewsletterState("done");
    } catch {
      setNewsletterState("error");
    }
  }

  const locationsQuery = useQuery({ queryKey: ["locations"], queryFn: fetchLocations });
  const testimonialsQuery = useQuery({ queryKey: ["testimonials"], queryFn: fetchTestimonials });
  const postsQuery = useQuery({ queryKey: ["home-posts"], queryFn: fetchPosts });
  const locations = locationsQuery.data ?? [];
  const testimonials = testimonialsQuery.data ?? [];
  const posts = (postsQuery.data ?? []).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="px-3 pt-6 sm:px-5 sm:pt-8">
        <div className="mx-auto grid max-w-[1240px] gap-5 lg:grid-cols-[1fr_1.15fr]">
          <div className="fade-up flex flex-col justify-between gap-6">
            <div>
              <h1 className="text-[2rem] font-bold leading-[1.05] text-foreground sm:text-5xl xl:text-[3.4rem]">
                Buy, Sell & Rent Properties Across the World With{" "}
                <span className="text-gradient-brand">Confidence</span>
              </h1>
              <p className="mt-5 max-w-md text-sm text-muted-foreground sm:text-base">Discover verified houses, apartments, land and commercial properties from trusted property owners, agencies and verified merchants.</p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setSearchOpen((v) => !v)}
                  aria-expanded={searchOpen}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-7 text-sm font-semibold text-ink-foreground transition-opacity hover:opacity-90"
                >
                  <Search className="size-4" />
                  {settings.hero.cta_label}
                </button>
                <Link
                  to="/merchant"
                  className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  {settings.hero.cta_secondary_label} <ArrowUpRight className="size-4" />
                </Link>
              </div>
            </div>

            <div className="surface-card flex items-center gap-4 rounded-[1.6rem] p-3">
              <div className="min-w-0">
                <p className="truncate rounded-full bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
                  tadmanhomes@gmail.com
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-xs font-bold text-primary-foreground">
                    TH
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Tadman Homes And Properties</p>
                    <p className="text-xs text-muted-foreground">Buy • Sell • Rent Worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="fade-up space-y-3">
            <div className="relative overflow-hidden rounded-[1.75rem]">
              <img
                src={heroVilla}
                alt="Modern luxury villa with infinity pool"
                width={1400}
                height={1000}
                className="h-[240px] w-full object-cover sm:h-[340px]"
              />
              <div className="glass-panel absolute right-4 top-4 flex items-center gap-2 rounded-full px-3 py-1.5">
                <Star className="size-3.5 fill-primary text-primary" />
                <span className="text-xs font-semibold text-foreground">Verified</span>
                <span className="text-xs text-muted-foreground">Trusted Properties</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="h-24 w-full rounded-2xl bg-secondary/10 sm:h-32" />
              <div className="h-24 w-full rounded-2xl bg-secondary/10 sm:h-32" />
              <div className="h-24 w-full rounded-2xl bg-secondary/10 sm:h-32" />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1240px]">
          <SearchReveal open={searchOpen} onClose={() => setSearchOpen(false)} />
        </div>
      </section>

      {/* Discover / trust band */}
      <Section>
        <div className="grid gap-5 rounded-[2rem] bg-secondary/70 p-6 sm:p-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-4xl">
             Discover Verified Properties For Sale & Rent
            </h2>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {[
                "Verified Listings",
                "Trusted Merchants",
                "Premium Properties",
                "Nationwide Coverage",
               ].map((t) => (
  <span key={t} className="flex items-center gap-1.5">
    <span className="size-1.5 rounded-full bg-primary" />
    {t}
  </span>
))}
</div>
<div className="mt-6 grid gap-3 sm:grid-cols-3">
  {reasons.map((r) => (
    <div key={r.title} className="surface-card rounded-2xl p-4">
      <r.icon className="size-5 text-primary" />
      <p className="mt-3 text-sm font-semibold text-foreground">{r.title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
        {r.body}
      </p>
    </div>
  ))}
</div>
</div>

<div className="relative overflow-hidden rounded-[1.75rem]">
            <img
              src={heroVilla}
              alt="Tadman Luxury Residence"
              loading="lazy"
              width={1400}
              height={1000}
              className="h-full min-h-[260px] w-full object-cover"
            />
            <div className="glass-panel absolute inset-x-4 bottom-4 rounded-2xl p-4">
              <p className="text-sm font-semibold text-foreground">Tadman Luxury Residence</p>
              <p className="mt-1 text-xs text-muted-foreground">Premium homes · Verified listings · Global properties</p>

            <div className="mt-3 flex items-center justify-between">
            <p className="font-display text-lg font-bold text-foreground">Browse Available Listings</p>
                <Link
                  to="/properties"
                  className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-ink-foreground"
                >
                  Show more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Featured properties */}
      <Section
        title="Featured Properties"
        subtitle="Browse hand-picked verified properties from trusted merchants."
        action={
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            View all <ArrowUpRight className="size-4" />
          </Link>
        }
      >
        <PropertyGrid
          queryKey="featured"
          options={{ featured: true, limit: 6 }}
          emptyMessage="Featured listings will appear here once published."
        />
      </Section>

      {/* Categories */}
      <Section title="Property Categories" subtitle="Explore different property categories available on Tadman Homes And Properties.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {categories.map((c) => (
            <Link
              key={c.label}
              to="/properties"
              search={{ type: c.slug }}
              className="surface-card flex flex-col items-center gap-2 rounded-2xl p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
                <c.icon className="size-5" />
              </span>
              <p className="text-sm font-semibold text-foreground">{c.label}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* Latest listings */}
      <Section
        title="Latest Listings"
        subtitle="Recently published verified properties from our trusted merchants."
        action={
          <Link
            to="/properties"
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            All listings <ArrowUpRight className="size-4" />
          </Link>
        }
      >
        <PropertyGrid
          queryKey="latest"
          options={{ limit: 6 }}
          emptyMessage="New listings will appear here once published."
        />
      </Section>

      {/* Become a merchant */}
      <Section>
        <div className="grid items-center gap-8 rounded-[2rem] bg-ink px-6 py-12 text-ink-foreground sm:px-12 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-foreground/60">
              Become a Merchant
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-4xl">
              List Your Properties On Tadman Homes And Properties
            </h2>
            <p className="mt-4 max-w-md text-sm text-ink-foreground/70">
              Create a merchant account, subscribe to a plan, publish your property listings, manage enquiries and reach thousands of buyers and tenants from one professional dashboard.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/merchant"
                className="inline-flex h-12 items-center rounded-full bg-ink-foreground px-6 text-sm font-semibold text-ink"
              >
                Start selling
              </Link>
              <Link
                to="/pricing"
                className="inline-flex h-12 items-center rounded-full border border-ink-foreground/25 px-6 text-sm font-semibold text-ink-foreground"
              >
                See pricing
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Unlimited", "Property Listings"],
              ["Monthly", "Flexible Subscription"],
              ["Global", "Property Marketplace"],
              ["24/7", "Dashboard Access"],
             ].map(([n, l]) => (
  <div key={l} className="rounded-2xl border border-ink-foreground/12 p-5">
    <p className="font-display text-3xl font-bold">{n}</p>
    <p className="mt-1 text-xs text-ink-foreground/60">{l}</p>
  </div>
))}
    </div>
          
         </div>
       </Section>
    </>
  );
}
