"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface IconButtonProps {
  icon: ReactNode;
  text: string;
  href?: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export const IconButton = ({
  icon,
  text,
  href,
  isActive = false,
  onClick,
  className,
}: IconButtonProps) => {
  const buttonContent = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-1 transition-colors duration-200",
        isActive && "text-primary",
        !isActive && "text-white",
        className
      )}
    >
      <div
        className={cn(isActive && "text-primary", !isActive && "text-white")}
      >
        {icon}
      </div>
      <span className="text-xs font-medium">{text}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {buttonContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="block">
      {buttonContent}
    </button>
  );
};
