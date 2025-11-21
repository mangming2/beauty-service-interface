import React from "react";
import Image from "next/image";
import LottieAnimation from "@/components/common/LottieAnimation";
import { cn } from "@/lib/utils";

interface LoadingProps {
  /** 로딩 메시지 */
  message?: string;
  /** 로딩 크기 */
  size?: "sm" | "md" | "lg" | "xl";
  /** 전체 화면 로딩 여부 */
  fullScreen?: boolean;
  /** 배경색 */
  background?: "transparent" | "dark" | "light";
  /** 로고 표시 여부 */
  showLogo?: boolean;
  /** 커스텀 클래스명 */
  className?: string;
  /** 로고 이미지 경로 */
  logoPath?: string;
  /** 로고 크기 */
  logoSize?: { width: number; height: number };
  /** 로띠 애니메이션 파일 경로 */
  lottieSrc?: string;
  /** 로띠 애니메이션 크기 */
  lottieSize?: { width: number; height: number };
}

const lottieSizes = {
  sm: { width: 40, height: 40 },
  md: { width: 60, height: 60 },
  lg: { width: 80, height: 80 },
  xl: { width: 120, height: 120 },
};

const backgroundClasses = {
  transparent: "bg-transparent",
  dark: "bg-gray-900",
  light: "bg-gray-50",
};

export function Loading({
  message = "로딩 중...",
  size = "md",
  fullScreen = false,
  background = "transparent",
  showLogo = false,
  className,
  logoPath = "/main-logo.png",
  logoSize = { width: 196, height: 54 },
  lottieSrc = "/logo-loading.lottie",
  lottieSize,
}: LoadingProps) {
  const containerClasses = cn(
    "flex flex-col items-center justify-center text-white",
    fullScreen && "min-h-screen",
    backgroundClasses[background],
    className
  );

  const finalLottieSize = lottieSize || lottieSizes[size];

  return (
    <div className={containerClasses}>
      {showLogo && (
        <div className="mb-16 text-center">
          <Image
            src={logoPath}
            alt="Main Logo"
            width={logoSize.width}
            height={logoSize.height}
            className="object-contain"
          />
        </div>
      )}
      <LottieAnimation
        src={lottieSrc}
        width={finalLottieSize.width}
        height={finalLottieSize.height}
        className="mx-auto"
      />
      {message && (
        <div
          className={cn(
            "mt-4 text-center",
            size === "sm" && "text-sm",
            size === "md" && "text-md",
            size === "lg" && "text-lg",
            size === "xl" && "text-xl"
          )}
        >
          {message}
        </div>
      )}
    </div>
  );
}

// 특정 상황에 맞는 프리셋 컴포넌트들
export function PageLoading({
  message = "데이터를 불러오는 중...",
}: {
  message?: string;
}) {
  return (
    <Loading message={message} size="lg" fullScreen background="transparent" />
  );
}

export function AuthLoading() {
  return (
    <Loading
      message="로딩 중..."
      size="lg"
      fullScreen
      background="transparent"
      showLogo
    />
  );
}

export function FormLoading({ message = "로딩 중..." }: { message?: string }) {
  return (
    <Loading message={message} size="md" fullScreen background="transparent" />
  );
}

export function ButtonLoading({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <Loading
      message=""
      size={size}
      fullScreen={false}
      background="transparent"
    />
  );
}

export function InlineLoading({
  message = "로딩 중...",
}: {
  message?: string;
}) {
  return (
    <div className="flex items-center justify-center gap-2 text-white">
      <LottieAnimation src="/logo-loading.lottie" width={16} height={16} />
      <span className="text-sm">{message}</span>
    </div>
  );
}
