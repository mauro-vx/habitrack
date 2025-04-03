import { z } from "zod";
import { isMonday, isSunday, nextMonday, nextSunday, startOfDay, startOfToday } from "date-fns";

import { HabitType } from "../create/enums";

export const createHabitSchema = z
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
  })
  .superRefine((data, ctx) => {
    const {
      date_range: { start_date, end_date },
      type,
      days_of_week,
    } = data;
    const normalizedStartDate = startOfDay(start_date);
    const today = startOfToday();

    if (normalizedStartDate < today) {
      ctx.addIssue({
        code: "custom",
        path: ["date_range", "start_date"],
        message: "Start date must be today or a future date.",
      });
    }

    if (!isMonday(normalizedStartDate)) {
      const nextAllowedMonday = nextMonday(today);
      if (normalizedStartDate < nextAllowedMonday) {
        ctx.addIssue({
          code: "custom",
          path: ["date_range", "start_date"],
          message: "Start date must be the first Monday from today.",
        });
      }
    }

    if (type === HabitType.CUSTOM) {
      if (!Object.values(days_of_week).some(Boolean)) {
        ctx.addIssue({
          code: "custom",
          path: ["days_of_week"],
          message: "At least one weekday must be selected for monthly habits.",
        });
      }
    }

    if (end_date) {
      const normalizedEndDate = startOfDay(end_date);
      const firstSundayAfterStart = nextSunday(normalizedStartDate);

      if (normalizedEndDate < firstSundayAfterStart || !isSunday(normalizedEndDate)) {
        ctx.addIssue({
          code: "custom",
          path: ["date_range", "end_date"],
          message: "End date must be a Sunday on or after the first Sunday after the selected Monday.",
        });
      }
    } else {
      if (!isMonday(normalizedStartDate)) {
        ctx.addIssue({
          code: "custom",
          path: ["date_range", "end_date"],
          message: "End date can only be null if the start date is a valid Monday.",
        });
      }
    }
  });

export type CreateHabitSchema = z.infer<typeof createHabitSchema>;
