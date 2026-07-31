import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Section } from "@/components/page-shell";
import { fetchPostBySlug } from "@/lib/content";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Article | Tadman Homes & Properties" },
      { name: "description", content: `Read the latest property insight from the Tadman Homes team.` },
      { property: "og:title", content: `Tadman Journal — ${params.slug.replace(/-/g, " ")}` },
      { property: "og:description", content: "Market insight, buying guides and selling strategy." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: () => fetchPostBySlug(slug),
  });

  if (isLoading) {
    return (
      <Section>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading article…
        </p>
      </Section>
    );
  }

  if (!data) {
    return (
      <Section>
        <p className="text-sm text-muted-foreground">
          That article could not be found.{" "}
          <Link to="/blog" className="font-semibold text-primary">
            Back to the journal
          </Link>
        </p>
      </Section>
    );
  }

  return (
    <Section>
      <article className="mx-auto max-w-3xl">
        {data.cover_image && (
          <img
            src={data.cover_image}
            alt={data.title}
            width={1200}
            height={600}
            className="mb-8 h-72 w-full rounded-[1.6rem] object-cover"
          />
        )}
        {data.published_at && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">
            {new Date(data.published_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
        <h1 className="mt-3 text-3xl font-bold text-foreground sm:text-4xl">{data.title}</h1>
        {data.excerpt && <p className="mt-4 text-base text-muted-foreground">{data.excerpt}</p>}
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-foreground">
          {(data.content ?? "").split(/\n{2,}/).map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
        <Link to="/blog" className="mt-10 inline-block text-sm font-semibold text-primary">
          ← Back to the journal
        </Link>
      </article>
    </Section>
  );
}
