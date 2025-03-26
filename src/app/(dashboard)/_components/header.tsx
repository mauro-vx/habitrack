import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/app/(dashboard)/dashboard/_components/header/date-picker";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 container flex items-center gap-4 bg-inherit p-4" role="banner">
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select Duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="day">Day</SelectItem>
          <SelectItem value="week">Week</SelectItem>
          <SelectItem value="month">Month</SelectItem>
        </SelectContent>
      </Select>

      <DatePicker />

      <Button asChild variant="outline">
        <Link href="/">Home</Link>
      </Button>
    </header>
  );
}
