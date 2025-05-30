import * as React from "react";

import { useQuery } from "@tanstack/react-query";

import { HabitInfo } from "@/app/types";
import { CategoryKey } from "../habits-overview";
import { getLocalizedHabitsClient } from "@/app/(dashboard)/dashboard/_utils/client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export function HabitsView({
  habits,
  timezone,
  selectedCategory,
}: {
  habits: Record<CategoryKey, HabitInfo[]>;
  timezone: string;
  selectedCategory: CategoryKey;
}) {
  const { data, error, isError, isFetching, isRefetching } = useQuery({
    queryKey: ["habits", timezone],
    queryFn: () => getLocalizedHabitsClient(),
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
    <div className="space-y-1 overflow-auto lg:space-y-2">
      {isRefetching || isFetching ? (
        <p className="text-muted-foreground text-center">Refreshing habits...</p>
      ) : displayedHabits.length === 0 ? (
        <p className="text-muted-foreground text-center">No habits in this category</p>
      ) : (
        displayedHabits.map((habit) => (
          <Card key={habit.id}>
            <CardHeader className="flex items-center">
              <CardTitle>{habit.name}</CardTitle>
            </CardHeader>
          </Card>
        ))
      )}
    </div>
  );
}
