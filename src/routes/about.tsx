import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";
import heroVilla from "@/assets/hero-villa.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Tadman Homes & Properties" },
      {
        name: "description",
        content:
          "Tadman Homes & Properties connects buyers to sellers with ease — a global marketplace for premium property.",
      },
      { property: "og:title", content: "About Tadman Homes & Properties" },
      { property: "og:description", content: "Connecting buyers to sellers with ease, worldwide." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Connecting buyers to sellers with ease"
        subtitle="We built Tadman so that finding, listing and closing on property feels as simple as booking a stay."
      />
      <Section>
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <img
            src={heroVilla}
            alt="A Tadman listed villa"
            loading="lazy"
            width={1400}
            height={1000}
            className="h-[320px] w-full rounded-[1.75rem] object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">Our story</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Tadman Homes &amp; Properties started with a simple frustration: property listings
              were scattered, unverified and hard to trust. We set out to build a single premium
              marketplace where every home is checked, every agent is accountable and every buyer
              knows exactly what they are getting.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Today we serve buyers, sellers, landlords, agencies, developers and investors across
              more than forty countries — with a merchant platform that gives professionals the
              tools to run their portfolio from anywhere.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[
                ["18k", "Active listings"],
                ["6.4k", "Merchants"],
                ["40+", "Countries"],
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
      <Section title="What we stand for">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Transparency", "Clear pricing, honest descriptions and verified ownership."],
            ["Craft", "A premium experience for a decision that changes people's lives."],
            ["Access", "Global reach for professionals of every size, at a fair monthly price."],
          ].map(([t, d]) => (
            <div key={t} className="surface-card rounded-2xl p-6">
              <p className="text-sm font-semibold text-foreground">{t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}