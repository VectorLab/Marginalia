import { useState, useEffect } from "react";

import { Link } from "@tanstack/react-router";

import { Article } from "@/components/Article";
import { parseMarginalia } from "@/lib/parser";
import { slugify } from "@/lib/utils";

type EditorClientProps = {
  editSlug?: string;
};

export function EditorClient({ editSlug }: EditorClientProps) {
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [message, setMessage] = useState("");
  const [isSlugModified, setIsSlugModified] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  useEffect(() => {
    if (!editSlug) return;

    const loadPost = async () => {
      setMessage("Loading...");
      try {
        const params = new URLSearchParams({ slug: editSlug });
        const res = await fetch(`/api/posts?${params}`);
        if (!res.ok) throw new Error("Failed to load post");
        const data = await res.json();

        if (data.error) {
          setMessage(data.error);
        } else {
          setTitle(data.title);
          setSlug(data.slug);
          setContent(data.content);
          setPublished(data.published);
          setIsSlugModified(true);
          setMessage("");
        }
      } catch (err) {
        setMessage(err instanceof Error ? err.message : "Failed to load.");
      }
    };

    loadPost();
  }, [editSlug]);

  const { cleanContent, notes } = parseMarginalia(content);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isSlugModified) {
      setSlug(slugify(newTitle));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
    setIsSlugModified(true);
  };

  const handleSave = async () => {
    setMessage("Saving...");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: slugify(slug),
          title,
          content,
          published,
        }),
      });

      if (res.ok) {
        setMessage("Saved.");
      } else {
        const data = await res.json();
        setMessage(`Error: ${data.error}`);
      }
    } catch {
      setMessage("Network error.");
    }
  };

  return (
    <div className="editor-wrapper">
      <header className="mobile-header">
        <Link to="/" className="back-link">
          Cancel
        </Link>
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === "edit" ? "active" : ""}`}
            onClick={() => setActiveTab("edit")}
          >
            Edit
          </button>
          <button
            className={`tab-btn ${activeTab === "preview" ? "active" : ""}`}
            onClick={() => setActiveTab("preview")}
          >
            Preview
          </button>
        </div>
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
      </header>

      <div
        className={`pane input-pane ${activeTab === "edit" ? "active" : ""}`}
      >
        <div className="desktop-header">
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 300 }}>
            The Studio
          </h2>
          <Link to="/" className="back-link">
            Back
          </Link>
        </div>

        {message && <span className="status-msg">{message}</span>}

        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={handleTitleChange}
        />
        <input
          type="text"
          placeholder="Slug (auto-generated)"
          value={slug}
          onChange={handleSlugChange}
          className="desktop-only"
          style={{ opacity: isSlugModified ? 1 : 0.6 }}
        />

        <label className="checkbox-label desktop-only">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          Published
        </label>

        <textarea
          placeholder="Write here. Use ||context||(note) for marginalia."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="save-btn desktop-only" onClick={handleSave}>
          {published ? "Save & Publish" : "Save Draft"}
        </button>
      </div>

      <div
        className={`pane preview-pane ${activeTab === "preview" ? "active" : ""}`}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 5vw, 2.5rem)",
            fontWeight: 300,
            marginBottom: "1rem",
          }}
        >
          {title || "Untitled"}
        </h1>
        <Article
          content={cleanContent}
          notes={notes.map((n, i) => ({ id: i, ...n }))}
        />
      </div>

      <footer className="mobile-footer">
        <div className="mobile-meta">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Publish
          </label>
          {message && <span className="status-msg">{message}</span>}
        </div>
      </footer>
    </div>
  );
}
