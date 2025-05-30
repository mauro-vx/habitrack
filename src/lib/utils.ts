import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  addWeeks,
  getYear,
  subWeeks,
  getISOWeek,
  getMonth,
  getDay,
  subDays,
  addDays,
  subMonths,
  addMonths,
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
  const currentWeek = getISOWeek(date);
  const currentDay = getDay(date) === 0 ? 7 : getDay(date);

  const previousDate = subWeeks(date, 1);
  const previousYear = getYear(previousDate);
  const previousMonth = getMonth(previousDate) + 1;
  const previousWeek = getISOWeek(previousDate);
  const previousDay = getDay(date) === 0 ? 7 : getDay(date);

  const nextDate = addWeeks(date, 1);
  const nextYear = getYear(nextDate);
  const nextMonth = getMonth(nextDate) + 1;
  const nextWeek = getISOWeek(nextDate);
  const nextDay = getDay(date) === 0 ? 7 : getDay(date);

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
  const currentWeek = getISOWeek(date);
  const currentDay = getDay(date) === 0 ? 7 : getDay(date);

  const previousDate = subDate(date, 1);
  const previousYear = getYear(previousDate);
  const previousMonth = getMonth(previousDate) + 1;
  const previousWeek = getISOWeek(previousDate);
  const previousDay = getDay(previousDate) === 0 ? 7 : getDay(previousDate);

  const nextDate = addDate(date, 1);
  const nextYear = getYear(nextDate);
  const nextMonth = getMonth(nextDate) + 1;
  const nextWeek = getISOWeek(nextDate);
  const nextDay = getDay(nextDate) === 0 ? 7 : getDay(nextDate);

  return {
    current: { day: currentDay, week: currentWeek, month: currentMonth, year: currentYear },
    previous: { day: previousDay, week: previousWeek, month: previousMonth, year: previousYear },
    next: { day: nextDay, week: nextWeek, month: nextMonth, year: nextYear },
  };
}
