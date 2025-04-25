import * as React from "react";

import { Circle, Triangle, Square, PlusCircle } from "lucide-react";

import { Enums } from "@/lib/supabase/database.types";
import { ShowHabitState } from "@/app/types";
import { HabitState, HabitType } from "@/app/enums";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS_MAP = {
  [HabitState.PENDING]: {
    startIcon: <Circle className="fill-gray-500" />,
    fill: "fill-gray-500",
  },
  [HabitState.PROGRESS]: {
    startIcon: <Circle className="fill-violet-500" />,
    fill: "fill-violet-500",
  },
  [HabitState.DONE]: {
    startIcon: <PlusCircle className="stroke-green-500" />,
    fill: "fill-green-500",
  },
  [HabitState.SKIP]: {
    startIcon: <PlusCircle className="stroke-blue-500" />,
    fill: "fill-blue-500",
  },
  [HabitState.INCOMPLETE]: {
    startIcon: <Circle className="fill-red-500" />,
    fill: "fill-red-500",
  },
};

export default function HabitTypeIcon({
  habitType,
  habitState,
  className,
}: {
  habitType: Enums<"habit_type">;
  habitState: ShowHabitState;
  className?: string;
}) {
  const selectedOption = STATUS_OPTIONS_MAP[habitState];

  const shapeIcons = {
    [HabitType.DAILY]: Circle,
    [HabitType.WEEKLY]: Triangle,
    [HabitType.CUSTOM]: Square,
  };

  const ShapeIcon = shapeIcons[habitType] || null;

  if (!ShapeIcon) {
    return null;
  }

  return <ShapeIcon className={cn(selectedOption.fill, className)}/>;
}
