"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export default function PathGuard({
  hideWhen = [],
  showWhen = [],
  children,
}: {
  hideWhen?: string[];
  showWhen?: string[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const doesPathMatch = (patterns: string[], path: string) => patterns.some((pattern) => path.includes(pattern));

  const pathnameMatchedShow = doesPathMatch(showWhen, pathname);
  const pathnameMatchedHide = doesPathMatch(hideWhen, pathname);

  const shouldRender = pathnameMatchedShow || (!pathnameMatchedHide && !showWhen.length);

  return <>{shouldRender ? children : null}</>;
}
