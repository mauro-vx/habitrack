import { Circle, Triangle, Square } from "lucide-react";

import { Database } from "@/lib/supabase/database.types";
import { HabitType } from "@/app/enums";

export default function HabitTypeIcon({
  habitType,
  className,
}: {
  habitType: Database["public"]["Enums"]["habit_type"];
  className?: string;
}) {
  switch (habitType) {
    case HabitType.DAILY:
      return <Circle className={className} />;
    case HabitType.WEEKLY:
      return <Triangle className={className} />;
    case HabitType.CUSTOM:
      return <Square className={className} />;
    default:
      return null;
  }
}
