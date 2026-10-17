import Link from "next/link";
import RegisterForm from "./register-form";

export const metadata = {
  title: "Create Account",
  description: "Create an Addis Eats customer account.",
};

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-5 py-16">
      <h1 className="mb-2 text-3xl font-bold">Create your account</h1>
      <p className="mb-8 text-gray-600">
        Join Addis Eats and get ready to order your favorite Ethiopian food.
      </p>

      <RegisterForm />

      <p className="mt-6 text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/signin" className="font-semibold text-primary underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
