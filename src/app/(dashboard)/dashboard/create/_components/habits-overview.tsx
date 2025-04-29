"use client";

import * as React from "react";

import { HabitEntities } from "@/app/types";
import { cn } from "@/lib/utils";
import HabitCard from "@/app/(dashboard)/dashboard/create/_components/habits-overview/habit-card";
import { Button } from "@/components/ui/button";

enum CategoryKey {
  All = "all",
  Active = "active",
  Future = "future",
  Past = "past",
}

const categories: CategoryKey[] = [CategoryKey.All, CategoryKey.Active, CategoryKey.Future, CategoryKey.Past];

export function HabitsOverview({
  initialData,
  className,
}: {
  initialData: {
    active: HabitEntities;
    future: HabitEntities;
    past: HabitEntities;
    all: HabitEntities;
  };
  className?: string;
}) {
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryKey>(CategoryKey.Active);
  const [displayedHabits, setDisplayedHabits] = React.useState<HabitEntities>(initialData.all);

  React.useEffect(() => {
    setDisplayedHabits(initialData[selectedCategory]);
  }, [selectedCategory, initialData]);

  return (
    <section className={cn("flex flex-col gap-1 sm:flex-col lg:gap-2", className)}>
      <div className="flex gap-1 lg:gap-4">
        {categories.map((category) => (
          <Button
            variant="outline"
            size="sm"
            disabled={selectedCategory === category}
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn("text-xs lg:text-base", selectedCategory === category && "text-brand")}
            style={{ opacity: "100" }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      <div className="overflow-auto space-y-1 lg:space-y-2">
        {displayedHabits.length === 0 ? (
          <p className="text-muted-foreground text-center">No habits in this category</p>
        ) : (
          displayedHabits.map((habit) => <HabitCard key={habit.id} title={habit.name} />)
        )}
      </div>
    </section>
  );
}
