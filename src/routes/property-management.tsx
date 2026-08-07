import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";

export const Route = createFileRoute("/property-management")({
  head: () => ({
    meta: [
      {
        title: "Property Management Services | Tadman Homes and Properties",
      },
      {
        name: "description",
        content:
          "Professional property management services for residential and commercial properties.",
      },
    ],
  }),
  component: PropertyManagementPage,
});

function PropertyManagementPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Property Management Services"
        subtitle="We help property owners manage tenants, maintenance, inspections and daily operations."
      />

      <Section title="Coming Soon">
        <p>
          Full property management services will be available here.
        </p>
      </Section>
    </>
  );
}
