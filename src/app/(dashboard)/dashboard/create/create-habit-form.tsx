"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isBefore, isMonday, isSunday, startOfDay } from "date-fns";
import { AlertCircle, CalendarIcon } from "lucide-react";

import { Status, HabitType } from "@/app/enums";
import { CreateHabitState } from "../create/types";
import { CreateHabitSchema, createHabitSchema } from "../create/schema";
import { createHabit } from "@/lib/actions/create-habit";
import { useCapitalizeFirst } from "@/hooks/use-capitalize-first";
import { cn, getFirstPossibleMonday } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { toast } from "sonner";

const DAILY_DAYS_OF_WEEK = {
  1: true,
  2: true,
  3: true,
  4: true,
  5: true,
  6: true,
  7: true,
};

const DEFAULT_DAYS_OF_WEEK = {
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
  date_range: {
    start_date: getFirstPossibleMonday(new Date()),
    end_date: null,
  },
  target_count: 1,
  days_of_week: DAILY_DAYS_OF_WEEK,
};

export default function CreateHabitForm({ className }: { className?: string }) {
  const [state, formAction, isPending] = React.useActionState(createHabit, initState);
  const capitalizeFirst = useCapitalizeFirst();

  const form = useForm({
    resolver: zodResolver(createHabitSchema),
    defaultValues: initState,
    mode: "onChange",
  });

  const onHabitTypeChange = (value: HabitType) => {
    const currentStartDate = form.getValues("date_range.start_date");
    const newStartDate = isMonday(currentStartDate) ? currentStartDate : getFirstPossibleMonday(currentStartDate);

    form.setValue("date_range", { start_date: newStartDate, end_date: null });

    if (value === HabitType.DAILY) {
      form.setValue("days_of_week", DAILY_DAYS_OF_WEEK);
    }
    form.setValue("days_of_week", DEFAULT_DAYS_OF_WEEK);
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

  React.useEffect(() => {
    if (state?.status === Status.SUCCESS && !isPending) {
      toast.success("Habit has been created", {
        description: form.getValues("name"),
      });
    }
  }, [state?.status, isPending, form]);

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
                    onHabitTypeChange(value as HabitType);
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
                    {Object.keys(DAILY_DAYS_OF_WEEK).map((dayKey) => {
                      const dayIdx = Number(dayKey) as keyof typeof DAILY_DAYS_OF_WEEK;

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

        {/* region target_count */}

        <FormField
          control={form.control}
          name="target_count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>target_count:</FormLabel>
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

        {/* region start & end date */}

        <FormField
          control={form.control}
          name="date_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pick a date range(Start: Monday, End: Following Sunday):</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {/* Display selected range or placeholder */}
                      {field.value?.start_date
                        ? field.value.end_date
                          ? `${format(field.value.start_date, "LLL dd, y")} - ${format(
                              new Date(field.value.end_date),
                              "LLL dd, y",
                            )}`
                          : `${format(new Date(field.value.start_date), "LLL dd, y")}`
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
                        from: field.value?.start_date ? field.value.start_date : undefined,
                        to: field.value?.end_date ? field.value.end_date : undefined,
                      }}
                      onSelect={(range) => {
                        if (range?.from && isMonday(range?.from)) {
                          field.onChange({
                            start_date: range?.from,
                            end_date: range?.to || null,
                          });
                        } else if (range?.to && field.value?.start_date) {
                          field.onChange({
                            start_date: field.value?.start_date,
                            end_date: range.to,
                          });
                        } else {
                          field.onChange({
                            start_date: null,
                            end_date: null,
                          });
                        }
                      }}
                      disabled={(date) => {
                        const startDate = field.value?.start_date ? startOfDay(field.value.start_date) : null;
                        const normalizedDate = startOfDay(date);
                        const today = startOfDay(new Date());

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
          )}
        />

        {/* endregion */}

        {/* region submit */}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create Habit"}
        </Button>

        {/* endregion */}

        {/* region errors */}

        {state?.dbError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.dbError.message || "An error occurred."}</AlertDescription>
          </Alert>
        )}

        {/* endregion */}
      </form>
    </Form>
  );
}
