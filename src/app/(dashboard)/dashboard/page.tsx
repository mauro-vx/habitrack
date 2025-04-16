import { cookies } from "next/headers";
import { HydrationBoundary } from "@tanstack/react-query";

import { prefetchDataForDashboard } from "../dashboard/_utils/server";
import Switcher from "./_components/switcher";
import WeekSelector from "./_components/week-selector";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone")?.value || "Europe/Prague";

  const dehydratedState = await prefetchDataForDashboard(timezone);

  const slots = [
    { slotName: "Day", component: <div>Daily view</div> },
    {
      slotName: "Week",
      component: <WeekSelector />,
    },
    { slotName: "Month", component: <div>Monthly view</div> },
    { slotName: "Year", component: <div>Yearly view</div> },
  ];

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="container flex h-screen flex-col gap-4 border-2 border-yellow-500">
        <Switcher slots={slots} />
      </main>
    </HydrationBoundary>
  );
}
