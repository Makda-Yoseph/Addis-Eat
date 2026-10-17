import Link from "next/link";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Sign In", href: "/signin" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-amber-200 bg-[#fff8e9] text-stone-700">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-14 lg:px-8 lg:py-16">
        <div>
          <Link
            href="/"
            className="text-3xl font-extrabold tracking-tight text-red-800 transition-colors hover:text-red-700"
          >
            Addis Eats
          </Link>

          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Authentic Ethiopian Cuisine
          </p>

          <p className="mt-5 max-w-sm text-sm leading-7 text-stone-600">
            Bringing the rich flavors of Ethiopia to your table. Fresh
            ingredients, traditional recipes, and a taste of home — delivered
            with love.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-800">
            Quick Links
          </h2>

          <ul className="mt-5 space-y-3">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-2 text-sm transition-colors hover:text-red-800"
                >
                  <span className="text-amber-600" aria-hidden="true">
                    ›
                  </span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-800">
            Customer Support
          </h2>

          <div className="mt-5 space-y-4 text-sm">
            <p className="flex items-start gap-3">
              <span className="font-bold text-red-800" aria-hidden="true">
                ✉
              </span>
              <a
                href="mailto:hello@addiseats.com"
                className="break-all transition-colors hover:text-red-800"
              >
                hello@addiseats.com
              </a>
            </p>

            <p className="flex items-start gap-3">
              <span className="font-bold text-red-800" aria-hidden="true">
                ☎
              </span>
              <a
                href="tel:+251911123456"
                className="transition-colors hover:text-red-800"
              >
                +251 911 123 456
              </a>
            </p>

            <p className="flex items-start gap-3">
              <span className="font-bold text-red-800" aria-hidden="true">
                ●
              </span>
              <span>
                Bole Addis Ababa,
                <br />
                Ethiopia
              </span>
            </p>
          </div>

          <Link
            href="/menu"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-red-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
          >
            Explore Our Menu{" "}
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>

      <div className="border-t border-amber-200">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-center text-xs text-stone-600 sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">
          <p>© 2026 Addis Eats. All rights reserved.</p>

          {/* <p className="font-medium text-red-800">
            Good Food <span className="mx-2 text-amber-600">•</span>
            Happy People <span className="mx-2 text-amber-600">•</span>
            Addis Eats
          </p> */}
        </div>
      </div>

      {/* <div
        className="h-2 border-y border-amber-500"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #991b1b 0px, #991b1b 5px, #f3d28a 5px, #f3d28a 10px, #fff8e9 10px, #fff8e9 15px)",
        }}
        aria-hidden="true"
      /> */}
    </footer>
  );
}
