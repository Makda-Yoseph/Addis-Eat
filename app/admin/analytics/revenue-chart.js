"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function RevenueChart({ data }) {
  if (!data?.length || data.every((day) => day.revenue === 0)) {
    return (
      <div className="flex min-h-64 items-center justify-center text-center">
        <div>
          <p className="font-semibold text-stone-700">
            No delivered revenue yet
          </p>
          <p className="mt-2 text-sm text-stone-500">
            Revenue will appear here when orders are delivered.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mt-6 h-72 w-full"
      role="img"
      aria-label="Line chart showing daily revenue from delivered orders"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid stroke="#e7e5e4" strokeDasharray="4 4" />

          <XAxis
            dataKey="label"
            tick={{ fill: "#78716c", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#d6d3d1" }}
            minTickGap={20}
          />

          <YAxis
            width={75}
            tick={{ fill: "#78716c", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />

          <Tooltip
            formatter={(value) => [
              `${Number(value).toLocaleString()} ETB`,
              "Revenue",
            ]}
            labelFormatter={(label) => `Date: ${label}`}
            contentStyle={{
              borderRadius: "10px",
              border: "1px solid #e7e5e4",
            }}
          />

          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#b91c1c"
            strokeWidth={3}
            dot={{ r: 4, fill: "#b91c1c" }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
