import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getMenu } from "@/lib/menu";
import { toggleDishStock } from "./actions";

export default function AdminMenuPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading menu...</p>}>
      <AdminMenu />
    </Suspense>
  );
}

async function AdminMenu() {
  const session = await getSession();

  if (!session) redirect("/signin?next=/admin/menu");

  if (session.id !== "admin-1" || session.role !== "staff") {
    redirect("/");
  }

  const data = await getMenu();

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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-stone-500">Total dishes</p>
          <p className="mt-2 text-3xl font-bold">{data.menu.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-stone-500">Available</p>
          <p className="mt-2 text-3xl font-bold text-green-700">
            {data.menu.filter((dish) => dish.inStock).length}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-stone-500">Unavailable</p>
          <p className="mt-2 text-3xl font-bold text-red-700">
            {data.menu.filter((dish) => !dish.inStock).length}
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
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Availability</th>
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
                        className={`rounded-full px-3 py-2 text-xs font-semibold ${
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
