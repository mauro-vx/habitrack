import { HabitEntitiesRpc } from "@/app/types";
import { useWeekData } from "@/app/(dashboard)/dashboard/_services/client";
import { DaySummaryBadge } from "./week-slider/day-summary-badge";
import { WeekTimeline } from "./week-slider/week-timeline";
import { WeekRecords } from "./week-slider/week-records";

export function WeekSlider({ weekStartDate }: { weekStartDate: Date }) {
  const { data: habits }: { data: HabitEntitiesRpc } = useWeekData(weekStartDate);

  return (
    <>
      <WeekTimeline weekStartDate={weekStartDate} />
      <WeekRecords habits={habits} weekStartDate={weekStartDate} />
      <DaySummaryBadge habits={habits} />
    </>
  );
}
