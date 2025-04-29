import * as React from "react";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ThemeProvider } from "@/context/theme-provider";
import { TimezoneProvider } from "@/context/timezone-provider";
import { QueryClientProviderWrapper } from "@/context/query-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme>
      <TimezoneProvider />
      <QueryClientProviderWrapper>
        <ReactQueryDevtools initialIsOpen={false} />
        {children}
      </QueryClientProviderWrapper>
    </ThemeProvider>
  );
}
