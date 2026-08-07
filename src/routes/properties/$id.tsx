import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, Phone, MessageCircle } from "lucide-react";
import { PageHeader, Section, PrimaryButton } from "@/components/page-shell";
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPropertyById } from "@/lib/properties";

export const Route = createFileRoute("/properties/$id")({
  component: PropertyDetailsPage,
});

function PropertyDetailsPage() {
  const { id } = useParams({ from: "/properties/$id" });

  const { data: property, isLoading } = useQuery({
  queryKey: ["property", propertyId],
  queryFn: () => fetchPropertyById(propertyId),
});

  if (isLoading) {
  return (
    <Section>
      <p>Loading property details...</p>
    </Section>
  );
}

if (!property) {
  return (
    <Section>
      <p>Property not found or no longer available.</p>
    </Section>
  );
}

  return (
    <>
      <PageHeader
        eyebrow="Property Details"
        title={property.title}
        subtitle={property.location}
      />

      <Section title="">
        <div className="grid gap-8 lg:grid-cols-2">

          <div className="surface-card flex h-[400px] items-center justify-center rounded-3xl">
            <Building2 className="size-20 text-primary" />
          </div>

          <div className="space-y-5">
            <h2 className="text-3xl font-bold">
              {property.price}
            </h2>

            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="size-4" />
              {property.city}, {property.country}
            </div>

            <p className="text-muted-foreground">
              {property.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="surface-card rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  Property Type
                </p>
                <p className="font-semibold">
                  {property.type}
                </p>
              </div>

              <div className="surface-card rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  Bedrooms
                </p>
                <p className="font-semibold">
                 {property.beds}
                </p>
              </div>

              <div className="surface-card rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  Bathrooms
                </p>
                <p className="font-semibold">
                  {property.baths}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
  <a
    href={
      property.merchant?.whatsapp
        ? `https://wa.me/${property.merchant.whatsapp.replace(/\D/g, "")}`
        : "https://wa.me/2349117511768"
    }
    target="_blank"
    rel="noopener noreferrer"
  >
    <PrimaryButton>
      <MessageCircle className="mr-2 size-4" />
      WhatsApp Inquiry
    </PrimaryButton>
  </a>

  <a
    href={`tel:${property.merchant?.phone || "07031556176"}`}
  >
    <PrimaryButton>
      <Phone className="mr-2 size-4" />
      Contact Agent
    </PrimaryButton>
  </a>
</div>
          </div>

        </div>
      </Section>
    </>
  );
}
