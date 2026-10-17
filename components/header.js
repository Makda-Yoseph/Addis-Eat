import Link from "next/link";
import { getSession } from "@/lib/session";
import { signOutAction } from "@/app/(shop)/signin/actions";
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
          <Link href="/">Home</Link>
          <Link href="/menu">Menu</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/checkout">Checkout</Link>

          <CartLink />

          {session ? (
            <>
              <span className="text-stone-600">
                Hi, {session.name || "there"}
              </span>

              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-white hover:opacity-90"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/signin">Sign in</Link>

              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-white hover:opacity-90"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
