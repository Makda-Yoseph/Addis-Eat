"use server";

import { redirect } from "next/navigation";
import { findUserByEmail, verifyPassword } from "@/lib/users";

import { createSession, deleteSession } from "@/lib/session";

function getSafeNext(value) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return "/";
  }

  try {
    const url = new URL(value, "http://localhost");

    if (url.origin !== "http://localhost") {
      return "/";
    }

    return url.pathname + url.search + url.hash;
  } catch {
    return "/";
  }
}

export async function signInAction(prevState, formData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  const password = String(formData.get("password") ?? "");
  const next = getSafeNext(formData.get("next"));

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const user = await findUserByEmail(email);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password." };
  }

  await createSession(user);

  if (user.id === "admin-1" && user.role === "staff") {
    redirect("/admin");
  }

  redirect(next);
}
export async function signOutAction() {
  await deleteSession();
  redirect("/");
}
