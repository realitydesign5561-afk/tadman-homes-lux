import prop1 from "@/assets/prop-1.jpg";
import prop2 from "@/assets/prop-2.jpg";
import prop3 from "@/assets/prop-3.jpg";
import hero from "@/assets/hero-villa.jpg";

export const propertyImages = { prop1, prop2, prop3, hero };

export type Property = {
  id: string;
  title: string;
  type: string;
  status: "For Sale" | "For Rent";
  price: string;
  period?: string;
  city: string;
  country: string;
  beds: number;
  baths: number;
  area: string;
  image: string;
  featured?: boolean;
  description: string;
  features: string[];
  agent: string;
};

export const properties: Property[] = [
  {
    id: "villa-azure-marbella",
    title: "Villa Azure",
    type: "Villa",
    status: "For Sale",
    price: "$2,450,000",
    city: "Marbella",
    country: "Spain",
    beds: 5,
    baths: 4,
    area: "480 m²",
    image: hero,
    featured: true,
    description:
      "A sculptural seafront villa with a 20-metre infinity pool, floor-to-ceiling glazing and mature palm gardens minutes from the marina.",
    features: ["Infinity pool", "Smart home", "Private garden", "3-car garage", "Sea view", "Staff quarters"],
    agent: "Diana Russell",
  },
  {
    id: "the-cedar-house",
    title: "The Cedar House",
    type: "House",
    status: "For Sale",
    price: "$860,000",
    city: "Austin",
    country: "United States",
    beds: 4,
    baths: 3,
    area: "310 m²",
    image: prop1,
    featured: true,
    description:
      "Warm cedar and concrete architecture on a quiet tree-lined street, with a double-height living room and landscaped native garden.",
    features: ["Double garage", "Home office", "Underfloor heating", "Solar panels"],
    agent: "Marcus Bell",
  },
  {
    id: "skyline-penthouse",
    title: "Skyline Penthouse",
    type: "Penthouse",
    status: "For Rent",
    price: "$5,900",
    period: "/month",
    city: "Dubai",
    country: "UAE",
    beds: 3,
    baths: 3,
    area: "220 m²",
    image: prop3,
    featured: true,
    description:
      "Full-floor penthouse with wraparound terraces, panoramic city views and concierge service in a landmark tower.",
    features: ["Concierge", "Gym & spa", "Private lift", "City view"],
    agent: "Amira Khalil",
  },
  {
    id: "harbour-view-apartment",
    title: "Harbour View Apartment",
    type: "Apartment",
    status: "For Rent",
    price: "$2,150",
    period: "/month",
    city: "Lisbon",
    country: "Portugal",
    beds: 2,
    baths: 2,
    area: "96 m²",
    image: prop2,
    description:
      "Bright corner apartment with a glass balcony overlooking the harbour, steps from cafés and the riverside promenade.",
    features: ["Balcony", "Elevator", "Furnished", "Parking"],
    agent: "João Ferreira",
  },
  {
    id: "palm-grove-duplex",
    title: "Palm Grove Duplex",
    type: "Duplex",
    status: "For Sale",
    price: "$540,000",
    city: "Lagos",
    country: "Nigeria",
    beds: 4,
    baths: 4,
    area: "265 m²",
    image: prop1,
    description:
      "A gated duplex in a serviced estate with 24/7 power, private courtyard and generous family living spaces.",
    features: ["Gated estate", "24/7 power", "Borehole", "CCTV"],
    agent: "Tunde Adeyemi",
  },
  {
    id: "riverside-commercial-suite",
    title: "Riverside Commercial Suite",
    type: "Commercial",
    status: "For Rent",
    price: "$7,400",
    period: "/month",
    city: "London",
    country: "United Kingdom",
    beds: 0,
    baths: 2,
    area: "410 m²",
    image: prop2,
    description:
      "Grade-A office floor with river frontage, raised access flooring and a fitted boardroom in a managed building.",
    features: ["Fibre internet", "Boardroom", "Bike storage", "24h access"],
    agent: "Helen Okafor",
  },
  {
    id: "olive-hill-land",
    title: "Olive Hill Land Parcel",
    type: "Land",
    status: "For Sale",
    price: "$180,000",
    city: "Paphos",
    country: "Cyprus",
    beds: 0,
    baths: 0,
    area: "1,200 m²",
    image: prop1,
    description:
      "Elevated building plot with sea glimpses, full planning permission granted for a two-storey residence.",
    features: ["Planning approved", "Utilities on site", "Sea glimpse"],
    agent: "Nikos Georgiou",
  },
  {
    id: "the-atrium-residence",
    title: "The Atrium Residence",
    type: "Apartment",
    status: "For Sale",
    price: "$1,120,000",
    city: "Singapore",
    country: "Singapore",
    beds: 3,
    baths: 2,
    area: "140 m²",
    image: prop3,
    description:
      "Refined residence with a double-height atrium, natural stone finishes and access to a rooftop garden.",
    features: ["Rooftop garden", "Pool", "Concierge", "Storage unit"],
    agent: "Wei Ling Tan",
  },
  {
    id: "coastal-white-villa",
    title: "Coastal White Villa",
    type: "Villa",
    status: "For Rent",
    price: "$9,300",
    period: "/month",
    city: "Santorini",
    country: "Greece",
    beds: 6,
    baths: 5,
    area: "520 m²",
    image: hero,
    description:
      "Whitewashed cliffside villa with heated pool, outdoor kitchen and uninterrupted caldera sunsets.",
    features: ["Heated pool", "Chef's kitchen", "Sunset terrace", "Housekeeping"],
    agent: "Elena Papadaki",
  },
];

