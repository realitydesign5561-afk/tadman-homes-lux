import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Tadman Homes & Properties" },
      { name: "description", content: "The terms that govern use of the Tadman Homes & Properties marketplace." },
      { property: "og:title", content: "Terms of Service | Tadman Homes" },
      { property: "og:description", content: "Terms governing use of our marketplace." },
    ],
  }),
  component: TermsPage,
});

const sections = [
  ["Using the marketplace", "Browsing, searching, saving favourites and contacting agents is free for visitors. You agree to use the platform lawfully and not to scrape, resell or misrepresent listings."],
  ["Merchant subscriptions", "Merchant plans are billed monthly in advance and renew automatically until cancelled. Cancellation takes effect at the end of the current billing period."],
  ["Listing standards", "Merchants must have the legal right to advertise each property, and listings must be accurate, current and free of misleading claims. We may remove listings that breach these standards."],
  ["Liability", "Tadman is a marketplace, not a party to any sale or tenancy. We verify listings in good faith but buyers and tenants remain responsible for their own due diligence."],
  ["Termination", "We may suspend accounts that breach these terms, engage in fraud or repeatedly publish inaccurate listings."],
  ["Changes", "We may update these terms; material changes will be notified by email at least 14 days in advance."],
];

function TermsPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Terms of Service" subtitle="Last updated 30 July 2026." />
      <Section>
        <div className="surface-card mx-auto max-w-3xl space-y-8 rounded-[1.75rem] p-8 sm:p-10">
          {sections.map(([t, d]) => (
            <div key={t}>
              <h2 className="text-lg font-semibold text-foreground">{t}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}