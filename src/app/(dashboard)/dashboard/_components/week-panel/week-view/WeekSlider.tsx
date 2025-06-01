import { HabitEntitiesWeekRpc } from "@/app/types";
import { useWeekData } from "@/app/(dashboard)/dashboard/_utils/client";
import { DaySummaryBadge } from "./week-slider/day-summary-badge";
import { WeekTimeline } from "./week-slider/week-timeline";
import { WeekRecords } from "./week-slider/week-records";

export function WeekSlider({ weekStartDate }: { weekStartDate: Date }) {
  const { data: habits }: { data: HabitEntitiesWeekRpc } = useWeekData(weekStartDate);

  return (
    <>
      <WeekTimeline weekStartDate={weekStartDate} />
      <WeekRecords habits={habits} weekStartDate={weekStartDate} />
      <DaySummaryBadge habits={habits} />
    </>
  );
}
