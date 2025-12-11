"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to sign in.");
        setLoading(false);
        return;
      }

      router.replace("/books");
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("Unexpected error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to manage your bookshelf.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="auth-error">{error}</p>}

        <label className="auth-label">
          Email
          <input
            type="email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="auth-label">
          Password
          <input
            type="password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button
          type="submit"
          className="auth-submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="auth-footer">
        No account yet?{" "}
        <Link href="/register">
          <span className="auth-link">Create one</span>
        </Link>
      </p>
    </div>
  );
}
