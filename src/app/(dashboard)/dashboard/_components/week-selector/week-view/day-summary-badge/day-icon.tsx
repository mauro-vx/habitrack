import * as React from "react";

import { Star, StarOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { COL_START_CLASSES } from "../_utils/grid-column-utils";

export function DayIcon({ result, idx }: { result: boolean; idx: number }) {
  const Comp = result ? Star : StarOff;

  return (
    <Comp className={cn(`size-4 ${COL_START_CLASSES[idx + 1]}, ${result ? "text-yellow-500" : "text-pink-600"}`)} />
  );
}
