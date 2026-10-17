"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { useCartStore } from "@/lib/cart-store";

// Leaflet map – client-only, no SSR
const DeliveryMap = dynamic(() => import("@/components/delivery-map"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "220px",
        borderRadius: "10px",
        background: "#f5f5f4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#78716c",
        fontSize: "0.875rem",
      }}
    >
      Loading map…
    </div>
  ),
});

const fetcher = async (url) => {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Could not load your orders.");
  return res.json();
};

const STATUS_STYLES = {
  pending: { bg: "#fef9c3", text: "#854d0e" },
  preparing: { bg: "#ffedd5", text: "#9a3412" },
  delivered: { bg: "#dcfce7", text: "#166534" },
};

function ReorderButton({ items }) {
  const addItem = useCartStore((s) => s.addItem);
  const [done, setDone] = useState(false);

  function handleReorder() {
    // Add each item the same quantity it was ordered with
    items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
        });
      }
    });
    setDone(true);
    // Reset "Added!" label after 2 seconds
    setTimeout(() => setDone(false), 2000);
  }

  return (
    <button
      onClick={handleReorder}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        background: done ? "#15803d" : "#c2410c",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "0.55rem 1.1rem",
        fontWeight: 700,
        fontSize: "0.875rem",
        cursor: "pointer",
        transition: "background 0.2s",
      }}
    >
      {done ? "✅ Added to cart!" : "🛒 Add to Cart"}
    </button>
  );
}

function OrderCard({ order }) {
  const sc = STATUS_STYLES[order.status] ?? STATUS_STYLES.pending;

  return (
    <article
      style={{
        background: "#fff",
        borderRadius: "16px",
        border: "1px solid #e7e5e4",
        padding: "1.5rem",
        boxShadow: "0 1px 4px rgba(0,0,0,.06)",
      }}
    >
      {/* Header – date, delivery area, status badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#78716c",
              marginBottom: "0.2rem",
            }}
          >
            {new Date(order.createdAt).toLocaleDateString("en-ET", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p
            style={{
              fontWeight: 600,
              fontSize: "0.95rem",
              textTransform: "capitalize",
            }}
          >
            📦 Delivery to:{" "}
            <span style={{ color: "#c2410c" }}>{order.address}</span>
          </p>
        </div>
        <span
          style={{
            background: sc.bg,
            color: sc.text,
            padding: "0.3rem 0.9rem",
            borderRadius: "9999px",
            fontSize: "0.8rem",
            fontWeight: 700,
            textTransform: "capitalize",
            whiteSpace: "nowrap",
          }}
        >
          {order.status}
        </span>
      </div>

      {/* Items list */}
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          marginBottom: "1rem",
        }}
      >
        {order.items.map((item) => (
          <li
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.875rem",
              color: "#44403c",
            }}
          >
            <span>
              {item.name}{" "}
              <span style={{ color: "#78716c" }}>× {item.quantity}</span>
            </span>
            <span style={{ fontWeight: 600 }}>
              {(item.price * item.quantity).toLocaleString()} ETB
            </span>
          </li>
        ))}
      </ul>

      {/* Total + Reorder button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid #f5f5f4",
          paddingTop: "0.75rem",
          marginBottom: "1.25rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#c2410c" }}>
          {order.total.toLocaleString()} ETB
        </span>

        {/* ── Reorder button ── */}
        <ReorderButton items={order.items} />
      </div>

      {/* Delivery map – always visible */}
      <DeliveryMap deliveryAddress={order.address} height="220px" />
    </article>
  );
}

export default function OrdersClient({ initialOrders }) {
  const {
    data: orders,
    error,
    isLoading,
  } = useSWR("/api/orders", fetcher, {
    fallbackData: initialOrders,
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });

  if (error) {
    return (
      <p role="alert" className="mt-6 text-red-700">
        {error.message}
      </p>
    );
  }

  if (isLoading && !orders) {
    return <p className="mt-6 text-stone-500">Loading your orders…</p>;
  }

  const sortedOrders = orders
    ? [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

  if (!sortedOrders.length) {
    return (
      <div
        style={{
          marginTop: "2rem",
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid #e7e5e4",
          padding: "3rem 2rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>🍽️</div>
        <p style={{ fontWeight: 600, marginBottom: "1rem" }}>
          You haven&apos;t placed any orders yet.
        </p>
        <Link
          href="/menu"
          style={{
            display: "inline-block",
            background: "#c2410c",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            borderRadius: "10px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
      }}
    >
      {sortedOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
