import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

import {
  errorResponse,
  HTTP_STATUS,
  jsonResponse,
  successResponse,
} from "@/lib/api";
import { verifyOwner } from "@/lib/auth/verify";
import { db } from "@/lib/db";
import { marginalia, posts } from "@/lib/db/schema";
import { parseMarginalia } from "@/lib/parser";

export const Route = createFileRoute("/api/posts")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const slug = url.searchParams.get("slug");

        if (!slug) {
          return errorResponse("Slug required", HTTP_STATUS.BAD_REQUEST);
        }

        const post = await db.query.posts.findFirst({
          where: eq(posts.slug, slug),
        });

        if (!post) {
          return errorResponse("Post not found", HTTP_STATUS.NOT_FOUND);
        }

        return jsonResponse({
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.rawContent ?? post.content,
          published: post.published,
        });
      },

      DELETE: async ({ request }) => {
        const { authorised, error } = await verifyOwner(request);
        if (!authorised) return error;

        const url = new URL(request.url);
        const slug = url.searchParams.get("slug");

        if (!slug) {
          return errorResponse("Slug required", HTTP_STATUS.BAD_REQUEST);
        }

        const post = await db.query.posts.findFirst({
          where: eq(posts.slug, slug),
        });

        if (post) {
          await db.delete(marginalia).where(eq(marginalia.postId, post.id));
          await db.delete(posts).where(eq(posts.id, post.id));
        }

        return successResponse();
      },

      POST: async ({ request }) => {
        const { authorised, error } = await verifyOwner(request);
        if (!authorised) return error;

        try {
          const body = await request.json();
          const { slug, title, content, published } = body;

          if (!slug || !title || !content) {
            return errorResponse("Missing fields", HTTP_STATUS.BAD_REQUEST);
          }

          const { cleanContent, notes } = parseMarginalia(content);

          const existing = await db.query.posts.findFirst({
            where: eq(posts.slug, slug),
          });

          let postId = existing?.id;

          if (existing) {
            await db
              .update(posts)
              .set({
                title,
                content: cleanContent,
                rawContent: content,
                published: !!published,
                updatedAt: new Date(),
              })
              .where(eq(posts.id, existing.id));
          } else {
            const now = new Date();
            const result = await db
              .insert(posts)
              .values({
                slug,
                title,
                content: cleanContent,
                rawContent: content,
                excerpt: "...",
                published: !!published,
                createdAt: now,
                updatedAt: now,
                publishedAt: now,
              })
              .returning();
            postId = result[0].id;
          }

          if (!postId) throw new Error("Failed to save post");

          await db.delete(marginalia).where(eq(marginalia.postId, postId));

          if (notes.length > 0) {
            await db.insert(marginalia).values(
              notes.map((n) => ({
                postId: postId!,
                context: n.context,
                content: n.content,
              })),
            );
          }

          return successResponse({ slug });
        } catch (err) {
          console.error("POST /api/posts error:", err);
          return errorResponse("Server Error", HTTP_STATUS.SERVER_ERROR);
        }
      },
    },
  },
});
