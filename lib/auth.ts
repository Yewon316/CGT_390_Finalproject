import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const TOKEN_NAME = "bookshelf_session";
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  "bookshelf-dev-secret-change-this-before-production";

export interface AuthTokenPayload {
  userId: number;
  email: string;
  name?: string | null;
}

export function getTokenName() {
  return TOKEN_NAME;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, AUTH_SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(token?: string | null): AuthTokenPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, AUTH_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}
