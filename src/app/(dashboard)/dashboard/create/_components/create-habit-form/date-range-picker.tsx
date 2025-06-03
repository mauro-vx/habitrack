import { Control } from "react-hook-form";
import { CalendarIcon, X } from "lucide-react";
import { format, isBefore, isMonday, isSunday, startOfDay, isAfter, isSameDay, startOfWeek, addWeeks } from "date-fns";

import { CreateSchemaClient } from "@/app/(dashboard)/dashboard/_utils/schema-client";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { PopoverClose } from "@radix-ui/react-popover";

export function DateRangeField({ control, disabled }: { control: Control<CreateSchemaClient>; disabled?: boolean }) {
  return (
    <FormField
      control={control}
      name="date_range"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Select a date range: Monday to Sunday</FormLabel>
            <FormControl>
              <div className="relative">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {`${format(field.value.start_date, "LLL dd, y")} ${field.value.end_date ? `- ${format(field.value.end_date, "LLL dd, y")}` : ""}`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="flex items-center justify-between border-b p-3">
                      <div className="text-sm font-medium">Habit Duration</div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          field.onChange({
                            start_date: startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 }),
                            end_date: null,
                          })
                        }
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Clear</span>
                      </Button>
                    </div>

                    <Calendar
                      mode="default"
                      weekStartsOn={1}
                      initialFocus
                      modifiers={{
                        selected: [field.value?.start_date, field.value?.end_date].filter((date) => date !== null),
                        inRange: { from: field.value.start_date, to: field.value.end_date || undefined },
                      }}
                      modifiersClassNames={{
                        selected:
                          "bg-secondary-accent text-secondary-accent-foreground font-bold hover:text-secondary-accent-foreground",
                        inRange: "bg-primary/10 rounded-none",
                      }}
                      onDayClick={(day) => {
                        if (isMonday(day)) {
                          if (isSameDay(day, field.value.start_date)) {
                            return;
                          }

                          field.onChange({
                            start_date: day,
                            end_date:
                              field.value?.end_date && isAfter(day, field.value.end_date) ? null : field.value.end_date,
                          });
                          return;
                        }

                        if (isSunday(day)) {
                          if (!isAfter(day, field.value.start_date)) {
                            return;
                          }

                          field.onChange({
                            start_date: field.value.start_date,
                            end_date: field.value?.end_date && isSameDay(day, field.value.end_date) ? null : day,
                          });
                        }
                      }}
                      disabled={(date) => {
                        const normalizedDate = startOfDay(date);
                        const today = startOfDay(new Date());

                        if (disabled) {
                          return true;
                        }

                        if (isBefore(normalizedDate, today)) {
                          return true;
                        }

                        if (isMonday(normalizedDate)) {
                          return false;
                        }

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
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0 right-0 h-full px-3"
                    onClick={() =>
                      field.onChange({
                        start_date: startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 }),
                        end_date: null,
                      })
                    }
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
