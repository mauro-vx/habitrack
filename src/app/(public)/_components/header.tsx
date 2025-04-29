import LogoSection from "./header/logo-section";
import NavMenu from "./header/nav-menu";
import UserActions from "./header/user-actions";
import ModeToggle from "@/components/ui/mode-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 container flex items-center gap-2 lg:gap-4 bg-inherit p-2 lg:p-4" role="banner">
      <LogoSection />
      <NavMenu />
      <UserActions />
      <ModeToggle />
    </header>
  );
}
