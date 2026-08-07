import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";

export const Route = createFileRoute("/property-disclaimer")({
  head: () => ({
    meta: [
      {
        title: "Property Disclaimer | Tadman Homes and Properties",
      },
      {
        name: "description",
        content:
          "Important disclaimer information about Tadman Homes and Properties listings, services and third-party information.",
      },
    ],
  }),
  component: PropertyDisclaimerPage,
});

function PropertyDisclaimerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Property Disclaimer"
        subtitle="Important information regarding our property listings and services."
      />

      <Section title="Property Information">
        <p className="text-muted-foreground">
          Tadman Homes and Properties makes reasonable efforts to ensure
          that property information displayed on our platform is accurate.
          However, details such as pricing, availability, measurements and
          descriptions may change without prior notice.
        </p>
      </Section>

      <Section title="Third-Party Information">
        <p className="text-muted-foreground">
          Some property information may be provided by property owners,
          developers or third parties. Tadman Homes does not guarantee the
          accuracy or completeness of information supplied by external
          parties.
        </p>
      </Section>

      <Section title="Property Viewing">
        <p className="text-muted-foreground">
          Users are encouraged to inspect properties personally and verify
          all relevant information before making any financial commitment.
        </p>
      </Section>

      <Section title="No Guarantee">
        <p className="text-muted-foreground">
          Listing a property on our platform does not guarantee a sale,
          rental agreement or investment return.
        </p>
      </Section>

      <Section title="Professional Advice">
        <p className="text-muted-foreground">
          Users should seek appropriate legal, financial or professional
          advice before entering property transactions.
        </p>
      </Section>

      <Section title="Contact">
        <p className="text-muted-foreground">
          For questions regarding any property listing or disclaimer,
          contact Tadman Homes and Properties.
        </p>
      </Section>
    </>
  );
}
