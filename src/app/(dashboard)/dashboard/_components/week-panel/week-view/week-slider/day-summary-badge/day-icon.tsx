import { Star, MoonStar } from "lucide-react";

import { cn } from "@/lib/utils";
import { COL_START_CLASSES } from "../_utils/grid-column-utils";

export function DayIcon({ result, idx }: { result: boolean; idx: number }) {
  const Comp = result ? Star : MoonStar;

  return (
    <Comp
      className={cn(
        `size-5 lg:size-6 ${COL_START_CLASSES[idx + 1]}, ${result ? "fill-completed-fill stroke-completed-stroke" : "stroke-inactive-stroke"}`,
      )}
    />
  );
}
