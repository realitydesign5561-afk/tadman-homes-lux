import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Bath, BedDouble, Check, Maximize, MapPin, Phone } from "lucide-react";
import { Section } from "@/components/page-shell";
import { PropertyCard } from "@/components/property-card";
import { properties } from "@/data/properties";

export const Route = createFileRoute("/properties/$propertyId")({
  loader: ({ params }) => {
    const property = properties.find((p) => p.id === params.propertyId);
    if (!property) throw notFound();
    return property;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Property"} | Tadman Homes & Properties` },
      {
        name: "description",
        content:
          loaderData?.description ?? "View full details, photos and pricing for this property.",
      },
      { property: "og:title", content: loaderData?.title ?? "Property" },
      { property: "og:description", content: loaderData?.description ?? "" },
    ],
  }),
  component: PropertyDetails,
  errorComponent: ({ error }) => (
    <div className="px-5 py-24 text-center" role="alert">
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="px-5 py-24 text-center">
      <h1 className="text-2xl font-bold text-foreground">Listing not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This property may have been sold or withdrawn.
      </p>
      <Link
        to="/properties"
        className="mt-6 inline-flex rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-ink-foreground"
      >
        Back to properties
      </Link>
    </div>
  ),
});

function PropertyDetails() {
  const property = Route.useLoaderData();
  const similar = properties.filter((p) => p.id !== property.id).slice(0, 3);

  return (
    <>
      <Section>
        <div className="grid gap-3 lg:grid-cols-[2fr_1fr]">
          <img
            src={property.image}
            alt={property.title}
            width={1400}
            height={1000}
            className="h-[300px] w-full rounded-[1.75rem] object-cover sm:h-[440px]"
          />
          <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
            {properties.slice(0, 3).map((p) => (
              <img
                key={p.id}
                src={p.image}
                alt="Additional property photo"
                loading="lazy"
                width={900}
                height={700}
                className="h-24 w-full rounded-2xl object-cover lg:h-[139px]"
              />
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">
              {property.status} · {property.type}
            </span>
            <h1 className="mt-4 text-3xl font-bold text-foreground sm:text-4xl">
              {property.title}
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" /> {property.city}, {property.country}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                { icon: BedDouble, label: `${property.beds} bedrooms` },
                { icon: Bath, label: `${property.baths} bathrooms` },
                { icon: Maximize, label: property.area },
              ].map((s) => (
                <span
                  key={s.label}
                  className="surface-card flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground"
                >
                  <s.icon className="size-4 text-primary" /> {s.label}
                </span>
              ))}
            </div>

            <h2 className="mt-9 text-xl font-semibold text-foreground">About this property</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {property.description} Enquire today to arrange a private viewing with a Tadman
              accredited agent, either in person or over a live video walkthrough.
            </p>

            <h2 className="mt-9 text-xl font-semibold text-foreground">Features</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {property.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="size-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <aside className="surface-card h-fit rounded-[1.75rem] p-6 lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Price</p>
            <p className="mt-1 font-display text-3xl font-bold text-foreground">
              {property.price}
              <span className="text-sm font-medium text-muted-foreground">{property.period}</span>
            </p>
            <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
              <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-sm font-bold text-primary-foreground">
                {property.agent.slice(0, 1)}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{property.agent}</p>
                <p className="text-xs text-muted-foreground">Accredited Tadman agent</p>
              </div>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="mt-5 space-y-3">
              <input
                placeholder="Your name"
                aria-label="Your name"
                className="h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm outline-none focus:border-primary"
              />
              <input
                type="email"
                placeholder="Email address"
                aria-label="Email address"
                className="h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm outline-none focus:border-primary"
              />
              <textarea
                rows={3}
                placeholder="I'd like to arrange a viewing…"
                aria-label="Message"
                className="w-full rounded-2xl border border-border bg-secondary/60 p-4 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-ink-foreground"
              >
                <Phone className="size-4" /> Contact agent
              </button>
            </form>
          </aside>
        </div>
      </Section>

      <Section title="Similar properties">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {similar.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </Section>
    </>
  );
}