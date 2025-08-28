"use client";

import { usePathname } from "next/navigation";
import { AuthGuard } from "./AuthGuard";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const pathname = usePathname();
  const isPublicPage = pathname === "/" || pathname === "/login";

  if (isPublicPage) {
    return <>{children}</>;
  }

  return <AuthGuard>{children}</AuthGuard>;
}
