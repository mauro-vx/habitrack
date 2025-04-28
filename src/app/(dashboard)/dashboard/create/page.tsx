import * as React from "react";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";

import { Separator } from "@/components/ui/separator";
import { fetchHabitsByTimezone } from "@/app/(dashboard)/dashboard/_utils/server";
import { CreateHabitForm } from "./_components/create-habit-form";
import { HabitsOverview } from "./_components/habits-overview";

export default async function CreatePage() {
  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone")?.value || "Europe/Prague";

  const habitsData = await fetchHabitsByTimezone(timezone);

  const categoryData = {
    active: habitsData.active,
    future: habitsData.future,
    past: habitsData.past,
    all: [...habitsData.active, ...habitsData.future, ...habitsData.past],
  };

  return (
    <div className="container flex h-screen flex-col overflow-hidden py-2 lg:py-4">
      <header className="grid grid-cols-[auto,1fr,auto] items-center gap-1 lg:gap-4">
        <Link href="/dashboard">
          <ChevronLeft />
        </Link>
        <h1 className="text-center text-lg font-bold">Create new habit</h1>
      </header>

      <main className="flex flex-1 flex-col gap-2 overflow-auto sm:flex-row lg:gap-4">
        <CreateHabitForm className="h-full min-h-fit flex-1 overflow-auto" />

        <Separator className="sm:hidden" />

        <HabitsOverview
          initialData={categoryData}
          className="min-h-[200px] w-full flex-none overflow-auto sm:w-auto sm:shrink-0"
        />
      </main>
    </div>
  );
}
