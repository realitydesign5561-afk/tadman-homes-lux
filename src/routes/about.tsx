import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";

const aboutImage = "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=1400&h=1000";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Tadman Homes & Properties" },
      {
        name: "description",
        content:
          "Tadman Homes & Properties is a trusted global real estate marketplace helping buyers, sellers, landlords and investors discover verified properties worldwide.",
      },
      { property: "og:title", content: "About Tadman Homes & Properties" },
      { property: "og:description", content: "Trusted global marketplace for buying, selling and renting verified properties." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="About Tadman Homes & Properties"
        subtitle="A trusted real estate marketplace connecting buyers, sellers, landlords and investors with verified property opportunities across the world."
      />
      <Section>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <img
            src={aboutImage}
            alt="A Tadman listed villa"
            loading="lazy"
            width={1400}
            height={1000}
            className="h-[320px] w-full rounded-[1.75rem] object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Our story</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Tadman Homes & Properties was created to simplify the way people buy, sell and rent properties. Our mission is to build a trusted marketplace where property owners, developers, agencies and independent merchants can connect with genuine buyers and tenants through a secure digital platform.</p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Beyond property listings, we are committed to transparency, innovation and exceptional customer service. Our platform is designed to provide verified listings, powerful search tools, secure communication and professional support that help clients make informed real estate decisions with confidence.</p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["Verified", "Listings"],
                ["Secure", "Transactions"],
                ["Global", "Marketplace"],
               ].map(([n, l]) => (
                <div key={l} className="surface-card rounded-2xl p-4 text-center">
                  <p className="font-display text-2xl font-bold text-foreground">{n}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
      <Section title="Why Choose Tadman Homes & Properties">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
             [
               "Verified Listings",
               "Every property is reviewed before publication to improve trust and reduce fraudulent listings.",
             ],
             [
               "Global Marketplace",
               "Buy, sell and rent properties across multiple cities and countries from one trusted platform.",
             ],
             [
    "Professional Support",
    "Our experienced team assists buyers, sellers and merchants throughout their property journey.",
  ],
].map(([t, d]) => (
            <div key={t} className="surface-card rounded-2xl p-6">
              <p className="text-sm font-semibold text-foreground">{t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section title="Our Mission">
        <div className="surface-card rounded-3xl p-8">
          <p className="text-sm leading-8 text-muted-foreground">
          Our mission is to provide a secure, transparent and technology-driven real estate marketplace where buyers, sellers, landlords, developers and agencies can connect with confidence. We are committed to continuous improvement, quality listings and professional support.
         </p>
     </div>
    </Section>
      <Section title="Our Vision">
        <div className="surface-card rounded-3xl p-8">
         <p className="text-sm leading-8 text-muted-foreground">
         To become one of the world's leading digital real estate platforms by making property buying, selling and renting easier, safer and more accessible for everyone.</p>
     </div>
    </Section>
    </>
  );
}
