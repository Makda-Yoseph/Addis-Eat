import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMenu } from "@/lib/menu";
import { toggleDishStock, createDish } from "./actions";

export default function AdminMenuPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading menu...</p>}>
      <AdminMenu />
    </Suspense>
  );
}

async function AdminMenu() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/admin/menu");
  }

  if (session.id !== "admin-1" || session.role !== "staff") {
    redirect("/");
  }

  const data = await getMenu();

  const availableCount = data.menu.filter((dish) => dish.inStock).length;

  const unavailableCount = data.menu.length - availableCount;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-widest text-red-700">
          Admin workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold text-stone-900">
          Menu Management
        </h1>

        <p className="mt-2 text-stone-600">
          Manage dishes, prices, and availability.
        </p>
      </div>

      <form
        action={createDish}
        className="space-y-4 rounded-xl border bg-white p-5"
      >
        <div>
          <h2 className="text-lg font-semibold">Add a dish</h2>
          <p className="mt-1 text-sm text-stone-500">
            Add a new item to your restaurant menu.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium">Dish name</span>
            <input
              name="name"
              required
              maxLength={100}
              className="w-full rounded-lg border p-3 focus-visible:outline-2 focus-visible:outline-red-700"
              placeholder="e.g. Kitfo"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Price (ETB)</span>
            <input
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              required
              className="w-full rounded-lg border p-3 focus-visible:outline-2 focus-visible:outline-red-700"
              placeholder="e.g. 650"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Category</span>
            <select
              name="category"
              required
              defaultValue=""
              className="w-full rounded-lg border bg-white p-3 focus-visible:outline-2 focus-visible:outline-red-700"
            >
              <option value="" disabled>
                Select a category
              </option>

              {data.categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Dish image</span>
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/png,image/webp"
              required
              className="block w-full rounded-lg border p-3 text-sm focus-visible:outline-2 focus-visible:outline-red-700"
            />
            <span className="text-xs text-stone-500">
              JPG, PNG, or WebP; maximum 5 MB.
            </span>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Description</span>
          <textarea
            name="description"
            required
            maxLength={1000}
            rows={3}
            className="w-full rounded-lg border p-3 focus-visible:outline-2 focus-visible:outline-red-700"
            placeholder="Describe the dish and its ingredients."
          />
        </label>

        <button
          type="submit"
          className="rounded-lg bg-red-700 px-5 py-3 font-semibold text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        >
          Add dish
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-stone-500">Total dishes</p>
          <p className="mt-2 text-3xl font-bold">{data.menu.length}</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-stone-500">Available</p>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {availableCount}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-stone-500">Unavailable</p>
          <p className="mt-2 text-3xl font-bold text-red-700">
            {unavailableCount}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b p-5">
          <h2 className="text-lg font-semibold">All dishes</h2>
          <p className="mt-1 text-sm text-stone-500">
            Toggle availability to control what customers can order.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500">
              <tr>
                <th scope="col" className="p-4">
                  Dish
                </th>
                <th scope="col" className="p-4">
                  Category
                </th>
                <th scope="col" className="p-4">
                  Price
                </th>
                <th scope="col" className="p-4">
                  Availability
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {data.menu.map((dish) => (
                <tr key={dish.id}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={`/images/menu/${dish.image}`}
                        alt={dish.name}
                        className="h-12 w-12 rounded-lg object-cover"
                        width={48}
                        height={48}
                      />

                      <div>
                        <p className="font-semibold text-stone-900">
                          {dish.name}
                        </p>
                        <p className="text-xs text-stone-500">#{dish.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">{dish.category}</td>

                  <td className="p-4 font-medium">
                    {Number(dish.price).toLocaleString()} ETB
                  </td>

                  <td className="p-4">
                    <form
                      action={toggleDishStock}
                      className="flex items-center gap-2"
                    >
                      <input type="hidden" name="id" value={dish.id} />

                      <input
                        type="hidden"
                        name="inStock"
                        value={String(!dish.inStock)}
                      />

                      <button
                        type="submit"
                        aria-label={`${
                          dish.inStock ? "Make" : "Make"
                        } ${dish.name} ${
                          dish.inStock ? "unavailable" : "available"
                        }`}
                        className={`rounded-full px-3 py-2 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 ${
                          dish.inStock
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {dish.inStock
                          ? "Available · Turn off"
                          : "Unavailable · Turn on"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
