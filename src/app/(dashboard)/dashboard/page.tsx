import { cookies } from "next/headers";
import { HydrationBoundary } from "@tanstack/react-query";

import { prefetchDataForDashboardRpc } from "../dashboard/_utils/server";
import { Switcher } from "./_components/switcher";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone")?.value || "Europe/Prague";

  const dehydratedState = await prefetchDataForDashboardRpc(new Date(), timezone);

  const slotNames = ["Day", "Week", "Month", "Year"];

  return (
    <HydrationBoundary state={dehydratedState}>
      <Switcher slotNames={slotNames} />
    </HydrationBoundary>
  );
}

