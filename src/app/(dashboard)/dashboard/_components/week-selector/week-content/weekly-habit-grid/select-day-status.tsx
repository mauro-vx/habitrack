import * as React from "react";

import { PlusCircle, MinusCircle, RefreshCcw, TriangleAlert } from "lucide-react";

import { HabitEntityRpc, SelectHabitState, ShowHabitState } from "@/app/types";
import { Tables } from "@/lib/supabase/database.types";
import { HabitState, HabitType, Status } from "@/app/enums";
import { cn } from "@/lib/utils";
import { deleteHabitStatus } from "@/lib/actions/delete-habit-status";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";
import { HabitTypeIcon } from "@/app/(dashboard)/dashboard/_components/habit-type-icon";
import { FractionDisplay } from "@/app/(dashboard)/dashboard/_components/fraction-display";
import { updateHabitStatus } from "@/lib/actions/update-habit-status";
import { createHabitStatus } from "@/lib/actions/create-habit-status";
import { isAfterToday, isBeforeToday, isToday } from "@/app/(dashboard)/dashboard/_utils/date";

export function SelectDayStatus({
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

  const [createState, createAction, isPendingCreate] = React.useActionState(createHabitStatus, null);
  const [updateState, updateAction, isPendingUpdate] = React.useActionState(updateHabitStatus, null);
  const [deleteState, deleteAction, isPendingDelete] = React.useActionState(deleteHabitStatus, null);

  const isPastDay = isBeforeToday(year, week, dayNumber);
  const isCurrentDay = isToday(year, week, dayNumber);
  const isFutureDay = isAfterToday(year, week, dayNumber);

  const habitState = getHabitState(
    habit,
    habitDayStatus,
    cumulativeCountWeekly,
    cumulativeCountDay,
    dayNumber,
    isCurrentDay,
    isPastDay,
  );

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange(newOpen);
  };

  const handleValueChange = async (value: SelectHabitState) => {
    if (!habitDayStatus?.id) {
      React.startTransition(() =>
        createAction({
          habitId: habit.id,
          week,
          year,
          dayNumber,
          initialState: value,
        }),
      );
      return;
    }

    if (value === HabitState.UNSKIP && habitDayStatus.skipped_count === 1 && !habitDayStatus.completion_count) {
      React.startTransition(() => deleteAction(habitDayStatus.id));
      return;
    }

    if (value === HabitState.UNDONE && habitDayStatus.completion_count === 1 && !habitDayStatus.skipped_count) {
      React.startTransition(() => deleteAction(habitDayStatus.id));
      return;
    }

    React.startTransition(() => updateAction({ habitStatusId: habitDayStatus.id, action: value }));
  };

  const isPending = isPendingCreate || isPendingUpdate || isPendingDelete;
  const isError =
    createState?.status === Status.DATABASE_ERROR ||
    updateState?.status === Status.DATABASE_ERROR ||
    deleteState?.status === Status.DATABASE_ERROR;

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

  return (
    <div className={COL_START_CLASSES[dayNumber]}>
      <Select value={habitState} onValueChange={handleValueChange} open={open} onOpenChange={handleOpenChange}>
        <SelectTrigger
          disabled={isFutureDay || isPendingDelete || isPendingUpdate || isPendingCreate}
          className={cn(
            "relative flex aspect-square items-center justify-center p-0 text-xs font-medium lg:text-base lg:font-bold [&>svg:last-child]:hidden",
            habit.type === HabitType.WEEKLY &&
              habitState === HabitState.PENDING &&
              isPastDay &&
              "border-2 border-dashed border-gray-500",
          )}
        >
          {isPending ? (
            <RefreshCcw className="size-5 animate-spin stroke-yellow-500 lg:size-8" />
          ) : isError ? (
            <TriangleAlert className="size-5 stroke-red-500 lg:size-8" />
          ) : (
            <HabitTypeIcon habitType={habit.type} habitState={habitState} className="size-5 lg:size-8" />
          )}

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

const COL_START_CLASSES: Record<number, string> = {
  1: "col-start-2",
  2: "col-start-3",
  3: "col-start-4",
  4: "col-start-5",
  5: "col-start-6",
  6: "col-start-7",
  7: "col-start-8",
};

function getHabitState(
  habit: HabitEntityRpc,
  habitDayStatus: Tables<"habit_statuses">,
  cumulativeCountWeekly: number,
  cumulativeCountDay: number,
  dayNumber: number,
  isCurrentDay: boolean,
  isPastDay: boolean,
): ShowHabitState {
  let habitState = HabitState.PENDING;

  if (habit.type === HabitType.DAILY) {
    switch (true) {
      case isCurrentDay:
        habitState = !habitDayStatus
          ? HabitState.PENDING
          : cumulativeCountDay < habit.target_count
            ? HabitState.PROGRESS
            : HabitState.DONE;
        break;

      case isPastDay:
        habitState = !habitDayStatus
          ? HabitState.INCOMPLETE
          : cumulativeCountDay < habit.target_count
            ? HabitState.INCOMPLETE
            : HabitState.DONE;
        break;
    }
  }

  if (habit.type === HabitType.WEEKLY) {
    const habitStatuses = Object.keys(habit.habit_statuses || {});
    const lastEntry = Number(habitStatuses.at(-1));

    switch (true) {
      case isCurrentDay:
        habitState =
          !habitDayStatus && !cumulativeCountWeekly
            ? HabitState.PENDING
            : cumulativeCountWeekly < habit.target_count
              ? HabitState.PROGRESS
              : HabitState.DONE;
        break;

      case isPastDay:
        habitState = !habitDayStatus
          ? HabitState.PENDING
          : cumulativeCountWeekly < habit.target_count || dayNumber !== lastEntry
            ? HabitState.PROGRESS
            : HabitState.DONE;
        break;
    }
  }

  if (habit.type === HabitType.CUSTOM) {
    switch (true) {
      case isCurrentDay:
        habitState = !habitDayStatus
          ? HabitState.PENDING
          : cumulativeCountDay < habit.target_count
            ? HabitState.PROGRESS
            : HabitState.DONE;
        break;

      case isPastDay:
        habitState = !habitDayStatus
          ? HabitState.INCOMPLETE
          : cumulativeCountDay < habit.target_count
            ? HabitState.INCOMPLETE
            : HabitState.DONE;
        break;
    }
  }

  return habitState;
}
