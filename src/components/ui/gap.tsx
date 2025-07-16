import { ReactNode } from "react";

interface GapProps {
  size: number;
  children: ReactNode;
  className?: string;
}

export function Gap({ size, children, className = "" }: GapProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: `${size}px`,
      }}
    >
      {children}
    </div>
  );
}

// 더 간단한 버전 - 단순히 높이만 주는 경우
interface GapYProps {
  size: number;
  className?: string;
}

export function GapY({ size, className = "" }: GapYProps) {
  return <div className={`${className}`} style={{ height: `${size}px` }} />;
}
