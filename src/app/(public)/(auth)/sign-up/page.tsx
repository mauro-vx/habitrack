import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SignUpForm } from "@/app/(public)/(auth)/_components/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="container flex h-screen items-center justify-center">
      <SignUpForm
        headerSlot={
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-4xl font-bold">Sign up</h2>
            <Button asChild variant="ghost" className="text-brand text-lg">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        }
        footerSlot={
          <Button asChild variant="outline" className="mt-4 self-end">
            <Link href="/">Cancel</Link>
          </Button>
        }
      />
    </main>
  );
}
