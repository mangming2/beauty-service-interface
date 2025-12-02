"use client";

import { cn } from "@/lib/utils";
import { Icons } from "../common/Icons";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({
  rating,
  onRatingChange,
  readonly = false,
  size = "md",
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleStarClick(starValue)}
            disabled={readonly}
            className={cn(
              !readonly && "cursor-pointer",
              readonly && "cursor-default"
            )}
          >
            <Icons.star
              color={isFilled ? "#facc15" : "#4A4B52"}
              className={sizeClasses[size]}
            />
          </button>
        );
      })}
    </div>
  );
}
