"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface LottieAnimationProps {
  src: string;
  width?: number;
  height?: number;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottieAnimation({
  src,
  width = 200,
  height = 200,
  className = "",
  loop = true,
  autoplay = true,
}: LottieAnimationProps) {
  return (
    <div className={className} style={{ width, height }}>
      <DotLottieReact
        src={src}
        loop={loop}
        autoplay={autoplay}
        style={{ width, height }}
      />
    </div>
  );
}
