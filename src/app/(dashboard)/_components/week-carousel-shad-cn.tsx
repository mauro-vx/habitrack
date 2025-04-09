"use client";

import * as React from "react";

import throttle from 'lodash.throttle';

import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { getWeekNumberAndYear } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { endOfWeek, format, setISOWeek, startOfWeek } from "date-fns";

export default function WeekCarouselShadCn({
  previousWeekHabits,
  currentWeekHabits,
  nextWeekHabits,
  previousWeek,
  nextWeek,
}: {
  previousWeekHabits: any;
  currentWeekHabits: any;
  nextWeekHabits: any;
  previousWeek: { weekNumber: number; year: number };
  nextWeek: { weekNumber: number; year: number };
}) {
  const { week, year } = getWeekNumberAndYear(new Date());

  const searchParams = useSearchParams();
  const params = React.useMemo(() => new URLSearchParams(searchParams), [searchParams]);
  const paramsString = searchParams.toString();

  const pathname = usePathname();
  const { replace } = useRouter();

  const [api, setApi] = React.useState<CarouselApi>();
  const currentSnapIndex = api?.selectedScrollSnap();
  const totalSlots = api?.scrollSnapList().length;
  const isApiInitialized = !!api && !!totalSlots && currentSnapIndex !== undefined;

  const yearParam = parseInt(params.get("year") || String(new Date().getFullYear()), 10);
  const weekParam = parseInt(params.get("week") || String(getWeekNumberAndYear(new Date()).week), 10);

  const dateForISOWeek = React.useMemo(() => setISOWeek(new Date(yearParam, 0, 1), weekParam), [yearParam, weekParam]);
  const startDate = React.useMemo(() => startOfWeek(dateForISOWeek), [dateForISOWeek]);
  const endDate = React.useMemo(() => endOfWeek(dateForISOWeek), [dateForISOWeek]);

  React.useEffect(() => {
    if (!params.get("year") || !params.get("week")) {
      params.set("year", year.toString());
      params.set("week", week.toString());
      replace(`${pathname}?${params}`);
    }
  }, [paramsString, pathname, replace, week, year]);

  const handlePreviousWeek = React.useCallback(() => {
    params.set("year", previousWeek.year.toString());
    params.set("week", previousWeek.weekNumber.toString());
    replace(`${pathname}?${params}`);
  }, [paramsString, previousWeek, pathname, replace]);

  const handleNextWeek = React.useCallback(() => {
    params.set("year", nextWeek.year.toString());
    params.set("week", nextWeek.weekNumber.toString());
    replace(`${pathname}?${params}`);
  }, [paramsString, nextWeek, pathname, replace]);

  const handlePrevious = React.useCallback(
    throttle(() => {
      handlePreviousWeek();
      if (isApiInitialized) {
        api.scrollTo(!currentSnapIndex ? totalSlots - 1 : currentSnapIndex - 1);
      }
    }, 300), // 300ms throttle interval
    [handlePreviousWeek, isApiInitialized, api, currentSnapIndex, totalSlots]
  );

  const handleNext = React.useCallback(
    throttle(() => {
      handleNextWeek();
      if (isApiInitialized) {
        api.scrollTo(currentSnapIndex === totalSlots - 1 ? 0 : currentSnapIndex + 1);
      }
    }, 300), // 300ms throttle interval
    [handleNextWeek, isApiInitialized, api, currentSnapIndex, totalSlots]
  );


  React.useEffect(() => {
    if (!api) {
      return;
    }

    api.on(
      "select",
      throttle(() => {
        console.log("triggered");
        const previousSnap = api.previousScrollSnap();
        const currentSnap = api.selectedScrollSnap();

        if (currentSnap > previousSnap) {
          handleNextWeek();
        } else if (currentSnap < previousSnap) {
          handlePreviousWeek();
        }
      }, 300)
    );
  }, [api, handleNextWeek, handlePreviousWeek]);


  return (
    <div className="flex w-full flex-col justify-center border-2 border-red-500">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={handlePrevious} aria-label="Previous week">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium">{`${format(startDate, "dd")} - ${format(endDate, "dd MMMM yyyy")}`}</h2>
        <Button variant="outline" size="icon" onClick={handleNext} aria-label="Next week">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Carousel
        opts={{ loop: true, inViewThreshold: 1, startIndex: 1, breakpoints: {} }}
        className="w-full max-w-[1200px]"
        setApi={setApi}
      >
        <CarouselContent>
          <CarouselItem className="basis-full" onClick={() => {}}>
            <Card className="h-[700px] w-full rounded-none">
              <CardContent className="flex h-full flex-col items-center justify-center">
                <h3 className="mb-4 text-2xl font-bold">Previous week</h3>
                {previousWeekHabits?.data?.map((habit: { id: string; name: string }) => (
                  <div key={habit.id}>{habit.name}</div>
                ))}
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="basis-full" onClick={() => {}}>
            <Card className="h-[700px] w-full rounded-none">
              <CardContent className="flex h-full flex-col items-center justify-center">
                <h3 className="mb-4 text-2xl font-bold">Current week</h3>
                {currentWeekHabits?.data?.map((habit: { id: string; name: string }) => (
                  <div key={habit.id}>{habit.name}</div>
                ))}
              </CardContent>
            </Card>
          </CarouselItem>
          <CarouselItem className="basis-full" onClick={() => {}}>
            <Card className="h-[700px] w-full rounded-none">
              <CardContent className="flex h-full flex-col items-center justify-center">
                <h3 className="mb-4 text-2xl font-bold">Next week</h3>
                {nextWeekHabits?.data?.map((habit: { id: string; name: string }) => (
                  <div key={habit.id}>{habit.name}</div>
                ))}
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
}
