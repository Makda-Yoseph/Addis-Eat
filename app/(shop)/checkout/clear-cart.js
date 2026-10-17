"use client";

import { useEffect } from "react";
import { useCartStore } from "@/lib/cart-store";

export default function ClearCartOnSuccess() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
