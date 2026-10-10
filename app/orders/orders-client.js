"use client";

import Link from "next/link";
import useSWR from "swr";

const fetcher = async (url) => {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Could not load your orders.");
  }

  return response.json();
};

export default function OrdersClient({ initialOrders }) {
  const {
    data: orders,
    error,
    isLoading,
  } = useSWR("/api/orders", fetcher, {
    fallbackData: initialOrders,
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });

  if (error) {
    return (
      <p role="alert" className="mt-6 text-red-700">
        {error.message}
      </p>
    );
  }

  if (isLoading && !orders) {
    return <p className="mt-6">Loading your orders...</p>;
  }

  if (!orders?.length) {
    return (
      <div className="mt-8 rounded-xl border bg-white p-8 text-center">
        <p>You haven't placed any orders yet.</p>
        <Link
          href="/menu"
          className="mt-5 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {orders.map((order) => (
        <article
          key={order.id}
          className="rounded-xl border border-stone-200 bg-white p-6"
        >
          <div className="flex flex-wrap justify-between gap-3">
            <div>
              {/* <p className="text-sm text-gray-500">Order number< */}
            </div>

            <span className="h-fit rounded-full bg-amber-100 px-3 py-1 text-sm font-medium capitalize">
              {order.status}
            </span>
          </div>

          <div className="mt-4 flex justify-between gap-4 border-t pt-4">
            <span className="text-gray-600">
              {order.items.length} item type(s)
            </span>
            <span className="font-bold">
              {order.total.toLocaleString()} ETB
            </span>
          </div>

          <Link
            href={`/order-confirmation/${order.id}`}
            className="mt-4 inline-block font-semibold text-primary hover:underline"
          >
            View order details
          </Link>
        </article>
      ))}
    </div>
  );
}
