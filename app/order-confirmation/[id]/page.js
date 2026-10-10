import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/session";
import { getOrderById } from "@/lib/orders";
import ClearCartOnSuccess from "@/app/checkout/clear-cart";

export const metadata = {
  title: "Order Confirmed | Addis Eats",
  description: "Your Addis Eats order confirmation and status.",
};

async function OrderConfirmation({ id }) {
  const session = await getSession();

  if (!session) {
    redirect("/signin");
  }

  const order = await getOrderById(id);

  if (!order) {
    return <main className="p-8">Order not found in storage.</main>;
  }

  if (order.userId !== session.id) {
    return <main className="p-8">This order belongs to another user.</main>;
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-16">
      <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-sm">
        <ClearCartOnSuccess />

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-700">
          ✓
        </div>

        <h1 className="mt-5 text-3xl font-bold">Your order is confirmed!</h1>

        <p className="mt-3 text-stone-600">
          Thank you for ordering with Addis Eats. Your meal is now awaiting
          preparation.
        </p>

        <div className="mt-8 rounded-xl bg-stone-50 p-5 text-left">
          {/* <p className="text-sm text-stone-500">Order number</p>
          <p className="mt-1 break-all font-semibold">{order.id}</p> */}

          <div className="mt-5 flex justify-between gap-4">
            <span className="text-stone-600">Status</span>
            <span className="font-semibold capitalize">{order.status}</span>
          </div>

          <div className="mt-3 flex justify-between gap-4">
            <span className="text-stone-600">Total</span>
            <span className="font-bold">
              {order.total.toLocaleString()} ETB
            </span>
          </div>
        </div>

        <p className="mt-6 text-sm text-stone-600">
          We'll update your order status as your meal moves through preparation
          and delivery.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/orders"
            className="rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:opacity-90"
          >
            Track My Order
          </Link>

          <Link
            href="/menu"
            className="rounded-lg border border-stone-300 px-6 py-3 font-semibold hover:bg-stone-50"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

export default async function OrderConfirmationPage({ params }) {
  const { id } = await params;

  return (
    <Suspense fallback={<main className="p-8">Loading confirmation...</main>}>
      <OrderConfirmation id={id} />
    </Suspense>
  );
}
