import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { marginalia, posts } from "@/lib/db/schema";

export const Route = createFileRoute("/api/writings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const slug = url.searchParams.get("slug");

        if (!slug) {
          return new Response(JSON.stringify({ error: "slug required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          });
        }

        const post = await db.query.posts.findFirst({
          where: eq(posts.slug, slug),
        });

        if (!post) {
          return new Response(JSON.stringify({ error: "not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }

        const notes = await db
          .select()
          .from(marginalia)
          .where(eq(marginalia.postId, post.id));

        return new Response(JSON.stringify({ post, notes }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
