"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-5 py-16 text-center">
        <div className="text-6xl">🛒</div>
        <h1 className="mt-5 text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-gray-600">
          Discover your favorite Ethiopian dishes and add them to your cart.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white hover:opacity-90"
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <h1 className="text-3xl font-bold">Your Cart</h1>
      <p className="mt-2 text-gray-600">Review your items before checkout.</p>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr_300px]">
        <section className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4"
            >
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p className="mt-1 text-sm text-gray-600">
                  {item.price} ETB each
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="h-9 w-9 rounded-md border border-gray-300"
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    −
                  </button>

                  <span className="min-w-5 text-center">{item.quantity}</span>

                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-9 w-9 rounded-md border border-gray-300"
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold">
                  {(item.price * item.quantity).toLocaleString()} ETB
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="mt-3 text-sm text-red-700 underline"
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </section>

        <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-xl font-bold">Order Summary</h2>

          <div className="mt-5 flex justify-between gap-3">
            <span className="text-gray-600">Subtotal</span>
            <span>{total.toLocaleString()} ETB</span>
          </div>

          <div className="mt-4 flex justify-between gap-3 border-t pt-4 font-bold">
            <span>Total</span>
            <span>{total.toLocaleString()} ETB</span>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Delivery fees, if applicable, will be calculated at checkout.
          </p>

          <Link
            href="/checkout"
            className="mt-6 block rounded-lg bg-primary px-4 py-3 text-center font-semibold text-white hover:opacity-90"
          >
            Proceed to Checkout
          </Link>

          <Link
            href="/menu"
            className="mt-4 block text-center text-sm text-gray-600 hover:text-primary"
          >
            Continue Shopping
          </Link>
        </aside>
      </div>
    </main>
  );
}
