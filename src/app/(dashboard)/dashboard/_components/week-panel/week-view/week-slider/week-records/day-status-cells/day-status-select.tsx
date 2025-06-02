import * as React from "react";

import { RotateCw, TriangleAlert } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { isBefore, startOfToday, isToday, isAfter } from "date-fns";

import { HabitEntityRpc, SelectHabitState } from "@/app/types";
import { Tables } from "@/lib/supabase/database.types";
import { HabitState, HabitType, Status } from "@/app/enums";
import { STATUS_OPTIONS } from "./day-status-select/constants";
import { getHabitState } from "./day-status-select/utils";
import { cn, getWeekDateSeries } from "@/lib/utils";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";
import { FractionDisplay } from "./day-status-select/fraction-display";
import { deleteHabitStatus } from "@/lib/actions/delete-habit-status";
import { updateHabitStatus } from "@/lib/actions/update-habit-status";
import { createHabitStatus } from "@/lib/actions/create-habit-status";
import { Select } from "@radix-ui/react-select";
import { HabitTypeIcon } from "./day-status-select/habit-type-icon";

export function DayStatusSelect({
  habit,
  habitDayStatus,
  cumulativeCountWeekly,
  cumulativeCountUntilToday,
  cumulativeCountDay,
  weekStartDate,
  statusDate,
  dayNumber,
  open: controlledOpen,
  onOpenChange = () => {},
  className,
}: {
  habit: HabitEntityRpc;
  habitDayStatus: Tables<"habit_statuses">;
  habitStatusId?: Tables<"habit_statuses">["id"];
  cumulativeCountWeekly: number;
  cumulativeCountUntilToday: number;
  cumulativeCountDay: number;
  weekStartDate: Date;
  statusDate: Date;
  dayNumber: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const queryClient = useQueryClient();

  const [createState, createAction, isPendingCreate] = React.useActionState(createHabitStatus, null);
  const [updateState, updateAction, isPendingUpdate] = React.useActionState(updateHabitStatus, null);
  const [deleteState, deleteAction, isPendingDelete] = React.useActionState(deleteHabitStatus, null);

  const isPastDay = isBefore(statusDate, startOfToday());
  const isCurrentDay = isToday(statusDate);
  const isFutureDay = isAfter(statusDate, startOfToday());

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
          weekStartDate,
          statusDate,
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

  const successfulState =
    createState?.status === Status.SUCCESS ||
    updateState?.status === Status.SUCCESS ||
    deleteState?.status === Status.SUCCESS;

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

  React.useEffect(() => {
    if (successfulState && !isPending) {
      const { year, month, week } = getWeekDateSeries(weekStartDate).current;

      queryClient.invalidateQueries({ queryKey: ["dayData", year, week, dayNumber] });
      queryClient.invalidateQueries({ queryKey: ["weekData", year, week] });
      queryClient.invalidateQueries({ queryKey: ["monthData", year, month] });
    }
  }, [weekStartDate, isPending, queryClient, successfulState, dayNumber]);

  return (
    <>
      <Select value={habitState} onValueChange={handleValueChange} open={open} onOpenChange={handleOpenChange}>
        <SelectTrigger
          disabled={isFutureDay || isPendingDelete || isPendingUpdate || isPendingCreate}
          className={cn(
            "relative flex aspect-square min-h-fit min-w-auto items-center justify-center p-1 text-xs font-medium lg:p-2 lg:text-base lg:font-bold [&>svg:last-child]:hidden",
            habit.type === HabitType.WEEKLY &&
              habitState === HabitState.PENDING &&
              isPastDay &&
              "border-2 border-dashed border-ring",
            className,
          )}
        >
          {isPending ? (
            <RotateCw className="size-5 animate-spin stroke-positive-stroke lg:size-6" />
          ) : isError ? (
            <TriangleAlert className="size-5 stroke-destructive-foreground lg:size-6" />
          ) : (
            <HabitTypeIcon habitType={habit.type} habitState={habitState} className="size-5 lg:size-6" />
          )}

          {!!habitDayStatus?.skipped_count && (
            <span className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 transform text-informative lg:-translate-x-1/2 lg:-translate-y-1/2">
              {habitDayStatus?.skipped_count}
            </span>
          )}
          <FractionDisplay
            numerator={habit.type === HabitType.WEEKLY ? cumulativeCountUntilToday : cumulativeCountDay}
            denominator={habit.target_count}
            className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 transform lg:translate-x-1/2 lg:-translate-y-1/2"
          />
          {!!habitDayStatus?.completion_count && (
            <span className="absolute right-0 bottom-0 translate-x-1/3 translate-y-1/3 transform text-positive lg:translate-x-1/2 lg:translate-y-1/2">
              {habitDayStatus?.completion_count}
            </span>
          )}
        </SelectTrigger>

        {open && (
          <SelectContent>
            <SelectGroup>
              {filteredStatusOptions.map((statusKey) => {
                const option = STATUS_OPTIONS[statusKey as SelectHabitState];
                const Icon = option.startIcon;

                return (
                  <SelectItem key={statusKey} value={statusKey}>
                    <Icon className={cn("size-4", option.color)} /> {option.label}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        )}
      </Select>
    </>
  );
}
