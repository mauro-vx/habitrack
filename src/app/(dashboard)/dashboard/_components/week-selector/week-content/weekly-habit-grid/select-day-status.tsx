import * as React from "react";

import { Circle } from "lucide-react";

import { HabitEntity } from "@/app/types";
import { cn } from "@/lib/utils";
import { Select } from "@radix-ui/react-select";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger } from "@/components/ui/select";

const STATUS_OPTIONS = [
  {
    value: "pending",
    label: "Pending",
    startIcon: <Circle className="fill-gray-500" />,
    color: "fill-gray-500",
  },
  {
    value: "done",
    label: "Done",
    startIcon: <Circle className="fill-green-500" />,
    color: "fill-green-500",
  },
  {
    value: "ignored",
    label: "Ignored",
    startIcon: <Circle className="fill-blue-500" />,
    color: "fill-blue-500",
  },
  {
    value: "incomplete",
    label: "Incomplete",
    startIcon: <Circle className="fill-red-500" />,
    color: "fill-red-500",
  },
];

interface SelectDayStatusProps {
  status: HabitEntity["habit_statuses"][0]["status"];
  onChange?: (option: (typeof STATUS_OPTIONS)[0]) => void;
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function SelectDayStatus({
  status,
  onChange = () => {},
  className,
  open: controlledOpen,
  onOpenChange = () => {},
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

  return (
    <div className={className}>
      <Select value={status} onValueChange={handleValueChange} open={open} onOpenChange={handleOpenChange}>
        <SelectTrigger className="flex min-h-fit min-w-fit items-center justify-center rounded-full p-1 [&>svg:last-child]:hidden">
          <Circle className={cn("min-h-8 min-w-8", selectedOption.color)} />
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
