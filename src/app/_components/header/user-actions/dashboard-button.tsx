import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function DashboardButton() {
  return (
    <Button asChild variant="outline">
      <Link href="/dashboard">Dashboard</Link>
    </Button>
  );
}
