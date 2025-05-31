"use client";

import * as React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { WeekView } from "./week-selector/week-view";
import { addWeeks, format, startOfWeek, subWeeks } from "date-fns";

export function WeekSelector() {
  const [api, setApi] = React.useState<CarouselApi>();

  const currentWeekInit = startOfWeek(new Date(), { weekStartsOn: 1 });
  const prevWeekInit = subWeeks(currentWeekInit, 1);
  const nextWeekInit = addWeeks(currentWeekInit, 1);

  const [visibleWeeks, setVisibleWeeks] = React.useState([prevWeekInit, currentWeekInit, nextWeekInit]);

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

  const handlePreviousWeek = React.useCallback(() => {
    setVisibleWeeks((prevState) => {
      const prevWeekDate = startOfWeek(addWeeks(prevState[0], -1), { weekStartsOn: 1 });
      return [prevWeekDate, ...prevState.slice(0, -1)];
    });
  }, []);

  const handleNextWeek = React.useCallback(() => {
    setVisibleWeeks((prevState) => {
      const nextWeekDate = startOfWeek(addWeeks(prevState[2], 1), { weekStartsOn: 1 });
      return [...prevState.slice(1), nextWeekDate];
    });
  }, []);

  const carouselItem0 = React.useRef<number>(0);
  const carouselItem1 = React.useRef<number>(1);
  const carouselItem2 = React.useRef<number>(2);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    let previousSnap = api.selectedScrollSnap();

    const selectHandler = () => {
      const currentSnap = api.selectedScrollSnap();

      if (
        (currentSnap === 0 && previousSnap === 1) ||
        (currentSnap === 1 && previousSnap === 2) ||
        (currentSnap === 2 && previousSnap === 0)
      ) {
        handlePreviousWeek();
      } else {
        handleNextWeek();
      }

      const mappings = [
        [1, 2, 0],
        [0, 1, 2],
        [2, 0, 1],
      ];
      [carouselItem0.current, carouselItem1.current, carouselItem2.current] = mappings[currentSnap];

      previousSnap = currentSnap;
    };

    api.on("select", selectHandler);

    return () => {
      api.off("select", selectHandler);
    };
  }, [api, handlePreviousWeek, handleNextWeek]);

  return (
    <>
      <div className="flex items-center justify-center">
        <Button variant="ghost" size="icon" onClick={() => scrollHandler("left")} aria-label="Previous week">
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-40 text-center">
          Week {format(visibleWeeks[1], "wo")} - {format(visibleWeeks[1], "yyyy")}
        </span>
        <Button variant="ghost" size="icon" onClick={() => scrollHandler("right")} aria-label="Next week">
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="flex h-full flex-col overflow-y-hidden">
        <Carousel
          opts={{ loop: true, inViewThreshold: 1, startIndex: 1, breakpoints: {} }}
          setApi={setApi}
          className="h-full"
        >
          <CarouselContent className="h-full" parentClassName="h-full">
            {[carouselItem0, carouselItem1, carouselItem2].map((carouselItem, idx) => (
              <CarouselItem key={`carousel-item-${idx}`} className="flex h-full flex-col">
                <React.Suspense fallback={<div>Loading data for week {format(visibleWeeks[1], "wo")}...</div>}>
                  <WeekView weekStartDate={visibleWeeks[!api ? 1 : carouselItem.current]} />
                </React.Suspense>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </>
  );
}
