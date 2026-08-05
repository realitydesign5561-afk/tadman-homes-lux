import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BadgeCheck,
  Search,
  Building2,
  Home,
  Landmark,
  LayoutGrid,
  Mail,
  MapPin,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Trees,
  Warehouse,
} from "lucide-react";
import { Section } from "@/components/page-shell";
import { SearchReveal } from "@/components/search-reveal";
import { useSettings } from "@/hooks/use-settings";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PropertyGrid } from "@/components/property-grid";
import { fetchLocations, fetchPosts, fetchTestimonials, subscribeNewsletter } from "@/lib/content";
import { propertyImages } from "@/data/properties";
import heroVilla from "@/assets/hero-villa.jpg";
import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";
import ctaBeach from "@/assets/cta-beach.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tadman Homes And Properties" },
      {
        name: "description",
        content:
          "Tadman Homes & Properties is a premium Real Estate Marketplace SaaS for buying, selling, and renting properties globally.",
      },
      { property: "og:title", content: "Tadman Homes And Properties" },
      {
        property: "og:description",
        content: "Tadman Homes & Properties is a premium Real Estate Marketplace SaaS for buying, selling, and renting properties globally.",
      },
    ],
  }),
  component: Index,
});

const categories = [
  { label: "Apartment", icon: Building2, count: 1240 },
  { label: "House", icon: Home, count: 986 },
  { label: "Villa", icon: Sparkles, count: 412 },
  { label: "Penthouse", icon: LayoutGrid, count: 168 },
  { label: "Duplex", icon: Landmark, count: 233 },
  { label: "Land", icon: Trees, count: 519 },
  { label: "Commercial", icon: Warehouse, count: 307 },
];

