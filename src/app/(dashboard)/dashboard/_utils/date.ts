import { addDays, eachDayOfInterval, endOfWeek, format, Locale, startOfWeek } from "date-fns";

export function getDayNumbersOfWeek(year: number, week: number) {
  const startDate = startOfWeek(new Date(year, 0, 1), { weekStartsOn: 1 });
  const weekStartDate = new Date(startDate.setDate(startDate.getDate() + (week - 1) * 7));

  const days = eachDayOfInterval({
    start: startOfWeek(weekStartDate, { weekStartsOn: 1 }),
    end: endOfWeek(weekStartDate, { weekStartsOn: 1 }),
  });

  return days.map((day) => day.getDate());
}

export function getDayNames(locale?: Locale, formatStyle: string = "EEEE") {
  const start = startOfWeek(new Date(), { weekStartsOn: 1, locale });

  return Array.from({ length: 7 }).map((_, i) => {
    const day = addDays(start, i);
    return format(day, formatStyle, { locale });
  });
}

export function getDayNamesInLocale(locale: Locale) {
  const start = startOfWeek(new Date(), { locale });
  return Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), "EEEE", { locale }));
}

export function getDayNamesByFormat(
  formatChoice: "short" | "full" | "minimal" | "narrow" | "altNarrow" | "localeAltNarrow" = "full",
  locale?: Locale,
) {
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
