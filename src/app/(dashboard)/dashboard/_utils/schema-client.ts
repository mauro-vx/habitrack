import { z } from "zod";
import { startOfToday } from "date-fns";

import { HabitType } from "@/app/enums";
import { validateStartDate, validateEndDate, validateDaysOfWeek } from "./schema-shared";

export const createSchemaClient = z
  .object({
    name: z.string().min(1, "Name is required."),
    description: z.string().optional(),
    type: z.nativeEnum(HabitType, { errorMap: () => ({ message: "Invalid habit type." }) }),
    days_of_week: z.object({
      1: z.boolean(),
      2: z.boolean(),
      3: z.boolean(),
      4: z.boolean(),
      5: z.boolean(),
      6: z.boolean(),
      7: z.boolean(),
    }),
    target_count: z.number().min(1, { message: "Target must be at least 1." }),
    date_range: z.object({
      start_date: z.coerce.date({ errorMap: () => ({ message: "Invalid start date." }) }),
      end_date: z.coerce.date({ errorMap: () => ({ message: "Invalid end date." }) }).nullable(),
    }),
    timezone: z.string(),
  })
  .superRefine((data, ctx) => {
    const {
      date_range: { start_date, end_date },
      type,
      days_of_week,
    } = data;

    const today = startOfToday();
    validateStartDate(start_date, today, ctx);
    validateEndDate(start_date, end_date, ctx);
    validateDaysOfWeek(type, days_of_week, ctx);
  });

export type CreateSchemaClient = z.infer<typeof createSchemaClient>;