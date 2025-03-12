import LogoSection from "@/app/_components/header/logo-section";
import NavMenu from "@/app/_components/header/nav-menu";
import UserActions from "@/app/_components/header/user-actions";

export default function Header() {
  return (
    <header className="container flex items-center gap-4 py-4" role="banner">
      <LogoSection />
      <NavMenu />
      <UserActions />
    </header>
  );
}
