"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-screen items-center justify-center px-2">
      <div className="text-center">
        <h1 className="text-destructive-foreground text-4xl font-bold">Something went wrong!</h1>
        <p className="text-md text-secondary-accent-foreground my-4 lg:text-lg">{"An unexpected error occurred."}</p>

        <Button onClick={() => reset()} variant="outline" size="lg">
          Try again
        </Button>
      </div>
    </section>
  );
}
