import { cookies } from "next/headers";
import { HydrationBoundary } from "@tanstack/react-query";

import { prefetchDataForDashboardRpc } from "../dashboard/_utils/server";
import { ClientSwitcher } from "./_components/client-switcher";
import { DaySelector } from "./_components/day-selector";
import { WeekSelector } from "./_components/week-selector";
import { MonthSelector } from "./_components/month-selector";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone")?.value || "Europe/Prague";

  const dehydratedState = await prefetchDataForDashboardRpc(new Date(), timezone);

  const slots = [
    { name: "Day", component: <DaySelector /> },
    { name: "Week", component: <WeekSelector /> },
    { name: "Month", component: <MonthSelector /> },
    { name: "Year", component: <div>Yearly view</div> },
  ];

  return (
    <HydrationBoundary state={dehydratedState}>
      <ClientSwitcher slots={slots} defaultSlotIndex={1} />
    </HydrationBoundary>
  );
}
