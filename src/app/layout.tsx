import * as React from "react";
import type { Metadata } from "next";
import { Fredoka,Poppins } from "next/font/google";

import "./globals.css";

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
    <html lang="en" className="dark">
      <body className={`${fredoka.variable} ${poppins.variable} antialiased`}>{children}</body>
    </html>
  );
}
