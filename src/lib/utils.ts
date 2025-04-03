import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getYear, getISOWeek, startOfWeek, addWeeks } from "date-fns";

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
