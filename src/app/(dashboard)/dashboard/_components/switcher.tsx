"use client";

import * as React from 'react';
import Link from "next/link";
import { Home, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { DaySelector } from "./day-selector";
import { WeekSelector } from "./week-selector";
import { MonthSelector } from "./month-selector";

const YearlyView = () => <div>Yearly view</div>;
  
const COMPONENTS = {
  "Day": DaySelector,
  "Week": WeekSelector,
  "Month": MonthSelector,
  "Year": YearlyView,
};

const SwitcherHeader = React.memo(
  ({
     slotNames,
     selectedIndex,
     onSlotSelect,
   }: {
    slotNames: string[];
    selectedIndex: number;
    onSlotSelect: (index: number) => void;
  }) => {
    return (
      <header className="grid w-full grid-cols-[auto_1fr_auto] place-items-center items-center">
        <Link href="/">
          <Home />
        </Link>

        <div className="col-span-1 flex gap-x-2 lg:gap-x-4">
          {slotNames.map((slotName, idx) => (
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

export function Switcher({ slotNames }: { slotNames: string[] }) {
  const [selectedSlotIndex, setSelectedSlotIndex] = React.useState(1);
  
  const selectedSlotName = slotNames[selectedSlotIndex];
  const CurrentComponent = COMPONENTS[selectedSlotName as keyof typeof COMPONENTS];

  return (
    <div className="container flex h-screen flex-col items-center gap-2 lg:gap-4 py-2 lg:py-4">
      <SwitcherHeader
        slotNames={slotNames}
        selectedIndex={selectedSlotIndex}
        onSlotSelect={setSelectedSlotIndex}
      />
      
      <CurrentComponent />
    </div>
  );
}