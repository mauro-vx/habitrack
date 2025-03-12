"use client";

import * as React from "react";

import clsx from "clsx";

import { useIsVisible } from "@/hooks/useIntersectionObserver";

interface AnimatedWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function AnimatedSection({ children, className }: AnimatedWrapperProps) {
  const ref = React.useRef(null);
  const isVisible = useIsVisible(ref);

  return (
    <section
      ref={ref}
      className={clsx(
        "duration-1000",
        isVisible ? "animate-in fade-in slide-in-from-bottom-8" : "opacity-0",
        className,
      )}
    >
      {children}
    </section>
  );
}
