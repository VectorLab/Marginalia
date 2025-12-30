import { createFileRoute } from "@tanstack/react-router";

import { EditorClient } from "@/components/EditorClient";
import editorStyles from "@/styles/Editor.css?url";

export const Route = createFileRoute("/editor")({
  validateSearch: (search: Record<string, unknown>) => ({
    slug: (search.slug as string) || undefined,
  }),
  head: () => ({
    meta: [{ title: "Editor - Marginalia" }],
    links: [{ rel: "stylesheet", href: editorStyles }],
  }),
  component: EditorPage,
});

function EditorPage() {
  const { slug } = Route.useSearch();
  return <EditorClient editSlug={slug} />;
}
