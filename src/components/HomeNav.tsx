import { useEffect, useState } from "react";

import { Link } from "@tanstack/react-router";

import { useSession, signInWithSuud, signOut } from "@/lib/auth/client";
import { getAdminEmail } from "@/lib/server";

export function HomeNav() {
  const { data: session, isPending } = useSession();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    getAdminEmail().then(setAdminEmail);
  }, []);

  const navStyle = {
    position: "fixed" as const,
    bottom: "var(--s-lg)",
    left: "var(--s-lg)",
    display: "flex",
    gap: "var(--s-xs)",
    zIndex: 100,
  };

  if (isPending) {
    return (
      <nav style={navStyle}>
        <span className="nav-btn" style={{ opacity: 0.5 }}>
          Loading...
        </span>
      </nav>
    );
  }

  if (!session) {
    return (
      <nav style={navStyle}>
        <button
          onClick={() => signInWithSuud("/")}
          className="nav-btn"
          type="button"
        >
          Authenticate
        </button>
      </nav>
    );
  }

  const showOwnerControls = !!(
    session?.user?.email &&
    adminEmail &&
    session.user.email === adminEmail
  );

  return (
    <nav style={navStyle}>
      {showOwnerControls && (
        <>
          <Link to="/editor" search={{ slug: undefined }} className="nav-btn">
            New
          </Link>
          <Link to="/dashboard" className="nav-btn">
            Manage
          </Link>
        </>
      )}
      <button
        onClick={() => signOut()}
        className="nav-btn"
        type="button"
        style={{ opacity: 0.7 }}
      >
        Leave
      </button>
    </nav>
  );
}
