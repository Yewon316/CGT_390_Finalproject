import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "@/lib/session";

const prisma = new PrismaClient();

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET
export async function GET(_req: Request, ctx: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const { id: idParam } = await ctx.params;
    const id = Number(idParam);

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (err) {
    console.error("GET /api/books/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to load book" },
      { status: 500 }
    );
  }
}

// PUT
export async function PUT(req: Request, ctx: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const { id: idParam } = await ctx.params;
    const id = Number(idParam);

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
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
      typeof review === "string" && review.trim() !== ""
        ? review.trim()
        : null;
    const coverUrlValue =
      typeof coverUrl === "string" && coverUrl.trim() !== ""
        ? coverUrl.trim()
        : null;

    const updated = await prisma.book.update({
      where: { id },
      data: {
        title,
        author,
        status,
        rating: ratingValue,
        review: reviewValue,
        coverUrl: coverUrlValue,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/books/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update book" },
      { status: 500 }
    );
  }
}

// DELETE /api/books/[id] → 책 삭제
export async function DELETE(_req: Request, ctx: RouteParams) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const { id: idParam } = await ctx.params;
    const id = Number(idParam);

    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const result = await prisma.book.deleteMany({
      where: { id },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/books/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete book" },
      { status: 500 }
    );
  }
}
