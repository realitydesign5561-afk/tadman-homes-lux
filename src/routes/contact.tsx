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

          <form onSubmit={handleSubmit} className="surface-card space-y-4 rounded-[1.75rem] p-7">
            <Field
              label="Full name"
              required
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Field
              label="Email"
              type="email"
              required
              placeholder="jane@email.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Field
              label="Subject"
              placeholder="How can we help?"
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
                placeholder="Tell us a little more…"
                className="w-full rounded-2xl border border-border bg-secondary/60 p-4 text-sm outline-none focus:border-primary"
              />
            </label>
            {status === "sent" && (
              <p className="text-sm text-primary">Thanks — we'll reply within one business day.</p>
            )}
            {status === "error" && (
              <p className="text-sm text-destructive">Your message could not be sent.</p>
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