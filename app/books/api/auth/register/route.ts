import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  getTokenName,
  hashPassword,
  signAuthToken,
} from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      name?: string;
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const name = body.name?.trim() || null;
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account already exists." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
      },
    });



    const token = signAuthToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    response.cookies.set(getTokenName(), token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("POST /api/auth/register error:", err);
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}
