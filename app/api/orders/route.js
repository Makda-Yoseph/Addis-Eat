import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { getOrdersByUser } from "@/lib/orders";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const orders = await getOrdersByUser(session.id);

  return NextResponse.json(orders, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
