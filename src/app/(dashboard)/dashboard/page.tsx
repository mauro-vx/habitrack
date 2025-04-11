import { cookies } from "next/headers";

import { getAdjacentWeeksNumber, getWeekNumberAndYear } from "@/lib/utils";
import ViewSwitcher from "@/app/(dashboard)/_components/view-switcher";
import WeekCarouselShadCn from "@/app/(dashboard)/_components/week-carousel-shad-cn";
import { fetchWeekDataServer } from "@/app/(dashboard)/dashboard/_utils/server";
import { prefetchDataForDashboard } from "@/app/(dashboard)/dashboard/_utils/server";
import { QueryClient, QueryClientProvider, HydrationBoundary } from "@tanstack/react-query";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone")?.value || "Europe/Prague";
  const now = new Date();
  const localTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  const { year, week } = getWeekNumberAndYear(localTime);
  const { prevWeek, nextWeek } = getAdjacentWeeksNumber(year, week);

  const dehydratedState = await prefetchDataForDashboard(timezone); // Prefetch and pass the pre-hydrated cache to the client

  const slots = [
    { slotName: "Day", component: <div>Daily view</div> },
    {
      slotName: "WeekCN",
      component: <WeekCarouselShadCn />,
    },
    { slotName: "Month", component: <div>Monthly view</div> },
    { slotName: "Year", component: <div>Yearly view</div> },
  ];

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="container flex h-screen flex-col gap-4 border-2 border-yellow-500">
        <ViewSwitcher slots={slots} />
      </main>
    </HydrationBoundary>
  );
}
