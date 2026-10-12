/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  htmlLimitedBots:
    /TelegramBot|Twitterbot|Slackbot|Bingbot|Googlebot|facebookexternalhit|LinkedInBot|WhatsApp/i,

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
