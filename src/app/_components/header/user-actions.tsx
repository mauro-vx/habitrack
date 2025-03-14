import ModeToggle from "@/components/ui/mode-toggle";
import DropdownAvatar from "./user-actions/dropdown-avatar";
import DashboardButton from "./user-actions/dashboard-button";

export default function UserActions() {
  return (
    <div className="flex w-full flex-row-reverse gap-4">
      <ModeToggle />
      <DropdownAvatar />
      <DashboardButton />
    </div>
  );
}
