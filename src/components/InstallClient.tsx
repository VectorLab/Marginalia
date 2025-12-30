import { useRef, useEffect, useState, forwardRef } from "react";

import { useNotePositions } from "@/hooks/useNotePositions";
import { signIn } from "@/lib/auth/client";
import type { ConfigStatus } from "@/lib/types";

const CONFIG_KEYS = [
  "BETTER_AUTH_SECRET",
  "SUUD_OAUTH_CLIENT_ID",
  "SUUD_OAUTH_CLIENT_SECRET",
  "VITE_SUUD_BASE_URL",
] as const;

type ConfigKey = (typeof CONFIG_KEYS)[number];

const notes: Record<ConfigKey, string> = {
  BETTER_AUTH_SECRET: "Run openssl rand -hex 16 to generate.",
  SUUD_OAUTH_CLIENT_ID: "Get this from your SUUD application settings.",
  SUUD_OAUTH_CLIENT_SECRET: "Never commit this to version control.",
  VITE_SUUD_BASE_URL: "Defaults to https://suud.net if not set.",
};

const ConfigItem = forwardRef<
  HTMLDivElement,
  {
    name: string;
    configured: boolean;
    description: string;
    optional?: boolean;
  }
>(function ConfigItem({ name, configured, description, optional }, ref) {
  const status = configured ? "ok" : optional ? "optional" : "missing";
  const indicator = configured ? "✓" : optional ? "?" : "×";

  return (
    <div className="config-item" ref={ref}>
      <span className="status-dot" data-status={status}>
        {indicator}
      </span>
      <div>
        <code className="config-name">{name}</code>
        <p className="config-desc">
          {description}
          {optional && " (optional)"}
        </p>
      </div>
    </div>
  );
});

const DEFAULT_STATUS: ConfigStatus = {
  BETTER_AUTH_SECRET: false,
  SUUD_OAUTH_CLIENT_ID: false,
  SUUD_OAUTH_CLIENT_SECRET: false,
  VITE_SUUD_BASE_URL: false,
  adminConfigured: false,
};

export function InstallClient() {
  const [status, setStatus] = useState<ConfigStatus>(DEFAULT_STATUS);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { setItemRef, positions } = useNotePositions(wrapperRef, CONFIG_KEYS);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/configStatus");
        if (!res.ok) throw new Error("Failed to load configuration");
        const data = await res.json();
        setStatus(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };
    loadConfig();
  }, []);

  const envReady =
    status.BETTER_AUTH_SECRET &&
    status.SUUD_OAUTH_CLIENT_ID &&
    status.SUUD_OAUTH_CLIENT_SECRET;

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signIn.oauth2({
        providerId: "suud",
        callbackURL: window.location.origin,
      });
    } catch {
      setError("Login failed");
      setIsLoggingIn(false);
    }
  };

  return (
    <main>
      <header className="install-header">
        <h1 className="install-title">Setup Required</h1>
        <p className="install-subtitle">
          Configure your environment to get started
        </p>
      </header>

      {error && (
        <div className="install-error" role="alert">
          {error}
        </div>
      )}

      <div className="install-wrapper" ref={wrapperRef}>
        <section className="install-content">
          <div className="install-card">
            <h2 className="install-card-title">Environment Variables</h2>

            <div className="config-list">
              <ConfigItem
                ref={setItemRef("BETTER_AUTH_SECRET")}
                name="BETTER_AUTH_SECRET"
                configured={status.BETTER_AUTH_SECRET}
                description="Secret key for authentication"
              />
              <ConfigItem
                ref={setItemRef("SUUD_OAUTH_CLIENT_ID")}
                name="SUUD_OAUTH_CLIENT_ID"
                configured={status.SUUD_OAUTH_CLIENT_ID}
                description="OAuth client ID from SUUD"
              />
              <ConfigItem
                ref={setItemRef("SUUD_OAUTH_CLIENT_SECRET")}
                name="SUUD_OAUTH_CLIENT_SECRET"
                configured={status.SUUD_OAUTH_CLIENT_SECRET}
                description="OAuth client secret from SUUD"
              />
              <ConfigItem
                ref={setItemRef("VITE_SUUD_BASE_URL")}
                name="VITE_SUUD_BASE_URL"
                configured={status.VITE_SUUD_BASE_URL}
                description="SUUD base URL (optional, defaults to https://suud.net)"
                optional
              />
            </div>
          </div>

          {envReady && !status.adminConfigured && (
            <div className="install-card">
              <h2 className="install-card-title">Claim Ownership</h2>
              <p className="install-desc">
                Environment is configured. Authenticate with SUUD to become the
                administrator of this blog. The first person to authenticate
                will automatically be set as the owner.
              </p>
              <button
                className="install-login-btn"
                onClick={handleLogin}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Redirecting..." : "Authenticate"}
              </button>
            </div>
          )}

          {status.adminConfigured && (
            <div className="install-card">
              <h2 className="install-card-title">Setup Complete</h2>
              <p className="install-desc">
                An administrator has been configured. You can now access the
                dashboard.
              </p>
              <a href="/dashboard" className="install-login-btn">
                Go to Dashboard
              </a>
            </div>
          )}

          {!envReady && (
            <div className="install-card">
              <h2 className="install-card-title">Setup Instructions</h2>

              <ol className="install-steps">
                <li>
                  Create a <code className="install-code">.env</code> or{" "}
                  <code className="install-code">.env.production</code> file in
                  the project root
                </li>
                <li>
                  Register your application at{" "}
                  <a
                    href="https://suud.net"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="install-link"
                  >
                    suud.net
                  </a>{" "}
                  to obtain OAuth credentials
                </li>
                <li>
                  Generate a secret key:{" "}
                  <code className="install-code">openssl rand -hex 16</code>
                </li>
                <li>Add the environment variables and restart the server</li>
              </ol>

              <pre className="install-pre">
                {`BETTER_AUTH_SECRET=your-secret-key
VITE_SUUD_BASE_URL=https://suud.net
SUUD_OAUTH_CLIENT_ID=your-client-id
SUUD_OAUTH_CLIENT_SECRET=your-client-secret`}
              </pre>
            </div>
          )}
        </section>

        <aside className="install-margin-column">
          {CONFIG_KEYS.map((key) => (
            <div
              key={key}
              className="install-note"
              style={{ top: positions[key] ?? 0 }}
            >
              {notes[key]}
            </div>
          ))}
        </aside>
      </div>
    </main>
  );
}
