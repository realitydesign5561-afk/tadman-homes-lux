import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Tadman Homes & Properties" },
      { name: "description", content: "How Tadman Homes & Properties collects, uses and protects your personal data." },
      { property: "og:title", content: "Privacy Policy | Tadman Homes" },
      { property: "og:description", content: "How we collect, use and protect your data." },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  ["Information we collect", "We collect the details you provide when creating an account, saving favourites, contacting an agent or subscribing as a merchant, plus basic usage data such as pages viewed and searches performed."],
  ["How we use your information", "We use your data to operate the marketplace, deliver enquiries to agents, process merchant subscriptions, prevent fraud and improve search results."],
  ["Sharing", "Enquiry details are shared with the agent or merchant responsible for the listing you contacted. We never sell personal data to third parties."],
  ["Cookies", "We use essential cookies to keep you signed in and analytics cookies to understand how the marketplace is used. You can control non-essential cookies in your browser."],
  ["Data retention", "Account data is retained while your account is active and for a limited period afterwards to satisfy legal and accounting obligations."],
  ["Your rights", "You may request access, correction, export or deletion of your personal data at any time by emailing support@tadmanhomes.com."],
];

function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" subtitle="Last updated 30 July 2026." />
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