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

export function MedalIcon({
  weeklyTotalCount,
  targetCount,
  className = "size-4",
}: {
  weeklyTotalCount: number;
  targetCount: number;
  className?: string;
}) {
  const getRandomIcon = (icons: React.ElementType[]) => {
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
  };

  if (weeklyTotalCount === 0) {
    const zeroIcons = [Banana, Bean, CloudHail];
    const ZeroIcon = getRandomIcon(zeroIcons);
    return <ZeroIcon className={`${className} stroke-fuchsia-300`} />;
  }

  const completionRatio = weeklyTotalCount / targetCount;

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
