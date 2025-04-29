import * as React from "react";

import { HabitEntitiesRpc } from "@/app/types";
import { useWeekDataMapped } from "@/app/(dashboard)/dashboard/_utils/client";
import { DaySummaryBadge } from "./week-view/day-summary-badge";
import { WeekTimeline } from "@/app/(dashboard)/dashboard/_components/week-selector/week-view/week-timeline";
import { WeekRecords } from "@/app/(dashboard)/dashboard/_components/week-selector/week-view/week-records";
import { Separator } from "@/components/ui/separator";

export function WeekView({ weekData }: { weekData: { year: number; week: number } }) {
  const { data: habits = [] }: { data: HabitEntitiesRpc } = useWeekDataMapped(weekData.year, weekData.week);

  return (
    <>
      <WeekTimeline weekData={weekData} />
      <Separator />
      <WeekRecords habits={habits} weekData={weekData} />
      <Separator />
      <DaySummaryBadge habits={habits} />
    </>
  );
}
