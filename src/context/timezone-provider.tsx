"use client";

import { useEffect } from "react";

export function TimezoneProvider() {
  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    document.cookie = `timezone=${timezone}; path=/;`;
  }, []);

  return null;
}
