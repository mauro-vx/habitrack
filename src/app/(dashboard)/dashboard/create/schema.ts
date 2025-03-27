import { z } from "zod";
import { addDays, isMonday, isSunday, nextMonday, nextSunday, startOfDay, startOfToday } from "date-fns";

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
    frequency: z.number().min(1, { message: "Frequency must be at least 1." }),
    start_date: z.coerce.date({ errorMap: () => ({ message: "Invalid start date." }) }),
    end_date: z.coerce.date({ errorMap: () => ({ message: "Invalid end date." }) }).nullable(),
  })
  .superRefine((data, ctx) => {
    const { start_date, end_date, type, days_of_week } = data;
    const normalizedStartDate = startOfDay(start_date);
    const today = startOfToday();

    if (type === HabitType.DAILY) {
      if (normalizedStartDate < today) {
        ctx.addIssue({
          code: "custom",
          path: ["start_date"],
          message: "Start date for daily habits must be today or a future date.",
        });
      }
    } else if (type === HabitType.WEEKLY || type === HabitType.CUSTOM) {
      if (!isMonday(normalizedStartDate)) {
        const nextAllowedMonday = nextMonday(today);

        if (normalizedStartDate < nextAllowedMonday) {
          ctx.addIssue({
            code: "custom",
            path: ["start_date"],
            message: "Start date for weekly or custom habits must be the first Monday from today.",
          });
        }
      }
    }

    if (type === HabitType.CUSTOM) {
      if (!Object.values(days_of_week).some(Boolean)) {
        ctx.addIssue({
          code: "custom",
          path: ["days_of_week"],
          message: "At least one weekday must be selected for custom habits.",
        });
      }
    }

    if (end_date) {
      const normalizedEndDate = startOfDay(end_date);

      if (type === HabitType.DAILY) {
        const minDailyEndDate = addDays(normalizedStartDate, 1);

        if (normalizedEndDate < minDailyEndDate) {
          ctx.addIssue({
            code: "custom",
            path: ["end_date"],
            message: "End date for daily habits must be at least one day after the start date.",
          });
        }
      } else if (type === HabitType.WEEKLY || type === HabitType.CUSTOM) {
        const firstSundayAfterStart = nextSunday(normalizedStartDate);

        if (normalizedEndDate < firstSundayAfterStart || !isSunday(normalizedEndDate)) {
          ctx.addIssue({
            code: "custom",
            path: ["end_date"],
            message: "End date for weekly or custom habits must be the first Sunday after the start date.",
          });
        }
      }
    }
  });

export type CreateHabitSchema = z.infer<typeof createHabitSchema>;
