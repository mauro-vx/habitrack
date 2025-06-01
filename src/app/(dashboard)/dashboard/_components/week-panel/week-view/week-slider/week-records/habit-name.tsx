import { cn } from "@/lib/utils";

export function HabitName({ name, className = "col-start-1" }: { name: string; className?: string }) {
  return (
    <span className={cn("text-x text-extra-tiny lg:text-xs justify-self-start lg:font-semibold", className)}>{name}</span>
  );
}
