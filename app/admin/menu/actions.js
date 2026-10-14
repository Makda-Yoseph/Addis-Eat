"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { updateDishStock } from "@/lib/menu";
import { addDish } from "@/lib/menu";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

export async function toggleDishStock(formData) {
  const session = await getSession();

  if (session?.id !== "admin-1" || session?.role !== "staff") {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id");
  const inStockValue = formData.get("inStock");

  if (
    typeof id !== "string" ||
    !/^\d+$/.test(id) ||
    !["true", "false"].includes(inStockValue)
  ) {
    throw new Error("Invalid menu update");
  }

  await updateDishStock(Number(id), inStockValue === "true");

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/api/menu");
}

export async function createDish(formData) {
  const session = await getSession();

  if (session?.id !== "admin-1" || session?.role !== "staff") {
    throw new Error("Unauthorized");
  }

  const name = String(formData.get("name") ?? "");
  const price = String(formData.get("price") ?? "");
  const category = String(formData.get("category") ?? "");
  const description = String(formData.get("description") ?? "");
  const imageFile = formData.get("image");

  if (
    typeof File === "undefined" ||
    !(imageFile instanceof File) ||
    imageFile.size === 0 ||
    imageFile.size > 5 * 1024 * 1024
  ) {
    throw new Error("Choose an image smaller than 5 MB.");
  }

  const extensions = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };

  const extension = extensions[imageFile.type];

  if (!extension) {
    throw new Error("Use a JPG, PNG, or WebP image.");
  }

  const filename = `${randomUUID()}${extension}`;
  const imageDirectory = path.join(process.cwd(), "public", "images", "menu");

  await mkdir(imageDirectory, { recursive: true });

  const bytes = Buffer.from(await imageFile.arrayBuffer());

  await writeFile(path.join(imageDirectory, filename), bytes);

  await addDish({
    name,
    price,
    category,
    description,
    image: filename,
  });

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  revalidatePath("/api/menu");
  redirect("/admin/menu");
}
