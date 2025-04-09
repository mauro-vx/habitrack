import * as React from "react";

import ThemeProvider from "@/context/theme-provider";
import TimezoneProvider from "@/context/timezone-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme>
      <TimezoneProvider />
      {children}
    </ThemeProvider>
  );
}
