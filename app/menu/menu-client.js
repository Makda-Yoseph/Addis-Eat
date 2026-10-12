"use client";

import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cart-store";
import Image from "next/image";

const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load the menu.");
  }

  return response.json();
};

const PAGE_SIZE = 6;

export default function MenuClient({
  initialData,
  initialPage,
  initialCategory,
}) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());

      const params = new URLSearchParams();

      if (selectedCategory) {
        params.set("category", selectedCategory);
      }

      params.set("page", "1");
      router.push(`/menu?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, router, selectedCategory]);

  const query = new URLSearchParams();

  if (debouncedSearch) {
    query.set("search", debouncedSearch);
  }

  if (selectedCategory) {
    query.set("category", selectedCategory);
  }

  const searchKey = `/api/menu?${query.toString()}`;

  const initialFilteredData = {
    ...initialData,
    menu: initialData.menu.filter((dish) => {
      const matchesCategory =
        !selectedCategory || dish.category === selectedCategory;

      const matchesSearch = [dish.name, dish.description, dish.category]
        .join(" ")
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());

      return matchesCategory && matchesSearch;
    }),
  };

  const { data, error, isLoading } = useSWR(searchKey, fetcher, {
    fallbackData: initialFilteredData,
    keepPreviousData: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    shouldRetryOnError: false,
  });

  const menu = data?.menu ?? [];
  const totalPages = Math.max(1, Math.ceil(menu.length / PAGE_SIZE));
  const page = Math.min(Math.max(initialPage, 1), totalPages);

  const startIndex = (page - 1) * PAGE_SIZE;
  const visibleDishes = menu.slice(startIndex, startIndex + PAGE_SIZE);

  if (isLoading && !data) {
    return <main className="p-6">Loading menu...</main>;
  }

  if (error && !data) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold">Our Menu</h1>
        <p className="mt-3 text-red-700">
          We couldn't load the menu. Please refresh and try again.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <h1 className="text-3xl font-bold">Our Menu</h1>

      <div className="mt-6">
        <label htmlFor="menu-search" className="mb-2 block font-medium"></label>

        <input
          id="menu-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Try Doro Wat or breakfast..."
          className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 sm:max-w-md"
        />
      </div>

      <div className="mt-6">
        <div className="flex gap-3 overflow-x-auto pb-3">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("");
              router.push("/menu?page=1");
            }}
            className={`shrink-0 rounded-full border px-5 py-2 font-medium transition ${
              selectedCategory === ""
                ? "border-primary bg-primary text-white"
                : "border-stone-300 bg-white text-stone-700 hover:border-primary hover:text-primary"
            }`}
          >
            All
          </button>

          {initialData.categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setSelectedCategory(category.name);

                const params = new URLSearchParams();
                params.set("category", category.name);

                if (debouncedSearch) {
                  params.set("search", debouncedSearch);
                }

                params.set("page", "1");
                router.push(`/menu?${params.toString()}`);
              }}
              className={`shrink-0 rounded-full border px-5 py-2 font-medium transition ${
                selectedCategory === category.name
                  ? "border-primary bg-primary text-white"
                  : "border-stone-300 bg-white text-stone-700 hover:border-primary hover:text-primary"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mt-4 text-sm text-amber-800">
          Refresh failed. Showing the menu data already available.
        </p>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleDishes.map((dish) => (
          <article
            key={dish.id}
            className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <Link href={`/menu/${dish.id}`} className="block">
              <Image
                src={`/images/menu/${dish.image}`}
                alt={dish.name}
                width={800}
                height={800}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-80 w-full rounded-2xl object-cover"
              />

              <div className="p-4">
                <p className="text-sm font-medium text-primary">
                  {dish.category}
                </p>

                <h2 className="mt-1 text-xl font-bold">{dish.name}</h2>

                <p className="mt-2 text-sm text-stone-600">
                  {dish.description}
                </p>

                <p className="mt-4 font-bold">{dish.price} ETB</p>

                <span className="mt-3 inline-block text-sm font-semibold text-primary">
                  View details →
                </span>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => addItem(dish)}
              className="m-4 mt-0 w-[calc(100%-2rem)] rounded-lg bg-primary px-4 py-3 font-semibold text-white transition hover:opacity-90"
            >
              Add to Cart
            </button>
          </article>
        ))}
      </div>

      <nav
        aria-label="Menu pagination"
        className="mt-10 flex items-center justify-center gap-4"
      >
        <button
          onClick={() => router.push(`/menu?page=${page - 1}`)}
          disabled={page === 1}
          className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <span aria-live="polite" className="text-sm font-medium">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => router.push(`/menu?page=${page + 1}`)}
          disabled={page === totalPages}
          className="rounded-lg bg-primary px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </nav>
    </main>
  );
}
