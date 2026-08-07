import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      {
        title: "Terms & Conditions | Tadman Homes and Properties",
      },
      {
        name: "description",
        content:
          "Terms and conditions for using Tadman Homes and Properties services and platform.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Terms & Conditions"
        subtitle="Rules and guidelines for using Tadman Homes and Properties services."
      />

      <Section title="Acceptance of Terms">
        <p className="text-muted-foreground">
          By accessing or using Tadman Homes and Properties services,
          you agree to these terms and conditions.
        </p>
      </Section>

      <Section title="Property Listings">
        <p className="text-muted-foreground">
          Property information provided on our platform should be
          accurate and updated. Tadman Homes reserves the right to
          review, modify or remove listings that violate our policies.
        </p>
      </Section>

      <Section title="User Responsibilities">
        <p className="text-muted-foreground">
          Users are responsible for providing accurate information
          and using the platform responsibly.
        </p>
      </Section>

      <Section title="Services">
        <p className="text-muted-foreground">
          Property management, sales, rentals and related services
          are provided based on agreed terms between Tadman Homes
          and the client.
        </p>
      </Section>

      <Section title="Limitation of Liability">
        <p className="text-muted-foreground">
          Tadman Homes and Properties is not responsible for losses
          caused by inaccurate information supplied by users or
          third parties.
        </p>
      </Section>

      <Section title="Contact">
        <p className="text-muted-foreground">
          For questions about these terms, contact Tadman Homes
          and Properties.
        </p>
      </Section>
    </>
  );
}
