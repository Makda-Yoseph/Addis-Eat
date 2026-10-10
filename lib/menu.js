import "server-only";
import menuData from "@/data/menu.json";

export async function getMenu() {
  return menuData;
}
