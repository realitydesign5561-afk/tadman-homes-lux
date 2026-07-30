import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { PageHeader, Section, Field, PrimaryButton } from "@/components/page-shell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | Tadman Homes & Properties" },
      {
        name: "description",
        content:
          "Talk to the Tadman team about buying, selling, renting or becoming a merchant. We reply within one business day.",
      },
      { property: "og:title", content: "Contact Tadman Homes & Properties" },
      { property: "og:description", content: "We reply within one business day." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk property"
        subtitle="Questions about a listing, your subscription or selling with us? We're here."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            {[
              { icon: Mail, t: "Email", d: "support@tadmanhomes.com" },
              { icon: Phone, t: "Phone", d: "+1 (555) 010 8890" },
              { icon: MapPin, t: "Head office", d: "Unit 12, Harbour Plaza, Global City" },
            ].map((c) => (
              <div key={c.t} className="surface-card flex items-center gap-4 rounded-2xl p-6">
                <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
                  <c.icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.t}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{c.d}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="surface-card space-y-4 rounded-[1.75rem] p-7"
          >
            <Field label="Full name" placeholder="Jane Doe" />
            <Field label="Email" type="email" placeholder="jane@email.com" />
            <Field label="Subject" placeholder="How can we help?" />
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Message
              </span>
              <textarea
                rows={5}
                placeholder="Tell us a little more…"
                className="w-full rounded-2xl border border-border bg-secondary/60 p-4 text-sm outline-none focus:border-primary"
              />
            </label>
            <PrimaryButton type="submit">Send message</PrimaryButton>
          </form>
        </div>
      </Section>
    </>
  );
}