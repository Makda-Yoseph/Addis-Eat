import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://addis-eat-mu.vercel.app"),

  title: {
    default: "Addis Eats | Authentic Ethiopian Food in Addis Ababa",
    template: "%s | Addis Eats",
  },

  description:
    "Order authentic Ethiopian food in Addis Ababa. Discover delicious dishes, traditional flavors, and fresh meals delivered to your door.",

  openGraph: {
    title: "Addis Eats | Authentic Ethiopian Food in Addis Ababa",
    description:
      "Discover delicious Ethiopian dishes and order your favorites with Addis Eats.",
    url: "/",
    siteName: "Addis Eats",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/addis-eats-social.png",
        width: 1200,
        height: 630,
        alt: "Addis Eats — Authentic Ethiopian Food",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Addis Eats | Authentic Ethiopian Food in Addis Ababa",
    description:
      "Discover delicious Ethiopian dishes and order your favorites with Addis Eats.",
    images: ["/images/addis-eats-social.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <Suspense fallback={<header className="h-16 border-b" />}>
          <Header />
        </Suspense>

        {children}
      </body>
    </html>
  );
}
