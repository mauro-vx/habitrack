"use client";

import * as React from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { getAdjacentWeeksDate, getAdjacentWeeksNumber } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WeekContent from "./week-selector/week-content";

export default function WeekSelector() {
  const [api, setApi] = React.useState<CarouselApi>();

  const {
    prevWeek: prevWeekInit,
    currentWeek: currentWeekInit,
    nextWeek: nextWeekInit,
  } = getAdjacentWeeksDate(new Date());

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
      const firstWeek = prevState[0];
      const { prevWeek } = getAdjacentWeeksNumber(firstWeek.year, firstWeek.week);

      return [prevWeek, ...prevState.slice(0, -1)];
    });
  }, []);

  const handleNextWeek = React.useCallback(() => {
    setVisibleWeeks((prevState) => {
      const lastWeek = prevState[prevState.length - 1];
      const { nextWeek } = getAdjacentWeeksNumber(lastWeek.year, lastWeek.week);

      return [...prevState.slice(1), nextWeek];
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
    <div className="flex w-full flex-col justify-center">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => scrollHandler("left")} aria-label="Previous week">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1>
          previous: {visibleWeeks[0].year} - {visibleWeeks[0].week}
        </h1>
        <h1>
          current: {visibleWeeks[1].year} - {visibleWeeks[1].week}
        </h1>
        <h1>
          next: {visibleWeeks[2].year} - {visibleWeeks[2].week}
        </h1>
        <Button variant="outline" size="icon" onClick={() => scrollHandler("right")} aria-label="Next week">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Carousel
        opts={{ loop: true, inViewThreshold: 1, startIndex: 1, breakpoints: {} }}
        className="w-full max-w-[1200px]"
        setApi={setApi}
      >
        <CarouselContent>
          {[carouselItem0, carouselItem1, carouselItem2].map((carouselItem, idx) => (
            <CarouselItem key={`carousel-item-${idx}`} className="basis-full">
              <Card className="h-[700px] w-full rounded-none">
                <CardContent className="flex h-full flex-col items-center justify-center overflow-scroll border-2 border-red-500">
                  <React.Suspense
                    fallback={<div>Loading data for week {visibleWeeks[carouselItem.current].week}...</div>}
                  >
                    <WeekContent
                      weekData={{
                        year: visibleWeeks[carouselItem.current].year,
                        week: visibleWeeks[carouselItem.current].week,
                      }}
                    />
                  </React.Suspense>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
