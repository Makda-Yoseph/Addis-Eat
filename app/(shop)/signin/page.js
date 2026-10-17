import { Suspense } from "react";
import SignInForm from "./signin-form";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your Addis Eats account.",
};

export default function SignInPage({ searchParams }) {
  return (
    <Suspense
      fallback={<main className="p-8 text-center">Loading sign-in...</main>}
    >
      <SignInContent searchParams={searchParams} />
    </Suspense>
  );
}

async function SignInContent({ searchParams }) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/";

  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <h1 className="mb-2 text-3xl font-bold">Welcome back</h1>
      <p className="mb-8 text-gray-600">Sign in to your Addis Eats account.</p>

      <SignInForm next={next} />

      <p className="mt-6 text-sm text-gray-600">
        Don't have an account yet? Registration is coming next.
      </p>
    </main>
  );
}
