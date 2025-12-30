import { createServerFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";

import { db } from "./db";
import { marginalia, posts, settings } from "./db/schema";

export const getHomePosts = createServerFn({ method: "GET" }).handler(
  async () => {
    const allPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.published, true))
      .orderBy(desc(posts.createdAt));
    return allPosts;
  },
);

export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async () => {
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
  },
);

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((d: string) => d)
  .handler(async ({ data: slug }) => {
    const post = await db.query.posts.findFirst({
      where: eq(posts.slug, slug),
    });
    return post || null;
  });

export const getPostNotes = createServerFn({ method: "GET" })
  .inputValidator((d: number) => d)
  .handler(async ({ data: postId }) => {
    const notes = await db
      .select()
      .from(marginalia)
      .where(eq(marginalia.postId, postId));
    return notes;
  });

export const getAllPosts = createServerFn({ method: "GET" }).handler(
  async () => {
    const allPosts = await db
      .select()
      .from(posts)
      .orderBy(desc(posts.updatedAt));
    return allPosts;
  },
);

export const checkEnvConfigured = createServerFn({ method: "GET" }).handler(
  async () => {
    const required = [
      "BETTER_AUTH_SECRET",
      "SUUD_OAUTH_CLIENT_ID",
      "SUUD_OAUTH_CLIENT_SECRET",
    ];
    const missing = required.filter((key) => !process.env[key]);
    return { configured: missing.length === 0, missing };
  },
);

export const getAdminEmail = createServerFn({ method: "GET" }).handler(
  async () => {
    try {
      const row = await db.query.settings.findFirst({
        where: eq(settings.key, "adminEmail"),
      });
      return row?.value || null;
    } catch {
      return null;
    }
  },
);
