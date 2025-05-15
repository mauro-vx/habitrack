import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getYear, getISOWeek, startOfWeek, addWeeks, subWeeks, setISOWeek, getMonth, getDate } from "date-fns";
import { User } from "@supabase/supabase-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function generateCacheKey(user: User | null, date: Date): string {
  if (!user || !user.id) {
    console.error("Invalid user object. User must contain an 'id' property.");
  }

  const { week, year } = getWeekNumberAndYear(date);
  return `cache-${user?.id}-${year}-${week}`;
}

export function getFirstPossibleMonday(date: Date): Date {
  return startOfWeek(addWeeks(date, 1), { weekStartsOn: 1 });
}

export function getWeekNumberAndYear(date: Date): { week: number; year: number } {
  const year = getYear(date);
  const week = getISOWeek(date);

  return { week, year };
}

export function getAdjacentWeeksDate(date: Date): {
  currentWeek: { week: number; year: number };
  prevWeek: { week: number; year: number };
  nextWeek: { week: number; year: number };
} {
  const currentYear = getYear(date);
  const currentWeek = getISOWeek(date);

  const previousDate = subWeeks(date, 1);
  const previousYear = getYear(previousDate);
  const previousWeek = getISOWeek(previousDate);

  const nextDate = addWeeks(date, 1);
  const nextYear = getYear(nextDate);
  const nextWeek = getISOWeek(nextDate);

  return {
    currentWeek: { week: currentWeek, year: currentYear },
    prevWeek: { week: previousWeek, year: previousYear },
    nextWeek: { week: nextWeek, year: nextYear },
  };
}

export function getDateSeries(date: Date): {
  current: { day: number; week: number; month: number; year: number };
  previous: { day: number; week: number; month: number; year: number };
  next: { day: number; week: number; month: number; year: number };
} {
  const currentYear = getYear(date);
  const currentWeek = getISOWeek(date);
  const currentDay = getDate(date);
  const currentMonth = getMonth(date) + 1; // date-fns months are 0-indexed

  const previousDate = subWeeks(date, 1);
  const previousYear = getYear(previousDate);
  const previousWeek = getISOWeek(previousDate);
  const previousDay = getDate(previousDate);
  const previousMonth = getMonth(previousDate) + 1;

  const nextDate = addWeeks(date, 1);
  const nextYear = getYear(nextDate);
  const nextWeek = getISOWeek(nextDate);
  const nextDay = getDate(nextDate);
  const nextMonth = getMonth(nextDate) + 1;

  return {
    current: { day: currentDay, week: currentWeek, month: currentMonth, year: currentYear },
    previous: { day: previousDay, week: previousWeek, month: previousMonth, year: previousYear },
    next: { day: nextDay, week: nextWeek, month: nextMonth, year: nextYear },
  };
}

export function getAdjacentWeeksNumber(
  year: number | string,
  week: number | string,
): { prevWeek: { week: number; year: number }; nextWeek: { week: number; year: number } } {
  const parsedYear = typeof year === "string" ? Number(year) : year;
  const parsedWeek = typeof week === "string" ? Number(week) : week;

  const date = setISOWeek(new Date(parsedYear, 0, 4), parsedWeek);

  const previousDate = subWeeks(date, 1);
  const previousYear = getYear(previousDate);
  const previousWeek = getISOWeek(previousDate);

  const nextDate = addWeeks(date, 1);
  const nextYear = getYear(nextDate);
  const nextWeek = getISOWeek(nextDate);

  return {
    prevWeek: { week: previousWeek, year: previousYear },
    nextWeek: { week: nextWeek, year: nextYear },
  };
}

export function getMonthAndYear(date: Date): { month: number; year: number } {
  const year = getYear(date);
  const month = getMonth(date) + 1; // date-fns months are 0-indexed

  return { month, year };
}

export function getDayMonthYear(date: Date): { day: number; month: number; year: number } {
  const year = getYear(date);
  const month = getMonth(date) + 1; // date-fns months are 0-indexed
  const day = getDate(date);

  return { day, month, year };
}

export function getAdjacentMonths(
  year: number,
  month: number,
): {
  prevMonth: { year: number; month: number };
  nextMonth: { year: number; month: number };
} {
  let prevMonth = month - 1;
  let prevYear = year;

  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear = year - 1;
  }

  let nextMonth = month + 1;
  let nextYear = year;

  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear = year + 1;
  }

  return {
    prevMonth: { year: prevYear, month: prevMonth },
    nextMonth: { year: nextYear, month: nextMonth },
  };
}
