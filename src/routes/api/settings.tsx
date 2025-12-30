import { createFileRoute } from "@tanstack/react-router";
import { sql } from "drizzle-orm";

import {
  errorResponse,
  HTTP_STATUS,
  jsonResponse,
  successResponse,
} from "@/lib/api";
import { verifyOwner } from "@/lib/auth/verify";
import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";

export const Route = createFileRoute("/api/settings")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const rows = await db.select().from(settings);
          const result = Object.fromEntries(
            rows
              .filter((row) => row.value !== null)
              .map((row) => [row.key, row.value]),
          );
          return jsonResponse(result);
        } catch (err) {
          console.error("GET /api/settings error:", err);
          return errorResponse(
            "Failed to load settings",
            HTTP_STATUS.SERVER_ERROR,
          );
        }
      },

      POST: async ({ request }) => {
        const { authorised, error } = await verifyOwner(request);
        if (!authorised) return error;

        try {
          const body = await request.json();
          const { adminEmail, siteTitle, siteDescription, siteKeywords } = body;

          const updates = [
            { key: "adminEmail", value: adminEmail || "" },
            { key: "siteTitle", value: siteTitle || "" },
            { key: "siteDescription", value: siteDescription || "" },
            { key: "siteKeywords", value: siteKeywords || "" },
          ];

          await db
            .insert(settings)
            .values(updates)
            .onConflictDoUpdate({
              target: settings.key,
              set: { value: sql`excluded.value` },
            });

          return successResponse();
        } catch (err) {
          console.error("POST /api/settings error:", err);
          return errorResponse("Server Error", HTTP_STATUS.SERVER_ERROR);
        }
      },
    },
  },
});
