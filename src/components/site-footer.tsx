import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import logo from "@/assets/tadman-logo.jpg.asset.json";

const columns = [
  {
    title: "Company",
    links: [
      { to: "/", label: "Home" },
      { to: "/properties", label: "Properties" },
      { to: "/about", label: "About Us" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Marketplace",
    links: [
      { to: "/buy", label: "Buy" },
      { to: "/rent", label: "Rent" },
      { to: "/sell", label: "Sell" },
      { to: "/agents", label: "Agents" },
    ],
  },
  {
    title: "Merchants",
    links: [
      { to: "/merchant", label: "Become a Merchant" },
      { to: "/pricing", label: "Pricing" },
      { to: "/register", label: "Register" },
      { to: "/login", label: "Login" },
    ],
  },
  {
    title: "Resources",
    links: [
      { to: "/blog", label: "Blog" },
      { to: "/privacy", label: "Privacy Policy" },
      { to: "/terms", label: "Terms" },
      { to: "/forgot-password", label: "Reset Password" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="px-3 pb-4 sm:px-5">
      <div className="mx-auto max-w-[1240px] rounded-[2rem] bg-ink px-6 py-12 text-ink-foreground sm:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_2.6fr]">
          <div>
            <div className="flex items-center gap-3">
              <img
                src={logo.url}
                alt="Tadman Homes and Properties"
                width={44}
                height={44}
                loading="lazy"
                className="size-11 rounded-xl object-cover"
              />
              <div>
                <p className="font-display text-base font-bold">Tadman Homes &amp; Properties</p>
                <p className="text-xs text-ink-foreground/60">Connecting buyers to sellers with ease.</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm text-ink-foreground/60">
              Buy, sell &amp; rent premium properties worldwide. One marketplace for buyers,
              landlords, agencies and developers.
            </p>
            <div className="mt-5 flex gap-2">
              {[Twitter, Facebook, Linkedin, Instagram].map((Icon, i) => (
                <span
                  key={i}
                  className="flex size-9 items-center justify-center rounded-full border border-ink-foreground/15 text-ink-foreground/70"
                >
                  <Icon className="size-4" />
                </span>
              ))}
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
          <p>© 2026 Tadman Homes &amp; Properties. All rights reserved.</p>
          <p>Buy, Sell &amp; Rent Premium Properties Worldwide.</p>
        </div>
      </div>
    </footer>
  );
}