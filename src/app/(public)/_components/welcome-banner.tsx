"use client";

import React from "react";
import Logo from "~/public/icons/logo.svg";
import AnimatedSection from "@/components/ui/animated-section";

export function WelcomeBanner({
  title = "Welcome to HabiTrack",
  description = "The ultimate tool to end procrastination and take charge of your habits. Stay organized, track your progress, and create the life you've always wanted.",
  logoSize = { mobile: "size-16", desktop: "size-32" },
  className,
}: {
  title?: string;
  description?: string;
  logoSize?: {
    mobile: string;
    desktop: string;
  };
  className?: string;
}) {
  return (
    <AnimatedSection className={`flex flex-col items-center gap-2 text-center lg:gap-6 ${className || ""}`}>
      <Logo className={`${logoSize.mobile} lg:${logoSize.desktop} shrink-0`} aria-label="HabiTrack logo" />
      <h1 className="text-primary text-2xl font-medium lg:text-3xl">{title}</h1>
      <p className="text-muted-foreground text-md lg:text-xl">{description}</p>
    </AnimatedSection>
  );
}

export default WelcomeBanner;
