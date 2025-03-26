"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, addWeeks, format, isBefore, isMonday, isSunday, startOfDay, startOfWeek } from "date-fns";
import { AlertCircle, CalendarIcon } from "lucide-react";

import { Status } from "@/app/enums";
import { HabitType } from "../create/enums";
import { CreateHabitState } from "../create/types";
import { CreateHabitSchema, createHabitSchema } from "../create/schema";
import { createHabit } from "@/lib/actions/create-habit";
import { useCapitalizeFirst } from "@/hooks/use-capitalize-first";
import { cn } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const defaultWeekState = {
  1: false,
  2: false,
  3: false,
  4: false,
  5: false,
  6: false,
  7: false,
};

const dayNameMap = {
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
};

const initState: CreateHabitState = {
  name: "",
  description: "",
  type: HabitType.DAILY,
  start_date: new Date(),
  end_date: null,
  frequency: 1,
  days_of_week: defaultWeekState,
};

export default function CreateHabitForm({ className }: { className?: string }) {
  const [state, formAction, isPending] = React.useActionState(createHabit, initState);
  const capitalizeFirst = useCapitalizeFirst();

  const form = useForm({
    resolver: zodResolver(createHabitSchema),
    defaultValues: initState,
    mode: "onChange",
  });

  const isDaily = form.watch("type") === HabitType.DAILY;
  const isWeekly = form.watch("type") === HabitType.WEEKLY;
  const isCustom = form.watch("type") === HabitType.CUSTOM;

  const handleDateChanges = (value: string) => {
    if (value === HabitType.WEEKLY || value === HabitType.CUSTOM) {
      const currentStartDate = form.getValues("start_date");
      const newStartDate = isMonday(currentStartDate)
        ? currentStartDate
        : startOfWeek(addWeeks(currentStartDate, 1), { weekStartsOn: 1 });
      form.setValue("start_date", newStartDate);
    }

    if (value === HabitType.DAILY || value === HabitType.WEEKLY) {
      form.setValue("days_of_week", defaultWeekState);
    }

    form.setValue("end_date", null);
  };

  async function onSubmit(data: CreateHabitSchema) {
    React.startTransition(() => formAction(data));

    if (state?.status === Status.VALIDATION_ERROR && state.validationErrors) {
      for (const [key, value] of Object.entries(state.validationErrors)) {
        form.setError(key as keyof typeof state.validationErrors, {
          type: "manual",
          message: value?.[0] || "Invalid value",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-4", className)}>
        {/* region name */}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name:</FormLabel>
              <FormControl>
                <Input placeholder="Name your habit" disabled={isPending} type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* endregion */}

        {/* region description */}

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description:</FormLabel>
              <FormControl>
                <Input placeholder="Description (optional)" disabled={isPending} type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* endregion */}

        {/* region type */}

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type:</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleDateChanges(value);
                  }}
                  disabled={isPending}
                >
                  <SelectTrigger>
                    <SelectValue>{capitalizeFirst(field.value)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={HabitType.DAILY}>{capitalizeFirst(HabitType.DAILY)}</SelectItem>
                      <SelectItem value={HabitType.WEEKLY}>{capitalizeFirst(HabitType.WEEKLY)}</SelectItem>
                      <SelectItem value={HabitType.CUSTOM}>{capitalizeFirst(HabitType.CUSTOM)}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* endregion */}

        {/* region selected weekdays */}

        {form.watch("type") === HabitType.CUSTOM && (
          <FormField
            control={form.control}
            name="days_of_week"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Days of the Week:</FormLabel>
                <FormControl>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(defaultWeekState).map((dayKey) => {
                      const dayIdx = Number(dayKey) as keyof typeof defaultWeekState;

                      return (
                        <div key={dayIdx}>
                          <Checkbox
                            id={dayKey}
                            checked={field.value[dayIdx]}
                            onCheckedChange={() => {
                              const updatedDays = {
                                ...field.value,
                                [dayIdx]: !field.value[dayIdx],
                              };
                              field.onChange(updatedDays);
                            }}
                            className="hidden"
                          />

                          <Button
                            asChild
                            variant="outline"
                            className={cn(
                              field.value[dayIdx] &&
                                "text-secondary-accent-foreground bg-secondary-accent hover:text-secondary-accent-foreground",
                            )}
                          >
                            <label htmlFor={dayKey} className="w-fit">
                              {dayNameMap[dayIdx]}
                            </label>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* endregion */}

        {/* region frequency */}

        <FormField
          control={form.control}
          name="frequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frequency:</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1"
                  disabled={isPending}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* endregion */}

        {/* region start date */}

        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date:</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-fit justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon />
                      {field.value ? format(new Date(field.value), "PPP") : <span>Pick a start date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      weekStartsOn={1}
                      selected={field.value && new Date(field.value)}
                      onSelect={(date) => field.onChange(date?.toISOString() || null)}
                      initialFocus
                      disabled={(date) => {
                        const isPastDisabled = isBefore(startOfDay(date), startOfDay(new Date()));
                        const isNotMondayDisabled = !isMonday(date);
                        const isNotStartOfWeekDisabled = isPastDisabled || isNotMondayDisabled;

                        if (isDaily) return isPastDisabled;
                        else if (isWeekly || isCustom) return isNotStartOfWeekDisabled;
                        else return isPastDisabled;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* endregion */}

        {/* region end date */}

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date:</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-fit justify-start text-left font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon />
                      {field.value ? format(new Date(field.value), "PPP") : <span>Pick an end date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      weekStartsOn={1}
                      selected={field.value || undefined}
                      onSelect={(date) => field.onChange(date?.toISOString() || null)}
                      initialFocus
                      disabled={(date) => {
                        const start_date = form.watch("start_date");
                        const normalizedStartDate = startOfDay(new Date(start_date));
                        const normalizedDate = startOfDay(date);

                        const isStartOrEqualDisabled = isBefore(normalizedDate, addDays(normalizedStartDate, 1));
                        const isNotSundayDisabled = !isSunday(date);
                        const isNotEndOfWeekDisabled = isStartOrEqualDisabled || isNotSundayDisabled;

                        if (isDaily) return isStartOrEqualDisabled;
                        else if (isWeekly || isCustom) return isNotEndOfWeekDisabled;
                        else return isNotEndOfWeekDisabled;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* endregion */}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Habit"}
        </Button>

        {state?.dbError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.dbError.message || "An error occurred."}</AlertDescription>
          </Alert>
        )}
      </form>
    </Form>
  );
}
