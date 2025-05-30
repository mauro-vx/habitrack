import { RefinementCtx } from "zod";
import { isMonday, isSunday, nextMonday, startOfDay } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

import { HabitType } from "@/app/enums";

export const validateStartDate = (startDate: Date, today: Date, ctx: RefinementCtx, timezone?: string) => {
  const todayStart = timezone ? fromZonedTime(startOfDay(toZonedTime(today, timezone)), timezone) : startOfDay(today);
  const startDateChecked = timezone ? toZonedTime(startDate, timezone) : startDate;

  if (startDateChecked < todayStart) {
    ctx.addIssue({
      code: "custom",
      path: ["date_range", "start_date"],
      message: `${timezone ? "SERVER" : "CLIENT"}: Start date must be today or a future date.`,
    });
  }

  if (!isMonday(startDateChecked)) {
    const nextAllowedMonday = timezone ? fromZonedTime(nextMonday(todayStart), timezone) : nextMonday(todayStart);

    if (startDateChecked < nextAllowedMonday) {
      ctx.addIssue({
        code: "custom",
        path: ["date_range", "start_date"],
        message: `${timezone ? "SERVER" : "CLIENT"}: Start date must be the first Monday from today.`,
      });
    }
  }
};

export const validateEndDate = (startDate: Date, endDate: Date | null, ctx: RefinementCtx, timezone?: string) => {
  const startDateChecked = timezone ? toZonedTime(startDate, timezone) : startDate;
  const endDateChecked = endDate ? (timezone ? toZonedTime(endDate, timezone) : endDate) : null;

  if (endDateChecked) {
    if (endDateChecked < startDateChecked) {
      ctx.addIssue({
        code: "custom",
        path: ["date_range", "end_date"],
        message: `${timezone ? "SERVER" : "CLIENT"}: End date must be after the selected start date (Monday).`,
      });
    }
    if (!isSunday(endDateChecked)) {
      ctx.addIssue({
        code: "custom",
        path: ["date_range", "end_date"],
        message: `${timezone ? "SERVER" : "CLIENT"}: End date must fall on a Sunday.`,
      });
    }
  }

  if (!isMonday(startDateChecked)) {
    ctx.addIssue({
      code: "custom",
      path: ["date_range", "end_date"],
      message: `${timezone ? "SERVER" : "CLIENT"}: End date can only be null if the start date is a valid Monday.`,
    });
  }
};

export const validateDaysOfWeek = (type: HabitType, daysOfWeek: Record<number, boolean>, ctx: RefinementCtx) => {
  if (type === HabitType.CUSTOM && !Object.values(daysOfWeek).some(Boolean)) {
    ctx.addIssue({
      code: "custom",
      path: ["days_of_week"],
      message: "At least one weekday must be selected for monthly habits.",
    });
  }
};
