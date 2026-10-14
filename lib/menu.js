import "server-only";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

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

export async function addDish({ name, price, category, description, image }) {
  const cleanName = name.trim();
  const cleanCategory = category.trim();
  const cleanDescription = description.trim();
  const numericPrice = Number(price);

  if (
    !cleanName ||
    cleanName.length > 100 ||
    !cleanCategory ||
    !cleanDescription ||
    cleanDescription.length > 1000 ||
    !Number.isFinite(numericPrice) ||
    numericPrice <= 0
  ) {
    throw new Error("Please enter valid dish details.");
  }

  const data = await getMenu();

  if (!data.categories.some((item) => item.name === cleanCategory)) {
    throw new Error("Please select a valid category.");
  }

  const dish = {
    id: Math.max(1000, ...data.menu.map((item) => Number(item.id) || 0)) + 1,
    name: cleanName,
    price: numericPrice,
    category: cleanCategory,
    image,
    description: cleanDescription,
    inStock: true,
  };

  data.menu.push(dish);

  const filePath = path.join(process.cwd(), "data", "menu.json");
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");

  return dish;
}
