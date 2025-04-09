"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";

export default function ViewSwitcher({ slots }: { slots: { slotName: string; component: React.ReactNode }[] }) {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

  return (
    <section className="flex h-full flex-col items-center gap-4 border-2 border-violet-500 p-4">
      <div className="flex gap-4">
        {slots.map(({ slotName }, idx) => (
          <Button key={slotName} variant="outline" onClick={() => setSelectedSlotIndex(idx)}>
            {slotName}
          </Button>
        ))}
      </div>

      {slots[selectedSlotIndex]["component"]}
    </section>
  );
}
