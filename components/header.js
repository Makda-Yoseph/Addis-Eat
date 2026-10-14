import Link from "next/link";
import { getSession } from "@/lib/session";
import { signOutAction } from "@/app/signin/actions";
import CartLink from "@/components/cart-link";

export default async function Header() {
  const session = await getSession();

  return (
    <header className="border-b border-gray-200 bg-white text-gray-900">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          Addis Eats
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <Link href="/menu" className="hover:text-primary">
            Menu
          </Link>
          <Link href="/orders" className="hover:text-primary">
            Orders
          </Link>

          <Link href="/checkout" className="hover:text-primary">
            Checkout
          </Link>
          <CartLink />

          <>
            <Link href="/signin" className="hover:text-primary">
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary px-4 py-2 text-white hover:opacity-90"
            >
              Register
            </Link>
          </>
        </div>
      </nav>
    </header>
  );
}
