import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 container flex items-center gap-4 bg-inherit p-4" role="banner">
      Header
      <Button asChild variant="outline">
        <Link href="/">Home</Link>
      </Button>
    </header>
  );
}
