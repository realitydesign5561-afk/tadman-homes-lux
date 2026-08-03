import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react";
import { Field, PageHeader, PrimaryButton, Section } from "@/components/page-shell";
import { PropertyForm } from "@/components/property-form";
import { supabase } from "@/lib/supabase";
import { formatPrice, type PropertyRow } from "@/lib/properties";
import {
  deleteAgent,
  deleteEnquiry,
  deleteManagementRequest,
  deleteMerchant,
  deleteProperty,
  fetchActivity,
  fetchAdminUsers,
  fetchAllAgents,
  fetchAllProperties,
  fetchEnquiries,
  fetchManagementRequests,
  fetchMerchants,
  fetchOverview,
  fetchSubscriptions,
  setMerchantStatus,
  setPropertyStatus,
  updateEnquiry,
  updateManagementRequest,
  updateProperty,
  upsertAgent,
  changeOwnPassword,
  type AdminAgentRow,
} from "@/lib/admin";
import {
  deleteFaq,
  deletePost,
  deleteTestimonial,
  fetchAllFaqs,
  fetchAllPosts,
  fetchAllTestimonials,
  upsertFaq,
  upsertPost,
  upsertTestimonial,
  type BlogAdminRow,
  type FaqAdminRow,
  type TestimonialAdminRow,
} from "@/lib/cms";
import { defaultSettings, fetchSettings, saveSetting, type SiteSettings } from "@/lib/settings";
import { supabase as sb } from "@/lib/supabase";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/login" });
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin");
    if (!roles || roles.length === 0) throw redirect({ to: "/dashboard" });
    return { userId: data.user.id };
  },
  head: () => ({
    meta: [
      { title: "Admin Panel | Tadman Homes & Properties" },
      { name: "description", content: "Manage listings, merchants, agents, content and settings." },
      { property: "og:title", content: "Admin Panel | Tadman Homes" },
      { property: "og:description", content: "Internal CMS for Tadman Homes and Properties." },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  "Overview",
  "Properties",
  "Merchants",
  "Agents",
  "Enquiries",
  "Management",
  "Content",
  "Settings",
  "Activity",
] as const;
type Tab = (typeof TABS)[number];

const card = "surface-card rounded-2xl p-5";
const chip = "rounded-full border border-border px-3 py-1.5 text-xs font-semibold";
const chipDark = "rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-ink-foreground";

function AdminPage() {
  const { userId } = Route.useRouteContext();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <>
      <PageHeader
  eyebrow="Administration"
  title="Admin dashboard"
  subtitle="Manage the entire Tadman Homes platform from one place."
>
  <button
    type="button"
    onClick={async () => {
      await signOut();
      navigate({ to: "/login", replace: true });
    }}
    className="inline-flex h-11 items-center rounded-full border border-border bg-card px-5 text-sm font-semibold"
  >
    Sign Out
  </button>
</PageHeader>
      <Section>
        <div className="mb-8 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-xs font-semibold ${
                tab === t ? "bg-ink text-ink-foreground" : "border border-border bg-card"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Overview" && <OverviewTab />}
        {tab === "Properties" && <PropertiesTab userId={userId} />}
        {tab === "Merchants" && <MerchantsTab />}
        {tab === "Agents" && <AgentsTab />}
        {tab === "Enquiries" && <EnquiriesTab />}
        {tab === "Management" && <ManagementTab />}
        {tab === "Content" && <ContentTab />}
        {tab === "Settings" && <SettingsTab />}
        {tab === "Activity" && <ActivityTab />}
      </Section>
    </>
  );
}

/* -------------------------------- overview ------------------------------- */

function OverviewTab() {
  const overview = useQuery({ queryKey: ["admin-overview"], queryFn: fetchOverview });
  const activity = useQuery({ queryKey: ["admin-activity"], queryFn: () => fetchActivity(8) });

  const o = overview.data;
  const cards = [
    { label: "Properties", value: o?.properties ?? 0 },
    { label: "Merchants", value: o?.merchants ?? 0 },
    { label: "Agents", value: o?.agents ?? 0 },
    { label: "Enquiries", value: o?.enquiries ?? 0 },
    { label: "Management requests", value: o?.management ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className={card}>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</p>
            <p className="mt-2 font-display text-2xl font-bold text-foreground">{c.value}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Recent activity</h3>
        <div className="space-y-2">
          {(activity.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
          ) : (
            (activity.data ?? []).map((a) => (
              <div key={a.id} className="rounded-xl border border-border px-4 py-3 text-sm">
                <span className="font-semibold text-foreground">{a.action}</span>{" "}
                <span className="text-xs text-muted-foreground">
                  {a.actor_name ?? "system"} • {new Date(a.created_at).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- properties ------------------------------ */

function PropertiesTab({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<PropertyRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [filter, setFilter] = useState("all");

  const list = useQuery({ queryKey: ["admin-properties"], queryFn: fetchAllProperties });
  const agents = useQuery({ queryKey: ["admin-agents"], queryFn: fetchAllAgents });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-properties"] });

  const status = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => setPropertyStatus(id, value),
    onSuccess: invalidate,
  });
  const feature = useMutation({
    mutationFn: ({ id, value }: { id: string; value: boolean }) =>
      updateProperty(id, { is_featured: value }),
    onSuccess: invalidate,
  });
  const remove = useMutation({ mutationFn: deleteProperty, onSuccess: invalidate });

  const rows = (list.data ?? []).filter((r) => filter === "all" || r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {["all", "draft", "pending", "approved", "rejected", "sold", "rented"].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={filter === f ? chipDark : chip + " capitalize"}
          >
            {f}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            setCreating((v) => !v);
            setEditing(null);
          }}
          className="ml-auto rounded-full bg-ink px-4 py-2 text-xs font-semibold text-ink-foreground"
        >
          {creating ? "Close" : "New listing"}
        </button>
      </div>

      {(creating || editing) && (
        <PropertyForm
  userId={userId}
  merchantId="332a1140-ab52-4fd3-a7e5-3c5da93a935b"
  property={editing}
  agents={(agents.data ?? []).map((a) => ({ id: a.id, full_name: a.full_name }))}
  canFeature
  canPublish
          onDone={() => {
            setCreating(false);
            setEditing(null);
            invalidate();
          }}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}

      {list.isLoading ? (
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No listings in this view.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((p) => (
            <div key={p.id} className={card}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {[p.city, p.country].filter(Boolean).join(", ")} • {p.listing_type}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-semibold">
                  {p.status}
                </span>
              </div>
              <p className="mt-2 font-display text-sm font-bold text-primary">
                {formatPrice(p.price, p.currency)}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={() => setEditing(p)} className={chip}>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => status.mutate({ id: p.id, value: "approved" })}
                  className={chipDark}
                >
                  Publish
                </button>
                <button
                  type="button"
                  onClick={() => status.mutate({ id: p.id, value: "rejected" })}
                  className={chip}
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={() => status.mutate({ id: p.id, value: "sold" })}
                  className={chip}
                >
                  Sold
                </button>
                <button
                  type="button"
                  onClick={() => status.mutate({ id: p.id, value: "rented" })}
                  className={chip}
                >
                  Rented
                </button>
                <button
                  type="button"
                  onClick={() => feature.mutate({ id: p.id, value: !p.is_featured })}
                  className={chip}
                >
                  {p.is_featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  type="button"
                  onClick={() => remove.mutate(p.id)}
                  className={chip + " text-destructive"}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- merchants ------------------------------ */

function MerchantsTab() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["admin-merchants"], queryFn: fetchMerchants });
  const subs = useQuery({ queryKey: ["admin-subscriptions"], queryFn: fetchSubscriptions });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-merchants"] });

  const status = useMutation({
    mutationFn: ({ id, value }: { id: string; value: string }) => setMerchantStatus(id, value),
    onSuccess: invalidate,
  });
  const remove = useMutation({ mutationFn: deleteMerchant, onSuccess: invalidate });

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {(list.data ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">No merchants registered yet.</p>
      )}
      {(list.data ?? []).map((m) => {
        const sub = (subs.data ?? []).find((s) => s.merchant_id === m.id);
        return (
          <div key={m.id} className={card}>
            <p className="text-sm font-semibold text-foreground">{m.business_name}</p>
            <p className="text-xs text-muted-foreground">{m.email ?? m.phone ?? "—"}</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-primary">
              {m.status}
              {m.verified ? " • verified" : ""}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Subscription: {sub ? `${sub.status} (${sub.provider ?? "paystack"})` : "none"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => status.mutate({ id: m.id, value: "approved" })}
                className={chipDark}
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => status.mutate({ id: m.id, value: "suspended" })}
                className={chip}
              >
                Suspend
              </button>
              <button
                type="button"
                onClick={() => remove.mutate(m.id)}
                className={chip + " text-destructive"}
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* --------------------------------- agents -------------------------------- */

const emptyAgent: Partial<AdminAgentRow> = {
  full_name: "",
  title: "",
  bio: "",
  email: "",
  phone: "",
  whatsapp: "",
  photo_url: "",
  is_active: true,
};

function AgentsTab() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Partial<AdminAgentRow>>(emptyAgent);
  const list = useQuery({ queryKey: ["admin-agents"], queryFn: fetchAllAgents });
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin-agents"] });
    setForm(emptyAgent);
  };
  const save = useMutation({ mutationFn: upsertAgent, onSuccess: invalidate });
  const remove = useMutation({ mutationFn: deleteAgent, onSuccess: invalidate });

  return (
    <div className="space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate(form);
        }}
        className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
      >
        <Field
          label="Full name"
          required
          value={form.full_name ?? ""}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
        />
        <Field
          label="Title"
          value={form.title ?? ""}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Field
          label="Email"
          value={form.email ?? ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Field
          label="Phone"
          value={form.phone ?? ""}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Field
          label="WhatsApp"
          value={form.whatsapp ?? ""}
          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
        />
        <Field
          label="Photo URL"
          value={form.photo_url ?? ""}
          onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
        />
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Bio
          </span>
          <textarea
            rows={3}
            value={form.bio ?? ""}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full rounded-2xl border border-border bg-secondary/60 p-4 text-sm"
          />
        </label>
        <div className="sm:col-span-2">
          <PrimaryButton type="submit" disabled={save.isPending}>
            {form.id ? "Save agent" : "Add agent"}
          </PrimaryButton>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(list.data ?? []).map((a) => (
          <div key={a.id} className={card}>
            <p className="text-sm font-semibold text-foreground">{a.full_name}</p>
            <p className="text-xs text-muted-foreground">{a.title ?? "Agent"}</p>
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={() => setForm(a)} className={chip}>
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove.mutate(a.id)}
                className={chip + " text-destructive"}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- enquiries ------------------------------ */

function EnquiriesTab() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["admin-enquiries"], queryFn: fetchEnquiries });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-enquiries"] });
  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Record<string, unknown> }) =>
      updateEnquiry(id, patch),
    onSuccess: invalidate,
  });
  const remove = useMutation({ mutationFn: deleteEnquiry, onSuccess: invalidate });

  return (
    <div className="space-y-3">
      {(list.data ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">No enquiries yet.</p>
      )}
      {(list.data ?? []).map((e) => (
        <div key={e.id} className={card}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-foreground">
              {e.name}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                {e.email ?? e.phone ?? ""}
              </span>
            </p>
            <span className="text-[11px] text-muted-foreground">
              {new Date(e.created_at).toLocaleString()}
            </span>
          </div>
          {e.subject && <p className="text-xs text-muted-foreground">{e.subject}</p>}
          <p className="mt-2 text-sm text-muted-foreground">{e.message}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => update.mutate({ id: e.id, patch: { is_read: true } })}
              className={chip}
            >
              Mark read
            </button>
            <button
              type="button"
              onClick={() => update.mutate({ id: e.id, patch: { status: "resolved" } })}
              className={chip}
            >
              Resolve
            </button>
            {e.email && (
              <a href={`mailto:${e.email}`} className={chip}>
                Reply by email
              </a>
            )}
            <button
              type="button"
              onClick={() => remove.mutate(e.id)}
              className={chip + " text-destructive"}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------- management requests --------------------------- */

function ManagementTab() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["admin-management"], queryFn: fetchManagementRequests });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-management"] });
  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Record<string, unknown> }) =>
      updateManagementRequest(id, patch),
    onSuccess: invalidate,
  });
  const remove = useMutation({ mutationFn: deleteManagementRequest, onSuccess: invalidate });

  return (
    <div className="space-y-3">
      {(list.data ?? []).length === 0 && (
        <p className="text-sm text-muted-foreground">No property management requests yet.</p>
      )}
      {(list.data ?? []).map((r) => (
        <div key={r.id} className={card}>
          <p className="text-sm font-semibold text-foreground">{r.full_name}</p>
          <p className="text-xs text-muted-foreground">
            {[r.email, r.phone, r.property_type, r.service].filter(Boolean).join(" • ")}
          </p>
          {r.property_address && (
            <p className="mt-1 text-xs text-muted-foreground">{r.property_address}</p>
          )}
          {r.message && <p className="mt-2 text-sm text-muted-foreground">{r.message}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => update.mutate({ id: r.id, patch: { status: "in_progress" } })}
              className={chip}
            >
              In progress
            </button>
            <button
              type="button"
              onClick={() => update.mutate({ id: r.id, patch: { status: "completed" } })}
              className={chipDark}
            >
              Completed
            </button>
            <button
              type="button"
              onClick={() => remove.mutate(r.id)}
              className={chip + " text-destructive"}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------- content ------------------------------- */

function ContentTab() {
  const qc = useQueryClient();
  const testimonials = useQuery({ queryKey: ["admin-testimonials"], queryFn: fetchAllTestimonials });
  const faqs = useQuery({ queryKey: ["admin-faqs"], queryFn: fetchAllFaqs });
  const posts = useQuery({ queryKey: ["admin-posts"], queryFn: fetchAllPosts });

  const [t, setT] = useState<TestimonialAdminRow>({
    author_name: "",
    author_role: "",
    content: "",
    is_published: true,
  });
  const [f, setF] = useState<FaqAdminRow>({ question: "", answer: "", category: "general" });
  const [p, setP] = useState<BlogAdminRow>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    is_published: true,
  });

  const saveT = useMutation({
    mutationFn: upsertTestimonial,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      setT({ author_name: "", author_role: "", content: "", is_published: true });
    },
  });
  const delT = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });
  const saveF = useMutation({
    mutationFn: upsertFaq,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-faqs"] });
      setF({ question: "", answer: "", category: "general" });
    },
  });
  const delF = useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-faqs"] }),
  });
  const saveP = useMutation({
    mutationFn: upsertPost,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
      setP({ title: "", slug: "", excerpt: "", content: "", cover_image: "", is_published: true });
    },
  });
  const delP = useMutation({
    mutationFn: deletePost,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-posts"] }),
  });

  return (
    <div className="space-y-12">
      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Testimonials</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveT.mutate(t);
          }}
          className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
        >
          <Field
            label="Author"
            required
            value={t.author_name}
            onChange={(e) => setT({ ...t, author_name: e.target.value })}
          />
          <Field
            label="Role"
            value={t.author_role ?? ""}
            onChange={(e) => setT({ ...t, author_role: e.target.value })}
          />
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Testimonial
            </span>
            <textarea
              rows={3}
              required
              value={t.content}
              onChange={(e) => setT({ ...t, content: e.target.value })}
              className="w-full rounded-2xl border border-border bg-secondary/60 p-4 text-sm"
            />
          </label>
          <div className="sm:col-span-2">
            <PrimaryButton type="submit">{t.id ? "Save testimonial" : "Add testimonial"}</PrimaryButton>
          </div>
        </form>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {(testimonials.data ?? []).map((row) => (
            <div key={row.id} className={card}>
              <p className="text-sm text-muted-foreground">{row.content}</p>
              <p className="mt-2 text-xs font-semibold text-foreground">{row.author_name}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => setT(row)} className={chip}>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => row.id && delT.mutate(row.id)}
                  className={chip + " text-destructive"}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">FAQs</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveF.mutate(f);
          }}
          className="surface-card grid gap-4 rounded-2xl p-6"
        >
          <Field
            label="Question"
            required
            value={f.question}
            onChange={(e) => setF({ ...f, question: e.target.value })}
          />
          <Field
            label="Category"
            value={f.category ?? ""}
            onChange={(e) => setF({ ...f, category: e.target.value })}
          />
          <label className="block">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Answer
            </span>
            <textarea
              rows={3}
              required
              value={f.answer}
              onChange={(e) => setF({ ...f, answer: e.target.value })}
              className="w-full rounded-2xl border border-border bg-secondary/60 p-4 text-sm"
            />
          </label>
          <PrimaryButton type="submit">{f.id ? "Save FAQ" : "Add FAQ"}</PrimaryButton>
        </form>
        <div className="mt-4 space-y-3">
          {(faqs.data ?? []).map((row) => (
            <div key={row.id} className={card}>
              <p className="text-sm font-semibold text-foreground">{row.question}</p>
              <p className="mt-1 text-sm text-muted-foreground">{row.answer}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => setF(row)} className={chip}>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => row.id && delF.mutate(row.id)}
                  className={chip + " text-destructive"}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-foreground">Blog posts</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveP.mutate({ ...p, slug: p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") });
          }}
          className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2"
        >
          <Field
            label="Title"
            required
            value={p.title}
            onChange={(e) => setP({ ...p, title: e.target.value })}
          />
          <Field label="Slug" value={p.slug} onChange={(e) => setP({ ...p, slug: e.target.value })} />
          <Field
            label="Cover image URL"
            value={p.cover_image ?? ""}
            onChange={(e) => setP({ ...p, cover_image: e.target.value })}
          />
          <label className="flex items-end gap-2 pb-2 text-sm">
            <input
              type="checkbox"
              checked={p.is_published}
              onChange={(e) => setP({ ...p, is_published: e.target.checked })}
            />
            Published
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Excerpt
            </span>
            <textarea
              rows={2}
              value={p.excerpt ?? ""}
              onChange={(e) => setP({ ...p, excerpt: e.target.value })}
              className="w-full rounded-2xl border border-border bg-secondary/60 p-4 text-sm"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Content
            </span>
            <textarea
              rows={6}
              value={p.content ?? ""}
              onChange={(e) => setP({ ...p, content: e.target.value })}
              className="w-full rounded-2xl border border-border bg-secondary/60 p-4 text-sm"
            />
          </label>
          <div className="sm:col-span-2">
            <PrimaryButton type="submit">{p.id ? "Save post" : "Publish post"}</PrimaryButton>
          </div>
        </form>
        <div className="mt-4 space-y-3">
          {(posts.data ?? []).map((row) => (
            <div key={row.id} className={card}>
              <p className="text-sm font-semibold text-foreground">{row.title}</p>
              <p className="text-xs text-muted-foreground">
                {row.is_published ? "Published" : "Draft"} • /{row.slug}
              </p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => setP(row)} className={chip}>
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => row.id && delP.mutate(row.id)}
                  className={chip + " text-destructive"}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- settings ------------------------------- */

function SettingsTab() {
  const qc = useQueryClient();
  const query = useQuery({ queryKey: ["website-settings"], queryFn: fetchSettings });
  const settings = query.data ?? defaultSettings;
  const [draft, setDraft] = useState<SiteSettings | null>(null);
  const value = draft ?? settings;
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const admins = useQuery({ queryKey: ["admin-users"], queryFn: fetchAdminUsers });

  const save = useMutation({
    mutationFn: async (key: keyof SiteSettings) => saveSetting(key, value[key]),
    onSuccess: () => {
      setMsg("Saved.");
      qc.invalidateQueries({ queryKey: ["website-settings"] });
    },
    onError: (e: unknown) => setMsg(e instanceof Error ? e.message : "Could not save."),
  });

  function patch<K extends keyof SiteSettings>(key: K, part: Partial<SiteSettings[K]>) {
    setDraft({ ...value, [key]: { ...value[key], ...part } });
  }

  return (
    <div className="space-y-10">
      {msg && <p className="text-sm text-primary">{msg}</p>}

      <div className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
        <h3 className="text-lg font-semibold text-foreground sm:col-span-2">Brand</h3>
        <Field
          label="Site name"
          value={value.brand.site_name}
          onChange={(e) => patch("brand", { site_name: e.target.value })}
        />
        <Field
          label="Motto"
          value={value.brand.motto}
          onChange={(e) => patch("brand", { motto: e.target.value })}
        />
        <Field
          label="Logo URL"
          value={value.brand.logo_url ?? ""}
          onChange={(e) => patch("brand", { logo_url: e.target.value })}
        />
        <Field
          label="Favicon URL"
          value={value.brand.favicon_url ?? ""}
          onChange={(e) => patch("brand", { favicon_url: e.target.value })}
        />
        <div className="sm:col-span-2">
          <PrimaryButton onClick={() => save.mutate("brand")}>Save brand</PrimaryButton>
        </div>
      </div>

      <div className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
        <h3 className="text-lg font-semibold text-foreground sm:col-span-2">Contact details</h3>
        <Field
          label="Address"
          value={value.contact.address}
          onChange={(e) => patch("contact", { address: e.target.value })}
        />
        <Field
          label="Email"
          value={value.contact.email}
          onChange={(e) => patch("contact", { email: e.target.value })}
        />
        <Field
          label="Secondary email"
          value={value.contact.email_secondary ?? ""}
          onChange={(e) => patch("contact", { email_secondary: e.target.value })}
        />
        <Field
          label="Hotline"
          value={value.contact.phone}
          onChange={(e) => patch("contact", { phone: e.target.value })}
        />
        <Field
          label="WhatsApp"
          value={value.contact.whatsapp}
          onChange={(e) => patch("contact", { whatsapp: e.target.value })}
        />
        <Field
          label="Opening hours"
          value={value.contact.hours ?? ""}
          onChange={(e) => patch("contact", { hours: e.target.value })}
        />
        <div className="sm:col-span-2">
          <PrimaryButton onClick={() => save.mutate("contact")}>Save contact</PrimaryButton>
        </div>
      </div>

      <div className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
        <h3 className="text-lg font-semibold text-foreground sm:col-span-2">Homepage hero</h3>
        <Field
          label="Title"
          value={value.hero.title}
          onChange={(e) => patch("hero", { title: e.target.value })}
        />
        <Field
          label="Subtitle"
          value={value.hero.subtitle}
          onChange={(e) => patch("hero", { subtitle: e.target.value })}
        />
        <Field
          label="Primary CTA"
          value={value.hero.cta_label}
          onChange={(e) => patch("hero", { cta_label: e.target.value })}
        />
        <Field
          label="Secondary CTA"
          value={value.hero.cta_secondary_label}
          onChange={(e) => patch("hero", { cta_secondary_label: e.target.value })}
        />
        <div className="sm:col-span-2">
          <PrimaryButton onClick={() => save.mutate("hero")}>Save hero</PrimaryButton>
        </div>
      </div>

      <div className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
        <h3 className="text-lg font-semibold text-foreground sm:col-span-2">Footer & socials</h3>
        <Field
          label="About text"
          value={value.footer.about}
          onChange={(e) => patch("footer", { about: e.target.value })}
        />
        <Field
          label="Facebook"
          value={value.footer.socials.facebook ?? ""}
          onChange={(e) =>
            patch("footer", { socials: { ...value.footer.socials, facebook: e.target.value } })
          }
        />
        <Field
          label="Instagram"
          value={value.footer.socials.instagram ?? ""}
          onChange={(e) =>
            patch("footer", { socials: { ...value.footer.socials, instagram: e.target.value } })
          }
        />
        <Field
          label="LinkedIn"
          value={value.footer.socials.linkedin ?? ""}
          onChange={(e) =>
            patch("footer", { socials: { ...value.footer.socials, linkedin: e.target.value } })
          }
        />
        <div className="sm:col-span-2">
          <PrimaryButton onClick={() => save.mutate("footer")}>Save footer</PrimaryButton>
        </div>
      </div>

      {(["about_page", "property_management_page", "legal_team_page", "contact_page"] as const).map(
        (key) => (
          <div key={key} className="surface-card grid gap-4 rounded-2xl p-6">
            <h3 className="text-lg font-semibold capitalize text-foreground">
              {key.replace(/_/g, " ")}
            </h3>
            <Field
              label="Heading"
              value={value[key].heading}
              onChange={(e) => patch(key, { heading: e.target.value })}
            />
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Body
              </span>
              <textarea
                rows={4}
                value={value[key].body}
                onChange={(e) => patch(key, { body: e.target.value })}
                className="w-full rounded-2xl border border-border bg-secondary/60 p-4 text-sm"
              />
            </label>
            <PrimaryButton onClick={() => save.mutate(key)}>Save page</PrimaryButton>
          </div>
        ),
      )}

      <div className="surface-card grid gap-4 rounded-2xl p-6 sm:grid-cols-2">
        <h3 className="text-lg font-semibold text-foreground sm:col-span-2">Admin account</h3>
        <div className="sm:col-span-2 text-sm text-muted-foreground">
          Administrators: {(admins.data ?? []).map((a) => a.email ?? a.full_name).join(", ") || "—"}
        </div>
        <Field
          label="New password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex items-end">
          <PrimaryButton
            onClick={async () => {
              try {
                await changeOwnPassword(password);
                setPassword("");
                setMsg("Password updated.");
              } catch (e) {
                setMsg(e instanceof Error ? e.message : "Could not update password.");
              }
            }}
          >
            Update password
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}

/* -------------------------------- activity ------------------------------- */

function ActivityTab() {
  const list = useQuery({ queryKey: ["admin-activity-full"], queryFn: () => fetchActivity(100) });
  const newsletter = useQuery({
    queryKey: ["admin-newsletter"],
    queryFn: async () => {
      const { data } = await sb
        .from("newsletter_subscribers")
        .select("id, email, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      return (data ?? []) as { id: string; email: string; created_at: string }[];
    },
  });

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        {(list.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          (list.data ?? []).map((a) => (
            <div key={a.id} className="rounded-xl border border-border px-4 py-3 text-sm">
              <span className="font-semibold text-foreground">{a.action}</span>{" "}
              <span className="text-xs text-muted-foreground">
                {a.entity ?? ""} • {a.actor_name ?? "system"} •{" "}
                {new Date(a.created_at).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Newsletter subscribers</h3>
        {(newsletter.data ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No subscribers yet.</p>
        ) : (
          <ul className="space-y-1 text-sm text-muted-foreground">
            {(newsletter.data ?? []).map((n) => (
              <li key={n.id}>{n.email}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
