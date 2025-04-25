import * as React from "react";

import { PlusCircle, MinusCircle } from "lucide-react";

import { HabitEntityRpc, SelectHabitState } from "@/app/types";
import { Tables } from "@/lib/supabase/database.types";
import { HabitState, HabitType } from "@/app/enums";
import { cn } from "@/lib/utils";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";
import HabitTypeIcon from "@/app/(dashboard)/dashboard/_components/habit-type-icon";
import FractionDisplay from "@/app/(dashboard)/dashboard/_components/fraction-display";
import { updateHabitStatus } from "@/lib/actions/update-habit-status";
import { createHabitStatus } from "@/lib/actions/create-habit-status";
import { isAfterToday, isBeforeToday, isToday } from "@/app/(dashboard)/dashboard/_utils/date";
import { deleteHabitStatus } from "@/lib/actions/delete-habit-status";
import { getHabitState } from "@/app/(dashboard)/dashboard/_components/week-selector/week-content/weekly-habit-grid/utils";

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
  habit,
  habitDayStatus,
  cumulativeCountWeekly,
  cumulativeCountUntilToday,
  cumulativeCountDay,
  year,
  week,
  dayNumber,
  open: controlledOpen,
  onOpenChange = () => {},
}: {
  habit: HabitEntityRpc;
  habitDayStatus: Tables<"habit_statuses">;
  habitStatusId?: Tables<"habit_statuses">["id"];
  cumulativeCountWeekly: number;
  cumulativeCountUntilToday: number;
  cumulativeCountDay: number;
  year: number;
  week: number;
  dayNumber: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const isPastDay = isBeforeToday(year, week, dayNumber);
  const isCurrentDay = isToday(year, week, dayNumber);
  const isFutureDay = isAfterToday(year, week, dayNumber);

  const { habitState } = getHabitState(
    habit,
    habitDayStatus,
    cumulativeCountDay,
    dayNumber,
    isCurrentDay,
    isPastDay,
    cumulativeCountWeekly,
  );

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange(newOpen);
  };
  const handleValueChange = async (value: HabitState) => {
    if (habitDayStatus?.id) {
      if (value === HabitState.UNSKIP && habitDayStatus?.skipped_count === 1 && !habitDayStatus?.completion_count) {
        await deleteHabitStatus(habitDayStatus.id);
      }
      if (value === HabitState.UNDONE && habitDayStatus?.completion_count === 1 && !habitDayStatus?.skipped_count) {
        await deleteHabitStatus(habitDayStatus?.id);
      }

      await updateHabitStatus(habitDayStatus?.id, value);
    } else {
      await createHabitStatus(habit.id, week, year, dayNumber, value);
    }
  };

  const filteredStatusOptions = Object.keys(STATUS_OPTIONS).filter((key) => {
    if (key === HabitState.UNDONE && !habitDayStatus?.completion_count) return false;
    if (key === HabitState.UNSKIP && !habitDayStatus?.skipped_count) return false;

    const isCompletionOrSkipAction = key === HabitState.DONE || key === HabitState.SKIP;
    const isAtTargetLimit =
      habit.type === HabitType.WEEKLY
        ? cumulativeCountWeekly === habit.target_count
        : cumulativeCountDay === habit.target_count;

    if (isCompletionOrSkipAction && isAtTargetLimit) return false;

    return true;
  });

  const baseClassName = getColStartClass(dayNumber);

  return (
    <div className={baseClassName}>
      <Select value={habitState} onValueChange={handleValueChange} open={open} onOpenChange={handleOpenChange}>
        <SelectTrigger
          disabled={isFutureDay}
          className={cn(
            "relative flex aspect-square items-center justify-center p-0 text-xs font-medium lg:text-base lg:font-bold [&>svg:last-child]:hidden",
            habit.type === HabitType.WEEKLY &&
              habitState === HabitState.PENDING &&
              isPastDay &&
              "border-2 border-dashed border-gray-500",
          )}
        >
          <HabitTypeIcon habitType={habit.type} habitState={habitState} className="size-5 lg:size-8" />
          {!!habitDayStatus?.skipped_count && (
            <span className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 transform text-blue-500 lg:-translate-x-1/2 lg:-translate-y-1/2">
              {habitDayStatus?.skipped_count}
            </span>
          )}
          <FractionDisplay
            numerator={habit.type === HabitType.WEEKLY ? cumulativeCountUntilToday : cumulativeCountDay}
            denominator={habit.target_count}
            className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 transform lg:translate-x-1/2 lg:-translate-y-1/2"
          />
          {!!habitDayStatus?.completion_count && (
            <span className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 transform text-green-500 lg:translate-x-1/2 lg:translate-y-1/2">
              {habitDayStatus?.completion_count}
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
