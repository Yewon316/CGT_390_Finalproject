"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });
      router.replace("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      className="nav-btn"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
