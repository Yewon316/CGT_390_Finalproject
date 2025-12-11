"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to create account.");
        setLoading(false);
        return;
      }

      router.replace("/register/success");
    } catch (err) {
      console.error("Register error:", err);
      setError("Error");
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h1 className="auth-title">Bookshelf</h1>
      <p className="auth-subtitle">Create an account</p>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="auth-error">{error}</p>}

        <label className="auth-label">
          Name
          <input
            className="auth-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Yewon"
          />
        </label>

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
          {loading ? "Creating account" : "Create Account"}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account?{" "}
        <Link href="/login">
          <span className="auth-link">Sign in</span>
        </Link>
      </p>
    </div>
  );
}