const reasons = [
  {
    title: "Verified listings only",
    body: "Every property is checked by our team before it goes live, so what you see is what exists.",
    icon: ShieldCheck,
  },
  {
    title: "Worldwide coverage",
    body: "Listings across 40+ countries, from city apartments to beachfront estates and land parcels.",
    icon: MapPin,
  },
  {
    title: "Trusted agents",
    body: "Work with accredited agents and agencies rated by real buyers, sellers and tenants.",
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
                Find Your Perfect Property with{" "}
                <span className="text-gradient-brand">Confidence</span>
              </h1>
              <p className="mt-5 max-w-md text-sm text-muted-foreground sm:text-base">
                {settings.hero.subtitle}
              </p>
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
              <img
                src={prop1}
                alt="Featured listing preview"
                loading="lazy"
                width={900}
                height={700}
                className="hidden h-24 w-32 rounded-2xl object-cover sm:block"
              />
              <div className="min-w-0">
                <p className="truncate rounded-full bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
                  {settings.contact.email}
                </p>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-xs font-bold text-primary-foreground">
                    TH
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground"> Tadman Homes & Properties | Buy, Sell & Rent Properties Worldwide</p>
                    <p className="text-xs text-muted-foreground">Buy, sell and rent verified properties worldwide with Tadman Homes & Properties. Explore houses, apartments, land, commercial properties and luxury homes.</p>
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
              {[prop1, prop2, prop3].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="Property gallery preview"
                  loading="lazy"
                  width={900}
                  height={700}
                  className="h-24 w-full rounded-2xl object-cover sm:h-32"
                />
              ))}
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
              Buy, Sell & Rent Premium Properties Worldwide
            </h2>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              [
                "Verified Listings",
                "Trusted Agents",
                "Global Properties",
                "Secure Transactions",
               ] => (
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
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{r.body}</p>
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
            <p className="font-display text-lg font-bold text-foreground">Contact for price</p>
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
        title="Discover Best Properties Tailored to You"
        subtitle="Hand-selected listings from verified agents and developers this month."
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

      {/* Featured locations */}
      <Section title="Featured Locations" subtitle="Explore the cities our clients love most.">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc, i) => (
            <Link
              key={loc.city}
              to="/properties"
              className="group relative overflow-hidden rounded-[1.6rem]"
            >
              <img
                src={[heroVilla, prop2, prop3][i % 3]}
                alt={`Properties in ${loc.city}`}
                loading="lazy"
                width={900}
                height={700}
                className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="glass-panel absolute inset-x-3 bottom-3 flex items-center justify-between rounded-2xl px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{loc.city}</p>
                  <p className="text-xs text-muted-foreground">{loc.country}</p>
                </div>
                <span className="text-xs font-semibold text-primary">{loc.count} listings</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Categories */}
      <Section title="Property Categories" subtitle="Browse by the type of space you need.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {categories.map((c) => (
            <Link
              key={c.label}
              to="/properties"
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
        subtitle="Fresh on the market, updated daily."
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

      {/* Testimonials */}
      <Section title="What Our Clients Say About Us" subtitle="Trusted by thousands of happy homeowners and sellers.">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
          <div className="surface-card flex flex-col justify-center rounded-[1.75rem] p-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Facts &amp; Numbers
            </p>
            <p className="mt-4 font-display text-6xl font-bold text-foreground">94%</p>
            <p className="mt-3 text-sm text-muted-foreground">
              of clients would recommend Tadman Homes &amp; Properties to their friends and family.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[1.75rem]">
            <img
              src={prop3}
              alt="Happy client in their new home"
              loading="lazy"
              width={900}
              height={700}
              className="h-full min-h-[240px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 text-ink-foreground">
              <Quote className="size-6 opacity-70" />
              <p className="mt-2 max-w-md text-lg font-medium">
                “Finding the right property was simple and transparent from start to finish”
              </p>
              <p className="mt-2 text-xs opacity-70">— Happy Client</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="surface-card rounded-2xl p-6">
              <p className="text-sm leading-relaxed text-foreground">{t.content}</p>
              <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
                <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-xs font-bold text-primary">
                  {t.author_name.slice(0, 1)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.author_name}</p>
                  <p className="text-xs text-muted-foreground">{t.author_role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Become a merchant */}
      <Section>
        <div className="grid items-center gap-8 rounded-[2rem] bg-ink px-6 py-12 text-ink-foreground sm:px-12 lg:grid-cols-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-foreground/60">
              Become a Merchant
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-4xl">
              Advertise your properties to a worldwide audience
            </h2>
            <p className="mt-4 max-w-md text-sm text-ink-foreground/70">
              Subscribe monthly, get your own private dashboard, publish unlimited listings and
              receive qualified enquiries directly from buyers and tenants.
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
              Verified Listings
              Professional Agents
              Global Reach
              24/7 Support,
             ].map(([n, l]) => (
              <div key={l} className="rounded-2xl border border-ink-foreground/12 p-5">
                <p className="font-display text-3xl font-bold">{n}</p>
                <p className="mt-1 text-xs text-ink-foreground/60">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Blog */}
      <Section
        title="From the Journal"
        subtitle="Market insight, buying guides and selling strategy."
        action={
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 self-start rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            All articles <ArrowUpRight className="size-4" />
          </Link>
        }
      >
        <div className="grid gap-5 sm:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="surface-card overflow-hidden rounded-[1.6rem]">
              <img
                src={post.cover_image || propertyImages.prop2}
                alt={post.title}
                loading="lazy"
                width={900}
                height={700}
                className="h-44 w-full object-cover"
              />
              <div className="p-5">
                {post.published_at && (
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {new Date(post.published_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
                <h3 className="mt-2 text-base font-semibold text-foreground">{post.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* Newsletter CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-[2rem]">
          <img
            src={ctaBeach}
            alt="Beachfront villa with palm trees"
            loading="lazy"
            width={1600}
            height={800}
            className="h-[380px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-ink/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-ink-foreground">
            <h2 className="max-w-2xl text-2xl font-bold sm:text-4xl">Stay Updated with the Latest Properties</h2>

            <p className="mt-3 max-w-lg text-sm text-ink-foreground/80">Receive verified listings, price updates and investment opportunities.</p>
            <form
              onSubmit={handleSubscribe}
              className="glass-panel mt-7 flex w-full max-w-md items-center gap-2 rounded-full p-1.5"
            >
              <span className="pl-3 text-muted-foreground">
                <Mail className="size-4" />
              </span>
              <input
                type="email"
                required
                placeholder="Enter your email"
                aria-label="Email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="h-10 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={newsletterState === "busy"}
                className="h-10 rounded-full bg-ink px-5 text-sm font-semibold text-ink-foreground disabled:opacity-60"
              >
                {newsletterState === "busy" ? "Joining…" : "Get Started"}
              </button>
            </form>
            {newsletterState === "done" && (
              <p className="mt-3 text-sm text-ink-foreground">You are subscribed — welcome aboard.</p>
            )}
            {newsletterState === "error" && (
              <p className="mt-3 text-sm text-ink-foreground">
                We could not save your email. Please try again.
              </p>
            )}
          </div>
        </div>
      </Section>
    </>
  );
}
