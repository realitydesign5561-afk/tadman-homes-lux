import { createFileRoute } from "@tanstack/react-router";
import { FileSearch, Gavel, ScrollText, ShieldCheck, Stamp, Handshake } from "lucide-react";
import { PageHeader, Section } from "@/components/page-shell";
import { useSettings } from "@/hooks/use-settings";
import { whatsappLink } from "@/lib/settings";

export const Route = createFileRoute("/legal-team")({
  head: () => ({
    meta: [
      { title: "Standby Legal Team | Tadman Homes and Properties" },
      {
        name: "description",
        content:
          "Property searches, due diligence, title verification, documentation and legal agreements handled by our standby legal team.",
      },
      { property: "og:title", content: "Legal Team | Tadman Homes and Properties" },
      {
        property: "og:description",
        content: "Legal support for property acquisition, sales and documentation.",
      },
    ],
  }),
  component: LegalTeamPage,
});

const services = [
  { icon: FileSearch, t: "Property search", d: "Searches at the land registry and relevant authorities." },
  { icon: ShieldCheck, t: "Due diligence", d: "Confirm ownership, encumbrances and government acquisition status." },
  { icon: Stamp, t: "Title verification", d: "Verification of C of O, governor's consent, deeds and survey plans." },
  { icon: Handshake, t: "Acquisition & sales", d: "Legal representation through purchase and disposal transactions." },
  { icon: ScrollText, t: "Documentation", d: "Deeds of assignment, tenancy agreements, leases and receipts." },
  { icon: Gavel, t: "Legal agreements", d: "Drafting and review of bespoke property agreements." },
];

function LegalTeamPage() {
  const settings = useSettings();
  const page = settings.legal_team_page;
  const wa = whatsappLink(
    settings.contact.whatsapp,
    "Hello Tadman Homes, I'd like to speak with your legal team.",
  );

  return (
    <>
      <PageHeader eyebrow="Legal" title={page.heading} subtitle={page.body} />

      <Section title="How our legal team helps">
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

      <Section>
        <div className="rounded-[2rem] bg-secondary/70 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Every transaction deserves legal cover
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Our standby legal team is available for a reasonable professional fee. Reach out before
            you commit to any property transaction.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-7 text-sm font-semibold text-ink-foreground transition-opacity hover:opacity-90"
            >
              {page.cta_label ?? "Speak With Our Legal Team"}
            </a>
            <a
              href={`tel:${settings.contact.phone}`}
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Call {settings.contact.phone}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}
