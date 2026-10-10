"use client";

import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";

export default function CartLink() {
  const items = useCartStore((state) => state.items);

  const count = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <Link href="/cart" className="relative font-medium hover:text-primary">
      Cart
      <span className="ml-2 inline-flex min-w-6 items-center justify-center rounded-full bg-primary px-2 py-1 text-xs text-white">
        {count}
      </span>
    </Link>
  );
}
