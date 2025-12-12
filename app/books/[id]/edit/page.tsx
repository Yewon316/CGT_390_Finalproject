import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import EditBookForm from "../EditBookForm";
import { requireUser } from "@/lib/session";

const prisma = new PrismaClient();

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBookPage({ params }: PageProps) {
  await requireUser();
  const { id: idParam } = await params;
  const id = Number(idParam);

  if (Number.isNaN(id)) {
    return (
      <div style={{ padding: "1rem 0" }}>
        <p>Invalid book id.</p>
        <Link href="/books" style={{ color: "#1e3a8a", fontSize: "0.9rem" }}>
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
        <p>Book not found</p>
        <Link href="/books" style={{ color: "#1e3a8a", fontSize: "0.9rem" }}>
          Back to bookshelf
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "480px", display: "grid", gap: "1rem" }}>
      <Link href={`/books/${id}`} style={{ color: "#1e3a8a", fontSize: "0.9rem" }}>
        Back to book
      </Link>

      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
        }}
      >
        Edit Book
      </h1>

      <EditBookForm
        id={book.id}
        initialTitle={book.title}
        initialAuthor={book.author}
        initialStatus={book.status}
        initialRating={book.rating}
        initialReview={book.review}
        initialCoverUrl={book.coverUrl}
      />
    </div>
  );
}
