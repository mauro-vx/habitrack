import * as React from "react";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cookies } from "next/headers";

import { Separator } from "@/components/ui/separator";
import { getLocalizedHabits } from "@/app/(dashboard)/dashboard/_utils/server";
import { CreateHabitForm } from "./_components/create-habit-form";
import { HabitsOverview } from "./_components/habits-overview";

export default async function CreatePage() {
  const cookieStore = await cookies();
  const timezone = cookieStore.get("timezone")?.value || "Europe/Prague";

  const habits = await getLocalizedHabits(timezone);

  return (
    <div className="container flex h-screen flex-col py-2 md:gap-4 lg:py-4">
      <header className="grid w-full grid-cols-[auto,1fr,auto] items-center gap-1 lg:gap-4">
        <Link href="/dashboard">
          <ChevronLeft />
        </Link>
        <h1 className="text-center text-lg font-bold lg:text-2xl">Create new habit</h1>
      </header>

      <main className="flex flex-col flex-1 gap-4 overflow-auto lg:flex-row lg:gap-4">
        <CreateHabitForm timezone={timezone}/>
        <Separator className="sm:hidden" />
        <HabitsOverview habits={habits} timezone={timezone} className="min-h-48 overflow-auto" />
      </main>
    </div>
  );
}
