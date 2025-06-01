import React from "react";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeekSelectorProps {
  visibleWeeks: Date[];
  onWeekChange: (direction: "left" | "right") => void;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({ visibleWeeks, onWeekChange }) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onWeekChange("left")}
        aria-label="Previous week"
        className="btn btn-ghost btn-icon"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <span className="min-w-40 text-center font-medium">
        Week {format(visibleWeeks[1], "wo")} - {format(visibleWeeks[1], "MMMM yyyy")}
      </span>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => onWeekChange("right")}
        aria-label="Next week"
        className="btn btn-ghost btn-icon"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};