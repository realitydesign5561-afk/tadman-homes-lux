import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import logo from "@/assets/tadman-logo.jpg.asset.json";

const columns = [
  {
    title: "Company",
    links: [
      { to: "/", label: "Home" },
      { to: "/about", label: "About" },
      { to: "/agents", label: "Our Agents" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Marketplace",
    links: [
      { to: "/properties", label: "Properties" },
      { to: "/buy", label: "Buy" },
      { to: "/rent", label: "Rent" },
      { to: "/sell", label: "Sell" },
    ],
  },
  {
    title: "Services",
    links: [
      { to: "/property-management", label: "Property Management" },
      { to: "/legal-team", label: "Legal Team" },
      { to: "/pricing", label: "Pricing" },
      { to: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Merchants",
    links: [
      { to: "/merchant", label: "Become a Merchant" },
      { to: "/merchant/login", label: "Merchant Login" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms" },
    ],
  },
];

export function SiteFooter() {
  const settings = useSettings();

const brand = settings?.brand ?? {};
const contact = settings?.contact ?? {};
const footer = settings?.footer ?? {};
  const socials = [
  { Icon: Twitter, href: footer?.socials?.x },
  { Icon: Facebook, href: footer?.socials?.facebook },
  { Icon: Linkedin, href: footer?.socials?.linkedin },
  { Icon: Instagram, href: footer?.socials?.instagram },
];

  return (
    <footer className="px-3 pb-4 sm:px-5">
      <div className="mx-auto max-w-[1240px] rounded-[2rem] bg-ink px-6 py-12 text-ink-foreground sm:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2.6fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={brand.logo_url || logo.url}
                alt={brand.site_name || "Tadman Homes"}
                width={44}
                height={44}
                loading="lazy"
                className="size-11 rounded-xl object-cover"
              />
              <div>
                <p className="font-display text-base font-bold">
                  {brand.site_name || "Tadman Homes"}
                </p>
                <p className="text-xs text-ink-foreground/60">{brand.motto}</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm text-ink-foreground/60">{footer.about}</p>

            <ul className="mt-5 space-y-2 text-sm text-ink-foreground/70">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0" />
                {contact.address}
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 size-4 shrink-0" />
                <span>
                  <a href={`tel:${contact.phone}`} className="hover:text-ink-foreground">
                    {contact.phone}
                  </a>
                  {contact.whatsapp && <> · WhatsApp {contact.whatsapp}</>}
                </span>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 size-4 shrink-0" />
                <span>
                  <a href={`mailto:${contact.email}`} className="hover:text-ink-foreground">
                    {contact.email}
                  </a>
                  {contact.email_secondary && (
                    <>
                      {" · "}
                      <a
                        href={`mailto:${contact.email_secondary}`}
                        className="hover:text-ink-foreground"
                      >
                        {contact.email_secondary}
                      </a>
                    </>
                  )}
                </span>
              </li>
              {contact.hours && (
                <li className="flex gap-2">
                  <Clock className="mt-0.5 size-4 shrink-0" />
                  {contact.hours}
                </li>
              )}
            </ul>

            <div className="mt-5 flex gap-2">
              {socials.map(({ Icon, href }, i) =>
                href ? (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-9 items-center justify-center rounded-full border border-ink-foreground/15 text-ink-foreground/70 transition-colors hover:text-ink-foreground"
                  >
                    <Icon className="size-4" />
                  </a>
                ) : (
                  <span
                    key={i}
                    className="flex size-9 items-center justify-center rounded-full border border-ink-foreground/15 text-ink-foreground/40"
                  >
                    <Icon className="size-4" />
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="text-xs font-semibold uppercase tracking-widest text-ink-foreground/50">
                  {col.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.to + l.label}>
                      <Link
                        to={l.to}
                        className="text-sm text-ink-foreground/75 transition-colors hover:text-ink-foreground"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-ink-foreground/10 pt-6 text-xs text-ink-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
  © {new Date().getFullYear()} {brand.site_name || "Tadman Homes"}. All rights reserved.
</p>
          <p>{brand.motto || ""}</p>
        </div>
      </div>
    </footer>
  );
}
