"use client";

import { usePathname } from "next/navigation";
import { AuthGuard } from "./AuthGuard";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const isDev = process.env.NODE_ENV === "development";

// 공개 경로 목록 (로그인 없이 접근 가능)
const PUBLIC_PATHS = ["/", "/login", "/auth/callback", "/recommend"];

// 게시판은 로그인 없이 접근 가능
const isBoardPath = (path: string) =>
  path === "/board" || path.startsWith("/board/");

// 패키지 상세/리뷰는 로그인 없이 접근 가능
const isPackageDetailPath = (path: string) => /^\/package\/[^/]+$/.test(path);
const isPackageReviewsPath = (path: string) =>
  /^\/package\/[^/]+\/reviews$/.test(path);

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const pathname = usePathname();

  const isPublicPage =
    PUBLIC_PATHS.includes(pathname) ||
    isBoardPath(pathname) ||
    isPackageDetailPath(pathname) ||
    isPackageReviewsPath(pathname) ||
    (isDev && pathname.startsWith("/dev/"));

  if (isPublicPage) {
    return <>{children}</>;
  }

  return <AuthGuard>{children}</AuthGuard>;
}
