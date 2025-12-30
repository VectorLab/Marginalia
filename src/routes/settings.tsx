import { createFileRoute } from "@tanstack/react-router";

import { SettingsClient } from "@/components/SettingsClient";
import settingsStyles from "@/styles/Settings.css?url";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [{ title: "Settings - Marginalia" }],
    links: [{ rel: "stylesheet", href: settingsStyles }],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return <SettingsClient />;
}
