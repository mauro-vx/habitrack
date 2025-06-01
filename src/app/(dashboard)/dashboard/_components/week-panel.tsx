"use client";

import * as React from "react";

import { CarouselApi } from "@/components/ui/carousel";
import { addWeeks, startOfWeek, subWeeks } from "date-fns";
import { WeekSelector } from "./week-panel/WeekSelector";
import { WeekView } from "./week-panel/week-view";

export function WeekPanel() {
  const [api, setApi] = React.useState<CarouselApi>();

  const visibleWeeksInit = React.useMemo(() => {
    const currentWeekInit = startOfWeek(new Date(), { weekStartsOn: 1 });
    return [subWeeks(currentWeekInit, 1), currentWeekInit, addWeeks(currentWeekInit, 1)];
  }, []);

  const [visibleWeeks, setVisibleWeeks] = React.useState(visibleWeeksInit);

  const scrollHandler = React.useCallback(
    (direction: "left" | "right") => {
      if (!api) return;
      const currentSnapIndex = api.selectedScrollSnap();
      const totalSlots = api.scrollSnapList().length;

      if (direction === "right") {
        if (currentSnapIndex === totalSlots) api.scrollTo(1);
        else api.scrollTo(currentSnapIndex + 1);
      } else if (direction === "left") {
        if (currentSnapIndex === 1) api.scrollTo(totalSlots);
        else api.scrollTo(currentSnapIndex - 1);
      }
    },
    [api],
  );

  return (
    <>
      <WeekSelector visibleWeeks={visibleWeeks} onWeekChange={scrollHandler} />
      <WeekView visibleWeeks={visibleWeeks} setVisibleWeeks={setVisibleWeeks} api={api} setApi={setApi} />
    </>
  );
}
