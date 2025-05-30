import { HabitEntitiesWeekRpc } from "@/app/types";
import { useWeekData } from "@/app/(dashboard)/dashboard/_utils/client";
import { DaySummaryBadge } from "./week-view/day-summary-badge";
import { WeekTimeline } from "@/app/(dashboard)/dashboard/_components/week-selector/week-view/week-timeline";
import { WeekRecords } from "@/app/(dashboard)/dashboard/_components/week-selector/week-view/week-records";

export function WeekView({ weekStartDate }: { weekStartDate: Date }) {
  const { data: habits }: { data: HabitEntitiesWeekRpc } = useWeekData(weekStartDate);

  return (
    <>
      <WeekTimeline weekStartDate={weekStartDate} />
      <WeekRecords habits={habits} weekStartDate={weekStartDate} />
      <DaySummaryBadge habits={habits} />
    </>
  );
}
