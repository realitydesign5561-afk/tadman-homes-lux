import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      {
        title: "Privacy Policy | Tadman Homes and Properties",
      },
      {
        name: "description",
        content:
          "Privacy policy for Tadman Homes and Properties.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="How Tadman Homes and Properties collects, uses and protects your information."
      />

      <Section title="Information We Collect">
        <p className="text-muted-foreground">
          We may collect personal information such as your name,
          email address, phone number, property preferences and
          information submitted through our forms.
        </p>
      </Section>

      <Section title="How We Use Your Information">
        <p className="text-muted-foreground">
          We use your information to respond to inquiries,
          provide property services, improve our platform and
          communicate important updates.
        </p>
      </Section>

      <Section title="Data Protection">
        <p className="text-muted-foreground">
          We take reasonable steps to protect your personal
          information from unauthorized access or misuse.
        </p>
      </Section>

      <Section title="Contact">
        <p className="text-muted-foreground">
          For questions regarding this policy, contact Tadman
          Homes and Properties.
        </p>
      </Section>
    </>
  );
}
