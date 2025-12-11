import { PrismaClient } from "@prisma/client";
import type { CSSProperties } from "react";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import { requireUser } from "@/lib/session";

const prisma = new PrismaClient();

const backButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.35rem 0.75rem",
  borderRadius: "0.65rem",
  border: "none",
  backgroundColor: "#0f172a",
  color: "white",
  fontSize: "0.8rem",
  fontWeight: 500,
  textDecoration: "none",
  width: "fit-content",
  alignSelf: "flex-start",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: PageProps) {
  await requireUser();
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return (
      <div style={{ padding: "1rem 0" }}>
        <p>Invalid book id.</p>
        <Link href="/books" style={backButtonStyle}>
          Back to bookshelf
        </Link>
      </div>
    );
  }

  const book = await prisma.book.findUnique({
    where: { id },
  });

  if (!book) {
    return (
      <div style={{ padding: "1rem 0" }}>
        <p>Book not found.</p>
        <Link href="/books" style={backButtonStyle}>
          Back to bookshelf
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "640px", display: "grid", gap: "1rem" }}>
      <Link href="/books" style={backButtonStyle}>
        Back to bookshelf
      </Link>

      <h1 style={{ fontSize: "1.8rem", fontWeight: 700 }}>Title: {book.title}</h1>

      <div className="detail-cover-wrapper">
        <div className="detail-cover-frame">
          {book.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverUrl}
              alt={`Cover art for ${book.title}`}
              className="detail-cover-image"
            />
          ) : (
            <p className="detail-cover-placeholder">No cover image yet</p>
          )}
        </div>
      </div>

      <p style={{ fontSize: "1rem", color: "#4b5563" }}>Author: {book.author}</p>

      <p style={{ fontSize: "0.9rem" }}>
        Status: <strong>{book.status}</strong>
      </p>

      {book.rating != null && (
        <p style={{ fontSize: "0.9rem" }}>
          Rating: {"★".repeat(book.rating)}{" "}
          {"☆".repeat(5 - book.rating)}
        </p>
      )}

      {book.review && (
        <div className="review-section">
          <p className="review-title">Summary</p>
          <p className="review-body">{book.review}</p>
        </div>
      )}
      
      <div style={{ marginTop: "0.75rem", display: "flex", gap: "0.5rem" }}>
      <Link
        href={`/books/${book.id}/edit`}
        style={{
          padding: "0.45rem 0.85rem",
          borderRadius: "0.6rem",
          border: "1px solid #0f172a",
          backgroundColor: "white",
          color: "#0f172a",
          fontSize: "0.9rem",
        }}
      >
        Edit
      </Link>
    </div>

      <div style={{ marginTop: "0.75rem" }}>
        <DeleteButton id={book.id} />
      </div>
    </div>

    
  );
}
