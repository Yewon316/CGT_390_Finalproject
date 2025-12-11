import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import LogoutButton from "./LogoutButton";

export default async function NavBar() {
  const user = await getCurrentUser();
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo" style={{ color: "white" }}>
          Bookshelf
        </Link>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "0.6rem",
          }}
        >
          {user && (
            <span
              style={{
                color: "white",
                fontSize: "0.9rem",
                marginBottom: "0.4rem",
              }}
            >
              Hello, {user.name || user.email}
            </span>
          )}

          <div className="nav-button-row">
            {user ? (
              <>
                <Link href="/books">
                  <button className="nav-btn">My Bookshelf</button>
                </Link>
                <Link href="/books/new">
                  <button className="nav-btn nav-btn-primary">Add Book</button>
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="nav-btn nav-btn-primary">Sign In</button>
                </Link>
                <Link href="/register">
                  <button className="nav-btn">Create Account</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
