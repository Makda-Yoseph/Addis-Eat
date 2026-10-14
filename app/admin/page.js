import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllOrders } from "@/lib/orders";

export default function AdminPage() {
  return (
    <Suspense
      fallback={<p className="p-6 text-stone-500">Loading dashboard...</p>}
    >
      <AdminDashboard />
    </Suspense>
  );
}

async function AdminDashboard() {
  const session = await getSession();

  if (!session) redirect("/signin?next=/admin");

  if (session.id !== "admin-1" || session.role !== "staff") {
    redirect("/");
  }

  const orders = await getAllOrders();

  const pending = orders.filter((order) => order.status === "pending").length;

  const delivered = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const revenue = orders
    .filter((order) => order.status === "delivered")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const stats = [
    { label: "Total Orders", value: orders.length },
    { label: "Pending Orders", value: pending },
    { label: "Delivered Orders", value: delivered },
    {
      label: "Delivered Revenue",
      value: `${revenue.toLocaleString()} ETB`,
    },
  ];

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">Overview</h1>
        <p className="mt-2 text-stone-500">
          Welcome back, {session.name}. Here is your business summary.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-stone-500">{stat.label}</p>
            <p className="mt-3 text-2xl font-bold text-red-700">{stat.value}</p>
          </article>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-5">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <p className="mt-1 text-sm text-stone-500">
            The latest five orders received.
          </p>
        </div>

        {recentOrders.length === 0 ? (
          <p className="p-6 text-sm text-stone-500">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-stone-500">
                <tr>
                  <th className="p-4">Order</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-stone-100">
                    <td className="p-4 font-medium">#{order.id.slice(0, 8)}</td>
                    <td className="p-4">{order.customerName}</td>
                    <td className="p-4">
                      {Number(order.total).toLocaleString()} ETB
                    </td>
                    <td className="p-4 capitalize">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
