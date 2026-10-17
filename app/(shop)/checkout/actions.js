"use server";

import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMenu } from "@/lib/menu";
import { createOrder } from "@/lib/orders";

export async function placeOrderAction(prevState, formData) {
  const session = await getSession();

  if (!session) {
    return { error: "Please sign in before placing your order." };
  }

  const customerName = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();

  if (!customerName || !phone || !address) {
    return { error: "Please complete all delivery details." };
  }

  let requestedItems;

  try {
    requestedItems = JSON.parse(String(formData.get("items") ?? ""));
  } catch {
    return { error: "Your cart could not be read. Please try again." };
  }

  if (
    !Array.isArray(requestedItems) ||
    requestedItems.length === 0 ||
    requestedItems.length > 50
  ) {
    return { error: "Your cart is empty or invalid." };
  }

  const { menu } = await getMenu();

  const items = [];

  for (const requested of requestedItems) {
    const dish = menu.find((item) => String(item.id) === String(requested.id));

    const quantity = Number(requested.quantity);

    if (
      !dish ||
      dish.inStock !== true ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1 ||
      quantity > 99
    ) {
      return {
        error:
          "One or more dishes are unavailable or have an invalid quantity.",
      };
    }

    items.push({
      id: dish.id,
      name: dish.name,
      price: dish.price,
      quantity,
      image: dish.image,
    });
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const order = await createOrder({
    userId: session.id,
    customerName,
    items,
    phone,
    address,
    total,
  });

  redirect(`/order-confirmation/${order.id}`);
}
