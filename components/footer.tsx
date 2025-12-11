import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #e5e7eb",
        marginTop: "2rem",
        padding: "1rem 0",
        backgroundColor: "#ffffff",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          padding: "0 1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "0.85rem",
          color: "#6b7280",
        }}
      >
        <span>© {new Date().getFullYear()} Bookshelf</span>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/about">
            <button
              style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#4b5563",
              }}
            >
              About Us
            </button>
          </Link>

          <button
            style={{
                border: "none",
                background: "none",
                cursor: "pointer",
                color: "#4b5563",
            }}
          >
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
}
