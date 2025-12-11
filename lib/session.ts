import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  AuthTokenPayload,
  getTokenName,
  verifyAuthToken,
} from "./auth";

export async function getCurrentUser(): Promise<AuthTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(getTokenName())?.value;
  return verifyAuthToken(token);
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
