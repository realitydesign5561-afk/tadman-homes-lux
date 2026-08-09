import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bath,
  BedDouble,
  Check,
  Maximize,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Section } from "@/components/page-shell";
import { PropertyGrid } from "@/components/property-grid";
import { fetchPropertyById } from "@/lib/properties";
import { submitContactRequest } from "@/lib/content";

export const Route = createFileRoute("/properties/$propertyId")({
  loader: async ({ params }) => {
    const property = await fetchPropertyById(params.propertyId);

    if (!property) {
      throw notFound();
    }

    return property;
  },

  head: ({ loaderData }) => ({
    meta: [
      {
        title: `${loaderData?.title ?? "Property"} | Tadman Homes & Properties`,
      },
      {
        name: "description",
        content:
          loaderData?.description ??
          "View full details, photos and pricing for this property.",
      },
      {
        property: "og:title",
        content: loaderData?.title ?? "Property",
      },
      {
        property: "og:description",
        content: loaderData?.description ?? "",
      },
      {
        property: "og:type",
        content: "article",
      },
      ...(loaderData?.image?.startsWith("http")
        ? [
            {
              property: "og:image",
              content: loaderData.image,
            },
            {
              name: "twitter:image",
              content: loaderData.image,
            },
          ]
        : []),
    ],
  }),

  component: PropertyDetails,

  errorComponent: ({ error }) => (
    <Section title="Something went wrong">
      <p className="text-sm text-muted-foreground">{error.message}</p>
    </Section>
  ),

  notFoundComponent: () => (
    <Section title="Listing not found">
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          This property may have been sold or withdrawn.
        </p>

        <Link
          to="/properties"
          className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-ink-foreground"
        >
          Back to properties
        </Link>
      </div>
    </Section>
  ),

});

function PropertyDetails() {
  const property = Route.useLoaderData();

  const waMessage = `Hello, I'm interested in ${property.title}.`;

  return (
    <>
      <Section title="">
        <div className="grid gap-3 lg:grid-cols-[1.6fr_0.4fr]">
          <div className="overflow-hidden rounded-[1.75rem]">
            <img
              src={property.image}
              alt={property.title}
              loading="eager"
              width={1200}
              height={900}
              className="h-[420px] w-full object-cover lg:h-[620px]"
            />
          </div>

          {property.gallery.length > 1 && (
            <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
              {property.gallery.slice(1, 4).map((src: string) => (
                <img
                  key={src}
                  src={src}
                  alt={`${property.title} photo`}
                  loading="lazy"
                  width={900}
                  height={700}
                  className="h-24 w-full rounded-2xl object-cover lg:h-[139px]"
                />
              ))}
            </div>
          )}
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
              <MapPin className="size-4" />
              {property.city}, {property.country}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {[
                {
                  icon: BedDouble,
                  label: `${property.beds} bedrooms`,
                },
                {
                  icon: Bath,
                  label: `${property.baths} bathrooms`,
                },
                {
                  icon: Maximize,
                  label: property.area,
                },
              ].map((s) => (
                <span
                  key={s.label}
                  className="surface-card flex items-center gap-2 rounded-full px-4 py-2 text-sm text-foreground"
                >
                  <s.icon className="size-4 text-primary" />
                  {s.label}
                </span>
              ))}
            </div>

            <h2 className="mt-9 text-xl font-semibold text-foreground">
              About this property
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {property.description}
            </p>

            {property.features.length > 0 && (
              <>
                <h2 className="mt-9 text-xl font-semibold text-foreground">
                  Features
                </h2>

                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {property.features.map((feature: string) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Check className="size-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <aside className="surface-card h-fit rounded-[1.75rem] p-6 lg:sticky lg:top-24">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              Price
            </p>

            <p className="mt-1 font-display text-3xl font-bold text-foreground">
              {property.price}
              <span className="text-sm font-medium text-muted-foreground">
                {property.period}
              </span>
            </p>

            <EnquiryForm
              propertyId={property.rowId}
              title={property.title}
            />

            {property.merchants?.whatsapp_number ? (
              <a
                href={`https://wa.me/${property.merchants.whatsapp_number}?text=${encodeURIComponent(waMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-foreground"
              >
                <MessageCircle className="size-4" />
                Chat on WhatsApp
              </a>
            ) : (
              <a
                aria-disabled
                className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-muted-foreground opacity-60"
              >
                <MessageCircle className="size-4" />
                Chat on WhatsApp
              </a>
            )}

            {property.merchants?.phone && (
              <a
                href={`tel:${property.merchants.phone}`}
                className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-foreground"
              >
                <Phone className="size-4" />
                Call agent
              </a>
            )}
          </aside>
        </div>
      </Section>

      <Section title="Similar properties">
        <PropertyGrid
          queryKey="similar"
          options={{ limit: 3 }}
          emptyMessage="No other listings are published yet."
        />
      </Section>
    </>
  );
}

function EnquiryForm({
  propertyId,
  title,
}: {
  propertyId: string;
  title: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    `I'd like to arrange a viewing of ${title}.`,
  );
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    try {
      await submitContactRequest({
        name,
        email,
        message,
        subject: `Enquiry: ${title}`,
        property_id: propertyId,
        source: "property-page",
      });

      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-3">
      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        aria-label="Your name"
        className="h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm outline-none focus:border-primary"
      />

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email address"
        aria-label="Email address"
        className="h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm outline-none focus:border-primary"
      />

      <textarea
        rows={3}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        aria-label="Message"
        className="w-full rounded-2xl border border-border bg-secondary/60 p-4 text-sm outline-none focus:border-primary"
      />

      {status === "sent" && (
        <p className="text-sm text-primary">
          Thanks — the agent will be in touch.
        </p>
      )}

      {status === "error" && (
        <p className="text-sm text-destructive">
          Could not send your enquiry.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-ink-foreground disabled:opacity-50"
      >
        {status === "sending" ? "Sending…" : "Contact agent"}
      </button>
    </form>
  );
}

