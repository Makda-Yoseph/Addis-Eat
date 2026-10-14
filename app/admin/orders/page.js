import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllOrders } from "@/lib/orders";
import { changeOrderStatus } from "./actions";
import { Suspense } from "react";

export default function OrdersPage() {
  return (
    <Suspense fallback={<p className="p-6">Loading orders...</p>}>
      <OrdersContent />
    </Suspense>
  );
}

async function OrdersContent() {
  const session = await getSession();

  if (!session) redirect("/signin?next=/admin/orders");

  if (session.id !== "admin-1" || session.role !== "staff") {
    redirect("/");
  }

  const orders = await getAllOrders();

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-stone-900">Orders</h1>
        <p className="mt-2 text-stone-500">
          View customer orders and update their status.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="p-4">Order</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Total</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Update</th>
            </tr>
          </thead>

          <tbody>
            {sortedOrders.map((order) => (
              <tr key={order.id} className="border-t border-stone-100">
                <td className="p-4 font-medium">#{order.id.slice(0, 8)}</td>
                <td className="p-4">{order.customerName}</td>
                <td className="p-4">{order.phone}</td>
                <td className="p-4">
                  {Number(order.total).toLocaleString()} ETB
                </td>
                <td className="p-4 whitespace-nowrap">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 capitalize">{order.status}</td>
                <td className="p-4">
                  <form action={changeOrderStatus} className="flex gap-2">
                    <input type="hidden" name="orderId" value={order.id} />

                    <select
                      name="status"
                      defaultValue={order.status}
                      className="rounded-md border border-stone-300 bg-white p-2"
                      aria-label={`Status for order ${order.id}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="delivered">Delivered</option>
                    </select>

                    <button
                      type="submit"
                      className="rounded-md bg-red-700 px-3 py-2 text-white hover:bg-red-800"
                    >
                      Save
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sortedOrders.length === 0 && (
          <p className="p-6 text-stone-500">No orders found.</p>
        )}
      </div>
    </section>
  );
}
