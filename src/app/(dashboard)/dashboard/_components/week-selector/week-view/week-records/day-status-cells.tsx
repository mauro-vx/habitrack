import { HabitEntityWeekRpc } from "@/app/types";
import { HabitType } from "@/app/enums";
import { DAYS_OF_WEEK } from "@/app/(dashboard)/dashboard/constants";
import { COL_START_CLASSES } from "../_utils/grid-column-utils";
import { calculateCountUntilDay, getDayStatusCount } from "./day-status-cells/utils";
import { DayStatusSelect } from "./day-status-cells/day-status-select";
import { addDays, isAfter, startOfToday } from "date-fns";

export function DayStatusCells({
  habit,
  weekStartDate,
  weeklyTotalCount,
}: {
  habit: HabitEntityWeekRpc;
  weekStartDate: Date;
  weeklyTotalCount: number;
}) {
  return DAYS_OF_WEEK.map((dayNumber) => {
    const statusDate = addDays(new Date(weekStartDate), dayNumber - 1);
    const isFutureDay = isAfter(statusDate, startOfToday())


    if (habit.type === HabitType.WEEKLY) {
      const hasStatusForDay = !!habit.habit_statuses?.[dayNumber];
      const isUnderTarget = weeklyTotalCount < habit.target_count;

      if ((!hasStatusForDay && !isUnderTarget) || isFutureDay) return null;
    }

    if (
      habit.type === HabitType.CUSTOM &&
      !habit.days_of_week?.[dayNumber as keyof HabitEntityWeekRpc["days_of_week"]]
    ) {
      return null;
    }

    const countUntilToday = calculateCountUntilDay(habit, dayNumber);
    const countForDay = getDayStatusCount(habit, dayNumber);

    return (
      <DayStatusSelect
        key={`${habit.id}-${dayNumber}`}
        habit={habit}
        habitDayStatus={habit.habit_statuses?.[dayNumber]}
        cumulativeCountWeekly={weeklyTotalCount}
        cumulativeCountUntilToday={countUntilToday}
        cumulativeCountDay={countForDay}
        weekStartDate={weekStartDate}
        statusDate={statusDate}
        dayNumber={dayNumber}
        className={COL_START_CLASSES[dayNumber]}
      />
    );
  });
}
