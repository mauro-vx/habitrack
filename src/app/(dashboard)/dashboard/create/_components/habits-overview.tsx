"use client";

import * as React from "react";

import { HabitInfo } from "@/app/types";
import { cn } from "@/lib/utils";
import { HabitSelector } from "./habits-overview/habit-selector";
import { HabitsView } from "@/app/(dashboard)/dashboard/create/_components/habits-overview/habits-view";

export enum CategoryKey {
  Active = "active",
  Future = "future",
  Past = "past",
  All = "all",
}

const categories: CategoryKey[] = [CategoryKey.All, CategoryKey.Active, CategoryKey.Future, CategoryKey.Past];

export function HabitsOverview({
  habits,
  timezone,
  className,
}: {
  habits: Record<CategoryKey, HabitInfo[]>;
  timezone: string;
  className?: string;
}) {
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryKey>(CategoryKey.Active);

  return (
    <section className={cn("flex flex-1 flex-col items-stretch gap-2", className)}>
      <HabitSelector
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <HabitsView habits={habits} timezone={timezone} selectedCategory={selectedCategory} />
    </section>
  );
}
