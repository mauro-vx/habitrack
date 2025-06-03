"use client";

import React from "react";

import { cn } from "@/lib/utils";
import { useBreakpoint } from "@/hooks/use-breakpoint-hook";
import { AnimatedSection } from "@/components/ui/animated-section";
import Logo from "~/public/icons/logo.svg";

export function WelcomeBanner({
  title = "Welcome to HabiTrack",
  description = "The ultimate tool to end procrastination and take charge of your habits. Stay organized, track your progress, and create the life you've always wanted.",
  className,
}: {
  title?: string;
  description?: string;
  className?: string;
}) {
  const isSmScreen = useBreakpoint("sm");

  return (
    <AnimatedSection className={cn("flex flex-col items-center gap-2 text-center lg:gap-6", className)}>
      <Logo className={cn("shrink-0", isSmScreen ? "size-32" : "size-16")} aria-label="HabiTrack logo" />
      <h1 className="text-primary text-2xl font-medium lg:text-3xl">{title}</h1>
      <p className="text-muted-foreground text-md lg:text-xl">{description}</p>
    </AnimatedSection>
  );
}
