import React from "react";
import { eachDayOfInterval, format, startOfWeek, addDays } from "date-fns";

interface WeekProps {
  // Optional prop to pass a custom start date
  startDate?: Date;
  className?: string;
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function WeeklyView({ startDate = new Date() }: WeekProps) {
  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 }); // Start at Monday
  const days = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });

  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((day, index) => (
        <div key={`day-${index}`} className="p-2 text-center font-medium">
          {day}
        </div>
      ))}
      {days.map((date, index) => (
        <div key={`date-${index}`} className="p-2 text-center">
          {format(date, "d")}
        </div>
      ))}
    </div>
  );
}
