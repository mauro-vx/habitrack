"use client";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function MonthSelector({
  selectedMonth,
  handlePreviousMonth,
  handleNextMonth,
}: {
  selectedMonth: Date;
  handlePreviousMonth: () => void;
  handleNextMonth: () => void;
}) {
  return (
    <div className="flex items-center justify-center">
      <Button variant="ghost" size="icon" onClick={handlePreviousMonth} aria-label="Previous month">
        <ChevronLeft className="size-4" />
      </Button>

      <span className="min-w-32 text-center">{format(selectedMonth, "MMMM yyyy")}</span>

      <Button variant="ghost" size="icon" onClick={handleNextMonth} aria-label="Next month">
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
