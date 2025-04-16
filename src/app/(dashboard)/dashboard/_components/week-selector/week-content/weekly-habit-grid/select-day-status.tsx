import * as React from "react";

import { Circle } from "lucide-react";

import { HabitEntity } from "@/app/types";
import { HabitStatus } from "@/app/enums";
import { cn } from "@/lib/utils";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";

const pendingLabel = HabitStatus.PENDING[0].toUpperCase() + HabitStatus.PENDING.slice(1);
const progressLabel = HabitStatus.PROGRESS[0].toUpperCase() + HabitStatus.PROGRESS.slice(1);
const doneLabel = HabitStatus.DONE[0].toUpperCase() + HabitStatus.DONE.slice(1);
const skipLabel = HabitStatus.SKIP[0].toUpperCase() + HabitStatus.SKIP.slice(1);
const incompleteLabel = HabitStatus.INCOMPLETE[0].toUpperCase() + HabitStatus.INCOMPLETE.slice(1);

const STATUS_OPTIONS = [
  {
    value: HabitStatus.PENDING,
    label: pendingLabel,
    startIcon: <Circle className="fill-gray-500" />,
    color: "fill-gray-500",
    background: "bg-gray-500",
  },
  {
    value: HabitStatus.PROGRESS,
    label: progressLabel,
    startIcon: <Circle className="fill-violet-500" />,
    color: "fill-violet-500",
    background: "bg-violet-500",
  },
  {
    value: HabitStatus.DONE,
    label: doneLabel,
    startIcon: <Circle className="fill-green-500" />,
    color: "fill-green-500",
    background: "bg-green-500",
  },
  {
    value: HabitStatus.SKIP,
    label: skipLabel,
    startIcon: <Circle className="fill-blue-500" />,
    color: "fill-blue-500",
    background: "bg-blue-500",
  },
  {
    value: HabitStatus.INCOMPLETE,
    label: incompleteLabel,
    startIcon: <Circle className="fill-red-500" />,
    color: "fill-red-500",
    background: "bg-red-500",
  },
];

interface SelectDayStatusProps {
  status: HabitEntity["habit_statuses"][0]["status"];
  habitTarget: HabitEntity["target_count"];
  dailyCompletion: HabitEntity["habit_statuses"][0]["completion_count"];
  dailySkip: HabitEntity["habit_statuses"][0]["skipped_count"];
  onChange?: (option: (typeof STATUS_OPTIONS)[0]) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  dayNumber: number;
}

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
  status,
  habitTarget,
  dailyCompletion,
  dailySkip,
  onChange = () => {},
  open: controlledOpen,
  onOpenChange = () => {},
  dayNumber,
}: SelectDayStatusProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const selectedOption = React.useMemo(
    () => STATUS_OPTIONS.find((option) => option.value === status) || STATUS_OPTIONS[0],
    [status],
  );

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

  const baseClassName = cn(getColStartClass(dayNumber), "place-self-center");

  return (
    <div className={baseClassName}>
      <Select value={status} onValueChange={handleValueChange} open={open} onOpenChange={handleOpenChange}>
        <SelectTrigger className="flex min-h-fit min-w-fit items-center justify-center rounded-full p-1 [&>svg:last-child]:hidden">
          {/*<Circle className={cn("min-h-8 min-w-8", selectedOption.color)} />*/}

          <div className={cn("flex size-8 rounded-full", selectedOption.background)}>
            <span className="m-auto font-bold text-black">
              <sup>{(dailyCompletion || 0) + (dailySkip || 0)}</sup>/<sub>{habitTarget}</sub>
            </span>
          </div>
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
