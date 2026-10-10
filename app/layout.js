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
  title: {
    default: "Addis Eats",
    template: "%s | Addis Eats",
  },
  description: "Discover delicious food in Addis Ababa, Ethiopia",
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
