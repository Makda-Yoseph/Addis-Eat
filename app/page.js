import Link from "next/link";
import menuData from "@/data/menu.json";
import Image from "next/image";

export default function Home() {
  const categories = menuData.categories;

  return (
    <main className="min-h-screen">
      <section className="bg-primary text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-4 font-semibold uppercase tracking-widest text-accent">
              A taste of Ethiopia
            </p>

            <h1 className="text-4xl font-bold leading-tight md:text-6xl">
              Authentic Ethiopian food, made with love.
            </h1>

            <p className="mt-5 max-w-lg text-lg text-white/85">
              Discover traditional favorites, delicious combinations, and the
              flavors that bring us together.
            </p>

            <Link
              href="/menu"
              className="mt-8 inline-block rounded-lg bg-accent px-6 py-3 font-bold text-stone-950 transition hover:brightness-95"
            >
              Explore Our Menu
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl">
            <Image
              src="/images/menu/Doro.jfif"
              alt="Traditional Ethiopian Doro Wat"
              width={800}
              height={800}
              unoptimized
              sizes="(max-width: 768px) 100vw, 50vw"
              className="h-72 w-full object-cover md:h-96"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <p className="font-semibold uppercase tracking-widest text-primary">
          Explore
        </p>

        <h2 className="mt-2 text-3xl font-bold">
          Something delicious for everyone
        </h2>

        <p className="mt-3 text-stone-600">
          Find your favorite flavors and discover something new.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu?category=${encodeURIComponent(category.name)}&page=1`}
              className="rounded-xl border border-stone-200 bg-white p-5 text-center font-semibold shadow-sm transition hover:border-primary hover:text-primary"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
