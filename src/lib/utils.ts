import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getYear, getISOWeek, startOfWeek, addWeeks, subWeeks, setISOWeek } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFirstPossibleMonday(date: Date): Date {
  return startOfWeek(addWeeks(date, 1), { weekStartsOn: 1 });
}

export function getWeekNumberAndYear(date: Date) {
  const year = getYear(date);
  const week = getISOWeek(date);

  return { week, year };
}

export function getAdjacentWeeksDate(date: Date) {
  const currentYear = getYear(date);
  const currentWeek = getISOWeek(date);

  const previousDate = subWeeks(date, 1);
  const previousYear = getYear(previousDate);
  const previousWeek = getISOWeek(previousDate);

  const nextDate = addWeeks(date, 1);
  const nextYear = getYear(nextDate);
  const nextWeek = getISOWeek(nextDate);

  return {
    current: { week: currentWeek, year: currentYear },
    previous: { week: previousWeek, year: previousYear },
    next: { week: nextWeek, year: nextYear },
  };
}

export function getAdjacentWeeksNumber(year: number | string, week: number | string) {
  const parsedYear = typeof year === "string" ? Number(year) : year;
  const parsedWeek = typeof week === "string" ? Number(week) : week;

  const date = setISOWeek(new Date(parsedYear, 0, 4), parsedWeek);

  const currentYear = getYear(date);
  const currentWeek = getISOWeek(date);

  const previousDate = subWeeks(date, 1);
  const previousYear = getYear(previousDate);
  const previousWeek = getISOWeek(previousDate);

  const nextDate = addWeeks(date, 1);
  const nextYear = getYear(nextDate);
  const nextWeek = getISOWeek(nextDate);

  return {
    currentWeek: { weekNumber: currentWeek, year: currentYear },
    previousWeek: { weekNumber: previousWeek, year: previousYear },
    nextWeek: { weekNumber: nextWeek, year: nextYear },
  };
}
