import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  getTokenName,
  signAuthToken,
  verifyPassword,
} from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      email?: string;
      password?: string;
    };

    const email = body.email?.trim().toLowerCase();
    const password = body.password ?? "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid" },
        { status: 401 }
      );
    }

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
    console.error("POST /api/auth/login error:", err);
    return NextResponse.json(
      { error: "Failed" },
      { status: 500 }
    );
  }
}
