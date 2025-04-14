import Link from "next/link";

import { ChevronLeft } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 container flex items-center p-4" role="banner">
      {/*<DatePicker />*/}

      <Link href="/" className="flex items-center gap-2">
        <ChevronLeft /> <span>Back</span>
      </Link>
    </header>
  );
}
