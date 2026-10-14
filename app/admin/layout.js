import Link from "next/link";

import { adminSignOut } from "./actions";

const navigation = [
  { label: "Overview", href: "/admin", icon: "▦" },
  { label: "Orders", href: "/admin/orders", icon: "▤" },
  { label: "Menu", href: "/admin/menu", icon: "🍽" },
  { label: "Analytics", href: "/admin/analytics", icon: "↗" },
];

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-stone-100 md:flex">
      <aside className="w-full bg-stone-950 p-5 text-white md:min-h-screen md:w-64 md:shrink-0">
        <Link href="/admin" className="text-xl font-bold text-red-400">
          Addis Eats
        </Link>

        <p className="mb-6 mt-1 text-xs uppercase tracking-widest text-stone-400">
          Admin workspace
        </p>

        <nav
          aria-label="Admin navigation"
          className="flex gap-2 overflow-x-auto md:flex-col"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm text-stone-300 transition hover:bg-stone-800 hover:text-white"
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 border-t border-stone-800 pt-5">
          <Link href="/" className="text-sm text-stone-400 hover:text-white">
            ← View customer website
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <main className="p-5 md:p-8">{children}</main>
        <div className="px-5 pb-6 md:px-8">
          <form action={adminSignOut}>
            <button
              type="submit"
              className="rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
