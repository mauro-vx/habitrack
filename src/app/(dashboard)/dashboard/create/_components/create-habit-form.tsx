"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addWeeks, isMonday, startOfWeek } from "date-fns";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import { DAILY_DAYS_OF_WEEK, DEFAULT_DAYS_OF_WEEK } from "../constants";
import { Status, HabitType } from "@/app/enums";
import { CreateHabitState } from "../types";
import { CreateSchemaClient, createSchemaClient } from "../../_utils/schema-client";
import { createHabit } from "@/lib/actions/create-habit";
import { cn } from "@/lib/utils";
import { Form } from "@/components/ui/form";
import { NameField } from "./create-habit-form/name-field";
import { TypeField } from "./create-habit-form/habit-type-selector";
import { DaysOfWeekField } from "./create-habit-form/days-of-week-checkbox-group";
import { TargetCount } from "./create-habit-form/target-count";
import { DateRangeField } from "./create-habit-form/date-range-picker";
import { SubmitButton } from "./create-habit-form/submit-button";
import { ErrorAlert } from "./create-habit-form/error-alert";
import { DescriptionField } from "./create-habit-form/description-field";

const { DAILY, CUSTOM } = HabitType;

const initState: CreateHabitState = {
  name: "",
  description: "",
  type: DAILY,
  date_range: {
  start_date: startOfWeek(addWeeks(new Date(), 1), { weekStartsOn: 1 }),
    end_date: null,
  },
  target_count: 1,
  days_of_week: DAILY_DAYS_OF_WEEK,
  timezone: "UTC",
};

export function CreateHabitForm({ timezone, className }: { timezone: string; className?: string }) {
  const [state, formAction, isPending] = React.useActionState(createHabit, initState);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(createSchemaClient),
    defaultValues: initState,
    mode: "onChange",
  });

  const onHabitTypeChange = (value: HabitType) => {
    const currentStartDate = form.getValues("date_range.start_date");
    const newStartDate = isMonday(currentStartDate)
      ? currentStartDate
      : startOfWeek(addWeeks(currentStartDate, 1), { weekStartsOn: 1 });
    form.setValue("date_range", { start_date: newStartDate, end_date: null });

    if (value === DAILY) {
      form.setValue("days_of_week", DAILY_DAYS_OF_WEEK);
    } else {
      form.setValue("days_of_week", DEFAULT_DAYS_OF_WEEK);
    }
  };

  function onSubmit(data: CreateSchemaClient) {
    React.startTransition(() => formAction(data));
  }

  React.useEffect(() => {
    if (state?.status === Status.VALIDATION_ERROR && state.validationErrors) {
      for (const [key, value] of Object.entries(state.validationErrors)) {
        form.setError(key as keyof typeof state.validationErrors, {
          type: "manual",
          message: value?.[0] || "Invalid value",
        });
      }
    }

    if (state?.status === Status.SUCCESS && !isPending) {
      toast.success("Habit has been created", {
        description: form.getValues("name"),
      });

      queryClient.invalidateQueries({ queryKey: ["habits", timezone] });
      form.reset(initState);
      form.clearErrors();
    }
  }, [state, isPending, form, queryClient, timezone]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-1 flex-col gap-2 lg:gap-4", className)}>
        <NameField control={form.control} disabled={isPending} />
        <DescriptionField control={form.control} disabled={isPending} />
        <TypeField control={form.control} disabled={isPending} onChange={onHabitTypeChange} />
        <DaysOfWeekField control={form.control} disabled={isPending} isCustom={form.watch("type") === CUSTOM} />
        <TargetCount control={form.control} disabled={isPending} />
        <DateRangeField control={form.control} disabled={isPending} />
        <SubmitButton isSubmitting={isPending} />
        <ErrorAlert error={state.dbError} />
      </form>
    </Form>
  );
}
