import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search, UserRound } from "lucide-react";
import logo from "@/assets/tadman-logo.jpg.asset.json";

const nav = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/buy", label: "Buy" },
  { to: "/rent", label: "Rent" },
  { to: "/sell", label: "Sell" },
  { to: "/agents", label: "Agents" },
  { to: "/pricing", label: "Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="glass-panel mx-auto flex max-w-[1240px] items-center gap-3 rounded-full px-3 py-2 shadow-card sm:px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 pl-1">
          <img
            src={logo.url}
            alt="Tadman Homes and Properties logo"
            width={36}
            height={36}
            className="size-9 rounded-full object-cover"
          />
          <span className="font-display text-sm font-extrabold tracking-tight text-foreground sm:text-base">
            TADMAN
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-0.5 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-ink text-ink-foreground" }}
              className="rounded-full px-3.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            to="/properties"
            aria-label="Search properties"
            className="hidden size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            <Search className="size-4" />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-ink-foreground transition-opacity hover:opacity-90"
          >
            <UserRound className="size-3.5" />
            Sign in
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="glass-panel mx-auto mt-2 max-w-[1240px] rounded-3xl p-3 shadow-card lg:hidden">
          <div className="grid grid-cols-2 gap-1">
            {nav.concat([{ to: "/merchant", label: "Become a Merchant" }]).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}