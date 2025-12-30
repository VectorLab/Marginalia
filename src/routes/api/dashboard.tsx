import { createFileRoute } from "@tanstack/react-router";
import { desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";

export const Route = createFileRoute("/api/dashboard")({
  server: {
    handlers: {
      GET: async () => {
        const allPosts = await db
          .select()
          .from(posts)
          .orderBy(desc(posts.updatedAt));
        return new Response(JSON.stringify({ allPosts }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
