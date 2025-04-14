import { HabitEntities } from "@/app/types";
import { getWeekNumberAndYear } from "@/lib/utils";
import { authenticateUser } from "@/lib/supabase/authenticate-user";
import { Separator } from "@/components/ui/separator";
import CreateHabitForm from "./_components/create-habit-form";
import HabitsOverview from "./habits-overview";

export default async function CreatePage() {
  const { week, year } = getWeekNumberAndYear(new Date());
  const { authSupabase } = await authenticateUser();

  const { data } = await authSupabase
    .from("habits")
    .select("*")
    .or(`start_year.lt.${year},and(start_year.eq.${year},start_week.lte.${week})`);

  return (
    <main className="container flex h-screen flex-col justify-center gap-4 sm:flex-row">
      <CreateHabitForm className="min-h-fit overflow-y-auto sm:grow" />
      <Separator className="sm:hidden" />
      <HabitsOverview className="overflow-y-auto sm:grow" habits={data as HabitEntities} />
    </main>
  );
}
