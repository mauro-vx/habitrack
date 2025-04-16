import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isBefore,
  Locale,
  startOfToday,
  startOfWeek,
} from "date-fns";

export function getDayNumbersOfWeek(year: number, week: number): number[] {
  const startDate = startOfWeek(new Date(year, 0, 1), { weekStartsOn: 1 });
  const weekStartDate = new Date(startDate.setDate(startDate.getDate() + (week - 1) * 7));

  const days = eachDayOfInterval({
    start: startOfWeek(weekStartDate, { weekStartsOn: 1 }),
    end: endOfWeek(weekStartDate, { weekStartsOn: 1 }),
  });

  return days.map((day) => day.getDate());
}

export function getDayNames(locale?: Locale, formatStyle: string = "EEEE"): string[] {
  const start = startOfWeek(new Date(), { weekStartsOn: 1, locale });

  return Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(start, i);
    return format(day, formatStyle, { locale });
  });
}

export function getDayNamesInLocale(locale: Locale): string[] {
  const start = startOfWeek(new Date(), { locale });
  return Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), "EEEE", { locale }));
}

export function getDayNamesByFormat(
  formatChoice: "short" | "full" | "minimal" | "narrow" | "altNarrow" | "localeAltNarrow" = "full",
  locale?: Locale,
): string[] {
  const formatStyles: Record<"short" | "full" | "minimal" | "narrow" | "altNarrow" | "localeAltNarrow", string> = {
    short: "EEE", // **`EEE`**: Abbreviated day name (e.g., "Mon").
    full: "EEEE", // **`EEEE`**: Full name of the day (e.g., "Monday").
    minimal: "EE", // **`EE`**: Minimal form of the day name (e.g., "Mo").
    narrow: "E", // **`E`**: Narrow form of the day name (e.g., "M").
    altNarrow: "eeeee", // **`eeeee`**: Narrow alternative form of day name (e.g., "M").
    localeAltNarrow: "eeeee", // **`eeeee` with `locale`**: Locale-specific shortest day name.
  };

  const formatStyle = formatStyles[formatChoice] || "EEEE";
  return getDayNames(locale, formatStyle);
}

function calculateTargetDate(year: number, weekNumber: number, dayNumber: number): Date {
  const yearStart = new Date(year, 0, 1);
  const firstWeekStart = startOfWeek(yearStart, { weekStartsOn: 1 });
  return addDays(addWeeks(firstWeekStart, weekNumber - 1), dayNumber - 1);
}

export function isBeforeToday(year: number, weekNumber: number, dayNumber: number): boolean {
  const targetDate = calculateTargetDate(year, weekNumber, dayNumber);
  return isBefore(targetDate, startOfToday());
}

export function isToday(year: number, weekNumber: number, dayNumber: number): boolean {
  const targetDate = calculateTargetDate(year, weekNumber, dayNumber);
  return targetDate.toDateString() === startOfToday().toDateString();
}


