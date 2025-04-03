"use client";

import * as React from "react";
// import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { format, addDays, subDays } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function DatePicker() {
  const [date, setDate] = React.useState<Date>(new Date());
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = (day: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (day) {
      params.set("day", day);
    } else {
      params.delete("day");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const goToPreviousDay = () => {
    setDate((prevDate) => subDays(prevDate, 1));
  };

  const goToNextDay = () => {
    setDate((prevDate) => addDays(prevDate, 1));
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={goToPreviousDay} aria-label="Previous day">
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-4">
          <span className="text-center font-medium">{format(date, "EEEE, MMMM do, yyyy")}</span>

          {/* added */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("flex justify-center items-center", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="size-4" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  if(newDate) setDate(newDate)
                  handleSearch(newDate ? format(newDate, "yyyy-MM-dd") : "")
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {/* added */}
        </div>

        <Button variant="outline" size="icon" onClick={goToNextDay} aria-label="Next day">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/*<Popover>*/}
      {/*  <PopoverTrigger asChild>*/}
      {/*    <Button*/}
      {/*      variant="outline"*/}
      {/*      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}*/}
      {/*    >*/}
      {/*      <CalendarIcon className="mr-2 h-4 w-4" />*/}
      {/*      {date ? format(date, "PPP") : <span>Pick a date</span>}*/}
      {/*    </Button>*/}
      {/*  </PopoverTrigger>*/}
      {/*  */}
      {/*  <PopoverContent className="w-auto p-0">*/}
      {/*    <Calendar mode="single" selected={date} onSelect={(newDate) => newDate && setDate(newDate)} initialFocus />*/}
      {/*  </PopoverContent>*/}
      {/*</Popover>*/}
    </div>
  );
}
