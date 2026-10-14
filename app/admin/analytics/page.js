import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllOrders } from "@/lib/orders";
import RevenueChart from "./revenue-chart";

export const metadata = {
  title: "Analytics | Addis Eats Admin",
  description: "Restaurant sales, order trends, and popular dishes.",
};

const ranges = [
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "all", label: "All time" },
];

function formatETB(value) {
  return `${Math.round(value).toLocaleString()} ETB`;
}

function getDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function AnalyticsLoading() {
  return (
    <section className="space-y-5" aria-label="Loading analytics">
      <div className="h-8 w-48 animate-pulse rounded bg-stone-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-xl bg-stone-100"
          />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-xl bg-stone-100" />
    </section>
  );
}

export default function AnalyticsPage({ searchParams }) {
  return (
    <Suspense fallback={<AnalyticsLoading />}>
      <AnalyticsDashboard searchParams={searchParams} />
    </Suspense>
  );
}

async function AnalyticsDashboard({ searchParams }) {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/admin/analytics");
  }

  if (session.id !== "admin-1" || session.role !== "staff") {
    redirect("/");
  }

  const params = await searchParams;
  const requestedRange = params?.range;

  const range = ranges.some((item) => item.value === requestedRange)
    ? requestedRange
    : "7";

  const allOrders = await getAllOrders();
  const today = getDateKey(new Date());

  const startDate = new Date(`${today}T00:00:00.000Z`);

  if (range !== "all") {
    startDate.setUTCDate(startDate.getUTCDate() - (Number(range) - 1));
  }

  const filteredOrders = allOrders.filter((order) => {
    if (!order.createdAt) return false;

    const orderDate = new Date(order.createdAt);

    if (Number.isNaN(orderDate.getTime())) return false;

    return range === "all" || getDateKey(orderDate) >= getDateKey(startDate);
  });

  const deliveredOrders = filteredOrders.filter(
    (order) => order.status === "delivered",
  );

  const revenue = deliveredOrders.reduce(
    (sum, order) => sum + Math.max(0, Number(order.total) || 0),
    0,
  );

  const averageOrderValue = deliveredOrders.length
    ? revenue / deliveredOrders.length
    : 0;

  const pending = filteredOrders.filter(
    (order) => order.status === "pending",
  ).length;

  const preparing = filteredOrders.filter(
    (order) => order.status === "preparing",
  ).length;

  const stats = [
    {
      label: "Delivered Revenue",
      value: formatETB(revenue),
      detail: "From delivered orders",
    },
    {
      label: "Total Orders",
      value: filteredOrders.length.toLocaleString(),
      detail: "All order statuses",
    },
    {
      label: "Average Order Value",
      value: formatETB(averageOrderValue),
      detail: "Delivered orders only",
    },
    {
      label: "Awaiting Completion",
      value: (pending + preparing).toLocaleString(),
      detail: `${pending} pending · ${preparing} preparing`,
    },
  ];

  // Prepare one revenue value for each date in the selected period.
  const chartDays = [];

  if (range === "all") {
    const dates = filteredOrders
      .map((order) => new Date(order.createdAt))
      .filter((date) => !Number.isNaN(date.getTime()))
      .sort((a, b) => a - b);

    const firstDate = dates.length
      ? new Date(`${getDateKey(dates[0])}T00:00:00.000Z`)
      : new Date(`${today}T00:00:00.000Z`);

    const lastDate = new Date(`${today}T00:00:00.000Z`);

    const dayDifference = Math.max(
      0,
      Math.floor((lastDate.getTime() - firstDate.getTime()) / 86400000),
    );

    // Keep the all-time graph readable when the history is long.
    const interval =
      dayDifference > 29 ? Math.ceil((dayDifference + 1) / 30) : 1;

    for (
      let date = new Date(firstDate);
      date <= lastDate;
      date.setUTCDate(date.getUTCDate() + interval)
    ) {
      chartDays.push(new Date(date));
    }

    if (chartDays.length === 0) {
      chartDays.push(lastDate);
    }

    if (getDateKey(chartDays[chartDays.length - 1]) !== today) {
      chartDays.push(lastDate);
    }
  } else {
    for (let offset = Number(range) - 1; offset >= 0; offset--) {
      const date = new Date(`${today}T00:00:00.000Z`);
      date.setUTCDate(date.getUTCDate() - offset);
      chartDays.push(date);
    }
  }

  const revenueByDay = chartDays.map((date) => {
    const key = getDateKey(date);

    const dailyRevenue = deliveredOrders
      .filter((order) => getDateKey(new Date(order.createdAt)) === key)
      .reduce((sum, order) => sum + Math.max(0, Number(order.total) || 0), 0);

    return {
      key,
      label: date.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      }),
      revenue: dailyRevenue,
    };
  });

  // Count the quantities of dishes ordered in the selected period.
  const dishTotals = new Map();

  for (const order of filteredOrders) {
    for (const item of order.items ?? []) {
      const key = String(item.id ?? item.name);

      const existing = dishTotals.get(key) ?? {
        name: item.name || "Unnamed dish",
        quantity: 0,
      };

      existing.quantity += Math.max(0, Number(item.quantity) || 0);
      dishTotals.set(key, existing);
    }
  }

  const popularDishes = [...dishTotals.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const maxDishQuantity = Math.max(
    1,
    ...popularDishes.map((dish) => dish.quantity),
  );

  const statusCounts = [
    {
      label: "Delivered",
      count: deliveredOrders.length,
      color: "bg-emerald-600",
    },
    {
      label: "Preparing",
      count: preparing,
      color: "bg-amber-500",
    },
    {
      label: "Pending",
      count: pending,
      color: "bg-red-700",
    },
  ];

  return (
    <section className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-red-700">
            Business insights
          </p>
          <h1 className="mt-2 text-3xl font-bold text-stone-900">Analytics</h1>
          <p className="mt-2 text-stone-500">
            Track restaurant performance and understand what customers order.
          </p>
        </div>

        <nav aria-label="Analytics date range" className="flex flex-wrap gap-2">
          {ranges.map((item) => (
            <Link
              key={item.value}
              href={`/admin/analytics?range=${item.value}`}
              aria-current={range === item.value ? "page" : undefined}
              className={`rounded-lg border px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700 ${
                range === item.value
                  ? "border-red-700 bg-red-700 text-white"
                  : "border-stone-200 bg-white text-stone-700 hover:border-red-300"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-stone-500">{stat.label}</p>
            <p className="mt-3 break-words text-2xl font-bold text-red-700">
              {stat.value}
            </p>
            <p className="mt-2 text-xs text-stone-500">{stat.detail}</p>
          </article>
        ))}
      </div>

      {/* Revenue line graph and order status */}
      <div className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-stone-900">
                Revenue trend
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Daily revenue from delivered orders
              </p>
            </div>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
              ETB
            </span>
          </div>

          <RevenueChart data={revenueByDay} />

          <p className="mt-3 text-xs text-stone-500">
            Only delivered orders contribute to this chart.
          </p>
        </article>

        <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-stone-900">Order status</h2>
          <p className="mt-1 text-sm text-stone-500">
            Orders in the selected period
          </p>

          {filteredOrders.length === 0 ? (
            <p className="py-12 text-center text-sm text-stone-500">
              No orders in this period.
            </p>
          ) : (
            <div className="mt-7 space-y-5">
              {statusCounts.map((status) => {
                const percentage = (status.count / filteredOrders.length) * 100;

                return (
                  <div key={status.label}>
                    <div className="mb-2 flex justify-between gap-3 text-sm">
                      <span className="text-stone-600">{status.label}</span>
                      <span className="font-semibold text-stone-900">
                        {status.count} ({Math.round(percentage)}%)
                      </span>
                    </div>

                    <div
                      className="h-2.5 overflow-hidden rounded-full bg-stone-100"
                      role="progressbar"
                      aria-label={`${status.label} orders`}
                      aria-valuemin={0}
                      aria-valuemax={filteredOrders.length}
                      aria-valuenow={status.count}
                    >
                      <div
                        className={`h-full rounded-full ${status.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </div>

      {/* Popular dishes */}
      <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Popular dishes</h2>
          <p className="mt-1 text-sm text-stone-500">
            Top five dishes by quantity ordered in this period
          </p>
        </div>

        {popularDishes.length === 0 ? (
          <p className="py-12 text-center text-sm text-stone-500">
            Popular dishes will appear here when customers place orders.
          </p>
        ) : (
          <div className="mt-6 space-y-5">
            {popularDishes.map((dish, index) => (
              <div key={dish.name}>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-sm font-bold text-amber-800">
                      {index + 1}
                    </span>
                    <span className="truncate font-medium text-stone-800">
                      {dish.name}
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-stone-600">
                    {dish.quantity} sold
                  </span>
                </div>

                <div className="ml-11 h-2 overflow-hidden rounded-full bg-stone-100">
                  <div
                    className="h-full rounded-full bg-red-700"
                    style={{
                      width: `${(dish.quantity / maxDishQuantity) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </article>

      <p className="text-xs text-stone-500">
        Showing {filteredOrders.length} of {allOrders.length} orders. Analytics
        are calculated from the order records currently stored by Addis Eats.
      </p>
    </section>
  );
}
