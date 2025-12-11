import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";

const prisma = new PrismaClient();

// GET 
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(books);
  } catch (err) {
    console.error("GET /api/books error:", err);
    return NextResponse.json(
      { error: "Failed to load books" },
      { status: 500 }
    );
  }
}

// POST
export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const body = (await req.json()) as {
      title?: string;
      author?: string;
      status?: string;
      rating?: number | string | null;
      review?: string | null;
      coverUrl?: string | null;
    };

    const { title, author, status, rating, review, coverUrl } = body;

    if (!title || !author || !status) {
      return NextResponse.json(
        { error: "Title, author, and status are required" },
        { status: 400 }
      );
    }

    const ratingValue =
      rating === null || rating === undefined || rating === ""
        ? null
        : Number(rating);
    const reviewValue =
      review == null || review.trim() === "" ? null : review.trim();
    const coverUrlValue =
      typeof coverUrl === "string" && coverUrl.trim() !== ""
        ? coverUrl.trim()
        : null;

    const book = await prisma.book.create({
      data: {
        title,
        author,
        status,
        rating: ratingValue,
        review: reviewValue,
        coverUrl: coverUrlValue,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (err) {
    console.error("POST /api/books error:", err);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}
