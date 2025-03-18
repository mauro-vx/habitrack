"use client";

import * as React from "react";

export default function ViewWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}
