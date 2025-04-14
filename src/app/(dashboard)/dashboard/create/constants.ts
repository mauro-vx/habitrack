import { getDayNamesByFormat } from "@/app/(dashboard)/dashboard/_utils/date";

export const dayNamesMap = getDayNamesByFormat("full").reduce(
  (map: Record<number, string>, dayName: string, idx: number) => {
    map[idx + 1] = dayName;
    return map;
  },
  {},
);

type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
type DaysOfWeekRecord = Record<DayNumber, boolean>;

const createDefaultDaysObject = (defaultValue: boolean): DaysOfWeekRecord => {
  return Object.keys(dayNamesMap).reduce((acc, key) => {
    acc[parseInt(key) as DayNumber] = defaultValue;
    return acc;
  }, {} as DaysOfWeekRecord);
};

export const DAILY_DAYS_OF_WEEK = createDefaultDaysObject(true);
export const DEFAULT_DAYS_OF_WEEK = createDefaultDaysObject(false);
