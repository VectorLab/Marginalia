import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";

import { Link } from "@tanstack/react-router";

import { useNotePositions } from "@/hooks/useNotePositions";
import type { SiteSettings } from "@/lib/types";

const SETTINGS_KEYS = [
  "adminEmail",
  "siteTitle",
  "siteDescription",
  "siteKeywords",
] as const;

type SettingsKey = (typeof SETTINGS_KEYS)[number];

const notes: Record<SettingsKey, string> = {
  adminEmail:
    "The SUUD email address of the blog administrator. Only this person can manage posts.",
  siteTitle: "Shown in browser tabs and search results. Keep it concise.",
  siteDescription:
    "A brief summary for search engines, ideally 150–160 characters.",
  siteKeywords: "Comma-separated terms that describe your site's content.",
};

const DEFAULT_SETTINGS: SiteSettings = {
  adminEmail: "",
  siteTitle: "",
  siteDescription: "",
  siteKeywords: "",
};

type Message = { type: "success" | "error"; text: string } | null;

export function SettingsClient() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<Message>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const { setItemRef, positions } = useNotePositions(wrapperRef, SETTINGS_KEYS);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        setSettings({
          adminEmail: data.adminEmail || "",
          siteTitle: data.siteTitle || "",
          siteDescription: data.siteDescription || "",
          siteKeywords: data.siteKeywords || "",
        });
      } catch (err) {
        setMessage({
          type: "error",
          text: err instanceof Error ? err.message : "Failed to load settings",
        });
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage({ type: "success", text: "Settings saved" });
    } catch {
      setMessage({ type: "error", text: "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main>
        <header className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Loading...</p>
        </header>
      </main>
    );
  }

  return (
    <main>
      <header className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Configure your site</p>
      </header>

      <div className="settings-wrapper" ref={wrapperRef}>
        <section className="settings-content">
          <div className="settings-card">
            <div className="settings-nav">
              <h2 className="settings-card-title">Configuration</h2>
              <Link to="/dashboard" className="settings-back">
                ← Dashboard
              </Link>
            </div>

            <form className="settings-form" onSubmit={handleSubmit}>
              <div className="settings-field" ref={setItemRef("adminEmail")}>
                <label className="settings-label" htmlFor="adminEmail">
                  Administrator Email
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  name="adminEmail"
                  className="settings-input"
                  value={settings.adminEmail}
                  onChange={handleChange}
                  placeholder="admin@example.com"
                />
              </div>

              <hr className="settings-divider" />

              <div className="settings-field" ref={setItemRef("siteTitle")}>
                <label className="settings-label" htmlFor="siteTitle">
                  Site Title
                </label>
                <input
                  type="text"
                  id="siteTitle"
                  name="siteTitle"
                  className="settings-input"
                  value={settings.siteTitle}
                  onChange={handleChange}
                  placeholder="Marginalia"
                />
              </div>

              <div
                className="settings-field"
                ref={setItemRef("siteDescription")}
              >
                <label className="settings-label" htmlFor="siteDescription">
                  Site Description
                </label>
                <textarea
                  id="siteDescription"
                  name="siteDescription"
                  className="settings-input settings-textarea"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  placeholder="Notes in the margins."
                />
              </div>

              <div className="settings-field" ref={setItemRef("siteKeywords")}>
                <label className="settings-label" htmlFor="siteKeywords">
                  Keywords
                </label>
                <input
                  type="text"
                  id="siteKeywords"
                  name="siteKeywords"
                  className="settings-input"
                  value={settings.siteKeywords}
                  onChange={handleChange}
                  placeholder="blog, notes, marginalia"
                />
              </div>

              <div className="settings-actions">
                <button
                  type="submit"
                  className="settings-save-btn"
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                {message && (
                  <span className="settings-message" data-type={message.type}>
                    {message.text}
                  </span>
                )}
              </div>
            </form>
          </div>
        </section>

        <aside className="margin-column">
          {SETTINGS_KEYS.map((key) => (
            <div
              key={key}
              className="margin-note"
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
