"use client";

import * as React from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600">Something went wrong!</h1>
        <p className="my-4 text-lg text-gray-700">{error.message || "An unexpected error occurred."}</p>

        <button onClick={() => reset()} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Try again
        </button>
      </div>
    </section>
  );
}
