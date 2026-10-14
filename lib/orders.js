import "server-only";

import { readFile, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

const ordersFile = path.join(process.cwd(), "data", "orders.json");

async function readOrders() {
  const content = await readFile(ordersFile, "utf8");
  return JSON.parse(content);
}

async function writeOrders(data) {
  await writeFile(ordersFile, JSON.stringify(data, null, 2), "utf8");
}

export async function createOrder({
  userId,
  customerName,
  items,
  phone,
  address,
  total,
}) {
  const data = await readOrders();

  const order = {
    id: randomUUID(),
    userId,
    customerName,
    items,
    phone,
    address,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  data.orders.push(order);
  await writeOrders(data);

  return order;
}

export async function getOrdersByUser(userId) {
  const data = await readOrders();

  return data.orders.filter((order) => order.userId === userId);
}

export async function getOrderById(orderId) {
  const data = await readOrders();

  return data.orders.find((order) => order.id === orderId) ?? null;
}

export async function getAllOrders() {
  const data = await readOrders();
  return data.orders;
}

export async function updateOrderStatus(orderId, status) {
  const allowedStatuses = ["pending", "preparing", "delivered"];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid order status");
  }

  const data = await readOrders();
  const order = data.orders.find((item) => item.id === orderId);

  if (!order) {
    throw new Error("Order not found");
  }

  order.status = status;
  await writeOrders(data);

  return order;
}
