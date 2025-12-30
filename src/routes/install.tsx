import { createFileRoute } from "@tanstack/react-router";

import { InstallClient } from "@/components/InstallClient";
import installStyles from "@/styles/Install.css?url";

export const Route = createFileRoute("/install")({
  head: () => ({
    meta: [{ title: "Setup - Marginalia" }],
    links: [{ rel: "stylesheet", href: installStyles }],
  }),
  component: InstallPage,
});

function InstallPage() {
  return <InstallClient />;
}
