import * as React from "react";

import { cn } from "@/lib/utils";
import { getDayNamesByFormat } from "@/app/(dashboard)/dashboard/_utils/date";

const dayNames = getDayNamesByFormat("short");

export function DayNameRow() {
  return dayNames.map((dayName, idx) => (
    <div key={dayName} className={cn("lg:font-medium text-sm lg:text-base", !idx && "col-start-2")}>
      {dayName}
    </div>
  ));
}