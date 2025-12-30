import { Link, createFileRoute } from "@tanstack/react-router";

import { HomeNav } from "@/components/HomeNav";
import { getHomePosts, getSiteSettings } from "@/lib/server";
import type { Post } from "@/lib/types";
import { formatDate, getValidDate } from "@/lib/utils";


function extractVerificationTokens(
  allPosts: { content: string | null }[],
): string[] {
  const regex = /data-suud-verification="([^"]+)"/g;
  const tokens: string[] = [];

  for (const post of allPosts) {
    if (!post.content) continue;
    for (const match of post.content.matchAll(regex)) {
      tokens.push(match[1]);
    }
  }

  return tokens;
}

function groupPostsByMonth(allPosts: Post[]): Map<string, Post[]> {
  const groups = new Map<string, Post[]>();

  for (const post of allPosts) {
    const date = getValidDate(post.createdAt);
    const key = formatDate(date, "month-year");

    const group = groups.get(key);
    if (group) {
      group.push(post);
    } else {
      groups.set(key, [post]);
    }
  }

  return groups;
}

export const Route = createFileRoute("/")({
  loader: async () => {
    const [allPosts, siteSettings] = await Promise.all([
      getHomePosts(),
      getSiteSettings(),
    ]);
    return { allPosts, siteSettings };
  },
  head: ({ loaderData }) => {
    const title = loaderData?.siteSettings?.siteTitle || "Marginalia";
    const description =
      loaderData?.siteSettings?.siteDescription || "Notes in the margins.";
    const keywords = loaderData?.siteSettings?.siteKeywords;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(keywords ? [{ name: "keywords", content: keywords }] : []),
      ],
    };
  },
  component: HomePage,
});

function HomePage() {
  const { allPosts } = Route.useLoaderData();

  const groupedPosts = groupPostsByMonth(allPosts as Post[]);
  const verificationTokens = extractVerificationTokens(allPosts);

  return (
    <main>
      {verificationTokens.map((token) => (
        <div key={token} data-suud-verification={token} hidden />
      ))}
      <header
        style={{
          paddingBlock: "clamp(4rem, 15vh, 8rem)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--s-huge)",
            fontWeight: 300,
            letterSpacing: "-0.02em",
            marginBottom: "var(--s-sm)",
          }}
        >
          Marginalia
        </h1>
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--s-md)",
            fontStyle: "italic",
            color: "var(--c-acc-subtle)",
          }}
        >
          Notes in the margins
        </p>
      </header>

      <section
        className="container"
        style={{
          paddingBottom: "clamp(4rem, 15vh, 8rem)",
        }}
      >
        {Array.from(groupedPosts.entries()).map(([monthYear, monthPosts]) => (
          <div key={monthYear} style={{ marginBottom: "var(--s-xxl)" }}>
            <time
              style={{
                display: "block",
                fontFamily: "var(--font-body)",
                fontSize: "var(--s-xs)",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--c-acc-subtle)",
                marginBottom: "var(--s-lg)",
                paddingBottom: "var(--s-xs)",
                borderBottom: "1px solid var(--c-border)",
              }}
            >
              {monthYear}
            </time>

            <div
              className="flow"
              style={{ "--flow-space": "var(--s-xl)" } as React.CSSProperties}
            >
              {monthPosts.map((post) => (
                <article key={post.id}>
                  <Link
                    to="/writings/$slug"
                    params={{ slug: post.slug }}
                    style={{ textDecoration: "none" }}
                  >
                    <h2
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "var(--s-lg)",
                        fontWeight: 400,
                        marginBottom: "var(--s-xs)",
                        transition: "color var(--dur-fast)",
                      }}
                    >
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "var(--s-sm)",
                          lineHeight: "var(--lh-loose)",
                          color: "var(--c-acc-subtle)",
                          maxWidth: "55ch",
                        }}
                        dangerouslySetInnerHTML={{ __html: post.excerpt }}
                      />
                    )}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ))}

        {allPosts.length === 0 && (
          <p
            style={{
              textAlign: "center",
              color: "var(--c-acc-subtle)",
              fontStyle: "italic",
            }}
          >
            No writings yet.
          </p>
        )}
      </section>

      <HomeNav />
    </main>
  );
}
