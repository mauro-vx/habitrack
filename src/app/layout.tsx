import * as React from "react";

import type { Metadata } from "next";
import { Fredoka, Poppins } from "next/font/google";

import "./globals.css";

import Providers from "@/context/providers";
import Header from "@/app/_components/header";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "HabitRack - End of Procrastination",
  description: "Empower yourself to overcome procrastination with HabitRack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fredoka.variable} ${poppins.variable} antialiased`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
