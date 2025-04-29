"use client";

import * as React from 'react';

import Link from "next/link";
import { Home, SquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";

const SwitcherHeader = React.memo(
  ({
    slots,
    selectedIndex,
    onSlotSelect,
  }: {
    slots: { slotName: string }[];
    selectedIndex: number;
    onSlotSelect: (index: number) => void;
  }) => {
    return (
      <header className="grid w-full grid-cols-[auto_1fr_auto] place-items-center items-center">
        <Link href="/">
          <Home />
        </Link>

        <div className="col-span-1 flex gap-x-2 lg:gap-x-4">
          {slots.map(({ slotName }, idx) => (
            <Button
              key={slotName}
              variant={selectedIndex === idx ? "default" : "outline"}
              onClick={() => onSlotSelect(idx)}
              className="text-xs lg:text-base"
            >
              {slotName}
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

export function Switcher({ slots }: { slots: { slotName: string; component: React.ReactNode }[] }) {
  const [selectedSlotIndex, setSelectedSlotIndex] = React.useState(1);

  const SelectedComponent = React.useMemo(() => slots[selectedSlotIndex].component, [slots, selectedSlotIndex]);

  return (
    <div className="container flex h-screen flex-col items-center gap-2 border-2 border-yellow-500 py-2 lg:py-4">
      <SwitcherHeader slots={slots} selectedIndex={selectedSlotIndex} onSlotSelect={setSelectedSlotIndex} />

      {SelectedComponent}
    </div>
  );
}
