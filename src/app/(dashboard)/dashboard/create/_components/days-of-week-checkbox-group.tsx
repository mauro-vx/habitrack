import * as React from "react";

import { Control } from "react-hook-form";

import { DAILY_DAYS_OF_WEEK, dayNameMap } from "../constants";
import { CreateHabitSchema } from "../schema";
import { cn } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

function DayCheckboxButton({
  dayId,
  label,
  checked,
  onCheckedChange,
  disabled,
}: {
  dayId: string;
  dayIndex: keyof typeof DAILY_DAYS_OF_WEEK;
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <Checkbox id={dayId} checked={checked} onCheckedChange={onCheckedChange} className="hidden" disabled={disabled} />
      <Button
        asChild
        variant="outline"
        className={cn(
          checked && "text-secondary-accent-foreground bg-secondary-accent hover:text-secondary-accent-foreground",
        )}
      >
        <label htmlFor={dayId} className="w-fit">
          {label}
        </label>
      </Button>
    </div>
  );
}

export default function DaysOfWeekField({
  control,
  disabled,
  isCustom,
}: {
  control: Control<CreateHabitSchema>;
  disabled?: boolean;
  isCustom: boolean;
}) {
  if (!isCustom) {
    return null;
  }

  return (
    <FormField
      control={control}
      name="days_of_week"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Days of the Week:</FormLabel>
          <FormControl>
            <div className="flex flex-wrap gap-2">
              {Object.keys(DAILY_DAYS_OF_WEEK).map((dayId) => {
                const dayIndex = parseInt(dayId) as keyof typeof DAILY_DAYS_OF_WEEK;
                return (
                  <DayCheckboxButton
                    key={dayIndex}
                    dayId={dayId}
                    dayIndex={dayIndex}
                    label={dayNameMap[dayIndex]}
                    checked={field.value[dayIndex]}
                    onCheckedChange={() => {
                      field.onChange({
                        ...field.value,
                        [dayIndex]: !field.value[dayIndex],
                      });
                    }}
                    disabled={disabled}
                  />
                );
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
