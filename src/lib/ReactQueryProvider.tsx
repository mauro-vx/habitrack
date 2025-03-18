// lib/ReactQueryProvider.tsx
"use client"; // Use this for Next.js if wrapping components within a client-side context
import React, { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Example: Stale time before refetching cached data is needed
      staleTime: 1000 * 60 * 5, // Cache result for 5 minutes
      cacheTime: 1000 * 60 * 10, // Keep data in cache for 10 minutes
      suspense: true, // Enable React Query's Suspense integration
      retry: 1, // Retry failed queries once
      refetchOnWindowFocus: false, // Don't refetch automatically

    },
  },
});

// React Query provider component
export default function ReactQueryProvider({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools (only for development) */}
      {process.env.NODE_ENV === "development" ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
