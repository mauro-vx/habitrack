import { cn } from "@/lib/utils";

import { HabitEntities } from "@/app/types";
import HabitCard from "./habit-card";

export default async function HabitsOverview({ className, habits }: { className?: string; habits: HabitEntities }) {
  return (
    <section className={cn("flex flex-col-reverse gap-4 sm:flex-col", className)}>
      {habits?.map((habit) => <HabitCard key={habit.id} title={habit.name} />)}
    </section>
  );
}
