import Link from "next/link";

import { Button } from "@/components/ui/button";

export function DashboardButton() {
  return (
    <Button asChild variant="outline" className="text-xs lg:text-sm">
      <Link href="/dashboard">Dash</Link>
    </Button>
  );
}
