"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { updateDishStock } from "@/lib/menu";

export async function toggleDishStock(formData) {
  const session = await getSession();

  if (session?.id !== "admin-1" || session?.role !== "staff") {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id");
  const inStockValue = formData.get("inStock");

  if (
    typeof id !== "string" ||
    !/^\d+$/.test(id) ||
    !["true", "false"].includes(inStockValue)
  ) {
    throw new Error("Invalid menu update");
  }

  await updateDishStock(Number(id), inStockValue === "true");

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/api/menu");
}
