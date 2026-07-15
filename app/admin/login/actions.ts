"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { createSession } from "@/lib/auth/session";

export type LoginState = { error: string | null };

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Please enter both email and password." };
  }

  let user;
  try {
    [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);
  } catch (error) {
    console.error("Login query failed:", error);
    return { error: "We couldn't reach the database — please try again." };
  }

  const valid = user && (await bcrypt.compare(password, user.passwordHash));
  if (!valid) {
    return { error: "That email and password combination doesn't match." };
  }

  await createSession({ sub: user.id, email: user.email });
  redirect("/admin/dashboard");
}
