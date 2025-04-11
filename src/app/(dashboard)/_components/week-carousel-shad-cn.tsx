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
import { Suspense } from "react";
import WeekContent from "@/app/(dashboard)/_components/week-content";

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

  const handlePreviousWeek = () => {
    setVisibleWeeks((prevState) => {
      // Get year and week from the first element in the array
      const firstWeek = prevState[0];
      const { prevWeek } = getAdjacentWeeksNumber(firstWeek.year, firstWeek.weekNumber);

      // Add the previous week to the beginning and remove the last element
      return [prevWeek, ...prevState.slice(0, -1)];
    });
  };

  const handleNextWeek = () => {
    setVisibleWeeks((prevState) => {
      // Get year and week from the last element in the array
      const lastWeek = prevState[prevState.length - 1];
      const { nextWeek } = getAdjacentWeeksNumber(lastWeek.year, lastWeek.weekNumber);

      // Add the next week to the end and remove the first element
      return [...prevState.slice(1), nextWeek];
    });
  };

  const carouselRef = React.useRef<number>(1);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    let previousSnap = api.selectedScrollSnap(); // Initialize with the starting index

    const selectHandler = () => {
      const currentSnap = api.selectedScrollSnap();

      carouselRef.current = currentSnap;

      if (
        (currentSnap === 0 && previousSnap === 1) ||
        (currentSnap === 1 && previousSnap === 2) ||
        (currentSnap === 2 && previousSnap === 0)
      ) {
        console.log("scrolled left");
        handlePreviousWeek();
      } else {
        console.log("scrolled right");
        handleNextWeek();
      }

      // Update previousSnap to the current snap
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
        <Button variant="outline" size="icon" onClick={handlePreviousWeek} aria-label="Previous week">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {/*<h2 className="text-lg font-medium">Week {currentWeekParam.weekNumber}</h2>*/}

        <h1>
          prevYear: {visibleWeeks[0].year} prevWeek: {visibleWeeks[0].weekNumber}
        </h1>
        <h1>
          currentYear: {visibleWeeks[1].year} currentWeek: {visibleWeeks[1].weekNumber}
        </h1>
        <h1>
          nextYear: {visibleWeeks[2].year} nextWeek: {visibleWeeks[2].weekNumber}
        </h1>
        <Button variant="outline" size="icon" onClick={handleNextWeek} aria-label="Next week">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Carousel
        opts={{ loop: true, inViewThreshold: 1, startIndex: 1, breakpoints: {} }}
        className="w-full max-w-[1200px]"
        setApi={setApi}
      >
        <CarouselContent>
          {/*{visibleWeeks.map(({ weekNumber, year }, idx) => (*/}
          {/*  <CarouselItem key={`${weekNumber}-${year}`} className="basis-full">*/}
          {/*    <Card className="h-[700px] w-full rounded-none">*/}
          {/*      <CardContent className="flex h-full flex-col items-center justify-center overflow-scroll border-2 border-red-500">*/}
          {/*        <Suspense fallback={<div>Loading data for week {visibleWeeks[idx].weekNumber}...</div>}>*/}
          {/*          <WeekContent weekNumber={weekNumber} year={year} />*/}
          {/*        </Suspense>*/}
          {/*      </CardContent>*/}
          {/*    </Card>*/}
          {/*  </CarouselItem>*/}
          {/*))}*/}

          {console.log("🙀 carouselRef.current 🙀: ", carouselRef.current)}

          <CarouselItem className="basis-full">
            <Card className="h-[700px] w-full rounded-none">
              <CardContent className="flex h-full flex-col items-center justify-center overflow-scroll border-2 border-red-500">
                <Suspense fallback={<div>Loading data for week {visibleWeeks[0].weekNumber}...</div>}>
                  <WeekContent
                    weekNumber={visibleWeeks[carouselRef.current === 0 ? 1 : carouselRef.current].weekNumber}
                    year={visibleWeeks[carouselRef.current === 0 ? 1 : carouselRef.current].year}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </CarouselItem>

          <CarouselItem className="basis-full">
            <Card className="h-[700px] w-full rounded-none">
              <CardContent className="flex h-full flex-col items-center justify-center overflow-scroll border-2 border-red-500">
                <Suspense fallback={<div>Loading data for week {visibleWeeks[1].weekNumber}...</div>}>
                  <WeekContent
                    weekNumber={visibleWeeks[carouselRef.current === 1 ? 1 : carouselRef.current].weekNumber}
                    year={visibleWeeks[carouselRef.current === 1 ? 1 : carouselRef.current].year}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </CarouselItem>

          <CarouselItem className="basis-full">
            <Card className="h-[700px] w-full rounded-none">
              <CardContent className="flex h-full flex-col items-center justify-center overflow-scroll border-2 border-red-500">
                <Suspense fallback={<div>Loading data for week {visibleWeeks[1].weekNumber}...</div>}>
                  <WeekContent
                    weekNumber={visibleWeeks[carouselRef.current === 2 ? 1 : carouselRef.current].weekNumber}
                    year={visibleWeeks[carouselRef.current === 2 ? 1 : carouselRef.current].year}
                  />
                </Suspense>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
}
