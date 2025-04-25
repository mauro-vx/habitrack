"use client";

import React from "react";

import Link from "next/link";
import { Home, SquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Switcher({ slots }: { slots: { slotName: string; component: React.ReactNode }[] }) {
  const [selectedSlotIndex, setSelectedSlotIndex] = React.useState(0);

  return (
    <div className="container flex h-screen flex-col items-center gap-2 border-2 border-yellow-500 py-2 lg:py-4">
      <header className="w-full grid grid-cols-[auto_1fr_auto] items-center place-items-center">
        <Link href="/">
          <Home />
        </Link>

        <div className="flex gap-x-1 lg:gap-x-4 col-span-1">
          {slots.map(({ slotName }, idx) => (
            <Button key={slotName} variant="outline" onClick={() => setSelectedSlotIndex(idx)} className="text-sm lg:text-base">
              {slotName}
            </Button>
          ))}
        </div>

        <Link href="/dashboard/create">
          <SquarePlus />
        </Link>

      </header>

      {slots[selectedSlotIndex]["component"]}
    </div>
  );
}
