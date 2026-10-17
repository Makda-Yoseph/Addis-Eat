import { Suspense } from "react";
import CheckoutClient from "./checkout-client";

export const metadata = {
  title: "Checkout | Addis Eats",
  description: "Review your order and enter your delivery details.",
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-3xl p-6">Loading checkout...</main>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
