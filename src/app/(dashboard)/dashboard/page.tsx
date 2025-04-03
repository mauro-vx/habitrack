import { Habits } from "@/app/types";
import { getWeekNumberAndYear } from "@/lib/utils";
import { authenticateUser } from "@/lib/supabase/authenticate-user";
import HabitCard from "@/app/(dashboard)/_components/habit-card";

export default async function CreatePage() {
  /* todo: date from picker - fetch current week in local timezone */
  const { week, year } = getWeekNumberAndYear(new Date());
  const { authSupabase } = await authenticateUser();

  const { data: habits } = await authSupabase
    .from("habits")
    .select("*, habit_statuses(id, date, start_week, start_year, status, completion_count)")
    .or(`start_year.lt.${year},and(start_year.eq.${year},start_week.lte.${week})`);

  return (
    <main className="container flex min-h-screen flex-col items-center gap-4 border-2 border-yellow-500">
      <h1 className="text-xl">Dashboard Summary</h1>

      <div className="flex w-full flex-wrap gap-4">
        {(habits as Habits)?.map((habit) => <HabitCard key={habit.id} {...habit} />)}
      </div>
    </main>
  );
}
