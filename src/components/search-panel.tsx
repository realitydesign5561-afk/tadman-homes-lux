import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { propertyTypes } from "@/data/properties";

export type PropertySearch = {
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  keyword?: string;
  price?: string;
  beds?: string;
  baths?: string;
  type?: string;
  status?: string;
};

const priceOptions = ["Any price", "Under $250k", "$250k – $750k", "$750k – $2M", "$2M+"];
const bedOptions = ["Any", "1+", "2+", "3+", "4+", "5+"];
const bathOptions = ["Any", "1+", "2+", "3+", "4+"];
const statusOptions = ["Any status", "For Sale", "For Rent"];

export function priceRange(value?: string): { minPrice?: number; maxPrice?: number } {
  switch (value) {
    case "Under $250k":
      return { maxPrice: 250_000 };
    case "$250k – $750k":
      return { minPrice: 250_000, maxPrice: 750_000 };
    case "$750k – $2M":
      return { minPrice: 750_000, maxPrice: 2_000_000 };
    case "$2M+":
      return { minPrice: 2_000_000 };
    default:
      return {};
  }
}

export function minFrom(value?: string): number | undefined {
  if (!value || value === "Any") return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isNaN(n) ? undefined : n;
}

const inputClass =
  "h-11 w-full rounded-full border border-border bg-secondary/60 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary focus:bg-card";
const selectClass =
  "h-11 w-full appearance-none rounded-full border border-border bg-secondary/60 px-4 text-sm text-foreground outline-none focus:border-primary focus:bg-card";

export function SearchPanel({ initial = {} }: { initial?: PropertySearch }) {
  const navigate = useNavigate();
  const [values, setValues] = useState<PropertySearch>(initial);

  const set = (key: keyof PropertySearch) => (v: string) =>
    setValues((prev) => ({ ...prev, [key]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const search: PropertySearch = {};
    (Object.keys(values) as (keyof PropertySearch)[]).forEach((k) => {
      const v = values[k]?.trim();
      if (v && !v.startsWith("Any")) search[k] = v;
    });
    navigate({ to: "/properties", search });
  }

  const textFields: { key: keyof PropertySearch; label: string; placeholder: string }[] = [
    { key: "country", label: "Country", placeholder: "Any country" },
    { key: "state", label: "State", placeholder: "Any state" },
    { key: "city", label: "City", placeholder: "Any city" },
    { key: "area", label: "Area", placeholder: "Neighbourhood" },
    { key: "keyword", label: "Keyword", placeholder: "Pool, sea view…" },
  ];

  const selectFields: { key: keyof PropertySearch; label: string; options: string[] }[] = [
    { key: "price", label: "Price", options: priceOptions },
    { key: "beds", label: "Bedrooms", options: bedOptions },
    { key: "baths", label: "Bathrooms", options: bathOptions },
    { key: "type", label: "Property Type", options: ["Any type", ...propertyTypes] },
    { key: "status", label: "Property Status", options: statusOptions },
  ];

  return (
    <form onSubmit={handleSubmit} className="surface-card rounded-[1.75rem] p-4 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {textFields.map((f) => (
          <label key={f.key} className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {f.label}
            </span>
            <input
              type="text"
              placeholder={f.placeholder}
              value={values[f.key] ?? ""}
              onChange={(e) => set(f.key)(e.target.value)}
              className={inputClass}
            />
          </label>
        ))}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {selectFields.map((s) => (
          <label key={s.key} className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {s.label}
            </span>
            <select
              value={values[s.key] ?? s.options[0]}
              onChange={(e) => set(s.key)(e.target.value)}
              className={selectClass}
            >
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
