import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EmailVerification() {
  return (
    <main className="container flex h-screen justify-center items-center">
      <section className="text-center">
        <h1 className="mb-4 text-2xl font-semibold">Signup Successful!</h1>
        <p className="mb-6 text-lg">
          We&#39;ve sent a confirmation email to your inbox. Please check your email and follow the instructions to
          verify your account.
        </p>
        <Button asChild variant="outline">
          <Link href="/">Return to Home Page</Link>
        </Button>
      </section>
    </main>
  );
}
