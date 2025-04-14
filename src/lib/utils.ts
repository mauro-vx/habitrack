import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getYear, getISOWeek, startOfWeek, addWeeks, subWeeks, setISOWeek } from "date-fns";
import { User } from "@supabase/supabase-js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
