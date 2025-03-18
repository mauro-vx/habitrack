import * as React from "react";

import { cn } from "@/lib/utils";

export default function Skeleton({
  size = 40,
  width,
  height,
  style = {},
  className,
}: {
  size?: number;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <div
      className={cn("animate-pulse rounded-full bg-gray-300 dark:bg-gray-700", className)}
      style={{
        width: width || size,
        height: height || size,
        ...style,
      }}
    />
  );
}
