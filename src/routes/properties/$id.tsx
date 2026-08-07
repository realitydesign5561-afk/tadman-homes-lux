import { createFileRoute } from "@tanstack/react-router";
import { Building2, MapPin, Phone, MessageCircle } from "lucide-react";
import { PageHeader, Section, PrimaryButton } from "@/components/page-shell";
import { useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/properties/$id")({
  component: PropertyDetailsPage,
});

function PropertyDetailsPage() {
  const { id } = useParams({ from: "/properties/$id" });

  const property = {
    title: "Luxury Property",
    location: "Lagos, Nigeria",
    price: "₦0",
    description:
      "Premium property listing details will appear here once approved by our merchant system.",
    type: "Residential",
    bedrooms: "3",
    bathrooms: "2",
  };

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
              {property.location}
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
                  {property.bedrooms}
                </p>
              </div>

              <div className="surface-card rounded-xl p-4">
                <p className="text-sm text-muted-foreground">
                  Bathrooms
                </p>
                <p className="font-semibold">
                  {property.bathrooms}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <PrimaryButton>
                <MessageCircle className="mr-2 size-4" />
                WhatsApp Inquiry
              </PrimaryButton>

              <PrimaryButton>
                <Phone className="mr-2 size-4" />
                Contact Agent
              </PrimaryButton>
            </div>
          </div>

        </div>
      </Section>
    </>
  );
}
