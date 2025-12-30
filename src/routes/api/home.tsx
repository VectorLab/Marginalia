import { createFileRoute } from "@tanstack/react-router";
import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { posts, settings } from "@/lib/db/schema";

async function getSiteSettings() {
  try {
    const rows = await db.select().from(settings);
    const result: Record<string, string> = {};
    for (const row of rows) {
      if (row.value !== null) {
        result[row.key] = row.value;
      }
    }
    return result;
  } catch {
    return {};
  }
}

export const Route = createFileRoute("/api/home")({
  server: {
    handlers: {
      GET: async () => {
        const allPosts = await db
          .select()
          .from(posts)
          .where(eq(posts.published, true))
          .orderBy(desc(posts.createdAt));
        const siteSettings = await getSiteSettings();
        return new Response(JSON.stringify({ allPosts, siteSettings }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