export const propertyTypes = [
  "Apartment",
  "House",
  "Villa",
  "Penthouse",
  "Duplex",
  "Land",
  "Commercial",
];

export const locations = [
  { city: "Marbella", country: "Spain", count: 128 },
  { city: "Dubai", country: "UAE", count: 342 },
  { city: "London", country: "United Kingdom", count: 264 },
  { city: "Lagos", country: "Nigeria", count: 187 },
  { city: "Lisbon", country: "Portugal", count: 96 },
  { city: "Singapore", country: "Singapore", count: 74 },
];

export const agents = [
  { name: "Diana Russell", role: "Luxury Specialist", city: "Marbella, Spain", listings: 42, phone: "+34 600 112 233" },
  { name: "Marcus Bell", role: "Residential Agent", city: "Austin, USA", listings: 31, phone: "+1 512 555 0142" },
  { name: "Amira Khalil", role: "Investment Advisor", city: "Dubai, UAE", listings: 58, phone: "+971 50 221 8890" },
  { name: "Tunde Adeyemi", role: "Estate Consultant", city: "Lagos, Nigeria", listings: 27, phone: "+234 803 220 1188" },
  { name: "Elena Papadaki", role: "Villa Rentals Lead", city: "Santorini, Greece", listings: 19, phone: "+30 694 118 2200" },
  { name: "Wei Ling Tan", role: "Urban Homes Expert", city: "Singapore", listings: 36, phone: "+65 8123 4477" },
];

export const posts = [
  {
    slug: "global-property-outlook",
    title: "The 2026 Global Property Outlook",
    excerpt: "Where prime residential yields are heading across eight key markets this year.",
    category: "Market Insight",
    date: "12 Jul 2026",
    image: prop2,
  },
  {
    slug: "buying-abroad-checklist",
    title: "Buying Abroad: A 10-Point Checklist",
    excerpt: "Everything to verify before you wire a deposit on an overseas property.",
    category: "Guides",
    date: "28 Jun 2026",
    image: prop1,
  },
  {
    slug: "staging-that-sells",
    title: "Staging That Actually Sells",
    excerpt: "Small, inexpensive changes that measurably shorten time on market.",
    category: "Selling",
    date: "09 Jun 2026",
    image: prop3,
  },
];

export const testimonials = [
  {
    quote:
      "Tadman made my first home purchase smooth and stress free. Every question was answered within the hour.",
    name: "Amanda Ricky",
    role: "Buyer, Jakarta",
  },
  {
    quote:
      "Professional, responsive and genuinely helpful. They made relocating feel easy, even from another country.",
    name: "Lisa & Marcus T.",
    role: "Couple, Clients",
  },
  {
    quote:
      "Our agency listed 40 units in the first month. The merchant dashboard pays for itself.",
    name: "Kevin Miller",
    role: "Investor",
  },
];