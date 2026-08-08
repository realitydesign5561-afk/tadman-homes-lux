import { supabase } from "@/lib/supabase";

export type AgentRow = {
  id: string;
  full_name: string;
  title: string | null;
  bio: string | null;
  photo_url: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
};

export async function fetchAgents(): Promise<AgentRow[]> {
  const { data, error } = await supabase
    .from("agents")
    .select("id, full_name, title, bio, photo_url, email, phone, whatsapp")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as AgentRow[];
}

export type BlogPostRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
};

export async function fetchPosts(): Promise<BlogPostRow[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as BlogPostRow[];
}

export type TestimonialRow = {
  id: string;
  author_name: string;
  author_role: string | null;
  content: string;
};

export async function fetchTestimonials(): Promise<TestimonialRow[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("id, author_name, author_role, content")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as TestimonialRow[];
}

export type LocationCount = { city: string; country: string; count: number };

export async function fetchLocations(): Promise<LocationCount[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("city, country")
    .eq("status", "approved");
  if (error) throw error;
  const map = new Map<string, LocationCount>();
  for (const row of (data ?? []) as { city: string | null; country: string | null }[]) {
    if (!row.city) continue;
    const key = `${row.city}|${row.country ?? ""}`;
    const found = map.get(key);
    if (found) found.count += 1;
    else map.set(key, { city: row.city, country: row.country ?? "", count: 1 });
  }
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 6);
}

export async function submitContactRequest(input: {
  name: string;
  email?: string;
  phone?: string;
  subject?: string;
  message: string;
  property_id?: string;
  merchant_id?: string;
  source?: string;
}) {
  const { error } = await supabase.from("contact_requests").insert(input);
  if (error) throw error;
}

export type SubscriptionPlan = {
  id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  interval: string;
  listing_limit: number | null;
  features: string[];
};

const STATIC_PLANS: SubscriptionPlan[] = [
  {
    id: "static-starter",
    name: "Starter",
    slug: "starter",
    price: 9900,
    currency: "NGN",
    interval: "month",
    listing_limit: 5,
    features: ["Up to 5 property listings", "Basic analytics", "Email support"],
  },
  {
    id: "static-professional",
    name: "Professional",
    slug: "professional",
    price: 24900,
    currency: "NGN",
    interval: "month",
    listing_limit: 20,
    features: [
      "Up to 20 property listings",
      "Featured placements",
      "Priority support",
      "Enquiry management",
    ],
  },
  {
    id: "static-enterprise",
    name: "Enterprise",
    slug: "enterprise",
    price: 59900,
    currency: "NGN",
    interval: "month",
    listing_limit: null,
    features: [
      "Unlimited listings",
      "Top featured placement",
      "Dedicated account manager",
      "Advanced analytics",
      "API access",
    ],
  },
];

export async function fetchPlans(): Promise<SubscriptionPlan[]> {
  try {
    const { data, error } = await supabase
      .from("subscription_plans")
      .select("id, name, slug, price, currency, interval, listing_limit, features")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error) throw error;
    const rows = (data ?? []) as SubscriptionPlan[];
    return rows.length > 0 ? rows : STATIC_PLANS;
  } catch {
    return STATIC_PLANS;
  }
}

export type FaqRow = { id: string; question: string; answer: string; category: string | null };

export async function fetchFaqs(category?: string): Promise<FaqRow[]> {
  let query = supabase
    .from("faqs")
    .select("id, question, answer, category")
    .eq("is_published", true)
    .order("sort_order", { ascending: true });
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as FaqRow[];
}

export type BlogPostDetail = BlogPostRow & { content: string | null };

export async function fetchPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, cover_image, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();
  if (error) throw error;
  return (data as BlogPostDetail) ?? null;
}

export async function subscribeNewsletter(email: string, source = "homepage") {
  const { error } = await supabase.from("newsletter_subscribers").insert({ email, source });
  if (error && !error.message.toLowerCase().includes("duplicate")) throw error;
}

export type ManagementRequestInput = {
  full_name: string;
  email?: string;
  phone?: string;
  property_address?: string;
  property_type?: string;
  service?: string;
  message?: string;
};

export async function submitManagementRequest(input: ManagementRequestInput) {
  const { error } = await supabase.from("property_management_requests").insert(input);
  if (error) throw error;
}
