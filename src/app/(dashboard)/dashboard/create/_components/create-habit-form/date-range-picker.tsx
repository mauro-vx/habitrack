import * as React from "react";

import { Control } from "react-hook-form";
import { CalendarIcon, X } from "lucide-react";
import { format, isBefore, isMonday, isSunday, startOfDay, isAfter, isSameDay } from "date-fns";

import { CreateHabitSchema } from "../../schema";
import { getFirstPossibleMonday } from "@/lib/utils";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PopoverClose } from "@radix-ui/react-popover";

export function DateRangeField({ control, disabled }: { control: Control<CreateHabitSchema>; disabled?: boolean }) {
  const defaultMonday = React.useMemo(() => getFirstPossibleMonday(new Date()), []);

  React.useEffect(() => {
    const currentValue = control._getWatch("date_range");
    if (!currentValue?.start_date) {
      control._formValues.date_range = {
        start_date: defaultMonday,
        end_date: null,
      };
    }
  }, [control, defaultMonday]);

  return (
    <FormField
      control={control}
      name="date_range"
      render={({ field }) => {
        if (!field.value?.start_date) {
          field.onChange({
            start_date: defaultMonday,
            end_date: null,
          });
        }

        const handleReset = () => {
          field.onChange({ start_date: null, end_date: null });
        };

        return (
          <FormItem>
            <FormLabel>Select a date range: Monday to Sunday</FormLabel>
            <FormControl>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value?.start_date
                        ? `${format(field.value.start_date, "LLL dd, y")} ${field.value.end_date ? `- ${format(field.value.end_date, "LLL dd, y")}` : ""}`
                        : "Select a date range"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex items-center justify-between border-b p-3">
                      <div className="text-sm font-medium">Habit Duration</div>
                      {field.value?.start_date && (
                        <Button variant="ghost" size="sm" onClick={handleReset}>
                          <X className="h-4 w-4" />
                          <span className="sr-only">Clear</span>
                        </Button>
                      )}
                    </div>

                    <Calendar
                      mode="default"
                      weekStartsOn={1}
                      initialFocus
                      selected={field.value?.end_date || field.value?.start_date || undefined}
                      modifiers={{
                        selected: [field.value?.start_date, field.value?.end_date].filter(
                          (date): date is Date => date !== null,
                        ) as Date[],
                        inRange:
                          field.value?.start_date && field.value?.end_date
                            ? { from: field.value.start_date, to: field.value.end_date }
                            : { from: new Date(0), to: new Date(0) },
                      }}
                      modifiersClassNames={{
                        selected: "bg-secondary-accent text-secondary-accent-foreground font-bold",
                        inRange: "bg-primary/10 rounded-none",
                      }}
                      onDayClick={(day) => {
                        if (isMonday(day)) {
                          if (field.value?.start_date && isSameDay(day, field.value.start_date)) {
                            return;
                          }

                          const currentEndDate = field.value?.end_date;
                          field.onChange({
                            start_date: day,
                            end_date: currentEndDate && isAfter(currentEndDate, day) ? currentEndDate : null,
                          });
                          return;
                        }

                        if (isSunday(day)) {
                          if (!field.value?.start_date) {
                            return;
                          }

                          if (!isAfter(day, field.value.start_date)) {
                            return;
                          }

                          if (field.value.end_date && isSameDay(day, field.value.end_date)) {
                            field.onChange({
                              start_date: field.value.start_date,
                              end_date: null,
                            });
                          } else {
                            field.onChange({
                              start_date: field.value.start_date,
                              end_date: day,
                            });
                          }
                          return;
                        }
                      }}
                      disabled={(date) => {
                        const normalizedDate = startOfDay(date);
                        const today = startOfDay(new Date());

                        if (disabled) return true;
                        if (isBefore(normalizedDate, today)) return true;

                        if (isMonday(normalizedDate)) return false;

                        if (isSunday(normalizedDate) && field.value?.start_date) {
                          return isBefore(normalizedDate, field.value.start_date);
                        }

                        return true;
                      }}
                    />

                    <PopoverClose asChild>
                      <Button type="button" variant="secondary" size="sm" className="w-full">
                        OK
                      </Button>
                    </PopoverClose>
                  </PopoverContent>
                </Popover>

                {field.value?.start_date && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3"
                    onClick={handleReset}
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Clear</span>
                  </Button>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
