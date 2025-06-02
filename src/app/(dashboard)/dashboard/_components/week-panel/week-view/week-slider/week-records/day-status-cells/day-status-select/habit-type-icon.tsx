import { Circle, Triangle, Square, PlusCircle } from "lucide-react";

import { Enums } from "@/lib/supabase/database.types";
import { ShowHabitState } from "@/app/types";
import { HabitState, HabitType } from "@/app/enums";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS_MAP = {
  [HabitState.PENDING]: {
    startIcon: <Circle className="stroke-inactive-stroke" />,
    fill: "fill-inactive-fill",
  },
  [HabitState.PROGRESS]: {
    startIcon: <Circle className="stroke-active-fill" />,
    fill: "fill-active-fill",
  },
  [HabitState.DONE]: {
    startIcon: <PlusCircle className="stroke-positive" />,
    fill: "fill-brand",
  },
  [HabitState.SKIP]: {
    startIcon: <PlusCircle className="stroke-informative" />,
    fill: "stroke-informative",
  },
  [HabitState.INCOMPLETE]: {
    startIcon: <Circle className="stroke-negative-stroke" />,
    fill: "fill-negative-fill",
  },
};

export function HabitTypeIcon({
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
