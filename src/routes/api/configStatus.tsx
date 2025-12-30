import { createFileRoute } from "@tanstack/react-router";

import { jsonResponse } from "@/lib/api";
import { getConfigStatus } from "@/lib/config";

export const Route = createFileRoute("/api/configStatus")({
  server: {
    handlers: {
      GET: async () => {
        const status = await getConfigStatus();
        return jsonResponse(status);
      },
    },
  },
});
