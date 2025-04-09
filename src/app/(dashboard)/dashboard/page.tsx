import { cookies } from "next/headers";

import { getAdjacentWeeksNumber, getWeekNumberAndYear } from "@/lib/utils";
import { authenticateUser } from "@/lib/supabase/authenticate-user";
import ViewSwitcher from "@/app/(dashboard)/_components/view-switcher";
import WeekCarouselShadCn from "@/app/(dashboard)/_components/week-carousel-shad-cn";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone")?.value || "Europe/Prague";
  const now = new Date();
  const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const { year, week } = getWeekNumberAndYear(localTime);
  const { prevWeek, nextWeek } = getAdjacentWeeksNumber(year, week);

  const { authSupabase } = await authenticateUser();
  const initialState = await Promise.all([
    authSupabase
      .from("habits")
      .select("*, habit_statuses(id, date, start_week, start_year, status, completion_count)")
      .or(`start_year.lt.${prevWeek.year},and(start_year.eq.${prevWeek.year},start_week.lte.${prevWeek.weekNumber})`),
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
    { slotName: "Day", component: <div>Daily view</div> },
    {
      slotName: "WeekCN",
      component: <WeekCarouselShadCn initialState={initialState} />,
    },
    { slotName: "Month", component: <div>Monthly view</div> },
    { slotName: "Year", component: <div>Yearly view</div> },
  ];

  return (
    <main className="container flex h-screen flex-col gap-4 border-2 border-yellow-500">
      <ViewSwitcher slots={slots} />
    </main>
  );
}
