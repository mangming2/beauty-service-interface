"use client";

import { usePathname } from "next/navigation";
import { AuthGuard } from "./AuthGuard";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const isDev = process.env.NODE_ENV === "development";

// 공개 경로 목록
const PUBLIC_PATHS = ["/", "/login"];

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const pathname = usePathname();

  const isPublicPage =
    PUBLIC_PATHS.includes(pathname) || (isDev && pathname.startsWith("/dev/"));

  if (isPublicPage) {
    return <>{children}</>;
  }

  return <AuthGuard>{children}</AuthGuard>;
}
