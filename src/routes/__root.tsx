import {
  createRootRoute,
  HeadContent,
  Outlet,
  redirect,
  Scripts,
} from "@tanstack/react-router";

import { ThemeToggle } from "@/components/ThemeToggle";
import appCss from "@/globals.css?url";
import { checkEnvConfigured } from "@/lib/server";

export const Route = createRootRoute({
  beforeLoad: async ({ location }) => {
    if (location.pathname === "/install") return;
    const { configured } = await checkEnvConfigured();
    if (!configured) {
      throw redirect({ to: "/install" });
    }
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;1,300;1,400&family=Geist:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        children: `(function(){try{var t=localStorage.getItem('theme'),d=matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.setAttribute('data-theme',t==='dark'||(!t&&d)?'dark':'light')}catch(e){}})()`,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <ThemeToggle />
        <Scripts />
      </body>
    </html>
  );
}
