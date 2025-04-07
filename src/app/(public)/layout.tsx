import * as React from "react";

import type { Metadata } from "next";
import { Fredoka, Poppins } from "next/font/google";

import "@/app/globals.css";

import Providers from "@/context/providers";
import Header from "./_components/header";

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
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal?: React.ReactNode | null;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fredoka.variable} ${poppins.variable} antialiased`}>
        <Providers>
          <Header />
          {children}
          {modal}
        </Providers>
      </body>
    </html>
  );
}
