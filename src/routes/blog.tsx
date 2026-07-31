import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Section } from "@/components/page-shell";
import { useQuery } from "@tanstack/react-query";
import { fetchPosts } from "@/lib/content";
import { propertyImages } from "@/data/properties";

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
  const { data, isLoading, error } = useQuery({ queryKey: ["blog-posts"], queryFn: fetchPosts });
  const posts = data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Insight for buyers, sellers and investors"
        subtitle="Research and practical guides from our agents across 40+ markets."
      />
      <Section>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading articles…</p>
        ) : error ? (
          <p className="text-sm text-destructive">Articles could not be loaded right now.</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No articles have been published yet.</p>
        ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.id} className="surface-card overflow-hidden rounded-[1.6rem]">
              <img
                src={post.cover_image || propertyImages.prop2}
                alt={post.title}
                loading="lazy"
                width={900}
                height={700}
                className="h-44 w-full object-cover"
              />
              <div className="p-6">
                {post.published_at && (
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {new Date(post.published_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                )}
                <h2 className="mt-2 text-base font-semibold text-foreground">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
        )}
      </Section>
    </>
  );
}