import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, Upload, BarChart3, Users } from "lucide-react";
import { PageHeader, Section } from "@/components/page-shell";

export const Route = createFileRoute("/merchant/")({
  component: MerchantPage,
});

function MerchantPage() {
  const features = [
    {
      icon: Building2,
      title: "Manage Properties",
      text: "Upload and manage your property listings.",
    },
    {
      icon: Upload,
      title: "Easy Upload",
      text: "Add images, prices and property details.",
    },
    {
      icon: BarChart3,
      title: "Track Performance",
      text: "Monitor views and listing activity.",
    },
    {
      icon: Users,
      title: "Receive Enquiries",
      text: "Connect with buyers and tenants.",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Merchant Portal"
        title="Grow Your Real Estate Business With Tadman"
        subtitle="List properties, manage enquiries and reach more customers."
      >
        <div className="flex gap-3 justify-center">
          <Link
            to="/register"
            className="rounded-full bg-ink px-6 py-3 text-white"
          >
            Create Merchant Account
          </Link>

          <Link
            to="/merchant/login"
            className="rounded-full border px-6 py-3"
          >
            Merchant Login
          </Link>
        </div>
      </PageHeader>


      <Section title="Merchant Benefits">
        <div className="grid gap-4 md:grid-cols-4">
          {features.map((item)=>(
            <div
              key={item.title}
              className="surface-card rounded-2xl p-5"
            >
              <item.icon className="size-6 text-primary"/>
              <h3 className="mt-3 font-semibold">
                {item.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}
