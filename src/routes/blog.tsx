import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";
import { posts } from "@/data/properties";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Property Journal & Market Insight | Tadman Homes" },
      {
        name: "description",
        content:
          "Market insight, buying guides and selling strategy from the Tadman Homes & Properties team.",
      },
      { property: "og:title", content: "Property Journal | Tadman Homes" },
      { property: "og:description", content: "Market insight, buying guides and selling strategy." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Insight for buyers, sellers and investors"
        subtitle="Research and practical guides from our agents across 40+ markets."
      />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.concat(posts).map((post, i) => (
            <article key={i} className="surface-card overflow-hidden rounded-[1.6rem]">
              <img
                src={post.image}
                alt={post.title}
                loading="lazy"
                width={900}
                height={700}
                className="h-44 w-full object-cover"
              />
              <div className="p-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                  {post.category} · {post.date}
                </p>
                <h2 className="mt-2 text-base font-semibold text-foreground">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}