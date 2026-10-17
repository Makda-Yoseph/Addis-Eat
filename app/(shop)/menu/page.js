import { Suspense } from "react";
import { getMenu } from "@/lib/menu";
import MenuClient from "./menu-client";

export const metadata = {
  title: "Our Menu",
  description:
    "Explore traditional Ethiopian dishes, delicious meals, and drinks at Addis Eats.",
};

export default function MenuPage({ searchParams }) {
  return (
    <Suspense fallback={<main className="p-6"></main>}>
      <MenuContent searchParams={searchParams} />
    </Suspense>
  );
}

async function MenuContent({ searchParams }) {
  const menuData = await getMenu();
  const params = await searchParams;
  const requestedPage = Number(params.page) || 1;
  const initialCategory = params.category || "";

  return (
    <MenuClient
      initialData={menuData}
      initialPage={requestedPage}
      initialCategory={initialCategory}
    />
  );
}
