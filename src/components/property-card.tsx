import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, Heart, MapPin, Maximize } from "lucide-react";
import type { Property } from "@/data/properties";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="surface-card group overflow-hidden rounded-[1.6rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={`${property.title} in ${property.city}`}
          loading="lazy"
          width={900}
          height={700}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[11px] font-semibold text-ink-foreground backdrop-blur">
          {property.status}
        </span>
        <button
          type="button"
          aria-label="Save to favourites"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-card/85 text-foreground backdrop-blur transition-colors hover:text-primary"
        >
          <Heart className="size-4" />
        </button>
      </div>

      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">{property.title}</h3>
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5" />
              {property.city}, {property.country}
            </p>
          </div>
          <p className="whitespace-nowrap font-display text-base font-bold text-primary">
            {property.price}
            <span className="text-xs font-medium text-muted-foreground">{property.period}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <BedDouble className="size-4" /> {property.beds} beds
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="size-4" /> {property.baths} baths
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="size-4" /> {property.area}
          </span>
        </div>

        <Link
          to="/properties/$propertyId"
          params={{ propertyId: property.id }}
          className="inline-flex w-full items-center justify-center rounded-full bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-ink hover:text-ink-foreground"
        >
          View details
        </Link>
      </div>
    </article>
  );
}