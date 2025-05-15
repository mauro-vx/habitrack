"use client";

import * as React from "react";

import Link from "next/link";
import { Home, SquarePlus } from "lucide-react";

import { useBreakpoint } from "@/hooks/use-breakpoint-hook";
import { Button } from "@/components/ui/button";

const SwitcherHeader = React.memo(
  ({
    slots,
    selectedIndex,
    onSlotSelect,
  }: {
    slots: {
      name: string;
      component: React.ReactNode;
    }[];
    selectedIndex: number;
    onSlotSelect: (index: number) => void;
  }) => {
    const isXsScreen = useBreakpoint("xs");

    return (
      <header className="grid w-full grid-cols-[auto_1fr_auto] place-items-center items-center">
        <Link href="/">
          <Home />
        </Link>

        <div className="col-span-1 flex gap-x-2 lg:gap-x-4">
          {slots.map((slot, idx) => (
            <Button
              key={slot.name}
              variant={selectedIndex === idx ? "default" : "outline"}
              onClick={() => onSlotSelect(idx)}
              className="text-xs lg:text-base"
            >
              {isXsScreen ? slot.name : slot.name[0]}
            </Button>
          ))}
        </div>

        <Link href="/dashboard/create">
          <SquarePlus />
        </Link>
      </header>
    );
  },
);

SwitcherHeader.displayName = "SwitcherHeader";

export function ClientSwitcher({
  slots,
  defaultSlotIndex = 1,
}: {
  slots: {
    name: string;
    component: React.ReactNode;
  }[];
  defaultSlotIndex?: number;
}) {
  const [selectedSlotIndex, setSelectedSlotIndex] = React.useState(defaultSlotIndex);

  return (
    <div className="container flex h-screen flex-col items-center gap-2 py-2 lg:gap-4 lg:py-4">
      <SwitcherHeader slots={slots} selectedIndex={selectedSlotIndex} onSlotSelect={setSelectedSlotIndex} />

      <div className="relative w-full flex-1">
        {slots.map((slot, index) => (
          <div key={slot.name} className={index === selectedSlotIndex ? "block h-full w-full" : "hidden"}>
            {slot.component}
          </div>
        ))}
      </div>
    </div>
  );
}
