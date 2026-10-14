import { getMenu } from "@/lib/menu";

export async function GET(request) {
  const menuData = await getMenu();
  const { searchParams } = new URL(request.url);

  const search = searchParams.get("search")?.trim().toLowerCase() || "";
  const category = searchParams.get("category") || "";

  const filteredMenu = menuData.menu.filter((dish) => {
    const matchesStock = dish.inStock === true;
    const matchesSearch = [dish.name, dish.description, dish.category]
      .join(" ")
      .toLowerCase()
      .includes(search);
    const matchesCategory = !category || dish.category === category;

    return matchesStock && matchesSearch && matchesCategory;
  });

  return Response.json({
    ...menuData,
    menu: filteredMenu,
  });
}
