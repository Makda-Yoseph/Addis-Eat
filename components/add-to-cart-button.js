"use client";

import { useCartStore } from "@/lib/cart-store";

export default function AddToCartButton({ dish }) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button
      type="button"
      onClick={() => addItem(dish)}
      className="mt-6 w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90 sm:w-auto"
    >
      Add to Cart
    </button>
  );
}
