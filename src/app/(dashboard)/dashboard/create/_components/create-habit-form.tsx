"use client";

import * as React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isMonday } from "date-fns";
import { toast } from "sonner";

import { DAILY_DAYS_OF_WEEK, DEFAULT_DAYS_OF_WEEK } from "../constants";
import { Status, HabitType } from "@/app/enums";
import { CreateHabitState } from "../types";
import { CreateHabitSchema, createHabitSchema } from "../schema";
import { createHabit } from "@/lib/actions/create-habit";
import { cn, getFirstPossibleMonday } from "@/lib/utils";
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
    start_date: getFirstPossibleMonday(new Date()),
    end_date: null,
  },
  target_count: 1,
  days_of_week: DAILY_DAYS_OF_WEEK,
};

export function CreateHabitForm({ className }: { className?: string }) {
  const [state, formAction, isPending] = React.useActionState(createHabit, initState);

  const form = useForm({
    resolver: zodResolver(createHabitSchema),
    defaultValues: initState,
    mode: "onChange",
  });

  const onHabitTypeChange = (value: HabitType) => {
    const currentStartDate = form.getValues("date_range.start_date");
    const newStartDate = isMonday(currentStartDate) ? currentStartDate : getFirstPossibleMonday(currentStartDate);
    form.setValue("date_range", { start_date: newStartDate, end_date: null });

    if (value === DAILY) {
      form.setValue("days_of_week", DAILY_DAYS_OF_WEEK);
    } else {
      form.setValue("days_of_week", DEFAULT_DAYS_OF_WEEK);
    }
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
      form.reset(initState);
    }
  }, [state?.status, isPending, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("flex flex-col gap-2 lg:gap-4 flex-1", className)}>
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
