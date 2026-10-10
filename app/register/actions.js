"use server";

import { redirect } from "next/navigation";
import { createUser } from "@/lib/users";
import { createSession } from "@/lib/session";

export async function registerAction(prevState, formData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name || !email || !password) {
    return { error: "Please fill in every field." };
  }

  if (password.length < 8) {
    return { error: "Your password must be at least 8 characters." };
  }

  let user;

  try {
    user = await createUser({ name, email, password });
  } catch (error) {
    if (error.message === "An account with this email already exists.") {
      return { error: "An account with this email already exists." };
    }

    throw error;
  }

  await createSession(user);
  redirect("/");
}
