"use client";

import * as React from "react";

import { HabitInfo } from "@/app/types";
import { cn } from "@/lib/utils";
import { HabitCard } from "@/app/(dashboard)/dashboard/create/_components/habits-overview/habit-card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getLocalizedHabitsClient } from "@/app/(dashboard)/dashboard/_utils/client";

enum CategoryKey {
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
  habits: {
    active: HabitInfo[];
    future: HabitInfo[];
    past: HabitInfo[];
    all: HabitInfo[];
  };
  timezone: string;
  className?: string;
}) {
  const [selectedCategory, setSelectedCategory] = React.useState<CategoryKey>(CategoryKey.Active);

  const { data, error, isError, isFetching, isRefetching } = useQuery({
    queryKey: ["habits", timezone],
    queryFn: () => getLocalizedHabitsClient(timezone),
    initialData: habits,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const displayedHabits = React.useMemo(() => {
    return data[selectedCategory] || [];
  }, [data, selectedCategory]);

  if (isError) {
    console.error("Error fetching habits:", error);

    return <div>Error loading habits: {error.message}</div>;
  }

  return (
    <section className={cn("flex flex-1 flex-col items-stretch gap-2", className)}>
      <div className="flex gap-2 lg:gap-4">
        {categories.map((category) => (
          <Button
            variant="outline"
            size="sm"
            disabled={selectedCategory === category}
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn("hover:text-brand-light text-xs lg:text-base", selectedCategory === category && "text-brand")}
            style={{ opacity: "100" }}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Button>
        ))}
      </div>

      <div className="space-y-1 overflow-auto lg:space-y-2">
        {isRefetching || isFetching ? (
          <p className="text-muted-foreground text-center">Refreshing habits...</p>
        ) : displayedHabits.length === 0 ? (
          <p className="text-muted-foreground text-center">No habits in this category</p>
        ) : (
          displayedHabits.map((habit) => <HabitCard key={habit.id} title={habit.name} />)
        )}
      </div>
    </section>
  );
}
