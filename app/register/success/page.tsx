import Link from "next/link";

export default function RegisterSuccessPage() {
  return (
    <div className="auth-card">
      <h1 className="auth-title">Thanks</h1>
      <p className="auth-subtitle">
        Your account has been created.
      </p>

      <Link href="/login">
        <button
          type="button"
          className="auth-submit"
          style={{ width: "100%" }}
        >
          Go to Login
        </button>
      </Link>

      <p className="auth-footer">
        Log in to begin tracking your books.
      </p>
    </div>
  );
}
