"use client";

import * as React from "react";

import dynamic from "next/dynamic";
import { type ThemeProviderProps } from "next-themes";

const NextThemesProvider = dynamic(() => import("next-themes").then((e) => e.ThemeProvider), { ssr: false });

export default function Providers({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem enableColorScheme>
      {children}
    </NextThemesProvider>
  );
}
