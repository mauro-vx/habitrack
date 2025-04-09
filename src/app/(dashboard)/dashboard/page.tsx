import { getAdjacentWeeksNumber } from "@/lib/utils";
import { authenticateUser } from "@/lib/supabase/authenticate-user";
import ViewSwitcher from "@/app/(dashboard)/_components/view-switcher";
import WeekCarouselShadCn from "@/app/(dashboard)/_components/week-carousel-shad-cn";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ year: string; week: string }>;
}) {
  const { year, week } = await searchParams;
  const { authSupabase } = await authenticateUser();

  const { previousWeek, nextWeek } = getAdjacentWeeksNumber(year, week);

  // const { data: habits } = await authSupabase
  //   .from("habits")
  //   .select("*, habit_statuses(id, date, start_week, start_year, status, completion_count)")
  //   .or(`start_year.lt.${year},and(start_year.eq.${year},start_week.lte.${week})`);

  const [previousWeekHabits, currentWeekHabits, nextWeekHabits] = await Promise.all([
    authSupabase
      .from("habits")
      .select("*, habit_statuses(id, date, start_week, start_year, status, completion_count)")
      .or(
        `start_year.lt.${previousWeek.year},and(start_year.eq.${previousWeek.year},start_week.lte.${previousWeek.weekNumber})`,
      ),
    authSupabase
      .from("habits")
      .select("*, habit_statuses(id, date, start_week, start_year, status, completion_count)")
      .or(`start_year.lt.${year},and(start_year.eq.${year},start_week.lte.${week})`),
    authSupabase
      .from("habits")
      .select("*, habit_statuses(id, date, start_week, start_year, status, completion_count)")
      .or(`start_year.lt.${nextWeek.year},and(start_year.eq.${nextWeek.year},start_week.lte.${nextWeek.weekNumber})`),
  ]);

  const slots = [
    // <div key="1">
    //   <h1>Summary (daily, weekly, custom)</h1>
    //   <div className="flex w-full flex-wrap gap-4">
    //     {(habits as Habits)?.map((habit) => <HabitCard key={habit.id} {...habit} />)}
    //   </div>
    // </div>,
    { slotName: "Day", component: <div>Daily view</div> },
    // { slotName: "Week", component: <WeeklyView /> },
    // { slotName: "Week Carousel", component: <WeekCarousel /> },
    // { slotName: "DayCN", component: <DayCarouselShadCn /> },
    {
      slotName: "WeekCN",
      component: (
        <WeekCarouselShadCn
          previousWeekHabits={previousWeekHabits}
          currentWeekHabits={currentWeekHabits}
          nextWeekHabits={nextWeekHabits}
          previousWeek={previousWeek}
          nextWeek={nextWeek}
        />
      ),
    },
    { slotName: "Month", component: <div>Monthly view</div> },
    { slotName: "Year", component: <div>Yearly view</div> },
  ];

  return (
    <main className="container flex h-screen flex-col gap-4 border-2 border-yellow-500">
      <ViewSwitcher slots={slots} />

      {/*<div className="flex w-full flex-wrap gap-4">*/}
      {/*  {(habits as Habits)?.map((habit) => <HabitCard key={habit.id} {...habit} />)}*/}
      {/*</div>*/}
    </main>
  );
}
