import { supabase } from "@/lib/supabase";
import { logActivity } from "@/lib/admin";

/* ------------------------------ testimonials ----------------------------- */

export type TestimonialAdminRow = {
  id?: string;
  author_name: string;
  author_role: string | null;
  content: string;
  rating?: number | null;
  is_published: boolean;
  sort_order?: number | null;
};

export async function fetchAllTestimonials(): Promise<TestimonialAdminRow[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return (data ?? []) as TestimonialAdminRow[];
}

export async function upsertTestimonial(row: TestimonialAdminRow) {
  const { error } = await supabase.from("testimonials").upsert(row);
  if (error) throw error;
  await logActivity(row.id ? "Updated testimonial" : "Added testimonial", "testimonial", row.id);
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw error;
  await logActivity("Deleted testimonial", "testimonial", id);
}

/* ---------------------------------- faqs --------------------------------- */

export type FaqAdminRow = {
  id?: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order?: number | null;
};

export async function fetchAllFaqs(): Promise<FaqAdminRow[]> {
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return (data ?? []) as FaqAdminRow[];
}

export async function upsertFaq(row: FaqAdminRow) {
  const { error } = await supabase.from("faqs").upsert(row);
  if (error) throw error;
  await logActivity(row.id ? "Updated FAQ" : "Added FAQ", "faq", row.id);
}

export async function deleteFaq(id: string) {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
  await logActivity("Deleted FAQ", "faq", id);
}

/* ------------------------------- blog posts ------------------------------ */

export type BlogAdminRow = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  is_published: boolean;
  published_at?: string | null;
};

export async function fetchAllPosts(): Promise<BlogAdminRow[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as BlogAdminRow[];
}

export async function upsertPost(row: BlogAdminRow) {
  const payload = {
    ...row,
    published_at: row.is_published ? (row.published_at ?? new Date().toISOString()) : null,
  };
  const { error } = await supabase.from("blog_posts").upsert(payload);
  if (error) throw error;
  await logActivity(row.id ? "Updated blog post" : "Added blog post", "blog_post", row.id);
}

export async function deletePost(id: string) {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw error;
  await logActivity("Deleted blog post", "blog_post", id);
}

/* ------------------------------- navigation ------------------------------ */

export type NavRow = {
  id?: string;
  label: string;
  href: string;
  parent_id: string | null;
  sort_order: number | null;
  is_active: boolean;
};

export async function fetchNavigation(): Promise<NavRow[]> {
  const { data, error } = await supabase
    .from("navigation_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return (data ?? []) as NavRow[];
}

export async function upsertNavItem(row: NavRow) {
  const { error } = await supabase.from("navigation_items").upsert(row);
  if (error) throw error;
  await logActivity(row.id ? "Updated nav item" : "Added nav item", "navigation", row.id);
}

export async function deleteNavItem(id: string) {
  const { error } = await supabase.from("navigation_items").delete().eq("id", id);
  if (error) throw error;
  await logActivity("Deleted nav item", "navigation", id);
}

/* ------------------------------ notifications ---------------------------- */

export type NotificationRow = {
  id: string;
  title: string;
  body: string | null;
  audience: string | null;
  is_read: boolean | null;
  created_at: string;
};

export async function fetchNotifications(audience?: string): Promise<NotificationRow[]> {
  let q = supabase
    .from("notifications")
    .select("id, title, body, audience, is_read, created_at")
    .order("created_at", { ascending: false })
    .limit(50);
  if (audience) q = q.eq("audience", audience);
  const { data, error } = await q;
  if (error) return [];
  return (data ?? []) as NotificationRow[];
}

export async function createNotification(title: string, body: string, audience: string) {
  const { error } = await supabase.from("notifications").insert({ title, body, audience });
  if (error) throw error;
  await logActivity("Sent notification", "notification");
}

export async function markNotificationRead(id: string) {
  await supabase.from("notifications").update({ is_read: true }).eq("id", id);
}

export async function deleteNotification(id: string) {
  await supabase.from("notifications").delete().eq("id", id);
}
