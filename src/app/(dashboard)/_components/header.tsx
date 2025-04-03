import Link from "next/link";

import { Button } from "@/components/ui/button";
import NavigationSelect from "./header/navigation-select";
import DatePicker from "@/app/(dashboard)/_components/header/date-picker";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 container flex items-center justify-between p-4" role="banner">
      <NavigationSelect />

      <DatePicker />

      <Button asChild variant="outline">
        <Link href="/">Home</Link>
      </Button>
    </header>
  );
}
