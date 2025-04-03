import { Habit } from "@/app/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HabitCard({
  name,
  description,
  type,
  start_date,
  end_date,
  days_of_week,
  target_count,
  start_week,
  start_year,
  end_week,
  end_year,
  // habit_statuses,
}: Habit) {
  return (
    <Card>
      <CardHeader className="flex flex-col space-y-2">
        <CardTitle>{name}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Type: {type}</p>
        <p>Start Date: {start_date}</p>
        <p>End Date: {end_date || "N/A"}</p>
        {Object.entries(days_of_week || {}).map(([key, value]) => (
          <p key={key}>
            Days of Week: {key}: {value ? "selected" : "unselected"}
          </p>
        ))}

        <p>Target count: {target_count}</p>
        <p>Start Week: {start_week}</p>
        <p>Start Year: {start_year}</p>
        {end_week !== null && <p>End Week: {end_week}</p>}
        {end_year !== null && <p>End Year: {end_year}</p>}
      </CardContent>
    </Card>
  );
}
