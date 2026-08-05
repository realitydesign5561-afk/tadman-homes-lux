import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Search, UserRound, LayoutDashboard, Heart, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useSettings } from "@/hooks/use-settings";
import logo from "@/assets/tadman-logo.jpg";

type NavItem = { to: string; label: string; children?: { to: string; label: string }[] };

const nav: NavItem[] = [
  { to: "/", label: "Home" },
  {
    to: "/properties",
    label: "Properties",
    children: [
      { to: "/buy", label: "Buy" },
      { to: "/sell", label: "Sell" },
      { to: "/rent", label: "Rent" },
      { to: "/pricing", label: "Pricing" },
    ],
  },
  { to: "/agents", label: "Our Agents" },
  { to: "/property-management", label: "Property Management" },
  { to: "/legal-team", label: "Legal Team" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
  {
    to: "/merchant",
    label: "List Property",
    children: [
 { to: "/merchant", label: "List Your Property" },
  { to: "/merchant/login", label: "Merchant Login" },
   ],
  },
];  
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { session, isAdmin } = useAuth();
  const settings = useSettings();
  const logoUrl = settings.brand.logo_url || logo;

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div className="glass-panel mx-auto flex max-w-[1240px] items-center gap-3 rounded-full px-3 py-2 shadow-card sm:px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 pl-1">
          <img
            src={logoUrl}
            alt={`${settings.brand.site_name} logo`}
            width={36}
            height={36}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="leading-tight">
  <h1 className="font-display text-sm font-extrabold">
    TADMAN
  </h1>
  <p className="text-[10px] text-muted-foreground">
    Homes & Properties
  </p>
</div>
        </Link>

        <nav className="mx-auto hidden items-center gap-0.5 xl:flex">
          {nav.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <Link
                  to={item.to}
                  activeProps={{ className: "bg-ink text-ink-foreground" }}
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                  <ChevronDown className="size-3.5" />
                </Link>
                <div className="invisible absolute left-0 top-full w-56 translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                  <div className="glass-panel rounded-2xl p-2 shadow-card">
                    {item.children.map((c) => (
                      <Link
                        key={c.to + c.label}
                        to={c.to}
                        className="block rounded-xl px-3 py-2 text-[13px] font-medium text-foreground/80 hover:bg-secondary"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-ink text-ink-foreground" }}
                className="rounded-full px-3 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <Link
            to="/properties"
            aria-label="Search properties"
            className="hidden size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground sm:flex"
          >
            <Search className="size-4" />
          </Link>
          {session && (
            <Link
              to="/favourites"
              aria-label="Saved properties"
              className="hidden size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-primary sm:flex"
            >
              <Heart className="size-4" />
            </Link>
          )}
         {isAdmin ? (
  <Link
    to="/admin"
    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-ink-foreground transition-opacity hover:opacity-90"
  >
    <LayoutDashboard className="size-3.5" />
    Admin
  </Link>
) : session ? (
  <Link
    to="/dashboard"
    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-ink-foreground transition-opacity hover:opacity-90"
  >
    <LayoutDashboard className="size-3.5" />
    Dashboard
  </Link>
) : (
  <Link
    to="/login"
    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-semibold text-ink-foreground transition-opacity hover:opacity-90"
  >
    <UserRound className="size-3.5" />
    Sign in
  </Link>
)}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-9 items-center justify-center rounded-full border border-border text-foreground xl:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="glass-panel mx-auto mt-2 max-h-[75vh] max-w-[1240px] overflow-y-auto rounded-3xl p-3 shadow-card xl:hidden">
          <div className="space-y-1">
            {nav.map((item) => (
              <div key={item.label}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="ml-3 border-l border-border pl-3">
                    {item.children.map((c) => (
                      <Link
                        key={c.to + c.label}
                        to={c.to}
                        onClick={() => setOpen(false)}
                        className="block rounded-2xl px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
