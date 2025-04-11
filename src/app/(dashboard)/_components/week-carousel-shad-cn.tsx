"use client";

import * as React from "react";
import throttle from "lodash.throttle";
import { fetchWeekDataClient, usePrefetchWeekData, useWeekData } from "@/app/(dashboard)/dashboard/_utils/client";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, getAdjacentWeeksDate, getAdjacentWeeksNumber } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQueries } from "@tanstack/react-query";

export default function WeekCarouselShadCn() {
  const [api, setApi] = React.useState<CarouselApi>();
  const currentSnapIndex = api?.selectedScrollSnap();
  const totalSlots = api?.scrollSnapList().length;
  const isApiInitialized = !!api && !!totalSlots && currentSnapIndex !== undefined;

  const searchParams = useSearchParams(); // URL path
  const pathname = usePathname();
  const { replace } = useRouter();

  const {
    prevWeek: prevWeekInit,
    currentWeek: currentWeekInit,
    nextWeek: nextWeekInit,
  } = getAdjacentWeeksDate(new Date());

  // Visible weeks state
  const [visibleWeeks, setVisibleWeeks] = React.useState([prevWeekInit, currentWeekInit, nextWeekInit]);
  // const [loading, setLoading] = React.useState(false);
  //
  // const prefetchWeekData = usePrefetchWeekData();

  // // Prefetch visible weeks when they change
  // React.useEffect(() => {
  //   visibleWeeks.forEach((week) => {
  //     prefetchWeekData(week, yearParam);
  //   });
  // }, []);

  // Fetch data for visible weeks
  const prevWeekData = useWeekData(visibleWeeks[0].weekNumber, visibleWeeks[0].year);
  const currentWeekData = useWeekData(visibleWeeks[1].weekNumber, visibleWeeks[1].year);
  const nextWeekData = useWeekData(visibleWeeks[2].weekNumber, visibleWeeks[2].year);
  const weeksData = [prevWeekData, currentWeekData, nextWeekData];

  // const weeksData = useQueries({
  //   queries: [
  //     {
  //       queryKey: ["weekData", { week: preWeekParam.weekNumber, year: preWeekParam.year }],
  //       queryFn: async () =>
  //         await fetchWeekDataClient(preWeekParam.weekNumber, preWeekParam.year),
  //     },
  //     {
  //       queryKey: ["weekData", { week: currentWeekParam.weekNumber, year: currentWeekParam.year }],
  //       queryFn: async () =>
  //       await fetchWeekDataClient(currentWeekParam.weekNumber, currentWeekParam.year),
  //     },
  //     {
  //       queryKey: ["weekData", { week: nextWeekParam.weekNumber, year: nextWeekParam.year }],
  //       queryFn: async () =>
  //        await fetchWeekDataClient(nextWeekParam.weekNumber, nextWeekParam.year),
  //     },
  //   ],
  // });


  // Carousel navigation logic
  // const handleScroll = React.useMemo(() => {
  //   return throttle(async (direction: "left" | "right") => {
  //     if (loading || !isApiInitialized) return; // Disable if loading or API is not ready
  //
  //     setLoading(true); // Disable further actions during prefetch
  //
  //     if (direction === "right") {
  //       try {
  //         if (isApiInitialized) {
  //           api.scrollTo(currentSnapIndex === totalSlots - 1 ? 0 : currentSnapIndex + 1);
  //         }
  //         await prefetchWeekData(nextWeekParam.weekNumber, nextWeekParam.year); // Wait for async prefetch
  //         updateUrl(nextWeekParam.year, nextWeekParam.weekNumber);
  //         // Update visible weeks
  //         setVisibleWeeks((prevWeeks) => [...prevWeeks.slice(1), nextWeekParam]);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //
  //     if (direction === "left") {
  //       try {
  //         if (isApiInitialized) {
  //           api.scrollTo(currentSnapIndex === 0 ? totalSlots - 1 : currentSnapIndex - 1);
  //         }
  //         await prefetchWeekData(preWeekParam.weekNumber, preWeekParam.year); // Wait for async prefetch
  //         updateUrl(preWeekParam.year, preWeekParam.weekNumber);
  //         // Update visible weeks
  //         setVisibleWeeks((prevWeeks) => [preWeekParam, ...prevWeeks.slice(0, -1)]);
  //       } finally {
  //         setLoading(false);
  //       }
  //     }
  //   }, 300);
  // }, [
  //   loading,
  //   api,
  //   currentSnapIndex,
  //   prefetchWeekData,
  //   nextWeekParam,
  //   preWeekParam,
  //   updateUrl,
  //   totalSlots,
  //   isApiInitialized,
  // ]);

  // React.useEffect(() => {
  //   if (!api) {
  //     return;
  //   }
  //
  //   const throttledSelectHandler = throttle(() => {
  //     const previousSnap = api.previousScrollSnap();
  //     const currentSnap = api.selectedScrollSnap();
  //
  //     if (currentSnap > previousSnap) {
  //       handleScroll("right");
  //     } else if (currentSnap < previousSnap) {
  //       handleScroll("left");
  //     }
  //   }, 300);
  //
  //   api.on("select", throttledSelectHandler);
  //
  //   return () => {
  //     api.off("select", throttledSelectHandler);
  //   };
  // }, [api, handleScroll]);

  const handlePreviousWeek = () => {
    setVisibleWeeks((prevState) => {
      // Get year and week from the first element in the array
      const firstWeek = prevState[0];
      const { prevWeek } = getAdjacentWeeksNumber(firstWeek.year, firstWeek.weekNumber);

      // Add the previous week to the beginning and remove the last element
      return [prevWeek, ...prevState.slice(0, -1)];
    });
  }

  const handleNextWeek = () => {
    setVisibleWeeks((prevState) => {
      // Get year and week from the last element in the array
      const lastWeek = prevState[prevState.length - 1];
      const { nextWeek } = getAdjacentWeeksNumber(lastWeek.year, lastWeek.weekNumber);

      // Add the next week to the end and remove the first element
      return [...prevState.slice(1), nextWeek];
    });
  };


  return (
    <div className="flex w-full flex-col justify-center">
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousWeek}
          aria-label="Previous week"
          // disabled={loading}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {/*<h2 className="text-lg font-medium">Week {currentWeekParam.weekNumber}</h2>*/}

        <h1>prevYear: {visibleWeeks[0].year} prevWeek: {visibleWeeks[0].weekNumber}</h1>
        <h1>currentYear: {visibleWeeks[1].year} currentWeek: {visibleWeeks[1].weekNumber}</h1>
        <h1>nextYear: {visibleWeeks[2].year} nextWeek: {visibleWeeks[2].weekNumber}</h1>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextWeek}
          aria-label="Next week"
          // disabled={loading}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Carousel
        opts={{ loop: true, inViewThreshold: 1, startIndex: 1, breakpoints: {} }}
        className="w-full max-w-[1200px]"
        setApi={setApi}
      >
        <CarouselContent>
          {weeksData.map(({ data }, idx) => (
            <CarouselItem key={idx} className="basis-full">
              <Card className="h-[700px] w-full rounded-none">
                <CardContent className="flex h-full flex-col items-center justify-center overflow-scroll border-2 border-red-500">
                  <h3 className="mb-4 text-2xl font-bold">Week {visibleWeeks[1].weekNumber}</h3>
                  {data ? (
                    <div className="text-center">
                      {data.map((habit) => (
                        <h3 key={habit.id} className="mb-4 text-xl font-bold">
                          {habit.name}
                        </h3>
                      ))}
                    </div>
                  ) : (
                    <p>Loading...</p>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
