import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "@tanstack/react-router";

export function DeleteButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    const params = new URLSearchParams({ slug });
    await fetch(`/api/posts?${params}`, { method: "DELETE" });
    setIsOpen(false);
    setIsDeleting(false);
    router.invalidate();
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    },
    [setIsOpen],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      cancelRef.current?.focus();
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="delete-btn"
        style={{
          background: "none",
          border: "none",
          fontSize: "0.75rem",
          color: "var(--c-acc-1)",
          cursor: "pointer",
          padding: "0.25rem 0",
          transition: "opacity 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Delete
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={() => setIsOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "hsla(var(--hue-ink), var(--sat-ink), 10%, 0.4)",
              backdropFilter: "blur(4px)",
              animation: "fadeInBackdrop 0.2s ease-out forwards",
            }}
          />

          <div
            style={{
              position: "relative",
              background: "var(--c-bg)",
              border: "1px solid var(--c-border)",
              borderRadius: "12px",
              padding: "1.5rem 2rem",
              maxWidth: "320px",
              width: "90%",
              boxShadow:
                "0 20px 40px -10px hsla(var(--hue-ink), var(--sat-ink), 10%, 0.2)",
              animation:
                "fadeInModal 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          >
            <h3
              id="delete-dialog-title"
              style={{
                margin: 0,
                fontSize: "var(--s-sm)",
                fontWeight: 500,
                color: "var(--c-fg)",
                marginBottom: "0.5rem",
              }}
            >
              Delete this post?
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: "var(--s-xs)",
                color: "var(--c-acc-subtle)",
                marginBottom: "1.25rem",
                lineHeight: "var(--lh-base)",
              }}
            >
              This action cannot be undone.
            </p>

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                ref={cancelRef}
                onClick={() => setIsOpen(false)}
                style={{
                  padding: "0.5rem 1rem",
                  border: "1px solid var(--c-border)",
                  borderRadius: "6px",
                  background: "transparent",
                  fontSize: "var(--s-xs)",
                  color: "var(--c-acc-subtle)",
                  cursor: "pointer",
                  transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--c-acc-subtle)";
                  e.currentTarget.style.color = "var(--c-fg)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--c-border)";
                  e.currentTarget.style.color = "var(--c-acc-subtle)";
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "6px",
                  background: "var(--c-acc-1)",
                  fontSize: "var(--s-xs)",
                  color: "var(--c-bg)",
                  cursor: isDeleting ? "wait" : "pointer",
                  opacity: isDeleting ? 0.7 : 1,
                  transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  if (!isDeleting) e.currentTarget.style.opacity = "0.85";
                }}
                onMouseLeave={(e) => {
                  if (!isDeleting) e.currentTarget.style.opacity = "1";
                }}
              >
                {isDeleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>

          <style>{`
            @keyframes fadeInBackdrop {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes fadeInModal {
              from {
                opacity: 0;
                transform: scale(0.95) translateY(8px);
              }
              to {
                opacity: 1;
                transform: scale(1) translateY(0);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
