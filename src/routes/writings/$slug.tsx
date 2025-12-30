import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { Article } from "@/components/Article";
import styles from "@/components/Article.module.css";
import { getPostBySlug, getPostNotes } from "@/lib/server";
import { formatDate } from "@/lib/utils";

export const Route = createFileRoute("/writings/$slug")({
  loader: async ({ params }) => {
    const { slug } = params;

    const post = await getPostBySlug({ data: slug });

    if (!post) {
      throw notFound();
    }

    const notes = await getPostNotes({ data: post.id });

    return { post, notes };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.post?.title || "Marginalia" },
      {
        name: "description",
        content: loaderData?.post?.excerpt || "Notes in the margins.",
      },
    ],
  }),
  component: PostPage,
  notFoundComponent: () => (
    <main style={{ padding: "4rem", textAlign: "center" }}>
      <h1>Post not found</h1>
      <Link to="/">Back to home</Link>
    </main>
  ),
});

function PostPage() {
  const { post, notes } = Route.useLoaderData();

  const dateStr = formatDate(post.createdAt, "long");

  return (
    <main>
      <header
        style={{
          paddingBlock: "clamp(3rem, 12vh, 6rem)",
          textAlign: "center",
        }}
      >
        <Link
          to="/"
          style={{
            display: "inline-block",
            fontFamily: "var(--font-body)",
            fontSize: "var(--s-xs)",
            color: "var(--c-acc-subtle)",
            textDecoration: "none",
            marginBottom: "var(--s-lg)",
            transition: "color var(--dur-fast)",
          }}
        >
          Marginalia
        </Link>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(var(--s-xl), 5vw, var(--s-xxl))",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            marginBottom: "var(--s-sm)",
            maxWidth: "20ch",
            marginInline: "auto",
          }}
        >
          {post.title}
        </h1>

        {dateStr && (
          <time
            style={{
              display: "block",
              fontFamily: "var(--font-body)",
              fontSize: "var(--s-xs)",
              color: "var(--c-acc-subtle)",
              letterSpacing: "0.05em",
            }}
          >
            {dateStr}
          </time>
        )}
      </header>

      <Article content={post.content} notes={notes} />

      <div className={styles.wrapper}>
        <footer
          style={{
            gridColumn: 2,
            paddingBlock: "clamp(3rem, 10vh, 5rem)",
            borderTop: "1px solid var(--c-border)",
            marginTop: "clamp(3rem, 10vh, 5rem)",
          }}
        >
          <Link
            to="/"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--s-xs)",
              color: "var(--c-acc-subtle)",
            }}
          >
            Back to all writings
          </Link>
        </footer>
      </div>
    </main>
  );
}
