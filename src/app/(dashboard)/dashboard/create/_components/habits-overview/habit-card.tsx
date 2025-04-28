import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function HabitCard({
  title,
}: {
  title: string;
}) {
  return (
    <Card>
      <CardHeader className="flex items-center">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
    </Card>
  );
}
