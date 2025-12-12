import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import FilterControls from "./FilterControls";
import { requireUser } from "@/lib/session";

type Book = {
  id: number;
  title: string;
  author: string;
  status: string;
  rating: number | null;
  coverUrl?: string | null;
};

type SearchParamsInput =
  | Promise<{ status?: string; sort?: string }>
  | { status?: string; sort?: string }
  | undefined;

const prisma = new PrismaClient();

const VALID_STATUSES = new Set(["ALL", "TO_READ", "READING", "COMPLETED"]);
const VALID_SORTS = new Set(["newest", "rating-desc", "rating-asc"]);

interface PageProps {
  searchParams?: SearchParamsInput;
}

function normalizeStatus(input?: string) {
  if (!input) return "ALL";
  const upper = input.toUpperCase();
  return VALID_STATUSES.has(upper) ? upper : "ALL";
}

function normalizeSort(input?: string) {
  if (!input) return "newest";
  return VALID_SORTS.has(input) ? input : "newest";
}

async function resolveSearchParams(searchParams?: SearchParamsInput) {
  if (!searchParams) return {};
  if (typeof (searchParams as Promise<{ status?: string }>).then === "function") {
    return (await searchParams) ?? {};
  }
  return searchParams;
}

export default async function BooksPage({ searchParams }: PageProps) {
  await requireUser();
  const resolvedSearchParams = await resolveSearchParams(searchParams);
  const statusFilter = normalizeStatus(resolvedSearchParams.status);
  const sortOrder = normalizeSort(resolvedSearchParams.sort);

  const where =
    statusFilter === "ALL"
      ? undefined
      : {
          status: statusFilter,
        };

  const orderBy =
    sortOrder === "rating-desc"
      ? [{ rating: "desc" as const }, { createdAt: "desc" as const }]
      : sortOrder === "rating-asc"
        ? [{ rating: "asc" as const }, { createdAt: "desc" as const }]
        : [{ createdAt: "desc" as const }];

  const books: Book[] = await prisma.book.findMany({
    where,
    orderBy,
  });

  const shelfRows: Book[][] = [];
  const shelfSize = 4;
  for (let i = 0; i < books.length; i += shelfSize) {
    shelfRows.push(books.slice(i, i + shelfSize));
  }

  return (
    <div className="bookshelf-wrapper">
      <div className="bookshelf-header">
        <div>
          <p className="bookshelf-tagline">library</p>
          <h1>My Bookshelf</h1>
        </div>
        <FilterControls currentStatus={statusFilter} currentSort={sortOrder} />
      </div>

      {books.length === 0 ? (
        <p style={{ color: "#grey" }}>No books Click Add Book
        </p>
      ) : (
        <div className="shelf-wall">
          {shelfRows.map((shelf, index) => (
            <div key={`shelf-${index}`} className="shelf-row">
              <div className="shelf-row-books">
                {shelf.map((book) => (
                  <Link key={book.id} href={`/books/${book.id}`} className="book-slot">
                    <div className="book-card">
                      <div className="book-cover-frame">
                        {book.coverUrl ? (
                          <img
                            src={book.coverUrl}
                            alt={`${book.title} cover`}
                            className="book-cover-image"
                          />
                        ) : (
                          <div className="book-cover-placeholder">Add cover
                          </div>
                        )}
                      </div>

                      <div className="book-card-body">
                        <p className="book-card-title">{book.title}</p>
                        <p className="book-card-author">{book.author}</p>
                        <p className="book-card-status">{book.status}</p>
                        {book.rating != null && (
                          <p className="book-card-rating">
                            {"★".repeat(book.rating)}
                            {"☆".repeat(5 - book.rating)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="book-base" />
                  </Link>
                ))}
              </div>
              <div className="shelf-plank" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
