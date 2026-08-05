import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Twitter, MapPin, Phone, Mail } from "lucide-react";
import { useSettings } from "@/hooks/use-settings";
import logo from "@/assets/tadman-logo.jpg";

const columns = [
  {
    title: "Company",
    links: [
      { to: "/", label: "Home" },
      { to: "/about", label: "About Us" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Marketplace",
    links: [
      { to: "/properties", label: "All Properties" },
      { to: "/properties?type=buy", label: "Buy" },
      { to: "/properties?type=rent", label: "Rent" },
      { to: "/properties?type=land", label: "Land" },
    ],
  },
  {
    title: "Services",
    links: [
      { to: "/pricing", label: "Pricing" },
      { to: "/blog", label: "Blog" },
      { to: "/faq", label: "FAQ" },
     ],
  },
  {
    title: "Merchants",
    links: [
      { to: "/merchant", label: "Become a Merchant" },
      { to: "/merchant/login", label: "Merchant Dashboard" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms & Conditions" },
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
                src={brand.logo_url || logo}
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
            <p className="mt-5 max-w-sm text-sm text-ink-foreground/60">Buy, sell and rent verified properties worldwide with confidence. Connecting buyers, sellers and investors through a trusted real estate marketplace.</p>
            <ul className="mt-5 space-y-2 text-sm text-ink-foreground/70">
              <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0" />26 Adisa Akintoye Street, Ketu Alapere, Lagos.</li>
              <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0" />Hotline: 07031556176</li>
              <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0" />WhatsApp: 09117511768</li>
              <li className="flex gap-2"><Mail className="mt-0.5 size-4 shrink-0" />
                <div>
             <div>tadmanhomes@gmail.com</div>
             <div>ralphconsult99@gmail.com</div>
         </div>
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
          <p>Buy • Sell • Rent Premium Properties Worldwide</p>
        </div>
      </div>
    </footer>
  );
}
