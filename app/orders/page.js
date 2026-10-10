import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrdersByUser } from "@/lib/orders";
import OrdersClient from "./orders-client";

export const metadata = {
  title: "My Orders | Addis Eats",
  description: "View your Addis Eats order history and track order status.",
};

export default async function OrdersPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/orders");
  }

  const orders = await getOrdersByUser(session.id);

  return (
    <main className="mx-auto max-w-4xl px-5 py-10">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <p className="mt-2 text-gray-600">
        View your orders and their current status.
      </p>

      <OrdersClient initialOrders={orders} />
    </main>
  );
}
