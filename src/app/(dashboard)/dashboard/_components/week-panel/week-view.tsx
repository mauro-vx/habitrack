"use client";

import * as React from "react";

import { addWeeks, format, startOfWeek } from "date-fns";

import { WeekSlider } from "./week-view/WeekSlider";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";

interface WeekCarouselProps {
  visibleWeeks: Date[];
  setVisibleWeeks: React.Dispatch<React.SetStateAction<Date[]>>;
  api: CarouselApi | undefined;
  setApi: React.Dispatch<React.SetStateAction<CarouselApi | undefined>>;
}

export const WeekView: React.FC<WeekCarouselProps> = ({ visibleWeeks, api, setApi, setVisibleWeeks }) => {
  const handlePreviousWeek = React.useCallback(() => {
    setVisibleWeeks((prevState) => {
      const prevWeekDate = startOfWeek(addWeeks(prevState[0], -1), { weekStartsOn: 1 });
      return [prevWeekDate, ...prevState.slice(0, -1)];
    });
  }, [setVisibleWeeks]);

  const handleNextWeek = React.useCallback(() => {
    setVisibleWeeks((prevState) => {
      const nextWeekDate = startOfWeek(addWeeks(prevState[2], 1), { weekStartsOn: 1 });
      return [...prevState.slice(1), nextWeekDate];
    });
  }, [setVisibleWeeks]);

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
    <div className="flex h-full flex-col overflow-y-hidden">
      <Carousel
        opts={{ loop: true, inViewThreshold: 1, startIndex: 1, breakpoints: {} }}
        setApi={setApi}
        className="h-full"
      >
        <CarouselContent className="h-full" parentClassName="h-full">
          {[carouselItem0.current, carouselItem1.current, carouselItem2.current].map((carouselItem, idx) => (
            <CarouselItem key={`carousel-item-${idx}`} className="flex h-full flex-col">
              <React.Suspense fallback={<div>Loading data for week {format(visibleWeeks[1], "wo")}...</div>}>
                <WeekSlider weekStartDate={visibleWeeks[!api ? 1 : carouselItem]} />
              </React.Suspense>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};