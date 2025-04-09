import Link from "next/link";

import { Button } from "@/components/ui/button";
import NavigationSelect from "./header/navigation-select";
import DatePicker from "@/app/(dashboard)/_components/header/date-picker";
import { ChevronLeft } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 container flex items-center p-4" role="banner">
      {/*<NavigationSelect />*/}

      {/*<DatePicker />*/}

      <Link href="/" className="flex items-center gap-2">
        <ChevronLeft /> <span>Back</span>
      </Link>
    </header>
  );
}
