import * as React from "react";

import ThemeProvider from "@/context/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme>
      {children}
    </ThemeProvider>
  );
}
