import Link from "next/link";
import { LogOut } from "lucide-react";
import { type User } from "@supabase/supabase-js";

import { signOut } from "@/lib/actions";
import { DropdownMenuItem, DropdownMenuShortcut } from "@/components/ui/dropdown-menu";

export function DropdownMenuButtonAuth({ user }: { user: User | null }) {
  return user ? (
    <DropdownMenuItem onClick={signOut}>
      <LogOut />
      <span>Sign out</span>
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  ) : (
    <DropdownMenuItem asChild>
      <Link href="/login">
        <LogOut />
        <span>Sign in</span>
        <DropdownMenuShortcut>⇧⌘I</DropdownMenuShortcut>
      </Link>
    </DropdownMenuItem>
  );
}
