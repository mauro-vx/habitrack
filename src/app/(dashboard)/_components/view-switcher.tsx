"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";

export default function ViewSwitcher({ slots }: { slots: { slotName: string; component: React.ReactNode }[] }) {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

  return (
    <section className="flex h-full flex-col items-center gap-4 border-2 border-violet-500">
      <div>
        {slots.map(({ slotName }, idx) => (
          <Button key={slotName} onClick={() => setSelectedSlotIndex(idx)}>
            {slotName}
          </Button>
        ))}
      </div>

      {slots[selectedSlotIndex]["component"]}
    </section>
  );
}
