import { Suspense } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getOrderById } from "@/lib/orders";
import ClearCartOnSuccess from "@/app/(shop)/checkout/clear-cart";

export const metadata = {
  title: "Order Confirmation | Addis Eats",
  description: "View your Addis Eats order confirmation.",
};

function ConfirmationLoading() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <p>Loading your order confirmation...</p>
    </main>
  );
}

async function ConfirmationContent({ id }) {
  const session = await getSession();

  if (!session) {
    if (!session) {
      redirect(
        `/signin?next=${encodeURIComponent(`/order-confirmation/${id}`)}`,
      );
    }
  }

  const order = await getOrderById(id);

  if (!order || order.userId !== session.id) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-12">
      <ClearCartOnSuccess />
      <div className="rounded-2xl border p-8">
        <p className="font-semibold text-green-700">
          Order placed successfully!
        </p>
        <h1 className="mt-3 text-3xl font-bold">Thank you for your order</h1>
        <p className="mt-3 text-gray-600">
          Your order has been received by Addis Eats.
        </p>

        <div className="mt-6 space-y-3">
          <p>
            <strong>Order ID:</strong> {order.id}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Total:</strong> {order.total} ETB
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            className="rounded-lg bg-red-700 px-5 py-3 text-white"
            href="/orders"
          >
            View my orders
          </Link>
          <Link className="rounded-lg border px-5 py-3" href="/menu">
            Continue shopping
          </Link>
        </div>
      </div>
    </main>
  );
}

// function redirectToSignIn(id) {
//   const { redirect } = require("next/navigation");
//   redirect(`/signin?next=${encodeURIComponent(`/order-confirmation/${id}`)}`);
// }

async function ConfirmationRoute({ params }) {
  const { id } = await params;
  return <ConfirmationContent id={id} />;
}

export default function OrderConfirmationPage({ params }) {
  return (
    <Suspense fallback={<ConfirmationLoading />}>
      <ConfirmationRoute params={params} />
    </Suspense>
  );
}
