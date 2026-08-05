import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { PageHeader, Section, Field, PrimaryButton } from "@/components/page-shell";
import { submitContactRequest } from "@/lib/content";

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
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitContactRequest({ ...form, source: "contact-page" });
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Contact Tadman Homes & Properties"
        subtitle="Need help buying, selling, renting or listing a property? Our team is ready to assist you."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-4">
            {[
              {
                icon: Mail,
                t: "Email",
                d: "tadmanhomes@gmail.com\nralphconsult99@gmail.com",
              },
              {
                icon: Phone,
                t: "Hotline",
                d: "07031556176\nWhatsApp: 09117511768",
              },
              {
                icon: MapPin,
                t: "Office Address",
                d: "26 Adisa Akintoye Street, Ketu Alapere, Lagos, Nigeria",
               },
              ].map((c) => (
              <div key={c.t} className="surface-card flex items-center gap-4 rounded-2xl p-6">
                <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
                  <c.icon className="size-5" />
                </span>
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{c.t}</p>
                  <p className="mt-1 whitespace-pre-line text-sm font-semibold text-foreground">{c.d}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="surface-card space-y-4 rounded-[1.75rem] p-7">
            <Field
              label="Full name"
              required
              placeholder="Your full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Field
              label="Email"
              type="email"
              required
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Field
              label="Subject"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Message
              </span>
              <textarea
                rows={5}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us how we can help..."
                className="w-full rounded-2xl border border-border bg-secondary/60 p-4 text-sm outline-none focus:border-primary"
              />
            </label>
            {status === "sent" && (
              <p className="text-sm text-primary">Your message has been received. Our team will contact you shortly.</p>
            )}
            {status === "error" && (
              <p className="text-sm text-destructive">Unable to send your message. Please try again later.</p>
            )}
            <PrimaryButton type="submit" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send message"}
            </PrimaryButton>
          </form>
        </div>
      </Section>
    </>
  );
}
