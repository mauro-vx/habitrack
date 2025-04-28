import * as React from "react";

import { cn } from "@/lib/utils";

export function HabitName({ name, className = "col-start-1" }: { name: string; className?: string }) {
  return <span className={cn("text-xs lg:text-lg lg:font-semibold", className)}>{name}</span>;
}
