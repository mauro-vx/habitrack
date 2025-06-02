import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  addWeeks,
  getYear,
  subWeeks,
  getMonth,
  getDay,
  subDays,
  addDays,
  subMonths,
  addMonths,
  getWeek,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function getWeekDateSeries(date: Date): {
  current: { day: number; week: number; month: number; year: number };
  previous: { day: number; week: number; month: number; year: number };
  next: { day: number; week: number; month: number; year: number };
} {
  const currentYear = getYear(date);
  const currentMonth = getMonth(date) + 1;
  const currentWeek = getWeek(date, { weekStartsOn: 1 });
  const currentDay = getDay(date) || 7;

  const previousDate = subWeeks(date, 1);
  const previousYear = getYear(previousDate);
  const previousMonth = getMonth(previousDate) + 1;
  const previousWeek = getWeek(previousDate, { weekStartsOn: 1 });
  const previousDay = getDay(date) || 7;

  const nextDate = addWeeks(date, 1);
  const nextYear = getYear(nextDate);
  const nextMonth = getMonth(nextDate) + 1;
  const nextWeek = getWeek(nextDate, { weekStartsOn: 1 });
  const nextDay = getDay(date) || 7;

  return {
    current: { day: currentDay, week: currentWeek, month: currentMonth, year: currentYear },
    previous: { day: previousDay, week: previousWeek, month: previousMonth, year: previousYear },
    next: { day: nextDay, week: nextWeek, month: nextMonth, year: nextYear },
  };
}

export function getDateSeries(
  date: Date,
  unit: "day" | "week" | "month",
): {
  current: { day: number; week: number; month: number; year: number };
  previous: { day: number; week: number; month: number; year: number };
  next: { day: number; week: number; month: number; year: number };
} {
  const subDate = unit === "day" ? subDays : unit === "week" ? subWeeks : subMonths;
  const addDate = unit === "day" ? addDays : unit === "week" ? addWeeks : addMonths;

  const currentYear = getYear(date);
  const currentMonth = getMonth(date) + 1;
  const currentWeek = getWeek(date, { weekStartsOn: 1 });
  const currentDay = getDay(date) || 7;

  const previousDate = subDate(date, 1);
  const previousYear = getYear(previousDate);
  const previousMonth = getMonth(previousDate) + 1;
  const previousWeek = getWeek(previousDate, { weekStartsOn: 1 });
  const previousDay = getDay(date) || 7;

  const nextDate = addDate(date, 1);
  const nextYear = getYear(nextDate);
  const nextMonth = getMonth(nextDate) + 1;
  const nextWeek = getWeek(nextDate, { weekStartsOn: 1 });
  const nextDay = getDay(date) || 7;

  return {
    current: { day: currentDay, week: currentWeek, month: currentMonth, year: currentYear },
    previous: { day: previousDay, week: previousWeek, month: previousMonth, year: previousYear },
    next: { day: nextDay, week: nextWeek, month: nextMonth, year: nextYear },
  };
}
