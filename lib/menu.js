import "server-only";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const menuFilePath = path.join(process.cwd(), "data", "menu.json");

export async function getMenu() {
  const file = await readFile(menuFilePath, "utf8");
  return JSON.parse(file);
}

export async function updateDishStock(id, inStock) {
  if (typeof inStock !== "boolean") {
    throw new Error("Invalid availability value");
  }

  const data = await getMenu();
  const dish = data.menu.find((item) => item.id === Number(id));

  if (!dish) {
    throw new Error("Dish not found");
  }

  dish.inStock = inStock;

  await writeFile(menuFilePath, JSON.stringify(data, null, 2), "utf8");

  return dish;
}
