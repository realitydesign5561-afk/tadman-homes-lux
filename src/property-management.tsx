import { createFileRoute } from "@tanstack/react-router";
import { Building2, ClipboardCheck, Home, ShieldCheck, Wrench } from "lucide-react";
import { PropertyManagementForm } from "@/components/property-management-form";

export const Route = createFileRoute("/property-management")({
  component: PropertyManagementPage,
});

const services = [
  {
    icon: Home,
    title: "Residential Property Management",
    description:
      "Tenant sourcing, rent collection, inspections, maintenance and reporting.",
  },
  {
    icon: Building2,
    title: "Commercial Property Management",
    description:
      "Management of offices, retail spaces, plazas and commercial investments.",
  },
  {
    icon: Wrench,
    title: "Property Maintenance",
    description:
      "Routine inspections, preventive maintenance and emergency repairs.",
  },
  {
    icon: ShieldCheck,
    title: "Facility Management",
    description:
      "Cleaning, security, utilities and contractor supervision.",
  },
  {
    icon: ClipboardCheck,
    title: "Tenant Management",
    description:
      "Tenant screening, lease administration and dispute resolution.",
  },
];

export default function PropertyManagementPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">

      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold">
          Professional Property Management
        </h1>

        <p className="mt-6 text-lg text-muted-foreground">
          We manage residential, commercial and investment properties
          while you enjoy stress-free ownership and consistent returns.
        </p>
      </section>

      <section className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-2xl border bg-card p-6"
          >
            <service.icon className="mb-4 h-10 w-10 text-primary" />

            <h3 className="text-xl font-semibold">
              {service.title}
            </h3>

            <p className="mt-3 text-muted-foreground">
              {service.description}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-24">

        <h2 className="mb-10 text-center text-3xl font-bold">
          Request Property Management
        </h2>

        <PropertyManagementForm />

      </section>

    </main>
  );
}
