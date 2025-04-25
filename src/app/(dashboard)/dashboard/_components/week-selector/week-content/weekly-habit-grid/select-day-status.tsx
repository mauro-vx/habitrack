import * as React from "react";

import { PlusCircle, MinusCircle } from "lucide-react";

import { SelectHabitState, ShowHabitState } from "@/app/types";
import { Tables, Enums } from "@/lib/supabase/database.types";
import { HabitState, HabitType } from "@/app/enums";
import { cn } from "@/lib/utils";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";
import HabitTypeIcon from "@/app/(dashboard)/dashboard/_components/habit-type-icon";
import FractionDisplay from "@/app/(dashboard)/dashboard/_components/fraction-display";
import { updateHabitStatus } from "@/lib/actions/update-habit-status";
import { createHabitStatus } from "@/lib/actions/create-habit-status";
import { isAfterToday } from "@/app/(dashboard)/dashboard/_utils/date";
import { deleteHabitStatus } from "@/lib/actions/delete-habit-status";

const STATUS_OPTIONS = {
  [HabitState.DONE]: {
    label: HabitState.DONE[0].toUpperCase() + HabitState.DONE.slice(1),
    startIcon: <PlusCircle className="stroke-green-500" />,
    color: "fill-green-500",
    background: "bg-green-500",
  },
  [HabitState.UNDONE]: {
    label: HabitState.UNDONE[0].toUpperCase() + HabitState.UNDONE.slice(1),
    startIcon: <MinusCircle className="stroke-yellow-500" />,
    color: "fill-yellow-500",
    background: "bg-yellow-500",
  },
  [HabitState.SKIP]: {
    label: HabitState.SKIP[0].toUpperCase() + HabitState.SKIP.slice(1),
    startIcon: <PlusCircle className="stroke-blue-500" />,
    color: "fill-blue-500",
    background: "bg-blue-500",
  },
  [HabitState.UNSKIP]: {
    label: HabitState.UNSKIP[0].toUpperCase() + HabitState.UNSKIP.slice(1),
    startIcon: <MinusCircle className="stroke-yellow-500" />,
    color: "fill-yellow-500",
    background: "bg-yellow-500",
  },
};

const getColStartClass = (dayIndex: number) => {
  const colStartClasses: Record<number, string> = {
    1: "col-start-2",
    2: "col-start-3",
    3: "col-start-4",
    4: "col-start-5",
    5: "col-start-6",
    6: "col-start-7",
    7: "col-start-8",
  };
  return colStartClasses[dayIndex];
};

export default function SelectDayStatus({
  habitState,
  habitTarget,
  habitType,
  dailyCompletion,
  dailySkip,
  weeklyCompletion,
  weeklySkip,
  cumulativeCountUntilToday,
  open: controlledOpen,
  onOpenChange = () => {},
  year,
  week,
  dayNumber,
  habitId,
  habitStatusId,
  isPast,
}: {
  habitState: ShowHabitState;
  habitType: Enums<"habit_type">;
  habitTarget: Tables<"habits">["target_count"];
  dailyCompletion: Tables<"habit_statuses">["completion_count"];
  dailySkip: Tables<"habit_statuses">["skipped_count"];
  weeklyCompletion: number;
  weeklySkip: number;
  cumulativeCountUntilToday: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  year: number;
  week: number;
  dayNumber: number;
  habitId: Tables<"habits">["id"];
  habitStatusId?: Tables<"habit_statuses">["id"];
  isPast: boolean;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const baseClassName = getColStartClass(dayNumber);

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange(newOpen);
  };

  const handleValueChange = async (value: HabitState) => {
    if (habitStatusId) {
      if (value === HabitState.UNSKIP && dailySkip === 1 && !dailyCompletion) {
        await deleteHabitStatus(habitStatusId);
      }
      if (value === HabitState.UNDONE && dailyCompletion === 1 && !dailySkip) {
        await deleteHabitStatus(habitStatusId);
      }

      await updateHabitStatus(habitStatusId, value);
    } else {
      await createHabitStatus(habitId, week, year, dayNumber, value);
    }
  };

  const isFutureDay = isAfterToday(year, week, dayNumber);

  const filteredStatusOptions = Object.keys(STATUS_OPTIONS).filter((key) => {
    if (key === HabitState.UNDONE && !dailyCompletion) return false;
    if (key === HabitState.UNSKIP && !dailySkip) return false;

    const isCompletionOrSkipAction = key === HabitState.DONE || key === HabitState.SKIP;
    const isAtTargetLimit =
      habitType === HabitType.WEEKLY
        ? weeklyCompletion + weeklySkip === habitTarget
        : (dailyCompletion || 0) + (dailySkip || 0) === habitTarget;

    if (isCompletionOrSkipAction && isAtTargetLimit) return false;

    return true;
  });

  return (
    <div className={baseClassName}>
      <Select value={habitState} onValueChange={handleValueChange} open={open} onOpenChange={handleOpenChange}>
        <SelectTrigger
          disabled={isFutureDay}
          className={cn(
            "relative flex aspect-square items-center justify-center p-0 text-xs font-medium lg:text-base lg:font-bold [&>svg:last-child]:hidden",
            habitType === HabitType.WEEKLY &&
              habitState === HabitState.PENDING &&
              isPast &&
              "border-2 border-dashed border-gray-500",
          )}
        >
          <HabitTypeIcon habitType={habitType} habitState={habitState} className="size-5 lg:size-8" />
          {!!dailySkip && (
            <span className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 transform text-blue-500 lg:-translate-x-1/2 lg:-translate-y-1/2">
              {dailySkip}
            </span>
          )}
          <FractionDisplay
            numerator={
              habitType === HabitType.WEEKLY ? cumulativeCountUntilToday : (dailyCompletion || 0) + (dailySkip || 0)
            }
            denominator={habitTarget}
            className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 transform lg:translate-x-1/2 lg:-translate-y-1/2"
          />
          {!!dailyCompletion && (
            <span className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 transform text-green-500 lg:translate-x-1/2 lg:translate-y-1/2">
              {dailyCompletion}
            </span>
          )}
        </SelectTrigger>

        {open && (
          <SelectContent>
            <SelectGroup>
              {filteredStatusOptions.map((key) => {
                return (
                  <SelectItem key={key} value={key}>
                    {STATUS_OPTIONS[key as SelectHabitState].startIcon} {STATUS_OPTIONS[key as SelectHabitState].label}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        )}
      </Select>
    </div>
  );
}
