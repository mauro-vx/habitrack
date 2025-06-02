import { cn } from "@/lib/utils";

export function Skeleton({
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
      className={cn("animate-pulse rounded-full bg-skeleton", className)}
      style={{
        width: width || size,
        height: height || size,
        ...style,
      }}
    />
  );
}
