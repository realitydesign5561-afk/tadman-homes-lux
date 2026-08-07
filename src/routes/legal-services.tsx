import { createFileRoute } from "@tanstack/react-router";
import { Scale, FileText, ShieldCheck, Handshake, Building2 } from "lucide-react";
import { PageHeader, Section } from "@/components/page-shell";

export const Route = createFileRoute("/legal-services")({
  head: () => ({
    meta: [
      {
        title: "Legal Services | Tadman Homes and Properties",
      },
      {
        name: "description",
        content:
          "Professional property legal services including documentation, tenancy agreements, compliance and transaction support.",
      },
    ],
  }),
  component: LegalServicesPage,
});

const services = [
  {
    icon: FileText,
    title: "Property Documentation",
    description:
      "Preparation and review of property documents, agreements and transaction paperwork.",
  },
  {
    icon: Scale,
    title: "Tenancy Agreements",
    description:
      "Professional tenancy documentation and legal support for landlords and tenants.",
  },
  {
    icon: ShieldCheck,
    title: "Property Compliance",
    description:
      "Helping property owners maintain proper documentation and regulatory compliance.",
  },
  {
    icon: Handshake,
    title: "Property Transactions",
    description:
      "Legal guidance during property sales, purchases and rental transactions.",
  },
  {
    icon: Building2,
    title: "Real Estate Advisory",
    description:
      "Strategic advice to help investors and property owners make informed decisions.",
  },
];

function LegalServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal Services"
        title="Professional Real Estate Legal Support"
        subtitle="Protecting your property interests with reliable documentation, compliance and transaction support."
      />

      <Section title="Our Legal Services">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="surface-card rounded-2xl p-5"
            >
              <service.icon className="size-6 text-primary" />

              <h3 className="mt-4 font-semibold">
                {service.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Why Choose Tadman Homes Legal Support">
        <div className="grid gap-4 md:grid-cols-2">
          <div>✔ Property-focused legal assistance</div>
          <div>✔ Clear documentation process</div>
          <div>✔ Transaction protection</div>
          <div>✔ Landlord and tenant support</div>
          <div>✔ Compliance guidance</div>
          <div>✔ Professional consultation</div>
        </div>
      </Section>

      <Section title="Contact Our Legal Team">
        <div className="surface-card rounded-2xl p-6 space-y-3">
          <p>
            <strong>Email:</strong> ralphconsult99@gmail.com
          </p>

          <p>
            <strong>Email:</strong> damilolaoshinowo3@gmail.com
          </p>

          <p>
            <strong>Hotline:</strong> 07031556176
          </p>

          <p>
            <strong>WhatsApp:</strong> 09117511768
          </p>

          <p>
            <strong>Phone:</strong> +234 807 488 3126
          </p>
        </div>
      </Section>
    </>
  );
}
