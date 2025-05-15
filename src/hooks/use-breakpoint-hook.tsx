"use client";

import * as React from 'react';

import defaultTheme from "tailwindcss/defaultTheme";

const breakpoints = {
  xs: '30rem', // custom bp 480px

  sm: defaultTheme.screens.sm, // '40rem'
  md: defaultTheme.screens.md, // '48rem'
  lg: defaultTheme.screens.lg, // '64rem'
  xl: defaultTheme.screens.xl, // '80rem'
  "2xl": defaultTheme.screens['2xl'], // '96rem'
};

type BreakpointKey = keyof typeof breakpoints;

export function useBreakpoint(breakpoint: BreakpointKey) {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const query = `(min-width: ${breakpoints[breakpoint]})`;
    const mediaQuery = window.matchMedia(query);

    setMatches(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [breakpoint]);

  return matches;
}