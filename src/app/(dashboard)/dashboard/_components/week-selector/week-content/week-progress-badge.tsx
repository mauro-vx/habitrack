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
import { HabitEntityRpc } from "@/app/types";
import { HabitType } from "@/app/enums";

export function WeekProgressBadge({
  habit,
  weeklyTotalCount,
  className = "size-4 col-start-9",
}: {
  habit: HabitEntityRpc;
  weeklyTotalCount: number;
  className?: string;
}) {
  const weeklyTarget = calculateWeeklyTarget(habit);


  const getRandomIcon = (icons: React.ElementType[]) => {
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
  };

  if (weeklyTotalCount === 0) {
    const zeroIcons = [Banana, Bean, CloudHail];
    const ZeroIcon = getRandomIcon(zeroIcons);
    return <ZeroIcon className={`${className} stroke-fuchsia-300`} />;
  }

  const completionRatio = weeklyTotalCount / weeklyTarget;

  if (completionRatio >= 1) {
    const fullIcons = [Trophy, Medal, Award];
    const FullIcon = getRandomIcon(fullIcons);
    return <FullIcon className={`${className} stroke-yellow-500`} />;
  } else if (completionRatio >= 0.75) {
    const mostlyIcons = [Milestone, Sun, Sparkle];
    const MostlyIcon = getRandomIcon(mostlyIcons);
    return <MostlyIcon className={`${className} stroke-gray-500`} />;
  } else if (completionRatio >= 0.5) {
    const halfIcons = [ThumbsUp, Smile, SmilePlus];
    const HalfIcon = getRandomIcon(halfIcons);
    return <HalfIcon className={`${className} stroke-brown-500`} />;
  } else if (completionRatio > 0) {
    const startedIcons = [BicepsFlexed, IceCreamCone, TrendingUp];
    const StartedIcon = getRandomIcon(startedIcons);
    return <StartedIcon className={`${className} stroke-orange-500`} />;
  }

  return <Circle className={`${className} stroke-gray-300`} />;
}

function calculateWeeklyTarget(habit: HabitEntityRpc): number {
  if (habit.type === HabitType.WEEKLY) {
    return habit.target_count;
  } else if (habit.type === HabitType.DAILY) {
    return habit.target_count * 7;
  } else if (habit.type === HabitType.CUSTOM) {
    const activeDays = Object.values(habit.days_of_week || {}).filter(Boolean).length;
    return habit.target_count * activeDays;
  }
  return 0;
}