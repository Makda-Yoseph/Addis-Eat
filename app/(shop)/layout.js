import { Suspense } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ShopLayout({ children }) {
  return (
    <>
      <Suspense
        fallback={
          <header className="border-b border-gray-200 bg-white px-5 py-4">
            <div className="mx-auto max-w-7xl font-bold text-primary">
              Addis Eats
            </div>
          </header>
        }
      >
        <Header />
      </Suspense>

      <main className="min-h-screen">{children}</main>

      <Footer />
    </>
  );
}
