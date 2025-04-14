import { getDayNamesByFormat } from "@/app/(dashboard)/dashboard/_utils/date";
import { DayNumber, DaysOfWeekRecord } from "@/app/(dashboard)/dashboard/create/types";

export const dayNamesMap = getDayNamesByFormat("full").reduce(
  (map: Record<number, string>, dayName: string, idx: number) => {
    map[idx + 1] = dayName;
    return map;
  },
  {},
);

const createDefaultDaysObject = (defaultValue: boolean): DaysOfWeekRecord => {
  return Object.keys(dayNamesMap).reduce((acc, key) => {
    acc[parseInt(key) as DayNumber] = defaultValue;
    return acc;
  }, {} as DaysOfWeekRecord);
};

export const DAILY_DAYS_OF_WEEK = createDefaultDaysObject(true);
export const DEFAULT_DAYS_OF_WEEK = createDefaultDaysObject(false);
