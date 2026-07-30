import { createFileRoute } from "@tanstack/react-router";
import { Phone, MapPin } from "lucide-react";
import { PageHeader, Section } from "@/components/page-shell";
import { agents } from "@/data/properties";

export const Route = createFileRoute("/agents")({
  head: () => ({
    meta: [
      { title: "Find an Agent | Tadman Homes & Properties" },
      {
        name: "description",
        content:
          "Meet accredited Tadman agents around the world, rated by real buyers, sellers and tenants.",
      },
      { property: "og:title", content: "Find an Agent | Tadman Homes" },
      { property: "og:description", content: "Accredited property agents worldwide." },
    ],
  }),
  component: AgentsPage,
});

function AgentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Agents"
        title="Work with accredited specialists"
        subtitle="Every agent on Tadman is identity-verified and reviewed by real clients."
      />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => (
            <div key={a.name} className="surface-card rounded-[1.6rem] p-6 text-center">
              <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-glow font-display text-xl font-bold text-primary-foreground">
                {a.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <p className="mt-4 text-base font-semibold text-foreground">{a.name}</p>
              <p className="text-xs text-primary">{a.role}</p>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5" /> {a.city}
              </p>
              <p className="mt-4 border-t border-border pt-4 text-xs text-muted-foreground">
                {a.listings} active listings
              </p>
              <a
                href={`tel:${a.phone.replace(/\s/g, "")}`}
                className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-secondary text-sm font-semibold text-foreground transition-colors hover:bg-ink hover:text-ink-foreground"
              >
                <Phone className="size-4" /> {a.phone}
              </a>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}