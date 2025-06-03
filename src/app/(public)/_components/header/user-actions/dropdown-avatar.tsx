import Link from "next/link";
import { LifeBuoy, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenuButtonAuth } from "./dropdown-avatar/dropdown-menu-button-auth";
import { authenticateUser } from "@/lib/supabase/authenticate-user";
import CatSilhouette from "~/public/icons/cat-silhouette.svg";


export async function DropdownAvatar() {
  const { authSupabase, user } = await authenticateUser();

  const { data: profileData, error } = await authSupabase
    .from("profiles")
    .select("full_name, username, avatar_url")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Failed to fetch profile data:", error.message);
  }

  const avatarUrl = authSupabase.storage.from("avatars").getPublicUrl(profileData?.avatar_url || "").data.publicUrl;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="outline-primary size-6 outline-2 lg:size-8">
          <AvatarImage src={avatarUrl} alt={`${profileData?.full_name || "User"} profile picture`} />
          <AvatarFallback className="bg-background">
            <CatSilhouette className="fill-foreground size-6" alt="Cat avatar" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{profileData?.username || "Guest"}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile">
              <User />
              <span>Profile</span>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem>
          <LifeBuoy />
          <span>Support</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuButtonAuth user={user} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
