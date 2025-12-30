import { Link, createFileRoute } from "@tanstack/react-router";

import { DeleteButton } from "@/components/DeleteButton";
import { getAllPosts } from "@/lib/server";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import dashboardStyles from "@/styles/Dashboard.css?url";


export const Route = createFileRoute("/dashboard")({
  loader: async () => {
    const allPosts = await getAllPosts();
    return { allPosts };
  },
  head: () => ({
    meta: [{ title: "Dashboard - Marginalia" }],
    links: [{ rel: "stylesheet", href: dashboardStyles }],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { allPosts } = Route.useLoaderData();
  const posts = allPosts as Post[];

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Manage</h1>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Link
            to="/settings"
            className="new-btn"
            style={{
              background: "transparent",
              color: "var(--c-fg)",
              border: "1px solid var(--c-border)",
            }}
          >
            Settings
          </Link>
          <Link to="/editor" search={{ slug: undefined }} className="new-btn">
            <span>+</span> New
          </Link>
        </div>
      </header>

      {posts.length > 0 ? (
        <div className="post-list">
          {posts.map((post) => (
            <article key={post.id} className="post-item">
              <div className="post-info">
                <div className="post-title-row">
                  <Link
                    to="/writings/$slug"
                    params={{ slug: post.slug }}
                    className="post-title"
                  >
                    {post.title}
                  </Link>
                  <span
                    className={`status-badge ${post.published ? "status-published" : "status-draft"}`}
                  >
                    {post.published ? "Live" : "Draft"}
                  </span>
                </div>
                <div className="post-meta">
                  /{post.slug}
                  {formatDate(post.updatedAt) &&
                    ` · ${formatDate(post.updatedAt)}`}
                </div>
              </div>
              <div className="post-actions">
                <Link
                  to="/editor"
                  search={{ slug: post.slug }}
                  className="action-link"
                >
                  Edit
                </Link>
                <DeleteButton slug={post.slug} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p className="empty-title">No writings yet</p>
          <p>Start by creating your first post.</p>
        </div>
      )}

      <Link to="/" className="back-link">
        ← Back to site
      </Link>
    </main>
  );
}
