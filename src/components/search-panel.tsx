import { Search } from "lucide-react";
import { propertyTypes } from "@/data/properties";

const fields = [
  { label: "Country", placeholder: "Any country" },
  { label: "State", placeholder: "Any state" },
  { label: "City", placeholder: "Any city" },
  { label: "Area", placeholder: "Neighbourhood" },
  { label: "Keyword", placeholder: "Pool, sea view…" },
];

const selects = [
  { label: "Price", options: ["Any price", "Under $250k", "$250k – $750k", "$750k – $2M", "$2M+"] },
  { label: "Bedrooms", options: ["Any", "1+", "2+", "3+", "4+", "5+"] },
  { label: "Bathrooms", options: ["Any", "1+", "2+", "3+", "4+"] },
  { label: "Property Type", options: ["Any type", ...propertyTypes] },
  { label: "Property Status", options: ["Any status", "For Sale", "For Rent"] },
];

export function SearchPanel() {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="surface-card rounded-[1.75rem] p-4 sm:p-6"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {fields.map((f) => (
          <label key={f.label} className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {f.label}
            </span>
            <input
              type="text"
              placeholder={f.placeholder}
              className="h-11 w-full rounded-full border border-border bg-secondary/60 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:bg-card"
            />
          </label>
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {selects.map((s) => (
          <label key={s.label} className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {s.label}
            </span>
            <select className="h-11 w-full appearance-none rounded-full border border-border bg-secondary/60 px-4 text-sm text-foreground outline-none focus:border-primary focus:bg-card">
              {s.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-8 text-sm font-semibold text-ink-foreground transition-opacity hover:opacity-90 sm:w-auto"
      >
        <Search className="size-4" />
        Find Properties
      </button>
    </form>
  );
}