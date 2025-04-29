import Link from "next/link";

import Logo from "~/public/icons/logo.svg";

export default function LogoSection() {
  return (
    <section className="flex items-center gap-4">
      <Link href="/" aria-label="Navigate to home">
        <Logo className="size-10 shrink-0" aria-hidden="true" />
      </Link>

      <span className="text-brand hidden lg:block" role="heading" aria-level={1}>
        HabiTrack
      </span>
    </section>
  );
}
