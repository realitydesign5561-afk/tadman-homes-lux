import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { FormEvent } from "react";
import { Building2, ClipboardCheck, Coins, Hammer, ShieldCheck, Users } from "lucide-react";
import { PageHeader, Section, Field, PrimaryButton } from "@/components/page-shell";
import { useSettings } from "@/hooks/use-settings";
import { submitManagementRequest } from "@/lib/content";

export const Route = createFileRoute("/property-management")({
  head: () => ({
    meta: [
      { title: "Property Management Services | Tadman Homes and Properties" },
      {
        name: "description",
        content:
          "Full-service property management in Lagos — tenant sourcing, rent collection, maintenance, inspections and transparent reporting.",
      },
      { property: "og:title", content: "Property Management | Tadman Homes and Properties" },
      {
        property: "og:description",
        content: "Let Tadman manage your residential or commercial property end to end.",
      },
    ],
  }),
  component: PropertyManagementPage,
});

const services = [
  {
    icon: Users,
    t: "Tenant Sourcing & Screening",
    d: "Professional marketing, tenant screening, interviews and lease execution.",
  },
  {
    icon: Coins,
    t: "Rent Collection",
    d: "Automated rent reminders, payment tracking and transparent remittance.",
  },
  {
    icon: Hammer,
    t: "Maintenance & Repairs",
    d: "Routine maintenance, emergency repairs and trusted contractors.",
  },
  {
    icon: ClipboardCheck,
    t: "Property Inspection",
    d: "Scheduled inspections with detailed reports and photographs.",
  },
  {
    icon: ShieldCheck,
    t: "Legal & Compliance",
    d: "Tenancy agreements, eviction procedures and regulatory compliance.",
  },
  {
    icon: Building2,
    t: "Facility Management",
    d: "Cleaning, security, utilities and complete estate management.",
  },
  {
    icon: Building2,
    t: "Commercial Property Management",
    d: "Office buildings, shopping complexes, warehouses and mixed-use properties.",
  },
  {
    icon: ShieldCheck,
    t: "Investment Advisory",
    d: "Helping investors maximize rental income and long-term property value.",
  },
];

const process = [
  {
    step: "01",
    title: "Request Consultation",
    description:
      "Tell us about your property and management requirements.",
  },
  {
    step: "02",
    title: "Property Inspection",
    description:
      "Our team visits your property for a full assessment.",
  },
  {
    step: "03",
    title: "Management Proposal",
    description:
      "We prepare a customized management plan and pricing.",
  },
  {
    step: "04",
    title: "Management Begins",
    description:
      "We handle everything while you receive regular reports.",
  },
];
function PropertyManagementPage() {
  const settings = useSettings();
  const page = settings.property_management_page ?? {
  heading: "Property Management Services",
  body: "Professional property management solutions for residential and commercial properties.",
};
  const [form, setForm] = useState({
  full_name: "",
  email: "",
  phone: "",
  property_type: "",
  service: "Full Property Management",
  message: "",
});
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  const set = (k: keyof typeof form) => (v: string) => setForm((p) => ({ ...p, [k]: v }));
import type { FormEvent } from "react";
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("busy");
    try {
      await submitManagementRequest(form);
      setForm({
  full_name: "",
  email: "",
  phone: "",
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
      <PageHeader eyebrow="Services" title={page.heading} subtitle={page.body} />

      <Section title="What we handle for you">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.t} className="surface-card rounded-2xl p-5">
              <s.icon className="size-5 text-primary" />
              <p className="mt-3 text-sm font-semibold text-foreground">{s.t}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.d}</p>
            </div>
          ))}
        </div>
      </Section>

     <Section
  title="How It Works"
  subtitle="Our simple four-step process for managing your property."
>
  <div className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    {process.map((item) => (
      <div
        key={item.step}
        className="surface-card rounded-2xl p-6"
      >
        <div className="mb-4 text-3xl font-bold text-primary">
          {item.step}
        </div>

        <h3 className="text-lg font-semibold">
          {item.title}
        </h3>

        <p className="mt-3 text-sm text-muted-foreground">
          {item.description}
        </p>
      </div>
    ))}
  </div>

  <div className="mb-12 rounded-3xl bg-secondary/30 p-8">
    <h3 className="mb-4 text-2xl font-bold">
      Why Choose Tadman Homes?
    </h3>

    <div className="grid gap-4 md:grid-cols-2">
      <div>✔ Experienced Property Managers</div>
      <div>✔ Transparent Financial Reports</div>
      <div>✔ Verified Maintenance Professionals</div>
      <div>✔ Tenant Screening & Management</div>
      <div>✔ Regular Property Inspections</div>
      <div>✔ Increased Property Value</div>
    </div>
  </div>

  <h2 className="mb-3 text-3xl font-bold">
    Request Property Management
  </h2>

  <p className="mb-8 text-muted-foreground">
    Complete the form below and one of our property managers will contact you shortly.
  </p>
        <form onSubmit={handleSubmit} className="surface-card grid gap-4 rounded-[1.75rem] p-6 sm:grid-cols-2">
          <Field label="Full name" required value={form.full_name} onChange={(e) => set("full_name")(e.target.value)} />
          <Field label="Email" type="email" value={form.email} onChange={(e) => set("email")(e.target.value)} />
          <Field label="Phone" value={form.phone} onChange={(e) => set("phone")(e.target.value)} />
          <Field
            label="Property type"
            placeholder="Apartment, duplex, shop…"
            value={form.property_type}
            onChange={(e) => set("property_type")(e.target.value)}
          />
          <div className="sm:col-span-2">
            <Field
              label="Property address"
              value={form.property_address}
              onChange={(e) => set("property_address")(e.target.value)}
            />
          </div>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Service needed
            </span>
            <select
              value={form.service}
              onChange={(e) => set("service")(e.target.value)}
              className="h-11 w-full rounded-2xl border border-border bg-secondary/60 px-4 text-sm text-foreground outline-none focus:border-primary focus:bg-card"
            >{[
  "Full Property Management",
  "Tenant Sourcing",
  "Rent Collection",
  "Facility Management",
  "Commercial Property Management",
  "Investment Advisory",
  "Property Inspection",
  "Maintenance Only",
  "Legal & Compliance",
  "Other",
].map(
                (o) => (
                  <option key={o}>{o}</option>
                ),
              )}
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Message
            </span>
            <textarea
              rows={4}
              value={form.message}
              onChange={(e) => set("message")(e.target.value)}
              className="w-full rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:bg-card"
            />
          </label>
          <div className="sm:col-span-2">
            {state === "done" && (
              <p className="mb-3 text-sm text-primary">Request received — our team will contact you shortly.</p>
            )}
            {state === "error" && (
              <p className="mb-3 text-sm text-destructive">Could not send your request. Please try again.</p>
            )}
            <PrimaryButton type="submit" disabled={state === "busy"}>
              {state === "busy" ? "Sending…" : "Submit request"}
            </PrimaryButton>
          </div>
        </form>
      </Section>
    </>
  );
}
