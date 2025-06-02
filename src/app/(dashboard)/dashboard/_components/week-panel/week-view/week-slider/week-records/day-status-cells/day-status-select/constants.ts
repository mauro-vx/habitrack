import { MinusCircle, PlusCircle } from "lucide-react";

import { HabitState } from "@/app/enums";
import { capitalizeFirstLetter } from "@/lib/utils";

export const STATUS_OPTIONS = {
  [HabitState.DONE]: {
    label: capitalizeFirstLetter(HabitState.DONE),
    startIcon: PlusCircle,
    color: "stroke-positive",
  },
  [HabitState.UNDONE]: {
    label: capitalizeFirstLetter(HabitState.UNDONE),
    startIcon: MinusCircle,
    color: "stroke-warning",
  },
  [HabitState.SKIP]: {
    label: capitalizeFirstLetter(HabitState.SKIP),
    startIcon: PlusCircle,
    color: "stroke-informative",
  },
  [HabitState.UNSKIP]: {
    label: capitalizeFirstLetter(HabitState.UNSKIP),
    startIcon: MinusCircle,
    color: "stroke-warning",
  },
} as const;