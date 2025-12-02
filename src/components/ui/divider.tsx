interface DividerProps {
  className?: string;
  height?: string | number;
}

export function Divider({ className = "", height }: DividerProps) {
  const heightValue = height
    ? typeof height === "number"
      ? `${height}px`
      : height
    : "1px";

  return (
    <div
      className={`bg-card-border ${className}`}
      style={{ height: heightValue }}
    />
  );
}
