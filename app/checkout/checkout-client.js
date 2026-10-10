"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useCartStore } from "@/lib/cart-store";
import { placeOrderAction } from "./actions";

export default function CheckoutClient() {
  const items = useCartStore((state) => state.items);

  const [state, formAction, pending] = useActionState(placeOrderAction, {
    error: "",
  });

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-gray-600">
          Add some delicious Ethiopian food before checking out.
        </p>
        <Link
          href="/menu"
          className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-white"
        >
          Browse Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <p className="mt-2 text-gray-600">
        Confirm your order and delivery details.
      </p>

      <form
        action={formAction}
        className="mt-8 space-y-6 rounded-xl border border-stone-200 bg-white p-6"
      >
        <input
          type="hidden"
          name="items"
          value={JSON.stringify(
            items.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
          )}
        />

        <div>
          <label htmlFor="name" className="mb-2 block font-medium">
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-lg border border-stone-300 px-4 py-3"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-2 block font-medium">
            Phone number
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            className="w-full rounded-lg border border-stone-300 px-4 py-3"
            placeholder="Enter your phone number"
          />
        </div>

        <div>
          <label htmlFor="address" className="mb-2 block font-medium">
            Delivery address
          </label>
          <textarea
            id="address"
            name="address"
            required
            autoComplete="street-address"
            rows={3}
            className="w-full rounded-lg border border-stone-300 px-4 py-3"
            placeholder="Enter your delivery address"
          />
        </div>

        <div className="rounded-lg bg-stone-50 p-4">
          <h2 className="font-bold">Order Summary</h2>

          {items.map((item) => (
            <div
              key={item.id}
              className="mt-3 flex justify-between gap-4 text-sm"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{(item.price * item.quantity).toLocaleString()} ETB</span>
            </div>
          ))}

          <div className="mt-4 flex justify-between border-t border-stone-200 pt-4 font-bold">
            <span>Total</span>
            <span>{total.toLocaleString()} ETB</span>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Your final total is calculated and verified on the server.
          </p>
        </div>

        {state?.error && (
          <p
            role="alert"
            className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-primary px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Placing your order..." : "Place Order"}
        </button>

        <Link
          href="/cart"
          className="block text-center text-sm text-gray-600 hover:text-primary"
        >
          Return to Cart
        </Link>
      </form>
    </main>
  );
}
