import { Suspense } from "react";
import { notFound } from "next/navigation";
import menuData from "@/data/menu.json";
import AddToCartButton from "@/components/add-to-cart-button";
import Image from "next/image";

export async function generateMetadata({ params }) {
  const { id } = await params;

  const dish = menuData.menu.find((item) => String(item.id) === id);

  if (!dish) {
    return {
      title: "Dish Not Found",
      description: "The requested dish could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${dish.name} | Authentic Ethiopian Food`;
  const description = `${dish.description} Discover ${dish.name} at Addis Eats in Addis Ababa.`;

  const url = `https://addis-eat-mu.vercel.app/menu/${id}`;
  const socialImage = `https://addis-eat-mu.vercel.app/images/menu/${dish.image}`;

  return {
    title,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "Addis Eats",
      images: [
        {
          url: `/images/menu/${dish.image}`,
          alt: `${dish.name} - Addis Eats`,
        },
      ],
      locale: "en_US",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/images/menu/${dish.image}`],
    },
  };
}

export default function DishDetailsPage({ params }) {
  return (
    <Suspense fallback={<main className="p-6">Loading dish details...</main>}>
      <DishDetails params={params} />
    </Suspense>
  );
}

async function DishDetails({ params }) {
  const { id } = await params;

  const dish = menuData.menu.find((item) => String(item.id) === id);

  if (!dish) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10">
      <a
        href="/menu"
        className="text-sm font-medium text-primary hover:underline"
      >
        ← Back to menu
      </a>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <Image
          src={`/images/menu/${dish.image}`}
          alt={dish.name}
          width={600}
          height={400}
          unoptimized
          className="h-52 w-full object-cover"
        />

        <div>
          <p className="font-medium text-primary">{dish.category}</p>

          <h1 className="mt-2 text-4xl font-bold">{dish.name}</h1>

          <p className="mt-4 leading-7 text-stone-600">{dish.description}</p>

          {dish.ingredients && (
            <div className="mt-5">
              <h2 className="font-semibold">Ingredients</h2>
              <p className="mt-2 text-stone-600">
                {Array.isArray(dish.ingredients)
                  ? dish.ingredients.join(", ")
                  : dish.ingredients}
              </p>
            </div>
          )}

          <p className="mt-6 text-2xl font-bold">{dish.price} ETB</p>

          <p
            className={`mt-2 text-sm font-medium ${
              dish.inStock ? "text-green-700" : "text-red-700"
            }`}
          >
            {dish.inStock ? "Available to order" : "Currently unavailable"}
          </p>
          <AddToCartButton
            dish={{
              id: dish.id,
              name: dish.name,
              price: dish.price,
              image: dish.image,
              category: dish.category,
            }}
          />
        </div>
      </div>
    </main>
  );
}
