"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { updateOrderStatus } from "@/lib/orders";

export async function changeOrderStatus(formData) {
  const session = await getSession();

  if (session?.id !== "admin-1" || session?.role !== "staff") {
    throw new Error("Unauthorized");
  }

  const orderId = formData.get("orderId");
  const status = formData.get("status");

  if (
    typeof orderId !== "string" ||
    typeof status !== "string" ||
    !["pending", "preparing", "delivered"].includes(status)
  ) {
    throw new Error("Invalid order update");
  }

  await updateOrderStatus(orderId, status);
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
}
