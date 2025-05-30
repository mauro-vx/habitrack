import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";

export function DaySelector({
  selectedDate,
  onClickPrevious,
  onClickNext,
}: {
  selectedDate: Date;
  onClickPrevious: () => void;
  onClickNext: () => void;
}) {
  return (
    <div className="flex items-center justify-center">
      <Button variant="ghost" size="icon" onClick={onClickPrevious} aria-label="Previous day">
        <ChevronLeft className="size-4" />
      </Button>

      <span className="min-w-64 text-center">{format(selectedDate, "PPPP")}</span>

      <Button variant="ghost" size="icon" onClick={onClickNext} aria-label="Next day">
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
