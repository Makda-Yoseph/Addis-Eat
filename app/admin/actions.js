"use server";

import { redirect } from "next/navigation";
import { getSession, deleteSession } from "@/lib/session";

export async function adminSignOut() {
  const session = await getSession();

  if (session?.id !== "admin-1" || session?.role !== "staff") {
    throw new Error("Unauthorized");
  }

  await deleteSession();
  redirect("/signin");
}
