import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/ui/mode-toggle";
import AvatarDropdown from "@/app/_components/header/user-actions/avatar-dropdown";

export default function UserActions() {
  return (
    <div className="flex w-full flex-row-reverse gap-4">
      <ModeToggle />
      <AvatarDropdown />
      <Button variant="outline">Dashboard</Button>
    </div>
  );
}
