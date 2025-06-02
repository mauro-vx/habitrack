import React from "react";

import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const WeekSelector = ({
  visibleWeeks,
  onWeekChange,
}: {
  visibleWeeks: Date[];
  onWeekChange: (direction: "left" | "right") => void;
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onWeekChange("left")}
        aria-label="Previous week"
        className="btn btn-ghost btn-icon"
      >
        <ChevronLeft className="h-4 w-4" />
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
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
