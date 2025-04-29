import * as React from "react";

import { Control } from "react-hook-form";
import { CalendarIcon } from "lucide-react";
import { format, isBefore, isMonday, isSunday, startOfDay } from "date-fns";

import { CreateHabitSchema } from "../../schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

export default function DateRangeField({
  control,
  disabled,
}: {
  control: Control<CreateHabitSchema>;
  disabled?: boolean;
}) {
  return (
    <FormField
      control={control}
      name="date_range"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Select a date range: Monday to Sunday</FormLabel>
            <FormControl>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value?.start_date
                      ? `${format(field.value.start_date, "LLL dd, y")} ${field.value.end_date ? `- ${format(field.value.end_date, "LLL dd, y")}` : ""}`
                      : "Select a date range"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="range"
                    weekStartsOn={1}
                    numberOfMonths={2}
                    initialFocus
                    selected={{
                      from: field.value?.start_date || undefined,
                      to: field.value?.end_date || undefined,
                    }}
                    onSelect={(range) => {
                      if (range?.from && isMonday(range.from)) {
                        field.onChange({ start_date: range?.from, end_date: range?.to || null });
                      } else if (range?.to && field.value?.start_date) {
                        field.onChange({ start_date: field.value.start_date, end_date: field.value.end_date });
                      } else {
                        field.onChange({ start_date: null, end_date: null });
                      }
                    }}
                    disabled={(date) => {
                      const startDate = field.value?.start_date ? startOfDay(field.value.start_date) : null;
                      const normalizedDate = startOfDay(date);
                      const today = startOfDay(new Date());

                      if (disabled) return true;
                      if (isBefore(normalizedDate, today)) return true;
                      if (!startDate) return !isMonday(normalizedDate);

                      return isBefore(normalizedDate, startDate) || !isSunday(normalizedDate);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
