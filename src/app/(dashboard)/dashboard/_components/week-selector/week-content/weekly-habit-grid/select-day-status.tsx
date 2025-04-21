import * as React from "react";

import { Circle } from "lucide-react";

import { HabitEntity } from "@/app/types";
import { Database } from "@/lib/supabase/database.types";
import { HabitState } from "@/app/enums";
import { cn } from "@/lib/utils";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";
import HabitTypeIcon from "@/app/(dashboard)/dashboard/_components/habit-type-icon";
import FractionDisplay from "@/app/(dashboard)/dashboard/_components/fraction-display";

const STATUS_OPTIONS = [
  {
    value: HabitState.PENDING,
    label: HabitState.PENDING[0].toUpperCase() + HabitState.PENDING.slice(1),
    startIcon: <Circle className="fill-gray-500" />,
    color: "fill-gray-500",
    background: "bg-gray-500",
  },
  {
    value: HabitState.PROGRESS,
    label: HabitState.PROGRESS[0].toUpperCase() + HabitState.PROGRESS.slice(1),
    startIcon: <Circle className="fill-violet-500" />,
    color: "fill-violet-500",
    background: "bg-violet-500",
  },
  {
    value: HabitState.DONE,
    label: HabitState.DONE[0].toUpperCase() + HabitState.DONE.slice(1),
    startIcon: <Circle className="fill-green-500" />,
    color: "fill-green-500",
    background: "bg-green-500",
  },
  {
    value: HabitState.SKIP,
    label: HabitState.SKIP[0].toUpperCase() + HabitState.SKIP.slice(1),
    startIcon: <Circle className="fill-blue-500" />,
    color: "fill-blue-500",
    background: "bg-blue-500",
  },
  {
    value: HabitState.INCOMPLETE,
    label: HabitState.INCOMPLETE[0].toUpperCase() + HabitState.INCOMPLETE.slice(1),
    startIcon: <Circle className="fill-red-500" />,
    color: "fill-red-500",
    background: "bg-red-500",
  },
];

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
  onChange = () => {},
  open: controlledOpen,
  onOpenChange = () => {},
  dayNumber,
}: {
  habitState: HabitState;
  habitType: Database["public"]["Enums"]["habit_type"];
  habitTarget: HabitEntity["target_count"];
  dailyCompletion: HabitEntity["habit_statuses"][0]["completion_count"];
  dailySkip: HabitEntity["habit_statuses"][0]["skipped_count"];
  onChange?: (option: (typeof STATUS_OPTIONS)[0]) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  dayNumber: number;
}) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const selectedOption = React.useMemo(
    () => STATUS_OPTIONS.find((option) => option.value === habitState) || STATUS_OPTIONS[0],
    [habitState],
  );

  const baseClassName = cn(getColStartClass(dayNumber), "place-self-center");

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange(newOpen);
  };

  const handleValueChange = (value: string) => {
    const option = STATUS_OPTIONS.find((opt) => opt.value === value);
    if (option) {
      onChange(option);
    }
  };

  return (
    <div className={baseClassName}>
      <Select value={habitState} onValueChange={handleValueChange} open={open} onOpenChange={handleOpenChange}>
        <SelectTrigger className="relative min-h-fit min-w-fit p-2 text-xs [&_svg:not([class*='size-'])]:size-8 [&>svg:last-child]:hidden">
          <HabitTypeIcon habitType={habitType} className={selectedOption.color} />
          {!!dailySkip && (
            <span className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 transform text-xs font-bold text-blue-500">
              {dailySkip}
            </span>
          )}
          <FractionDisplay
            numerator={(dailyCompletion || 0) + (dailySkip || 0)}
            denominator={habitTarget}
            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 transform"
          />
          {!!dailyCompletion && (
            <span className="absolute right-0 bottom-0 translate-x-1/2 translate-y-1/2 transform text-xs font-bold text-green-500">
              {dailyCompletion}
            </span>
          )}
        </SelectTrigger>

        {open && (
          <SelectContent>
            <SelectGroup>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.startIcon} {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        )}
      </Select>
    </div>
  );
}
