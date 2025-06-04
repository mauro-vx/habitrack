import { Status, HabitType } from "@/app/enums";

export type DayNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type DaysOfWeekRecord = Record<DayNumber, boolean>;

interface CreateValidationErrors {
  name?: string[];
  description?: string[];
  type?: string[];
  days_of_week?: string[];
  target_count?: string[];
  date_range?: string[];
}

export interface CreateHabitState {
  name: string;
  description?: string;
  type: HabitType;
  days_of_week: DaysOfWeekRecord;
  target_count: number;
  date_range: {
    start_date: Date;
    end_date: Date | null;
  };
  timezone: string;
  status?: Status;
  validationErrors?: CreateValidationErrors;
  dbError?: string;
}
