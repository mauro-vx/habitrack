import { cookies } from "next/headers";
import { HydrationBoundary } from "@tanstack/react-query";

import { prefetchDataForDashboardRpc } from "../dashboard/_utils/server";
import { ClientSwitcher } from "./_components/client-switcher";
import { DayPanel } from "./_components/day-panel";
import { WeekSelector } from "./_components/week-selector";
import { MonthPanel } from "./_components/month-panel";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone")?.value || "Europe/Prague";

  const dehydratedState = await prefetchDataForDashboardRpc(timezone);

  const slots = [
    { name: "Day", component: <DayPanel /> },
    { name: "Week", component: <WeekSelector /> },
    { name: "Month", component: <MonthPanel /> },
    { name: "Year", component: <div>Yearly view</div> },
  ];

  return (
    <HydrationBoundary state={dehydratedState}>
      <ClientSwitcher slots={slots} defaultSlotIndex={1} />
    </HydrationBoundary>
  );
}
