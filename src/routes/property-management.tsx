import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import {
  Building2,
  ClipboardCheck,
  Coins,
  Hammer,
  ShieldCheck,
  Users,
} from "lucide-react";

import {
  PageHeader,
  Section,
  Field,
  PrimaryButton,
} from "@/components/page-shell";

import { submitManagementRequest } from "@/lib/content";

export const Route = createFileRoute("/property-management")({
  head: () => ({
    meta: [
      {
        title: "Property Management Services | Tadman Homes and Properties",
      },
      {
        name: "description",
        content:
          "Professional property management services in Lagos including tenant sourcing, rent collection, maintenance, inspections and reporting.",
      },
      {
        property: "og:title",
        content: "Property Management | Tadman Homes and Properties",
      },
      {
        property: "og:description",
        content:
          "Let Tadman Homes manage your residential and commercial properties professionally.",
      },
    ],
  }),
  component: PropertyManagementPage,
});

const services = [
  {
    icon: Users,
    title: "Tenant Sourcing & Screening",
    description:
      "Professional marketing, tenant verification, screening and lease support.",
  },
  {
    icon: Coins,
    title: "Rent Collection",
    description:
      "Reliable rent collection, payment tracking and transparent reports.",
  },
  {
    icon: Hammer,
    title: "Maintenance & Repairs",
    description:
      "Fast repairs using trusted professionals while protecting your property.",
  },
  {
    icon: ClipboardCheck,
    title: "Property Inspection",
    description:
      "Routine inspections with detailed updates and condition reports.",
  },
  {
    icon: ShieldCheck,
    title: "Legal & Compliance",
    description:
      "Tenancy documentation, compliance support and property protection.",
  },
  {
    icon: Building2,
    title: "Facility Management",
    description:
      "Complete management of estates, commercial buildings and facilities.",
  },
  {
    icon: Building2,
    title: "Commercial Property Management",
    description:
      "Management solutions for offices, shops, warehouses and mixed-use buildings.",
  },
  {
    icon: ShieldCheck,
    title: "Investment Advisory",
    description:
      "Strategies to improve rental income and property value.",
  },
];

const process = [
  {
    step: "01",
    title: "Request Consultation",
    description:
      "Share your property details and management needs.",
  },
  {
    step: "02",
    title: "Property Inspection",
    description:
      "Our team evaluates your property condition.",
  },
  {
    step: "03",
    title: "Management Plan",
    description:
      "We create a suitable management strategy.",
  },
  {
    step: "04",
    title: "Management Begins",
    description:
      "We handle operations while you receive updates.",
  },
];

function PropertyManagementPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    property_address: "",
    property_type: "",
    service: "Full Property Management",
    message: "",
  });

  const [state, setState] = useState<
    "idle" | "busy" | "done" | "error"
  >("idle");

  const setField =
    (key: keyof typeof form) =>
    (value: string) => {
      setForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setState("busy");

    try {
      await submitManagementRequest(form);

      setForm({
        full_name: "",
        email: "",
        phone: "",
        property_address: "",
        property_type: "",
        service: "Full Property Management",
        message: "",
      });

      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Property Management Services"
        subtitle="Professional property management solutions that protect your investment and maximize returns."
      />

      <Section title="What We Handle For You">
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

      <Section
        title="How It Works"
        subtitle="Our simple process for managing your property."
      >
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {process.map((item) => (
            <div
              key={item.step}
              className="surface-card rounded-2xl p-6"
            >
              <div className="text-3xl font-bold text-primary">
                {item.step}
              </div>

              <h3 className="mt-4 font-semibold">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Why Choose Tadman Homes?">
        <div className="grid gap-4 md:grid-cols-2">
          <div>✔ Experienced Property Managers</div>
          <div>✔ Transparent Financial Reporting</div>
          <div>✔ Verified Maintenance Professionals</div>
          <div>✔ Tenant Screening Process</div>
          <div>✔ Regular Property Inspections</div>
          <div>✔ Increased Property Value</div>
        </div>
      </Section>

      <Section
        title="Request Property Management"
        subtitle="Complete the form and our property team will contact you."
      >
        <form
          onSubmit={handleSubmit}
          className="surface-card grid gap-4 rounded-[1.75rem] p-6 sm:grid-cols-2"
        >
          <Field
            label="Full Name"
            required
            value={form.full_name}
            onChange={(e) =>
              setField("full_name")(e.target.value)
            }
          />

          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) =>
              setField("email")(e.target.value)
            }
          />

          <Field
            label="Phone"
            value={form.phone}
            onChange={(e) =>
              setField("phone")(e.target.value)
            }
          />

          <Field
            label="Property Type"
            placeholder="Apartment, Duplex, Office..."
            value={form.property_type}
            onChange={(e) =>
              setField("property_type")(e.target.value)
            }
          />

          <div className="sm:col-span-2">
            <Field
              label="Property Address"
              value={form.property_address}
              onChange={(e) =>
                setField("property_address")(e.target.value)
              }
            />
          </div>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">
              Service Needed
            </span>

            <select
              value={form.service}
              onChange={(e) =>
                setField("service")(e.target.value)
              }
              className="h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm"
            >
              <option>Full Property Management</option>
              <option>Tenant Sourcing</option>
              <option>Rent Collection</option>
              <option>Facility Management</option>
              <option>Commercial Property Management</option>
              <option>Property Inspection</option>
              <option>Maintenance Only</option>
              <option>Legal & Compliance</option>
            </select>
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold uppercase text-muted-foreground">
              Message
            </span>

            <textarea
              rows={5}
              value={form.message}
              onChange={(e) =>
                setField("message")(e.target.value)
              }
              className="w-full rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm"
            />
          </label>

          <div className="sm:col-span-2">
            {state === "done" && (
              <p className="mb-3 text-sm text-primary">
                Request submitted successfully.
              </p>
            )}

            {state === "error" && (
              <p className="mb-3 text-sm text-destructive">
                Something went wrong. Please try again.
              </p>
            )}

            <PrimaryButton
              type="submit"
              disabled={state === "busy"}
            >
              {state === "busy"
                ? "Submitting..."
                : "Submit Request"}
            </PrimaryButton>
          </div>
        </form>
      </Section>
    </>
  );
}
