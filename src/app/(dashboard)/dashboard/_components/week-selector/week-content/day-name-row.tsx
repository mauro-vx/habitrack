import * as React from "react";

import { cn } from "@/lib/utils";
import { getDayNamesByFormat } from "@/app/(dashboard)/dashboard/_utils/date";

const dayNames = getDayNamesByFormat("full");

export function DayNameRow() {
  return dayNames.map((dayName, idx) => (
    <div key={dayName} className={cn("p-2 text-center font-medium", !idx && "col-start-2")}>
      {dayName}
    </div>
  ));
}