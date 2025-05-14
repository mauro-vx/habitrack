import * as React from "react";

import {
  Medal,
  Award,
  Trophy,
  Circle,
  Banana,
  Bean,
  CloudHail,
  Milestone,
  Sun,
  Sparkle,
  ThumbsUp,
  Smile,
  SmilePlus,
  BicepsFlexed,
  IceCreamCone,
  TrendingUp,
} from "lucide-react";
import { HabitEntityWeekRpc } from "@/app/types";
import { HabitType } from "@/app/enums";

export function WeekProgressBadge({
  habit,
  weeklyTotalCount,
  className = "size-5 lg:size-6 col-start-9",
}: {
  habit: HabitEntityWeekRpc;
  weeklyTotalCount: number;
  className?: string;
}) {
  const weeklyTarget = calculateWeeklyTarget(habit);
  
  const getIconByHabitProperty = (icons: React.ElementType[]) => {
    const hashValue = habit.id?.toString() || habit.name || "";
    let hashNumber = 0;
    for (let i = 0; i < hashValue.length; i++) {
      hashNumber += hashValue.charCodeAt(i);
    }
    const index = hashNumber % icons.length;
    return icons[index];
  };

  let IconComponent: React.ElementType = Circle;
  let iconClassName = "stroke-gray-300";

  if (weeklyTotalCount === 0) {
    const zeroIcons = [Banana, Bean, CloudHail];
    IconComponent = getIconByHabitProperty(zeroIcons);
    iconClassName = "stroke-fuchsia-300";
  } else {
    const completionRatio = weeklyTotalCount / weeklyTarget;

    if (completionRatio >= 1) {
      const fullIcons = [Trophy, Medal, Award];
      IconComponent = getIconByHabitProperty(fullIcons);
      iconClassName = "stroke-yellow-500";
    } else if (completionRatio >= 0.75) {
      const mostlyIcons = [Milestone, Sun, Sparkle];
      IconComponent = getIconByHabitProperty(mostlyIcons);
      iconClassName = "stroke-gray-500";
    } else if (completionRatio >= 0.5) {
      const halfIcons = [ThumbsUp, Smile, SmilePlus];
      IconComponent = getIconByHabitProperty(halfIcons);
      iconClassName = "stroke-brown-500";
    } else if (completionRatio > 0) {
      const startedIcons = [BicepsFlexed, IceCreamCone, TrendingUp];
      IconComponent = getIconByHabitProperty(startedIcons);
      iconClassName = "stroke-orange-500";
    }
  }

  return <IconComponent className={`${className} ${iconClassName}`} />;
}

function calculateWeeklyTarget(habit: HabitEntityWeekRpc): number {
  if (!habit) return 0;

  if (habit.type === HabitType.WEEKLY) {
    return habit.target_count || 0;
  } else if (habit.type === HabitType.DAILY) {
    return (habit.target_count || 0) * 7;
  } else if (habit.type === HabitType.CUSTOM) {
    const daysOfWeek = habit.days_of_week || {};
    const activeDays = Object.values(daysOfWeek).filter(Boolean).length;
    return (habit.target_count || 0) * activeDays;
  }
  return 0;
}
