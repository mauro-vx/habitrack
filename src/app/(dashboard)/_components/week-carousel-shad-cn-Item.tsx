import { CarouselItem } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import * as React from "react";
import { authenticateUser } from "@/lib/supabase/authorize-user";
import { getAdjacentWeeksNumber } from "@/lib/utils";

export default async function WeekCarouselShadCnItem({
  searchParams,
}: {
  searchParams: Promise<{ year: string; week: string }>;
}) {
  const { year, week } = await searchParams;
  const { authSupabase } = await authenticateUser();

  const { prevWeek } = getAdjacentWeeksNumber(year, week);

  const previousWeekHabits = await authSupabase
    .from("habits")
    .select("*, habit_statuses(id, date, start_week, start_year, status, completion_count)")
    .or(
      `start_year.lt.${prevWeek.year},and(start_year.eq.${prevWeek.year},start_week.lte.${prevWeek.weekNumber})`,
    );

  return (
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
  );
}
