import { MinusCircle, PlusCircle } from "lucide-react";

import { HabitState } from "@/app/enums";
import { capitalizeFirstLetter } from "@/lib/utils";

export const STATUS_OPTIONS = {
  [HabitState.DONE]: {
    label: capitalizeFirstLetter(HabitState.DONE),
    startIcon: PlusCircle,
    color: "stroke-green-500",
  },
  [HabitState.UNDONE]: {
    label: capitalizeFirstLetter(HabitState.UNDONE),
    startIcon: MinusCircle,
    color: "stroke-yellow-500",
  },
  [HabitState.SKIP]: {
    label: capitalizeFirstLetter(HabitState.SKIP),
    startIcon: PlusCircle,
    color: "stroke-blue-500",
  },
  [HabitState.UNSKIP]: {
    label: capitalizeFirstLetter(HabitState.UNSKIP),
    startIcon: MinusCircle,
    color: "stroke-yellow-500",
  },
} as const;