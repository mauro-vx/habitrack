import * as React from "react";

import Link from "next/link";

import { SignInForm } from "../_components/sign-in-form";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  return (
    <main className="container flex h-screen items-center justify-center">
      <SignInForm
        headerSlot={
          <div className="mb-4 flex items-end justify-between">
            <h2 className="text-4xl font-bold">Sign in</h2>
            <Button asChild variant="ghost" className="text-brand text-lg">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        }
        footerSlot={
          <Button asChild variant="outline" className="self-end mt-4">
            <Link href="/">Cancel</Link>
          </Button>
        }
      />
    </main>
  );
}
