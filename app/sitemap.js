import menuData from "@/data/menu.json";

const BASE_URL = "https://addis-eat-mu.vercel.app";

export default function sitemap() {
  const staticPages = [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/menu`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  const dishPages = menuData.menu.map((dish) => ({
    url: `${BASE_URL}/menu/${dish.id}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...dishPages];
}
