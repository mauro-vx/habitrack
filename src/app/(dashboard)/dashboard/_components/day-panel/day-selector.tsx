import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, isSameDay } from "date-fns";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DaySelector({
  selectedDate,
  onClickPrevious,
  onClickNext,
}: {
  selectedDate: Date;
  onClickPrevious: () => void;
  onClickNext: () => void;
}) {
  const isToday =  isSameDay(selectedDate, new Date());

  return (
    <div className="flex items-center justify-center">
      <Button variant="ghost" size="icon" onClick={onClickPrevious} aria-label="Previous day">
        <ChevronLeft className="size-4" />
      </Button>

      <span className={cn("min-w-64 text-center", isToday && "text-brand underline underline-offset-4")}>{format(selectedDate, "PPPP")}</span>

      <Button variant="ghost" size="icon" onClick={onClickNext} aria-label="Next day">
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}
