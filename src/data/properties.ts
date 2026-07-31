import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";
import hero from "@/assets/hero-villa.jpg";

// Static design assets only. All listing, agent, blog and testimonial content is
// loaded from Supabase — see src/lib/properties.ts and src/lib/content.ts.
export const propertyImages = { prop1, prop2, prop3, hero };

export type { Property } from "@/lib/properties";

export const propertyTypes = [
  "Apartment",
  "House",
  "Villa",
  "Penthouse",
  "Duplex",
  "Land",
  "Commercial",
];
