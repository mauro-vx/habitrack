import LogoSection from "./header/logo-section";
import NavMenu from "./header/nav-menu";
import UserActions from "./header/user-actions";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 container flex items-center gap-4 bg-inherit p-4" role="banner">
      <LogoSection />
      <NavMenu />
      <UserActions />
    </header>
  );
}
